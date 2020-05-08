// import { readFileStr } from 'https://deno.land/std@v1.0.0-rc1/fs/read_file_str.ts'
// import { writeFileStr } from 'https://deno.land/std@v1.0.0-rc1/fs/write_file_str.ts'
import { lock } from 'https://kigiri.github.io/lib/bootlock-windows.js?wdwd'


await lock({ debug: true, kill: true })

const wait = delay => new Promise((s) => setTimeout(s, delay))

const serve = ({ port = 8000 } = {}) => {
  const listener = Deno.listen({ port, transport: 'tcp' })
  const connections = []
  let closing = false

/*
  close(): void {
    this.closing = true;
    this.listener.close();
    for (const conn of this.connections) {
      try {
        conn.close();
      } catch (e) {
        // Connection might have been already closed
        if (!(e instanceof Deno.errors.BadResource)) {
          throw e;
        }
      }
    }
  }*/

  return {
    async* [Symbol.asyncIterator]() {
      while (!closing) {
        const conn = await listener.accept()
        const buf = new Uint8Array(4096)

        const readCount = await conn.read(buf)
        console.log('readcount:', readCount)
        const decoder = new TextDecoder()

        console.log(decoder.decode(buf.slice(0, readCount)))
            /*
        while (!closing) {
          let request
          try {
          } catch (error) {
            if (
              error instanceof Deno.errors.InvalidData ||
              error instanceof Deno.errors.UnexpectedEof
            ) {
              // An error was thrown while parsing request headers.
              await writeResponse(writer, {
                status: 400,
                body: encode(`${error.message}\r\n\r\n`),
              });
            }
            break;
          }
          if (request === null) {
            break;
          }

          request.w = writer;
          yield request;

          // Wait for the request to be processed before we accept a new request on
          // this connection.
          const responseError = await request.done;
          if (responseError) {
            // Something bad happened during response.
            // (likely other side closed during pipelined req)
            // req.done implies this connection already closed, so we can just return.
            this.untrackConnection(request.conn);
            return;
          }
          // Consume unread body and trailers if receiver didn't consume those data
          await request.finalize();
        }

        this.untrackConnection(conn);
        try {
          conn.close();
        } catch (e) {
          // might have been already closed
        }
*/
        // todo: handle Deno.errors.BadResource
        connections.push(conn)
        yield conn
      }
    },
    close() {
      closing = true
      listener.close()
      for (const conn of connections) {
        conn.close()
      }
    }
  }
}


for await (const req of serve()) {
  console.log('wesh', req)
}


/*
const serv = serve({ port: 7000 }, console.log)
for await (const req of serv) {
  console.log('nouvelle requete', Date.now())
  wait3sec()
    .then(() => req.respond({ body: `very slow ${Date.now()-start}!!\n` }))

}
*/
