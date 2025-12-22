---
title: "What's New in Aria - December 2025"
description: "Highlights from the December 2025 Aria release."
---

# What's New in Aria - December 2025

To give Aria more time to fully bake, the release plan for 1.0 has been adjusted. The new target date for Aria 1.0 is April 2026.

With this change, the language is entering a stabilization phase. The primary focus is now on correctness, bug fixes, and small quality-of-life improvements. Major new features are intentionally out of scope as we move toward 1.0.

## Standard Library

* `File.writeln` actually writes a newline at the end (oops)!

* `List` and `String` values allow negative indices with Python-style semantics.

* Multiplying a `List` or `String` by a negative integer now returns an empty value.

* `MixinRng.one_of` now fails explicitly when given an empty list.

* String character classes now fully support Unicode values.

* Fixed `Instant` to handle negative timestamps (before the Unix epoch) correctly in all cases.

* `String.hash` now produces distinct values for anagrams.

## Core Language

* The `<<=` and `>>=` assignment operators are now supported.

* `\r` is now recognized as a valid escape sequence.

* In `match` statements, `case Foo(x)` now fails cleanly if `Foo` has no payload, instead of triggering a VM error.

## REPL

* The REPL input parser now accepts comments, making it easier to paste larger or annotated code snippets.

---

## Aria Release
**Download Aria today** The latest version [v0.9.20251222](https://github.com/arialang/aria/releases/tag/v0.9.20251222) is available on GitHub, with prebuilt binaries for Linux and macOS.

Prefer to build from source? Clone the [repo](https://github.com/arialang/aria) and get the freshest bits.

---
