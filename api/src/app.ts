import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync } from "fastify";

import { readFileSync } from "fs";
import WebSocket = require("ws");
const private_key = readFileSync('./pv-key.pem','utf-8')


export type AppOptions = {
  // Place your custom options for app below here.
  private_key: string,
  websocket: WebSocket.Server
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!

  const options = { ...opts, private_key };

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options,
  });
};

export default app;
export { app };
