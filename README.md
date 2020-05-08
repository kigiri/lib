# lib
Bunch of libs for my `Deno` life

## `flags`
Parse cli flags for deno, automatically generate shorthands and colorfull help

### Usage
```js
// mod.js
import { F } from 'https://kigiri.github.io/lib/flags.js'

const flags = F({
  only: 'run tests only for the given exercise',
  continue: F.bool(`continue after failed test`, false),
})

console.log(flags)
```

### Output
```bash
$ deno mod.js --hello
Unknown flag: --hello

-o, --only: run tests only for the given exercise
-c, --continue: continue after failed test (default: false)

$ deno mod.js -c
{ _: [], help: false, h: false, continue: true, c: true }

$ deno mod.js --only=you
{ _: [], help: false, h: false, continue: true, c: true, only: 'you', o: 'you' }

$ deno mod.js -o you
{ _: [], help: false, h: false, continue: true, c: true, only: 'you', o: 'you' }
```

### Options
By default, shorthand is the first letter of the argument.\
An error is thrown if the shorthand is already taken.

You can specify your own single character shorthand like so:
```js
const flags = F({
  copy: F.bool('copy the content', false),
  cut: {
    description: 'cut the content',
    shorthand: 'x',
    type: 'boolean',
    defaultValue: false,
  },
  // or, use the bool helper function:
  paste: { ...F.bool('paste the content', true), shorthand: 'v' },
})
```

## `bootlock-windows`
Allow a single instance of this program to run.

### Usage
```js
import { lock } from 'https://kigiri.github.io/lib/bootlock-windows.js`
await lock({ debug: false,  kill: true })
```

