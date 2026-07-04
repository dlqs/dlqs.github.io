---
title: 'FRR Lua Hook System — GSoC 2021'
description: 'What I built for FRRouting during Google Summer of Code 2021: a function-based Lua hook system, and the autotools rabbit holes along the way.'
pubDate: 2021-08-23
---

Project: [listing](https://frrouting.github.io/frr-gsoc/year-2021/projects/lua-hook-points)

Presentation at Netdev 0x15 (about 10 minutes): [YouTube](https://youtu.be/_8R1MYP7M48?t=1051)

## Work done, in chronological order

### [Improvements to Lua hook system #8888](https://github.com/FRRouting/frr/pull/8888) (merged)

First take at a hook call system. FRR could already run Lua code, but it was rather
unwieldy with the manual encoding and decoding of values and whatnot. This PR
replaced the manual encoding/decoding of Lua values with a sort of static dispatch
that matches the Lua arguments with their encoders/decoders by their type, which
cut down on the amount of text one hook call required. It made use of a bunch of
macros and `_Generic`, which was introduced in C11.

### [Function-based Lua hook call #8982](https://github.com/FRRouting/frr/pull/8982) (merged)

Before this, the hook calls were still global, i.e. one hook call runs one .lua script.
This PR turned the hook calls into functions, which lets FRR users freely organize their
Lua functions and Lua scripts. Inputs (arguments) and outputs (return values) were also
made more explicit, which we thought was better for Lua writers.

### [Download Lua in bootstrap #9115](https://github.com/FRRouting/frr/pull/9115) (not merged) &middot; [Build Lua from tarball #9254](https://github.com/FRRouting/frr/pull/9254) (not merged)

FRR didn't support Lua on all platforms, and at the time of writing, still doesn't.
I took about two weeks to try to integrate Lua into FRR's GNU autotools setup, but it
went nowhere. I tried:

- Linking Lua's static library against FRR
  - Even if this might work for one binary, it's not a great idea, and GCC will warn you about it
- Making Lua a third party project, with its own Makefile
  - Turns out it's hard to build shared libraries for all platforms
- Compiling Lua into a GNU autotools library and integrating it with FRR's autotools setup
  - Worked on my laptop but not on other OSes. Turns out, linking a shared library against another
    shared library doesn't always work, since the symbols don't always show up transitively.

### [Refactor decoder for Lua hook system #9012](https://github.com/FRRouting/frr/pull/9012) (not merged)

We have what I thought was a pretty neat way to reduce the number of no-op code required.
(It's a long story — more in the PR description.) Unfortunately, until Clang supports nested
functions, this will probably not be merged. It's so neat, it's a pity :(

### [lib: lua: consecutive script calls #9348](https://github.com/FRRouting/frr/pull/9348) (merged)

Made Lua script calls consecutive. So multiple Lua script calls require only one Lua load.
This will probably be useful for script calls in loops. Still might be slow overall — but
we have to benchmark to be sure.

### [zebra: rib_process_dplaneresults hook call #9440](https://github.com/FRRouting/frr/pull/9440) (merged)

Another hook call for Zebra dplane. This can be used to log dataplane events out, say, when a
route is installed.

### [lib: Fix dead code from lua_dofile #9273](https://github.com/FRRouting/frr/pull/9273) (merged) &middot; [lib: check return on str2sockunion #9337](https://github.com/FRRouting/frr/pull/9337) (merged)

Bug fixes, for my own code.

## Things I liked

### C

This is my first time programming in a large C codebase, outside of school. And it wasn't
as bad as I thought it was going to be.

Macros: can be incredibly ~~confusing~~ powerful. In my first week, I tried to understand how the C
subscribable hook system worked. It took me a while to [break down](https://docs.google.com/document/d/18lGcCaoC-6duYumoBuLWbacsEXJjHB9lwg2nthjm5v4/edit) but I learned how macros could
be used to build some pretty wild things, far more than just as a copy-and-paste tool.

Types: C isn't well known for its polymorphism, but we can get pretty far with macros, `typeof`, and
statement expressions.

### Documentation and guidance

FRR is pretty well documented. Disregarding the domain-specific (networking) aspects of the code, it
was generally readable for a C novice like me. My mentors, as well as the developers on the #gsoc
or #developer Slack channel were really helpful and often responded rather quickly.

### Getting to talk about my project

My mentors were so nice, they gave me some time to talk about my project at netdev 2021! It
was a chance for me to pause and check out my own work as well. The other talks were interesting too,
but if I'm being honest I lacked the knowledge to follow most of them closely.
Most of the talks required extensive networking background knowledge to grok
(as is expected at *the* Linux networking conference).

## Things I didn't like

### Slow PR reviews

On average, after marking my PRs as ready-for-review, the review-refactor-review cycle usually took
pretty long, on average about 1.5–2 weeks. I had to ping a few times for a review.

### GNU Autotools

It was really hard working with GNU Autotools, and m4 too.
It took me a really long time to just understand what the [ax_lua](http://git.savannah.gnu.org/gitweb/?p=autoconf-archive.git;a=blob_plain;f=m4/ax_lua.m4) macro was doing, and even longer
to make some change to the build process.
However, evidently it *is* quite portable, perhaps its only redeeming feature — I'm sure there are other
things it does well, but I can't currently see any.

### Compile errors

Occasionally, GCC produces sane compile errors. In a macro-heavy project, one might occasionally
try to untangle hundreds of error messages to find that it was just a missing semicolon inside a macro.
It's really annoying, but probably an inevitable consequence of leaning on macros so heavily.
The low decipherability of compile errors really slowed down development time.

### Runtime errors

Daemons such as Zebra might sometimes just refuse to start, without any errors. These errors are
incredibly annoying to debug. And it is usually due to some insidious error, such as malloc-ing the
size of a pointer instead of a struct: `struct abc *a = malloc(sizeof(a))`.

These errors can be really hard to catch (it should be `sizeof(*a)` above). Valgrind comes in handy.
