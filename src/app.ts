import "reflect-metadata";
import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "fastify-autoload";
import { FastifyPluginAsync } from "fastify";
import { buildSchema } from "type-graphql";
import { AppAuthChecker } from "./authorization";
import { createClient } from "redis";
import { GraphQLSchema } from "graphql";
import { readFileSync } from "fs";
import WebSocket = require("ws");
import { db } from "./utils/db";

const private_key = readFileSync('/app/pv-key.pem','utf-8')


export type AppOptions = {
  // Place your custom options for app below here.
  schema: GraphQLSchema
  redis: ReturnType<typeof createClient>
  private_key: string,
  websocket: WebSocket.Server
} & Partial<AutoloadPluginOptions>;

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  // Place here your custom code!
  const redis = createClient({
    url: 'redis://redis:6379/0',
  })
  await redis.connect()

  let schema = await buildSchema({
    resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
    authChecker: AppAuthChecker,
  });
  const options = { ...opts, schema, redis, private_key };

  await db.initialize()
  await db.synchronize()
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
