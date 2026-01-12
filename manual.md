# 📘 Aria User Manual

## 👋 Welcome

This document is intended to guide you on the Aria language, from the fundamentals to advanced features. It is not meant as an introduction to computer programming.

It assumes you have Aria installed, and know how to write code in a text editor and run the Aria interpreter on your system. It does not assume that you know Rust or are interested in learning it.

## 📌 Fundamentals

Aria programs contain a `main` function, defined like

```aria
func main() {
    # code goes here
}
```

A program can contain multiple functions, but execution starts from `main`. A very simple program is the canonical Hello World

```aria
func main() {
    println("Hello World");
}
```

Save it to `hello.aria` and run it as `aria hello.aria`. It should print `Hello World` and return. There is no need to provide a return value from `main`.

To declare a variable, use `val`, as in

```aria
val x = 1;
val y = "Hello World";
val z = 3.14f;
```

It is possible to declare multiple variables in the same statement, as in

```aria
val x = 1, y = "Hello World", z = 3.14f;
```

Variables are mutable. Aria does not provide an immutable value construct. Assignment to a variable looks like most mainstream imperative languages

```aria
val x = 1;
assert x==1;
x = 2;
assert x==2;
```

It is possible to also assign multiple variables in the same statement

```aria
val x = 1, y = 2;
x,y = y,x;
assert x==2; # prints 2
assert y==1; # prints 1
```

All the right-hand sides of a multiple assignments are evaluated first, in reverse order, and then they are stored in the left-hand side variables, in order.

Basic arithmetic works as one would expect

```aria
val x = 1;
assert x+1==2;
assert 3 + 4 * 5 - x==22;
```

Integers are signed 64-bit values and they wrap around, e.g.

```aria
func main() {
    val x = 0x7FFFFFFFFFFFFFFF;
    assert x==9223372036854775807;
    assert x+1==-9223372036854775808;
}
```

## 📋 Lists

Lists are a builtin data type in Aria. They are defined by a list literal, e.g.

```aria
val l = [1, "hello", 3.14f, false];
assert l[0] == 1;
```

A list can contain heterogeneous elements of any Aria type. It is dynamically resizable, by appending new elements:

```aria
val l = [1, "hello", 3.14f, false];
l.append(5); # l is now [1, "hello", 3.14f, false, 5];
assert l.len() == 5;
assert l[4] == 5;
```

The size of a list can be obtained with `l.len()` and individual elements can be indexed directly from 0 to `len()-1`,

```aria
val l = [1, "hello", 3.14f, false];
assert l[1] == "hello";
l[1] = "hi there";
assert l[1] == "hi there";
```

Lists can contain other lists

```aria
val l = [1,2,3], ll = [l,4];
assert ll[0][0] == 1;
assert ll[0][0] == l[0];
```

Multidimensional arrays are not provided.

List concatenation uses the `+` operator, so

```aria
assert [1,2]+[3,4] == [1,2,3,4];
```

## 🧵 Strings

Strings can be concatenated with the `+` operator

```aria
assert "Hello " + 'World' == "Hello World";
```

and string repetition uses the `*` operator

```aria
assert "Chugga " * 2 + "Choo " * 2 == "Chugga Chugga Choo Choo ";
```

Strings literals can use either `"` or `'` quotes, which makes some constructs easier to write

```aria
val quote = 'He said "Tu quoque, fili mi?"';
```

Strings can also be indexed with square brackets, but only for reading

```aria
val x = "hello";
assert x[0] == "h";
```

String offer a formatting function, that allows interploating the values of variables or expression inside text. For example

```aria
val name = "Eric";
val year = 2021;
assert "My name is {0} and I was born in {1}".format(name, year) == "My name is Eric and I was born in 2021";
```

## 🔁 Control Flow

Common control flow statements and operators are available in Aria.

```aria
val x = 3;
if x == 3 {
    println("yes!");
} else {
    println("no!");
}
```

Alternative branches of an `if` statement are labeled `elsif`, as in

```aria
val x = 3;
if x == 1 {
    println("one");
} elsif x == 2 {
    println("two");
} elsif x == 3 {
    println("three"); # prints three
} else {
    println("I don't know");
}
```

There is no need to parenthesize the condition of an `if` clause. The `else` clause is optional.

`while` loops also work as expected.

```aria
val x = 1;
while x < 10 {
    println(x); # will print 1,2,3...
    x += 1;
}
assert x == 10;
```

Only boolean values and expressions, can be used in control flow, for example the following is illegal:

```
val x = 3;
while x {
    x -= 1;
    println(x);
}
```

`for` loops are used to iterate all over a container, for example a list.

```aria
val l = [2,4,6,8];
val counter = 0;
for x in l {
    println(x); # prints 2, 4, 6, 8
    counter += x;
}
assert counter == 20;
```

Loops can be exited with `break`, or jump to the next iteration with `continue`, much like in other languages in the C family.

Both `for` and `while` loops can optionally accept an `else` clause, which is executed if the body of the loop is never taken.

```aria
val or_else = false;
for x in [] {
    println(x);
} else {
    or_else = true;
    println("This list is empty!"); # prints This list is empty
}
assert or_else;
```

```aria
val x = 0;
val or_else = false;
while x > 1 {
    println("x is positive");
    x -= 1;
} else {
    or_else = true;
    println("x is <= 0"); # prints x is <= 0
}
assert or_else;
```

A ternary operator is provided with very similar behavior to its C counterpart:

```aria
val num = 3;
val str = num == 1 ? "one" : num == 2 ? "two" : "three";
assert str == "three";
```

## 🧑‍💻 Functions

Functions are defined with the `func` keyword, and can take zero or more arguments. They are invoked in the usual manner, with their name followed by parentheses.

```aria
func return_answer() {
    return 42;
}

func add_numbers(x,y) {
    return x + y;
}

func main() {
    assert return_answer() == 42;
    assert add_numbers(3,4) == 7;
}
```

Functions may not return a value if they are not used as expressions, such as

```aria
func print_answer() {
    println(42);
}

func main() {
    print_answer(); # prints 42
}
```

Functions can accept 0 or more required arguments, 0 or more optional arguments and possibly a variable number of arguments at the end. Variable arguments are stored in a list provided to the function named `varargs`

```aria
func add_all_values(x, ...) {
    for arg in varargs {
        x += arg;
    }
    return x;
}

func main() {
    assert add_all_values(1,2,4,6,8) == 21;
    assert add_all_values(5) == 5;
}
```

Optional arguments are given by name and a default value

```aria
func add(x,y=1) {
    return x + y;
}

func main() {
    assert add(3) == 4;
    assert add(2,3) == 5;
}
```

Closures are defined with a `|args| => { body }`. Captures (if any) are implicitly handled by the Aria VM

```aria
func double(x) {
    return x + x;
}

func call_f(f, x) {
    return f(x);
}

func main() {
    val answer = 42;

    assert call_f(double, 12) == 24;
    assert call_f(|x| => { return x + 1; }, 3) == 4;
    assert call_f(|x| => {return x + answer; }, 2) == 44;
}
```

One-line functions are a shorthand form for functions that consist of a single return expression. Instead of writing a full block, you can use = after the declaration:

```aria
func sum(x, y) = x + y;
assert sum(3,4) == 7;

func multiply(x,y=2) = x * y;
assert multiply(5) == 10;
assert multiply(3,4) == 12;
```

This is equivalent to writing a normal function that returns `x+y`.

## 🧱 Structs

Structs are defined as a set of operations, not data. For example

```aria
struct Foo {
    func blah() {
        return "I am a Foo";
    }
}

func main() {
    val f = alloc(Foo);
    assert f.blah() == 'I am a Foo';
}
```

Instances of structs are created with `alloc`, which returns a new object of the struct type.

For builtin types, `alloc` returns a default value (for example, 0 for integers and "" for strings). Some types (e.g. functions, enums, ...) cannot be instantiated with `alloc` because there is no obvious default for such values.

Instance functions are defined with the same syntax as free functions.  It is not possible to overload methods.

To access fields (data) on a struct instance, one directly reads or writes the field.

```aria
struct Foo {
    func blah() {
        return "I am a Foo - my value is {0}".format(this.x);
    }
}

func main() {
    val f = alloc(Foo);
    f.x = 5;
    assert f.blah() == "I am a Foo - my value is 5";
}
```

It is possible to define methods that interact with the struct type instead of any given instance. For example

```aria
struct Foo {
    type func blahblah() {
        return "I am the Foo struct";
    }
}

func main() {
    assert Foo.blahblah() == "I am the Foo struct";
}
```

The common use of `type` methods is to write constructors for structs

```aria
struct Foo {
    type func new(x) {
        return alloc(This) {
            .x = x
        };
    }

    func blah() {
        return "I am a Foo - my value is {0}".format(this.x);
    }
}

func main() {
    val f = Foo.new(5);
    assert f.blah() == "I am a Foo - my value is 5";
}
```

By convention, construtors are named `new`, or `new_with_X` if there are multiple possible constructors supplying different arguments.
This pattern allows writing fields into a struct before the caller can access its operation, so objects are well-formed by definition.

Structs can contain each other, but not inherit each other.

When printing objects of struct type, if a `prettyprint` method is defined, `format` and `println` call it and expect it to return a string that represents the object.

```aria
struct Foo {
    type func new(x) {
        return alloc(This) {
            .x = x
        };
    }

    func prettyprint() {
        return "Foo({0})".format(this.x);
    }
}

func main() {
    val f = Foo.new(5);
    assert f.prettyprint() == 'Foo(5)';
    println(f); # prints Foo(5)
}
```

## 📑 Enumerations

Enumerations allow describing a closed set of possible values

```aria
enum TaskStatus {
    case NotStarted,
    case InProgress,
    case Blocked,
    case Completed
}

func main() {
    val ts1 = TaskStatus::Completed;
    val ts2 = TaskStatus::InProgress;
}
```

Enumeration cases can also contain a payload. Each case can contain at most one value, which can be of any type, including a struct. It is possible to define structs inside enums, e.g.

```aria
enum TaskStatus {
    struct BlockedReason {
        type func new(reason: String) = alloc(This) { .reason };
    }

    case NotStarted,
    case InProgress(Int),
    case Blocked(TaskStatus.BlockedReason),
    case Completed
}

func main() {
    val ts1 = TaskStatus::Completed;
    val ts2 = TaskStatus::InProgress(45);
}
```

To check if an enumeration value is a specific case, helper `is_X` methods are provided for each case. For cases with payload, `unwrap_X` methods provide the payload, if the value is of that case.

```aria
enum TaskStatus {
    case NotStarted,
    case InProgress(Int),
    case Blocked,
    case Completed
}

func main() {
    val ts1 = TaskStatus::Completed;
    val ts2 = TaskStatus::InProgress(45);

    assert !ts1.is_Blocked();
    assert ts2.is_InProgress();
    assert ts2.unwrap_InProgress() == 45;
}
```

It is a runtime error to call `unwrap_X` on an enumeration value not representing that case.

One can also use the `match` statement to extract case and value from an enum, for example

```aria
enum TaskStatus {
    case NotStarted,
    case InProgress(Int),
    case Blocked,
    case Completed
}

func main() {
    val ts1 = TaskStatus::Completed;
    val ts2 = TaskStatus::InProgress(45);

    match ts2 {
        isa TaskStatus and case InProgress(x) => {
            println("In Progress, {0}% completed".format(x));
        },
        isa TaskStatus and case Blocked => {
            println("Blocked");
        },
        # ...
    } # prints In Progress, 45% completed
}
```

The two clauses in `match` above check that ts2 is of type `TaskStatus` and the case that it covers. A `case` check would only match the name of the case, but not the type (multiple enums could have the same case name). For enums with payload, the payload can also be extracted in the `case` clause by providing an identifier.

More broadly, a match statement can also be used to check some simple comparisons, for example

```aria
func main() {
    val x = 3;

    match x {
        >= 5 => { println("A very large number"); },
        > 3 => { println("A good number"); },
        == 3 => { println("It's three!"); }, # prints It's three!
        > 0 => { println("A small positive number"); }
    } else {
        println("not sure!");
    }
}
```

Valid operators are ==, !=, isa, >, >=, <, >= and they can be combined with `and` clauses:

```aria
func main() {
    val x = 3;

    match x {
        isa String and == "hello world" => { println("hi there!"); },
        isa Int and >= 4 => { println("Four or more"); },
        isa Int and > 0 and < 5 => { println("It might be three?"); }, # prints It might be three?
    }
}
```

## ⁉️ Maybe and Result

`Maybe` is an enum that represents a potentially missing value. It is defined as

```aria
enum Maybe {
    case Some(Any),
    case None,
}
```

As an enum, it can be used in `match` or checked with `is_X` helpers. APIs where a value may be returned or not, and neither condition is an error, use `Maybe` to represent that fact.

`Result` is an enum that represents a successful or failed operation. It is defined as

```aria
enum Result {
    case Ok(Any),
    case Err(Any),
}
```

Use `Result` to represent operations that can succeed or fail, where both conditions are expected and need to be handled. Generally, the value of the `Err` case should itself be a struct or enum that describes the error in more detail.

While `Maybe` is intended to convey the (non-)existence of a value, `Result` is intended to convey the (non-)success of an operation. For this reason,` Result` has bridges to-and-from exceptions, while `Maybe` does not.

To convert an exception into a `Result`, use `Result.new_with_try`, which takes a closure that may throw, and returns a `Result`. To convert a `Result` into an exception, use `Result.or_throw`, which returns the value of the `Ok` case, or throws the value of the `Err` case.

Shorthand syntax is provided to extract - or propagate - values from `Maybe` and `Result`, the `?` and `!` operators.

`x?` is equivalent to `val` if the object is `Result::Ok(val)` or `Maybe::Some(val)`. If the object is a `Result::Err(err)` or `Maybe::None`, it is equivalent to `return x;` from the current function.

`x!` has the same behavior, but instead of returning it will assert on `Err` or `None` cases.

Custom types can participate in the "try unwrap protocol", by defining a `_op_try_view` method, which must return a `Result` or a `Maybe`. If the method is not defined, the default behavior is to return `Result::Ok(this)`

```aria
func might_fail(x) {
    if x > 0 {
        return Result::Ok(x * 2);
    } else {
        return Result::Err("x must be positive");
    }
}

func main() {
    val r1 = might_fail(3);
    val r2 = might_fail(-1);

    assert r1! == 6;
    assert r2.is_Err();
    assert r2.unwrap_Err() == "x must be positive";
}
```

```aria
func might_be_missing(x) {
    if x > 0 {
        return Maybe::Some(x * 2);
    } else {
        return Maybe::None;
    }
}

func main() {
    val m1 = might_be_missing(3);
    val m2 = might_be_missing(-1);

    assert m1? == 6;
    assert m2.is_None();
    assert m2?.is_None();
}
```

## 🗺️ Maps

Maps are provided by the Aria standard library. To import the Map data type, use `import Map from aria.structures.map;`. This gives access to the `Map` data type.

Values can be inserted into a map by key

```aria
import Map from aria.structures.map;

func main() {
    val m = Map.new();
    m[1] = "one";
    m[2] = "two";
}
```

and retrieved by key

```aria
import Map from aria.structures.map;

func main() {
    val m = Map.new();
    m[1] = "one";
    m[2] = "two";

    assert m[1] == "one";
}
```

It is a runtime error to try to retrieve a missing key with the square brackets operator. In that case, use `get`, which returns `Maybe`.

```aria
import Map from aria.structures.map;

func main() {
    val m = Map.new();
    m[1] = "one";
    m[2] = "two";

    assert m.get(3).is_None();
}
```

Maps can be iterated with `for` loops, and they return pairs of key and value

```aria
import Map from aria.structures.map;

func main() {
    val m = Map.new();
    m[1] = "one";
    m[2] = "two";

    val all_values = "";

    for kvp in m {
        println("key = {0} value = {1}".format(kvp.key, kvp.value)); # prints key = 1 value = one key = 2 value = two
        all_values += kvp.value + " ";
    }
    assert all_values == "one two ";
}
```

Custom types can be used as keys in maps, as long as they define a `func hash()`.

## 🏷️ Object Initialization

Aria offers a quick syntax to write multiple values into the same object. Any expression can be followed by a write-list, e.g.

```aria
val x = [] {
    [0] = 1,
    [1] = 2,
    [2] = 3
};

assert x[0] == 1;
assert x[1] == 2;
assert x[2] == 3;
```

will initialize a list with [1, 2, 3].

It can also be done for structs, for example

```aria
val x = Box() {
    .a = 1,
    .b = 2,
    .c = 3,
};

assert x.a == 1;
assert x.b == 2;
assert x.c == 3;
```

which will create an object with fields `a`, `b`, and `c`.

Indices and fields can be freely mixed:

```aria
import Map from aria.structures.map;

val m = Map.new() {
    ["hello"] = "world",
    .something = "else",
    ["foo"] = "bar",
};

assert m["hello"] == "world";
assert m["foo"] == "bar";
assert m.something == "else";
```

As a shortcut, a field can be initialized by a local variable of the same name without duplicating the name, as in

```aria
struct StringWrapper {
    type func new(msg) = alloc(This) { .msg };

    func prettyprint() { return this.msg; }
}

assert StringWrapper.new("hello world").prettyprint() == "hello world";
```

This syntax is most often used for initializing objects and containers, but it is generally available:

```aria
assert ("x"{.hello = "world"}.hello) == "world";
```

Writes are performed in the order they are provided, and duplicated writes to the same index or name are not discarded. In general, the user should expect a "last write wins" behavior.

## 🚛 Extensions

Extensions allow to add new functions to already defined types. They are introduced by the `extension` keyword, and they otherwise look the same as a definition of a type

```aria
struct Counter {
    type func new() {
        return alloc(This) {
            .x = 0,
        };
    }
}

extension Counter {
    func add(x) {
        this.x += x;
        return this.x;
    }
}

extension Counter {
    func increment() {
        return this.add(1);
    }
}

func main() {
    val c = Counter.new();
    c.add(2);
    assert c.increment() == 3;
}
```

`add` and `increment` operate as if they were defined within the body of `Counter`'s initial definition.

Enums can also be extended the same way

```aria
enum Temperature {
    case Celsius(Float),
    case Fahrenheit(Float)

    func to_f() {
        match this {
            case Fahrenheit => { return this; },
            case Celsius(c) => {
                return Temperature::Fahrenheit(c*1.8f+32);
            }
        }
    }
}

extension Temperature {
    func prettyprint() {
        match this {
            case Fahrenheit(f) => {
                return "{0} F".format(f);
            }, case Celsius(c) => {
                return "{0} C".format(c);
            }
        }
    }
}

func main() {
    val tmp = Temperature::Celsius(32.0f);
    val tmp_f = tmp.to_f();
    assert tmp_f == Temperature::Fahrenheit(89.6f);
}
```

## 🏈 Exceptions

Exceptions can be used to generate out-of-band control flow. Any Aria object can be thrown and caught. Exceptions cause unwinding of the stack until a frame catches, or there are no more frames left, at which point it is handled by the VM itself.

```aria
func main() {
    try {
        println(9 / 3); # prints 3
        println(2 /0);
    } catch e {
        assert prettyprint(e) == "division by zero";
    }
}
```

`catch` cannot discriminate on the type of the exception or its parameters. If a `catch` block is unable to resolve an exception, it can throw it again.

The error handling philosophy of Aria is generally inspired by Rust and Midori:
- Some scenarios are expected and anticipated even if not the happy path (e.g. getting an element out of a Map, but there is nothing with that key); for cases like these return `Maybe::None` (if the absence of a value is not an error) or `Result::Err` (if the absence of a value is an error);
- Some scenarios are erroneous, but can be recovered from (e.g. disk removed during a file write); in these cases throw an exception and handle it somewhere else;
- Some errors are beyond recovering (e.g. the VM expected two operands but only one is present on the stack); in these cases the VM itself will throw a fatal error, or you can assert in your code. `assert` fails by throwing a non-recoverable VM error.

Aria itself defines a set of common exceptions in the `RuntimeError` enum:

- `DivisionByZero`: see example above;
- `EnumWithoutPayload`: you attempted to extract payload from an enum value that has none;
- `IndexOutOfBounds`: attempting to access an element beyond the end of a container;
- `MismatchedArgumentCount`: called a function with fewer/more arguments than it needed;
- `NoSuchCase`: attempting to access an enum's case that does not exist;
- `NoSuchIdentifier`: attempting to read/write a value that does not exist;
- `OperationFailed`: some task could not be completed for reasons outside of Aria's control (e.g. running an external program);
- `UnexpectedType`: an operation required a value of one type, but a value of a different one was provided

These values can be reused by user code, or new exception types can be created. The usual pattern for an exception is to create an ad-hoc struct

```aria
struct MyException {
    type func new(msg) {
        return alloc(This) {
            .msg = msg,
        };
    }

    func prettyprint() {
        return "{0}".format(this.msg);
    }
}
```

Possibly, the exception itself can craft a message based on arguments provided to it, if that makes sense in the specific case. An enumeration can be used to discriminate if an error can occur for different causes, and it's generally a better pattern than using an integer error code.

If an exception is not handled, the VM itself dumps the exception information and a stack trace. For example:

```
func do_division(x,y) {
    return x / y;
}

func complex_math(x,y) {
    val a = x + y;
    val b = x - y;
    val c = x * y;
    val d = do_division(x,y);

    return a + b + c - d;
}

func main() {
    println(complex_math(7,0));
}
```

will fail with an exception and print out

```
Error: division by zero
    ╭─[/tmp/program.aria:2:12]
    │
  2 │     return x / y;
    │            ──┬──
    │              ╰──── here
    │
  9 │     val d = do_division(x,y);
    │                        ──┬──
    │                          ╰──── here
    │
 15 │     println(complex_math(7,0));
    │                         ──┬──
    │                           ╰──── here
────╯
```

## 🎮 Operators

Structs and enums can overload a subset of operators to provide custom behavior. The resolution rules are similar to those of Python, without the support for inheritance.

The operators that can be overloaded are as follows:

| Operator Symbol | Name |
| ------------- | ------------- |
| `+` | `add` |
| `-` | `sub` |
| `*` | `mul` |
| `/` | `div` |
| `%` | `rem` |
| `<<` | `lshift` |
| `>>` | `rshift` |
| `==` | `equals` |
| `<` | `lt` |
| `>` | `gt` |
| `<=` | `lteq` |
| `>=` | `gteq` |
| `&` | `bwand` |
| `\|` | `bwor` |
| `^` | `xor` |
| `u-` | `neg` |
| `()` | `call` |
| `[]` | `read_index` |
| `[]=` | `write_index` |

Operators are overloaded by an `operator` declaration:

```aria
struct Integer {
    type func new(n) {
        return alloc(This){
            .n = n,
        };
    }

    operator %(rhs) {
        if rhs isa Integer {
            return Integer.new(this.n % rhs.n);
        } elsif rhs isa Int {
            return Integer.new(this.n % rhs);
        } else {
            throw alloc(Unimplemented);
        }
    }

    func prettyprint() {
        return "{0}".format(this.n);
    }
}

func main() {
    val x = Integer.new(26);
    assert (x%4).n == 2;
}
```

If an operator does not support a combination of operands, it can throw `Unimplemented`. For a binary operator, if the type of the second operand is different, Aria will attempt to invoke the reverse operator. For operators other than equality, the syntax to define a reverse operator is `reverse operator`. For equality, one simply defines `operator ==` on the other type.

Square bracket access is defined by means of `operator [](index)` and `operator []=(index, value)`. The value of the index does not have to be an integer (e.g. `Map`), and any arbitrary number of indices can be supported (including variable arguments).

Defining `operator ()` allows objects to be called as if they are functions, e.g.

```aria
struct CallMe {
    type func new() { return alloc(This); }
    operator ()(x,y,z) {
        println("You called me? x={0} y={1} z={2}".format(x,y,z));
        return x + y + z;
    }
}

func main() {
    val c = CallMe.new();
    assert c(1,2,3) == 6; # prints You called me? x=1 y=2 z=3 and then returns 6
}
```

Operator definitions generate an implementing function named `_op_impl_<name>`. While this is technically a part of the contract between the compiler and the VM, it is documented here because it can be useful to refer to the function underlying the operator in some cases, e.g. to implement a commutative reverse operator

```aria
struct Foo {
    operator + (rhs) {
        return 42;
    }

    reverse operator + (lhs) {
        return this._op_impl_add(lhs);
    }
}

assert (12 + alloc(Foo)) == 42;
```

To help with defining a coherent set of comparison operators, the standard library provides a `TotalOrdering` mixin at `aria.ordering.compare`.

## 👮 Guards

A guard is used to create a scoped block that can deallocate some managed resource on exit. Note that a `guard`'s `do` block is not a lexical block, but it accepts a function (or really any callable object) that is invoked with the guarded object as argument. This means that the guarded object can outlive the `do` block if it is returned or stored somewhere else. It also means that the `do` block can capture variables from its caller scope, but these will be treated as captures, not as local variables.

```aria
import guard from aria.utils.guard;

struct LoggedTask {
    type func new(op) {
        println("Starting {0}...".format(op));
        return alloc(This) {
            .op = op,
        };
    }

    func guard_exit() {
        println("{0} completed".format(this.op));
    }
}

func main() {
    guard(LoggedTask.new("first task")).do(|x| => { # prints Starting first task...
        # do the thing
    }); # prints first task completed

    guard(LoggedTask.new("second task")).do(|x| => { # prints Starting second task...
        # do the thing
    }); # prints second task completed
}
```

In the general case, objects are deallocated transparently by the Aria VM, and there is no way to control the time and flow of the deallocation.

If an object needs to execute some custom cleanup, a `guard` block is the right way to assign additional behavior independent of the general VM deallocation. Note that an object can live outside of its guard block, and it's up to the object to respond safely to that.

`guard`s return a `Result` based on what their `do` block returns:
- if the block returns normally with a value, the guard returns `Result::Ok(value);
- if the block returns with a `Result::Ok(value)`, the guard returns `Result::Ok(value);
- if the block returns with a `Result::Err(err)`, the guard returns `Result::Err(err)`;
- if the block throws an exception, the guard re-throws it.

## 🥗 Mixins

Mixins can be used to insert new behavior into existing types. Aria does not provide inheritance, but some cases can instead be expressed via a `mixin`.

```aria
mixin Double {
    func double(x) {
        return 2 * x;
    }
}

struct Foo {
    include Double

    type func new() {
        return alloc(This);
    }
}

func main() {
    val f = Foo.new();
    assert f.double(5) == 10;
}
```

Mixins can also be included in an extension, e.g.

```aria
mixin Double {
    func double(x) {
        return 2 * x;
    }
}

struct Foo {
    type func new() {
        return alloc(This);
    }
}

extension Foo {
    include Double
}

func main() {
    val f = Foo.new();
    assert f.double(5) == 10;
}
```

A shorthand syntax for `mixin` inclusion is using `:` (similar to how C++ expresses inheritance). For example:

```aria
mixin Double {
    func double(x) {
        return 2 * x;
    }
}

struct Foo : Double {
    type func new() {
        return alloc(This);
    }
}

func main() {
    val f = Foo.new();
    assert f.double(5) == 10;
}
```

Mixins included with `:` are treated as if included at the very start of the type/extension.

`Foo` includes all the member functions of mixin `Double`. Functions in a mixin can use other functions of their type, or the mixin, and can refer to `this`. At runtime, mixin functions see the type of the object they are included in, not the type of the mixin.

```aria
mixin Double {
    func double() {
        return 2 * this.x;
    }
}

struct Foo {
    include Double

    type func new(x) {
        return alloc(This) {
            .x = x,
        };
    }
}

func main() {
    val f = Foo.new(5);
    assert f.double() == 10;
}
```

```aria
mixin Double {
    func double() {
        return 2 * this.x;
    }
}

struct Foo {
    include Double

    type func new(x) {
        return alloc(This) {
            .x = x,
        };
    }
}

func main() {
    val f = Foo.new(5);
    assert f isa Foo;
    assert f isa Double;
}
```

Mixins may have requirements of their types, for example `Double` expects to be included in types that have a `.x` member value of a type that can be multiplied by 2. There is no way to encode those requirements, usually they are expressed as comments in the mixin itself.

A mixin can be included in multiple types, and a type can include multiple mixins. Mixins can be included in the type definition or an extension of it.

## 🎡 Iterators

`for` loops work by leveraging iterators. An iterator is an object that has a `next` method with no arguments. This method is expected to return an instance of the `Maybe` type:
- if the iteration is complete, it returns `Maybe::None`;
- otherwise, it returns `Maybe::Some(next_item)`.

This mechanism allows for finite or infinite sequences, for values to be pre-computed or dynamically generated.

The `in` expression of a for loop is assumed to be a container of some kind, so the `iterator` method is called on it, and its return is used as the actual iterator.

```aria
struct SampleIterator {
    type func new() {
        return alloc(This) {
            .num = 0,
        };
    }

    instance func iterator() {
        return this;
    }

    instance func next() {
        if this.num == 5 {
            return Maybe::None;
        } else {
            this.num += 1;
            return Maybe::Some(this.num);
        }
    }
}

func main() {
    for n in SampleIterator.new() {
        println(n); # prints 1,2,3,4,5
    }
}
```

Iterators for common types (e.g. Map, List) include the `Iterable` mixin (defined at `aria.iterator.mixin`). This mixin allows using common functional operators on an iterator (`where` (aka `filter`), `map` and `reduce`). Iterators can get pre-written implementations of these behaviors with the `Iterator` mixin from the same module. For example

```aria
import Iterator from aria.iterator.mixin;
import Iterable from aria.iterator.mixin;

struct SampleIterable {
    type func new() {
        return alloc(This);
    }

    instance func iterator() {
        return SampleIterator.new();
    }

    include Iterable
}

struct SampleIterator {
    type func new() {
        return alloc(This) {
            .num = 0,
        };
    }

    instance func next() {
        if this.num == 5 {
            return Maybe::None;
        } else {
            this.num += 1;
            return Maybe::Some(this.num);
        }
    }

    include Iterator
}

func main() {
    for n in SampleIterable.new().where(|x| => x > 2).map(|x| => x + 1) {
        println(n); # prints 4,5,6
    }
}
```

This is a slightly more complex but realistic example where the iterable and the iterator are different objects. Using the `Iterable` mixin, it is possible to compose operations, so one can `where`, then `map`, then `map`, ... and so on freely.

## 📦 Modules

Any Aria file can be a module and a collection of modules is called a widget.

Modules are imported with the `import` statement, which follows a dotted structure, e.g. `import aria.rng.xorshift;`. `aria` is the name of the Aria standard library, which contains submodules defined via filesystem paths. Documentation for the Aria library is contained in [stdlib.md](stdlib.md).

The following algorithm is used to resolve where to look for imports:
- if `ARIA_LIB_DIR` is defined, it is a list of paths separated by the platform separator; the system looks in each path in the order provided until the module is found;
- if there is a `lib/aria` directory next to the running binary, then the system looks in `lib/` for modules;
- if there is a `lib/aria` directory in the parent directory of the running binary, then the system looks in `lib/` for modules.

If running on Linux, four additional paths are searched:
- `/usr/local/aria<version>/lib` which is used if it contains an `aria` subdirectory;
- `/usr/local/aria/lib` which is used if it contains an `aria` subdirectory;
- `/usr/lib/aria<version>` which is used if it contains an `aria` subdirectory;
- `/usr/lib/aria` which is used if it contains an `aria` subdirectory.

If running on macOS, four additional paths are searched:
- `/opt/homebrew/opt/aria<version>/lib` which is used if it contains an `aria` subdirectory;
- `/opt/homebrew/opt/aria/lib` which is used if it contains an `aria` subdirectory;
- `/usr/local/opt/aria<version>/lib` which is used if it contains an `aria` subdirectory;
- `/usr/local/opt/aria/lib` which is used if it contains an `aria` subdirectory.

If `ARIA_LIB_DIR_EXTRA` is defined, it is a list of paths separated by the platform separator; each existing directory in that list is added to the end of the search path.

If no valid path exists, import modules cannot be located. Running Aria without its standard library is not a supported configuration.

As an example, `aria.rng.xorshift` is defined in `lib/aria/rng/xorshift.aria`. Directories may contain other directories, or files, or a combination thereof. A directory is scanned by virtue of its name being used, and does not need contain any marker files to be recognized as a module. Directories may be arbitrarily nested.

A module can be imported more than once, but only the first import will load the module, others will act as a no-op. An import of a module brings that module into the visible set of symbols, and names inside the module can be referenced via a fully-dotted path. For example

```aria
import aria.rng.xorshift;

func main() {
    val rng = aria.rng.xorshift.XorshiftRng.new();

    println(rng.next()); # will print a random value
}
```

To avoid dotted notation, one can import symbols directly from a module, e.g.

```aria
import XorshiftRng from aria.rng.xorshift;

func main() {
    val rng = XorshiftRng.new();

    println(rng.next()); # will print a random value
}
```

will work exactly the same. It is substantially equivalent to

```aria
import aria.rng.xorshift;

val XorshiftRng = aria.rng.xorshift.XorshiftRng;

func main() {
    val rng = XorshiftRng.new();

    println(rng.next()); # will print a random value
}
```

i.e. the entire module is imported, and one specific symbol is lifted from it.

It is possible to import multiple names from a module at once, or in separate statements.

Extensions in a module cannot be imported by name, and are always brought in when the module is imported.

## 📚 Libraries and Widgets

Usually, you’ll only be writing a single file and using the standard library or other libraries, also called `Widgets`. But sometimes projects are more complex than that, or maybe you want to write your own library. With that in mind, Aria provides you with a way to structure your more complex projects.

The only thing you need to do for Aria to know where your `Widget` starts is to create a `widget.json` file in the root of your `widget`. In this file, you can define metadata such as its name, version, and dependencies.

A typical `Widget` structure would look like this:

```bash
my_project/
├── widget.json
├── main.aria
├── parser.aria
└── parser/
    └── utils.aria
```

To use a function from `parser.aria` inside `my_project`, you can import it writing `import widget.parser;`. At the same time, `parser.aria` maybe uses structs inside `utils.aria` and imports it as `import widget.parser.utils;`. 

This structure allows Aria to know when you’re referencing your own modules and when you’re referencing other `Widget` modules.
