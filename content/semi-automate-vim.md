<script>
  import Asciinema from "$lib/components/Asciinema.svelte";
</script>

# Semi-automate the boring tasks with Vim

When you hear enthusiasts talk (or type) about Vim, you'll probably come away
believing that Vim is better because you can do things in "less keystrokes",
which "saves time" and thus makes you more productive. Needless to say, this
sounds a little bit excessive, and I'd mostly agree.

After using Vim for a few years, I don't think its advantage comes from saving
time through less edits-per-keystroke. In my opinion, Vim's main feature is
that the instructions you enter are more _meaningful_ than the instructions you
enter into other editors, which makes it easier to automate repetitive tasks.

I'm not a Vim evangelist, or even a particularly experienced Vim user. I like
using it, but I don't think it's for everyone. This article shares an advantage
of Vim that wasn't obvious to me before I started using it.


## The killer feature

For me, Vim is best at handling those awkward tasks that are a _bit_ repetitive
and laborious to do manually, but too short, niche, or have enough edge cases
that writing a script would take longer than just doing it by hand.

The reason Vim is so good for these tasks is that the commands you enter into
Vim are more generalizable than other text-editors' commands, which means you
can often just do the task once, then tell Vim to "do that again".


## Simple example

Let's take a simple example of changing some markdown links to HTML links. The
following text is a markdown link.

```
[link text](https://example.org)
```

Which we'll edit to the following HTML link.

```
<a href="https://example.org">link text</a>
```

In a regular text editor, you'd probably start with something like this
(relative from the beginning of the link):

1. Select characters 13-31 (the URL)
2. Cut the selection using CTRL+X
3. ...

You might already see the problem in asking your editor to "repeat this"
action. If we try to repeat this action on a different link, such as

```
[here's some other link text](https://example.org/about)
```

We'd end up copying the string `other link text](https://example`, and
continuing would just mangle the link further. Instead, here's how we'd do this
in Vim.

1. Type `f(` to move forward to the parentheses
2. Type `di(` to cut the text inside the parentheses
3. ...

This is what I meant when I said Vim's commands are "more meaningful"; they're
much closer to how you'd explain the process to a human. When you ask Vim to
repeat this action, it'll actually do what you want.

Here's a clip of me recording the action, then replaying it.

<Asciinema
    recordingName="semi-automate-vim/demo1"
    size={[18, 86]}
/>

You could probably automate this action easily through a regex
find-and-replace, or with one of many markdown parsing libraries, but this
feature becomes more useful when the tasks are a little more complicated.


## Longer example

Let's say you have a bunch of markdown files in a directory, and you want to
create a table-of-contents YAML file that has each filepath, the title of the
file, and a unique ID.

```yaml
- name: About us
  path: about-us.md
  uuid: c179f78b-d941-426f-be89-cf38e8131126

- name: Index
  path: index.md
  uuid: c179f78b-d941-426f-be89-cf38e8131126
```

Doing this manually is tedious, but not worth writing a script for if you only
need to do it once. This kind of task is Vim's forte.

<Asciinema
    recordingName="semi-automate-vim/demo2"
    size={[28, 134]}
/>

In the video, I use another handy feature, the "read" command (`:r!`). This
feature runs a Unix command and pastes the output where your cursor is. Typing
`:r! ls *.md` will insert all the markdown files in your folder as separate
lines, and I also use it to run a small Python script to generate the unique
IDs.

In this case I did have to think a little bit to make sure my actions were
generalizable, but editing still only took around 30s. 

I would describe this as "semi-automated"; you'll probably still want to neaten
up some edge cases. But this is a lot faster, and more importantly, a lot less
boring than doing it all manually.
