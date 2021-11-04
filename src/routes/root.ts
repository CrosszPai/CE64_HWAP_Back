import { FastifyPluginAsync } from "fastify";
import { AppOptions } from "../app";
import { HardwareStatus } from "../schema/hardware.schema";
import { AppMessage } from "../type";
// import { getConnection } from 'typeorm'
// import { Hardware, HardwareStatus } from '../schema/hardware.schema'

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
  fastify.post("/hook", (req, res) => {
    console.log(req.body);
    req.server.websocketServer.clients.forEach((e) => {
      e.send(
        JSON.stringify({
          id: "l4y0mwlS2r",
          event: "income_work",
          payload: (req.body as any).url,
        } as AppMessage)
      );
    });
    res.send("");
  });
};

export default root;
