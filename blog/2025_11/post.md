---
title: "What's New in Aria - November 2025"
description: "Highlights from the November 2025 Aria release, including new operators, type features, and standard-library improvements."
---

# What's New in Aria - November 2025

This month brings a collection of quality-of-life improvements across the standard library and the core language as Aria moves steadily toward v1.0.

## Standard Library

* **unwrap operators for `Maybe`** – The `Maybe` type now supports `!` and `?` operators for unwrapping values.

* **`Path.glob`** – `Path` now exposes a `glob` method for pattern-based file discovery, enabling easier directory traversal and scripted tooling.

* **Hashing improvements** – `List` can now be hashed when all its elements are hashable. This feature is backed by the new standard-library `SipHash` implementation for consistent, collision-resistant hashing.

## Core Language

* **Improved `isa` support** — The `isa` operator now understands mixins, allowing more accurate type checks in object-based designs.

* **Intersection types** - Aria now supports intersection types (`A & B`). These allow combining mixin constraints to express that a value must satisfy multiple capabilities simultaneously.

* **Multiple assignments** - It is now possible to assign multiple variables in a single statement, e.g.
```aria
x,y = y,x;
x,y,z = 3,2,1;
```

* **Multiple variable declarations** - It is now possible to declare multiple variables in a single statement, e.g.
```aria
val x = 1, y = 2, z = false, t = "hello";
```

* **Improved integer literals** - Hexadecimal literals are now treated as unsigned, so you can write `0xFFFFFFFFFFFFFFFF` without overflow.

---

## Aria Release
**Download Aria today** The latest version [v0.9.20251118](https://github.com/arialang/aria/releases/tag/v0.9.20251118) is available on GitHub, with prebuilt binaries for Linux and macOS.

Prefer to build from source? Clone the [repo](https://github.com/arialang/aria) and get the freshest bits.

---
