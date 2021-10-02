import "reflect-metadata";
import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "fastify-autoload";
import { FastifyPluginAsync } from "fastify";
import { buildSchema } from "type-graphql";

import * as TypeORM from "typeorm";
import { Container } from "typeorm-typedi-extensions";
import { AppAuthChecker } from "./authorization";
import { createClient } from "redis";
import { GraphQLSchema } from "graphql";
import { readFileSync } from "fs";

const private_key = readFileSync('/app/pv-key.pem','utf-8')


TypeORM.useContainer(Container);

export type AppOptions = {
  // Place your custom options for app below here.
  schema: GraphQLSchema
  redis: ReturnType<typeof createClient>
  private_key: string,
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
    container: Container,
    authChecker: AppAuthChecker,
  });
  const options = { ...opts, schema, redis, private_key };

  await TypeORM.createConnection({
    name: "default",
    type: "postgres",
    url: "postgresql://postgres:1234@db:5432/goshenite",
    entities: [__dirname + "/**/*.schema.{ts,js}"],
    synchronize: true,
  });
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
