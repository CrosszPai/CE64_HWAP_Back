import fp from "fastify-plugin";
import multipart, { FastifyMultipartOptions } from "@fastify/multipart";

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifyMultipartOptions>(async (fastify, opts) => {
  fastify.register(multipart, {});
});
