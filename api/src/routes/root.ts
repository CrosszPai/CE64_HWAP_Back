import axios from "axios";
import { FastifyPluginAsync } from "fastify";
import FormData = require("form-data");
import { AppOptions } from "../app";
import { AppMessage } from "../type";
import { db } from "../utils/db";
import * as stream from 'stream';
import { promisify } from 'util';
import { createReadStream, createWriteStream, existsSync, mkdirSync } from "fs";
import { queue_status_enum } from "@prisma/client"
const finished = promisify(stream.finished);

var dir = './tmp';
if (!existsSync(dir)) {
  mkdirSync(dir);
}

const root: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get('/ew', async (request, reply) => {
    reply.send("hello")
  })
  fastify.get("/connected_device", { websocket: true }, async function (connection, req) {
    connection.socket.onmessage = async (e) => {
      try {
        const data: AppMessage = JSON.parse(e.data.toString());
        console.log(data)
        if (data.event === 'connected') {
          await db.hardware.update({
            where: {
              id: data.id
            },
            data: {
              status: 'connected'
            }
          })
          e.target.send(
            JSON.stringify({
              ...data,
              payload: "success",
            } as AppMessage)
          );
          await db.hardware.update({
            where: {
              id: data.id
            },
            data: {
              status: 'idle'
            }
          })
        }
        if (data.event === 'error') {
          const hardware = await db.hardware.findFirst({
            where: {
              id: data.id
            },
            include: {
              queue: {
                include: {
                  working: true
                }
              }
            }
          })
          if (hardware && hardware.queueId) {
            await db.hardware.update({
              where: {
                id: data.id
              },
              data: {
                status: 'idle',
                queueId: null
              }
            })
            await db.queue.update({
              where: {
                id: hardware.queueId
              },
              data: {
                status: 'fail',
                notes: data.payload,
              }
            })
          }
        }
        if (data.event === 'finished') {
          const hardware = await db.hardware.findFirst({
            where: {
              id: data.id
            },
            include: {
              queue: {
                include: {
                  working: true
                }
              }
            }
          })
          if (hardware && hardware.queueId) {
            await db.hardware.update({
              where: {
                id: data.id
              },
              data: {
                status: 'idle',
                queueId: null
              }
            })
            await db.queue.update({
              where: {
                id: hardware.queueId
              },
              data: {
                status: data.payload as queue_status_enum,
              }
            })
          }

        }

      } catch (error) {
        console.log(error);
      }
    };

    connection.socket.onclose = (e) => {
      // console.log('close',e.target.);
    };

    return { root: true };
  });

  fastify.get("/check", (req, res) => {

  });
  fastify.post("/hook", async (req, res) => {
    const body = req.body as {
      url: string,
      commit: string
    }
    let work = await db.working.findFirst({
      where: {
        repo_url: body.url
      },
      include: {
        lab: true
      }
    })
    if (work) {
      let task1 = db.queue.deleteMany({
        where: {
          workingId: work.id
        },
      })
      let task2 = db.queue.create({
        data: {
          workingId: work.id,
        }
      })
      let [_, queue] = await Promise.all([task1, task2]);
      // compile code
      console.log('compile')
      axios.post("http://ubuntu:4444", {
        url: body.url,
      }, {
        headers: {
          'content-type': "application/json"
        },
        responseType: 'stream'
      }).then(async (response) => {
        const credentials = Buffer.from('user:password', 'utf-8').toString('base64');
        const form = new FormData()
        const writer = createWriteStream(`../tmp/${work?.id}.bin`);
        response.data.pipe(writer);
        await finished(writer);
        form.append('file', createReadStream(`../tmp/${work?.id}.bin`))
        await axios.post(`http://filer:8888/student/${work?.lab.id}/${queue.id}/bin/app.bin`, form, {
          headers: {
            'Authorization': `Basic ${credentials}`,
            ...form.getHeaders()
          },
          data: form,
        })
      });
    }
    res.send("")
  });

  fastify.get("/cron", async (req, res) => {
    const hardwares = await db.hardware.findMany({
      where: {
        status: 'idle'
      }
    })
    if (hardwares.length == 0) {
      return ""
    }
    const queue = await db.queue.findMany({
      take: hardwares.length,
      where: {
        status: 'waiting'
      },
      orderBy: {
        created_at: "asc"
      },
      include: {
        working: true
      }
    })
    if (queue.length == 0) {
      return ""
    }

    for (let i = 0; i < hardwares.length; i++) {
      const hardware = hardwares[i];
      const queueItem = queue[i];
      req.server.websocketServer.clients.forEach((e) => {
        e.send(
          JSON.stringify({
            id: hardware.id,
            event: "incoming_work",
            payload: queueItem.id.toString(),
          } as AppMessage)
        );
      });
      await db.hardware.update({
        where: {
          id: hardware.id
        },
        data: {
          status: 'busy',
          queueId: queueItem.id,
        }
      })
      await db.queue.update({
        where: {
          id: queueItem.id
        },
        data: {
          status: 'working',
        }
      })
    }
    return ""
  })
};

export default root;
