# Red-Black Trees

Ada Developers Academy / Lovelace Learning Labs

Advanced Data Structures 1 - Trees

Week 3

## Instructions

Since red-black trees are a special type of binary search tree, we'll reuse the binary search tree tests from last week's lab. That means that this week's lab has a bit of a weird setup process.

### Option 1: start over with a new repo

This option is simpler, but involves juggling multiple repos with similar file structures. Recommended if you're less comfortable with git.

Download

```sh
$ git clone <paste-url>
$ cd <created-directory>
```

Install

```sh
$ npm install
```

Run tests in watch mode

```sh
$ npm test
```

### Option 2: merge stubs into your existing binary search tree repo

The advantage here is that it's easier to build on your existing binary search tree code, and you don't need to juggle multiple directories. The disadvantage is that the git setup is a fair bit more complex.

```sh
# cd into your lab repo from last week
$ cd <path>/ads-binary-search-trees

# Check out a new branch for this week's work
$ git checkout -b red-black-trees

# Add this week's lab as a second remote
$ git remote add rbt https://github.com/Lovelace-Learning-Labs/ads-red-black-trees.git

# Merge this week's lab's code into your branch
$ git fetch rbt
$ git merge rbt/master

# Install additional packages (should be a no-op)
$ npm install

# Run tests as usual
$ npm test
```

## Assignment - Week 3

### Core

1. Read through the existing code in `src/data_structures/red_black_tree.js` and ensure you understand how it works
1. Make sure that both the binary search tree tests and the red-black tree tests are running (and failing) against `RedBlackTree`
1. Implement `RedBlackTree._insertInternal()` and `RedBlackTree._insertRebalance()` to pass the tests

### Optional

1. Implement `RedBlackTree.delete()` to pass the tests
1. Implement a visualization of a user list that relies on a red-black tree
1. Write a command-line program to profile the performance of an ordered dictionary. It should...
    - Build a tree of a certain size and then measure the time it takes to do various operations
    - Measure the time it takes to build the tree, to do a set number of lookups, and to delete every record in the tree
    - Build trees of size 1,000 to 25,000 nodes, at 1,000 node increments
    - Use both random and pathological input orderings to generate trees

    Run your profiler against both your red-black tree implementation and your binary search tree implementation. You should get 4 sets of performance data, one for each combination of algorithm and input ordering. Plug these data into your favorite spreadsheet and make a graph. Can you see the difference between linear and logarithmic peformance?

    Note: because JS is [JIT-compiled](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/), you may see significantly lower performance on the first few runs of any given operation for your program. To avoid this, you can "warm up" the JIT by creating a dummy tree and doing a few hundred inserts, lookups and deletes before starting the profile run.
