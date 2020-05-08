import { readFileStr } from 'https://deno.land/std@v1.0.0-rc1/fs/read_file_str.ts'
import { writeFileStr } from 'https://deno.land/std@v1.0.0-rc1/fs/write_file_str.ts'

const toUTF8 = buff => {
  const decoder = new TextDecoder()
  return decoder.decode(buff)
}

export const bootstrap = async ({ debug = false, kill = true } = {}) => {
  const pid = await readFileStr('.pid')
    .catch(err => err instanceof Deno.errors.NotFound ? '' : Promise.reject(err))

  const log = debug ? console.log : () => {}

  if (pid) {
    if (!kill) {
      console.log(`Process already started on pid: ${pid}, delete .pid file and retry`)
      retrun Deno.exit(1)
    }
    const killProcess = await Deno.run({
      cmd: [ 'taskkill', '/F', '/PID', pid ],
      stdout: 'piped',
      stderr: 'piped',
    })

    const killStatus = await killProcess.status()
    if (!killStatus.success) {
      const reason = toUTF8(await killProcess.stderrOutput()).trim()
      if (reason.endsWith('not found.')) {
        log(`pid [${pid}] not found`)
      } else {
        log(`Unable to kill [${pid}]: ${reason}`)
      }
    } else {
      log(toUTF8(await killProcess.output()).trim())
      await Deno.remove('.pid')
    }
  } else {
    log('nothing to kill')
  }

  await writeFileStr('.pid', String(Deno.pid))

  window.addEventListener('unload', async () => {
    log('closing... cleanup .pid file')
    await Deno.remove('.pid').catch(log)
  })
  log('prev pid:', pid, Deno.pid)
}
