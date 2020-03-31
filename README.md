# lib
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
