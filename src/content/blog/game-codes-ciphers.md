---
title: "Using ciphers to make randomized join-game codes"
description: "A fun puzzle in mapping game IDs to four-character codes, solved using a cipher"
pubDate: "26 May 2026"
---

I'm currently working on an online card game called "Buns". It's yet to be
released (or any code open-sourced), but I recently solved a fun puzzle when
adding a feature, and I'd like to share it.

When a user creates a game, they're given a "game code". The game creator then
shares this code with friends so they can join the same game. At the moment,
I'm generating these codes using Rust's `AtomicUsize`, which is just an
incrementing integer. This works really well code-wise, but there are a couple
of problems on the users' end:

1. It's an unusual user experience for the codes to be numbers, especially low
   ones such as `13`.
2. On creating a game, it's easy to guess what the next created game ID will
   be, and you could easily jump into someone else's game.

To solve this, I'd instead like the code to be a collection of random
characters, such as `R7XQ`.

For the rest of this article, I'll refer to the number from `AtomicUsize` as
"game IDs" or just "IDs", and the desired random strings as "game codes" or
"codes".

## Why not hashmaps?

There are a few different ways you could solve this problem. A simple one is to
maintain two hashmaps, one of IDs to codes, and one of codes to IDs. Each time
we create a new game, we also generate a new random code and update both
hashmaps. This is a perfectly fine solution and one I'd be likely to use if I
was creating this code at work. However, there are a couple of minor drawbacks:

* We need locks on the hashmaps. Contention is unlikely since we only need to
  lock the maps when creating or joining games, which are infrequent events.
  But locks do introduce complexity and potential bugs (such as deadlocks).
* The hashmaps' states require some maintenance, such as cleaning up codes when
  games are destroyed. This also makes the system a bit harder to test.

Realistically, these are non-issues for my server, which is unlikely to have
more than a handful of users, but I couldn't resist trying to create an
approach that didn't need locks or mutable shared state.

## My solution

What I really want is a deterministic, reversible mapping of integers to random
codes. If we can have a pure function for the form:

```rust
fn encode(id: usize) -> String
```

Then we can have another function:

```rust
fn decode(code: String) -> usize
```

Then we don't need any locks or hashmaps. The rest of this article will explain
how to create such a function.

## Part 1: IDs to codes

The first part of the puzzle is mapping integers to codes without the
randomization. This part is easy. Since I want players to be able to share the
codes verbally, I decided each code should be four characters long and each
character be from the set (0-9,A-Z), which gives us 36 characters to work with.

| integer | code   |
|---------|--------|
| 0       | `0000` |
| 1       | `0001` |
| 35      | `000Z` |
| 1679615 | `ZZZZ` |

Here's some code to do that:

```rust
fn int_to_char(num: usize) -> Option<char> {
    match num {
        // 0-9
        0..=9 => Some((num as u8 + b'0').into()),
        // A-Z
        10..=35 => Some((num as u8 - 10 + b'A').into()),
        _ => None,
    }
}

fn num_to_string(num: usize) -> Option<String> {
    let mut code = String::with_capacity(CODE_LEN as usize);
    for i in (0..CODE_LEN).rev() {
        let divisor = (NUM_CHARS as usize).pow(i as u32);
        let digit = (num / divisor) % NUM_CHARS as usize;
        code.push(int_to_char(digit)?)
    }
    return Some(code);
}
```

This means each ID up to 36^4 (= 1,679,615) maps to exactly one code. I don't expect to
ever get _near_ a million games created, especially since server restarts reset
the ID counter, but you could add a couple more characters to get a much larger
limit. 1.6 million combinations is still small enough to brute force in a few
seconds, but I plan to rate-limit game-join requests aggressively.

## Part 2: Randomizing the codes with ciphers

This is the fun part! We now have a very fast way of converting between IDs
(integers) and game codes (strings), but we still have the problem that the
game codes are not randomized. This means the first game will have code `0000`,
the next `0001`, and so on; not ideal. To solve this, we can use a _cipher_.

A cipher takes N bits and, using a secret, transforms them to a different,
seemingly random set of N bits. If you have the secret, you can reverse this
transformation. The reversible property also guarantees there are no
collisions; there must be a 1:1 mapping between ciphered and un-ciphered bits.

To randomize our codes, we'll pass the ID integer through a cipher before we
encode it into a string. This means the codes will appear random to users, but
we can de-cipher them to get the game IDs.

There is an edge case to deal with: We need 21 bits to encode our maximum ID
(1679615), but 21 bits can also represent numbers higher than this (up to
2097152). When we cipher our ID, there's a ~20% chance we could end up with a
number greater than 1679615. The solution (from a stack overflow post I found
years ago that I can't relocate), is to simply re-cipher until we're within our
bounds. Since each re-cipher gives a ~80% of success, we're unlikely to need to
do this more than a handful of times. We're also guaranteed not to enter an
infinite loop; because the process is reversible, each cipher must either take
us to a new number, or the number we started with (which is in range).

If you're interested, here's the code that does that. I used a [Feistel
cipher](https://en.wikipedia.org/wiki/Feistel_cipher) as my cipher
implementation, and I named the process "permutation", since you can view it as
"shuffling" all the numbers between 0 and the maximum ID (1,679,615). It also
makes it clearer that this should not be used for any actual cryptographic
purposes.

```rust
const CODE_LEN: u32 = 4;
const NUM_CHARS: u32 = 36;

/// Rounds of Feistel cipher for permutation
const NUM_ROUNDS: usize = 6;
const PERMUTATION_MAX: u32 = NUM_CHARS.pow(CODE_LEN) - 1;

/// Feistel permutation
struct Permutation {
    max: u32,
    seed: u64,
    block_size: u32,
    keys: [u32; NUM_ROUNDS],
    right_bit_mask: u32,
}

impl Permutation {
    pub fn new(seed: u64) -> Self {
        let block_size = ((PERMUTATION_MAX as f64).log2().ceil() / 2.0) as u32;

        let mut rng = ChaCha8Rng::seed_from_u64(seed);
        let keys: [u32; NUM_ROUNDS] =
            std::array::from_fn(|_| rng.random_range(0..(2_u32.pow(block_size) - 1)));

        Self {
            max: PERMUTATION_MAX,
            seed,
            block_size,
            keys,
            right_bit_mask: ((1 << block_size) - 1),
        }
    }

    fn _hash(&self, num: u32) -> u32 {
        twox_hash::XxHash3_64::oneshot_with_seed(self.seed, &num.to_le_bytes()) as u32
    }

    fn _cipher_function(&self, right: u32, key: u32) -> u32 {
        let xored = right ^ key;
        let hashed = self._hash(xored);
        hashed & self.right_bit_mask
    }

    pub fn permute(&self, num: u32) -> u32 {
        let mut left = num >> self.block_size;
        let mut right = num & self.right_bit_mask;
        for key in self.keys {
            let new_right = left ^ self._cipher_function(right, key);
            left = right;
            right = new_right;
        }
        let result = (left << self.block_size) + right;
        if result <= self.max {
            result
        } else {
            self.permute(result)
        }
    }

    pub fn unpermute(&self, num: u32) -> u32 {
        let mut left = num >> self.block_size;
        let mut right = num & self.right_bit_mask;
        for key in self.keys.iter().rev() {
            let new_left = right ^ self._cipher_function(left, *key);
            right = left;
            left = new_left;
        }
        let result = (left << self.block_size) + right;
        if result <= self.max {
            result
        } else {
            self.unpermute(result)
        }
    }
}
```

And here are some examples of game codes:

| ID        | code   |
|----------:|--------|
| 1         | `T1WE` |
| 36        | `R3L2` |
| 590,331   | `QIVE` |
| 1,387,022 | `U0JN` |

## Bonus: Avoiding offensive words

One problem with randomized strings is that it's possible to get offensive
words, which I'd like to avoid. I used a [banned word
list](https://github.com/Hesham-Elbadawi/list-of-banned-words) to find
4-character words I should filter out.

If you really want to see the words, you can use the following command, but
do be warned that there are very offensive words in there.

```bash
curl -s https://raw.githubusercontent.com/Hesham-Elbadawi/list-of-banned-words/refs/heads/master/en | grep '^....$'
```

Fortunately, filtering these out was quite simple. I converted each word from
base 36 to an integer without de-ciphering them to find the numbers we want to
avoid. Then I sorted these numbers and added them to an array. Storing numbers
also means I don't need to check these words into source control.

(The list shows 38 words, but there are 60 numbers in the code snippet because
I also added some number-for-letter substitutions, such as `SEXY` -> `S3XY`).

```rust
/// These numbers decode to offensive words that we want to avoid showing to users
const BANNED_NUMBERS: [u32; 60] = [47050, 78154, 172539, ... 1678375, 1678987];

fn is_banned(num: &u32) -> bool {
    BANNED_NUMBERS.binary_search(num).is_ok()
}
```

Then we can skip over these in the permutation step in the same way we avoided
numbers over the limit.

```rust
if result <= self.max && !is_banned(&result) {
    return result
} else {
    return self.permute(result)
}
```

Finally, we'll also need to remember to reduce the maximum number by the number
of banned words.

```rust
const PERMUTATION_MAX: u32 = NUM_CHARS.pow(CODE_LEN) - (BANNED_NUMBERS.len() as u32) - 1;
```

## Summary

I'm really pleased with this solution. As mentioned in the introduction, it
requires no shared mutable state aside from the counter, which means no locks.
Since the functions are pure, it's very easy to test.

It's also very performant. The following test iterates through _every_ valid
code and runs in ~2.5s, which means encoding/decoding an ID takes ~1.5μs.

```rust
// Exhaustive check that the bad-words mechanism is working
// This is slow so we ignore it by default
#[ignore]
#[test]
fn badwords() {
    let encoder = IdEncoder::new(8);
    for i in 0..PERMUTATION_MAX {
        let encoded = encoder.encode(i as usize);
        assert!(encoded.is_some_and(|e| e != "SEXY")) // Tamest bad word
    }
}
```

But most of all, it was satisfying to use this cool property of ciphers I
discovered years ago for a non-cryptographic application.
