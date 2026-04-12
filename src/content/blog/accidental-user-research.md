---
title: 'The accidental user researcher'
description: 'How I accidentally stumbled upon user research best practices while maintaining an open-source textbook.'
pubDate: '20 Feb 2026'
---

I was first hired at IBM to work on the _Qiskit Textbook_, an online resource
teaching quantum computing through Qiskit, one of IBM's open-source software
products. The goal was to gain popularity in classrooms and with self-learners.
When I first started, my manager asked me what I thought I should do to improve
it. I said "user research".

I knew "user research" was important, I'm not sure where I'd heard it, but it
stuck. I also knew that I didn't really know anything about it; I was aware
that user research was a profession in and of itself, and that IBM employed
such professionals, and even back then I wasn't arrogant enough to think I
could jump right into it.

Surely we'd need a large number of participants (N) to avoid bias? And aren't
there some psychology things at play? We should probably have professionals
conduct the research to avoid leading questions. However, my manager probably
knew that was never going to happen and encouraged me to do what I could by
myself. "It's better than nothing", I thought.


## Fast feedback

I sent out an office-wide invitation for a quantum computing reading group. The
idea was that we'd read through the textbook together, and I'd work out where
people were stuck and use that to improve the content. With "quantum" being the
buzzword it was, ~100 people turned up to the first meeting, which I was
woefully underprepared for.

However, most participants realised they didn't actually want to read about
Hermitian matrices or the conjugate transpose in their lunch break, and the
group quickly petered down to a handful of dedicated and bright readers.

Each week, we read a chapter of the book together. We'd regularly come across
clunky phrasings, incorrect equations, and places where my understanding was
weaker than I realised. The group were exceptionally bright and would share
their own revelations about the concepts. After each session, I'd revise
everything we read that day.


## Crowdsourcing

> given enough eyeballs, all bugs are shallow
>
> -- <cite>Eric S. Raymond</cite>

The reading group wasn't the only feedback I had: The Qiskit community was
thriving, partly due to the buzzword effect, but also due to the great work
done by the rest of the Qiskit community team. Every day I saw new questions in
Slack and content "bugs" appearing the GitHub issue tracker. I essentially had
a thousand proof readers, reviewing the content more carefully than I could
ever hope one person to. I didn't even ask for this! It just happened to me. I
set a Slack alert for "textbook"; I wanted to respond to typos before
leadership saw them, but this also meant I saw every complaint and confusion
with the textbook material.

While it helped on all fronts, the crowdsourced feedback from Slack and GitHub
worked best for non-subjective feedback after the general form of the content
had settled. The frequency of questions about different topics was also a good
proxy for the general quality of different sections.


## Trouble in paradise

Depending on your metric, the textbook was a roaring success. It was the most
viewed page on (the now unavailable) qiskit.org. It was so successful that
apparently "Qiskit" had started becoming confused with the "Qiskit Textbook",
and it was leading to Qiskit's perception as exclusively a tool for learning:
Not something leadership was too pleased with.

It was also not particularly sleek: In terms of the [cathedral vs the
bazaare](http://www.catb.org/~esr/writings/cathedral-bazaar/), the textbook was
unquestionably a bazaare. Due to the large number of authors, there was no
consistent voice. It was not mathematically rigorous (I've still never learnt
how to write a formal proof). And the content became so large and specialised
that I started to burn out trying maintain it myself. IBMers proposed new pages
about their cutting-edge research. Qiskit itself was in flux and new releases
regularly broke our code examples. I was buried under GitHub issues.

I felt a sense of dread and guilt over PRs I couldn't review. Typos were simple
enough. Correcting a minus sign in a Byzantine equation required me to pull out
a pen and paper and work through the whole thing. Everyone had well-meaning
opinions, all of which were reasonable and I couldn't say no to, but all of
which were inconsistent with each other. Rejecting code is one thing: Whether
it works is relatively objective. Rejecting content is harder, especially on
grounds of style, tone, and preference. I dared not look through the open PRs:
Well-meaning changes from volunteers trying to improve open-access materials,
collecting dust. I was letting them down.

Some IBMers would stick around and help update their chapters or answer
questions from the community, others did not. I hypothesise that they viewed
writing a textbook page as similar to writing an academic paper: Once it's
published, it's "done", not a living document like the textbook.

I also became afraid to change the textbook. In the early days, I made huge
edits based on user research and my own experiences as a recent learner. As the
readership grew, questions and issues about the most-read content petered out.
This proved the feedback cycle was working, but it also made me afraid to throw
away those battle-tested explanations. One of our performance metrics was
adoption in university courses, but professors using the textbook did not like
explanations changing under their feet during a course, some even needed the
content approved beforehand.

Eventually, the textbook was superseded by [IBM Quantum
Learning](https://quantum.cloud.ibm.com/learning). In addition to content, the
textbook's software had also evolved into an unsustainable state, and the
developers wanted a rewrite. The team decided this was a good time to start
afresh. After a transitional period, I jumped ship from learning and joined
Qiskit's developer advocacy team where I became a software developer mostly
working on [IBM Quantum Documentation](https://quantum.cloud.ibm.com/docs). 


## Lessons

I learnt many lessons in my time managing the textbook. The biggest was how to
say "no", which I learnt too late. However, I also learnt that I did some
things right.

Looking back, the biggest factor in the success of the textbook was the user
feedback loops we had in place. I stumbled into these accidentally and believed
they were sub-optimal, but I later discovered that fast feedback loops with a
small number of participants is actually the _best_ way to go about user
research. [NN/Group: Why You Only Need to Test with 5
Users](https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/)
is a great read, but the tl;dr is that large studies are a waste of time, and
many iterations with a small number of users are best.

For areas best suited to mass feedback, you don't need to conduct a big study,
just make sure the correct channels are set up so users can let you know.

But the biggest lesson is that you don't need to be a user researcher to do
user research. Sure, maybe they're better at it, but _anything_ is better than
nothing. This is your permission to do it.
