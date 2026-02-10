---
title: "What's Next For Aria"
description: "Update on Aria's future"
---

# What's Next for Aria

I have had a lot of fun hacking on Aria. What started as a little tree-walking toy interpreter ended up a nice language (or at least so I think) and allowed me to meet some of the nicest folks I had the pleasure of working with!

However, I came to realize that, while the basic architecture of the project is reasonable, and the language it expresses is pleasant to use, the current codebase is not nearly as performant as it could or should be. I looked into ways to bridge that gap, and they would amount to what is essentially a wholesale rewrite of the virtual machine.

Chief among the issues:
- the Value system is essentially `Rc<RefCell<SomeBox>>`, which is very convenient to write code in, but not very efficient at runtime. I built it up this way for two reasons, because I was new at Rust, and because I wanted to be able to attach attributes to anything, easily. It is no longer carrying its weight. I can see more efficient ways to manage objects, and attributes could be handled via promotion to a slow path;
- The runloop uses the Rust stack as the Aria stack, and operator overloads can enter the runloop multiple times. This is (surprising perhaps nobody except me) inefficient, and should be replaced by a proper runloop using a `Stack<Frame>`, if anything, which leads me to
- I don't plan to have a JIT, so picking a stack VM is leaving efficiency on the table that I will never get back. A register VM would have been a better hese constraints. I should have done that.

All these things would amount to a complete rewrite of the Aria VM. If I am to rewrite the entire thing, I might as well embrace the challenge and imagine what a "new Aria" would look like. Are exceptions really carrying their weight? (probably not). Could I resolve imports at compile time to make more portable programs? (maybe yes, but what does it mean for attached native libraries?). Is my Python-like operator model the right one? (probably yes).

And then some more.

One of the early feedbacks I received when I posted Aria was, "ok technically nice, but what's the pitch?". I want to spend some more time on the pitch. I think there is a path for a scripting language that stays nimble and sheds ceremony without getting sloppy ("for system developers"). Maybe I will find that path. I think going back to basics is a good way to look for it.

Where does that leave the original Aria code? I plan to leave it right here where it is. If someone wants to embark on the journey to upgrade the VM, be my guest. I will gladly support that. Or if someone wants to take this codebase entirely somewhere else, then also so be it. I am happy to appoint a maintainer who has a vision for this program and wants to grow it.

I don't have a firm timeline for "the new thing", but if you want to stay in touch, follow [me](https://github.com/egranata) on GitHub to find out.