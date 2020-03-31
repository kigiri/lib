import { parse } from 'https://deno.land/std/flags/mod.ts'
import { blue, cyan, yellow } from 'https://deno.land/std/fmt/colors.ts'

export const F = ({ stopEarly, ['--']: __, ...opts }) => {
  const alias = { h: 'help' }
  const string = []
  const boolean = ['help']
  const defaults = {}
  const help = []
  for (const [k,v] of Object.entries(opts)) {
    let { description, shorthand, type, defaultValue } = v
    typeof v === 'string' && (description = v)
    shorthand || (shorthand = k[0])
    if (shorthand.length > 1) {
      throw Error(`${k} should be single characters only for shorthand, got ${shorthand}`)
    }

    type === 'boolean' ? boolean.push(k) : string.push(k)
    const helpStr = []
    if (!alias[shorthand]) {
      alias[shorthand] = k
      helpStr.push(blue(`-${shorthand}, `))
    }
    helpStr.push(`${blue(`--${k}:`)} ${description}`)
    if (defaultValue != null) {
      helpStr.push(` (${yellow('default:')} ${cyan(String(defaultValue))})`)
      defaults[k] = defaultValue
    }
    help.push(helpStr.join(''))
  }

  const unknown = i => {
    i && console.log('Unknown flag:', blue(String(i)), '\n')
    console.log(help.join('\n'))
    Deno.exit(0)
  }

  const flags = parse(Deno.args, {
    alias,
    boolean,
    string,
    default: defaults,
    unknown,
    '--': __,
    stopEarly,
  })

  if (flags.help) return unknown()
  return flags
}

export const bool = F.bool = (description, defaultValue) =>
  ({ description, defaultValue, type: 'boolean' })
