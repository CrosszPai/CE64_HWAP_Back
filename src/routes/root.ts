import { FastifyPluginAsync } from "fastify";
import { AppOptions } from "../app";
import { Hardware, HardwareStatus } from "../schema/hardware.schema";
import { Queue, QueueStatus } from "../schema/queue.schema";
import { Working } from "../schema/working.schema";
import { AppMessage } from "../type";
import { db } from "../utils/db";

const root: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/", { websocket: true }, async function (connection, req) {
    connection.socket.onmessage = async (e) => {
      try {
        const data: AppMessage = JSON.parse(e.data.toString());
        if (data.event === "connected") {
          await opts.redis.set(data.id, HardwareStatus.IDLE);
          e.target.send(
            JSON.stringify({
              ...data,
              payload: "success",
            } as AppMessage)
          );
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
    req.server.websocketServer.clients.forEach((e) => {
      e.send("dwwdwwd");
    });
    res.send("asd");
  });
  fastify.post("/hook", async (req, res) => {
    console.log(req.body);
    const working = await db.getRepository(Working).findOne({
      where: {
        repo_url: (req.body as any).url,
      },
    });
    if (!working) {
      res.send({
        error: "working not found",
      });
      return;
    }
    // set all working queue status to cancel
    await db.getRepository(Queue).update(
      { working: working },
      { status: QueueStatus.CANCELED }
    );

    // and create new queue
    await db.getRepository(Queue).save({
      working: working,
      status: QueueStatus.WAITING,
    });
    res.send("");
  });

  fastify.get("/cron", async (req, res) => {
    const queueRepository = db.getRepository(Queue);
    const queues_count = await queueRepository.count({
      where: { status: QueueStatus.WAITING },
      order: { created_at: "ASC" },
    });

    const keys = await opts.redis.KEYS("*");
    const _hardwares = await opts.redis.mGet(keys);

    const hardwares = keys
      .map((e, i) => {
        return [e, _hardwares[i]];
      })
      .filter(([k, v]) => v === HardwareStatus.IDLE)
      .map(([k, v]) => k as string);

    console.log(hardwares);

    if (hardwares.length === 0) {
      return res.send("no idle hardware");
    }
    if (queues_count === 0) {
      return res.send("no waiting queue");
    }
    // apply all queues to idle hardware
    const queues = await queueRepository.find({
      where: { status: QueueStatus.WAITING },
      order: { created_at: "ASC" },
    });
    console.log(queues);
    let assigned = await Promise.all(
      hardwares.map(async (hardware, index) => {
        opts.redis.set(hardware, HardwareStatus.BUSY);
        console.log(hardware);

        const hw = await db.getRepository(Hardware).findOne({
          where: { id: hardware },
        });
        console.log(hw);

        if (hw) {
          queues[index].status = QueueStatus.WORKING;
          hw.queue = queues[index];
          await Promise.all([
            db.getRepository(Hardware).save(hw),
            queueRepository.save(queues[index]),
          ]);
          req.server.websocketServer.clients.forEach((e) => {
            e.send(
              JSON.stringify({
                id: hardware,
                event: "income_work",
                payload: queues[index].working?.repo_url,
              } as AppMessage)
            );
          });
        }
        return hardware;
      })
    );

    res.send(assigned.length.toString() + " updated");
  });
};

export default root;
