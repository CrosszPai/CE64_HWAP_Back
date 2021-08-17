import { FastifyPluginAsync } from "fastify";
import { getGraphQLParameters, processRequest } from "graphql-helix";
// import {
//   getGraphQLParameters,
//   renderGraphiQL,
//   shouldRenderGraphiQL,
// } from "graphql-helix";

const graphqlRoutes: FastifyPluginAsync = async (
  fastify,
  opts: any
): Promise<void> => {
  fastify.all("/", async function (request, reply) {
    const { operationName, query, variables } = getGraphQLParameters(request);
    const result = await processRequest({
      operationName,
      query,
      variables,
      request,
      schema: opts.schema,
    });

    if (result.type === "RESPONSE") {
      result.headers.forEach(({ name, value }) => reply.header(name, value));
      reply.status(result.status);
      reply.send(result.payload);
    } else if (result.type === "PUSH") {
      reply.raw.writeHead(200, {
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
      });

      reply.raw.on("close", () => {
        result.unsubscribe();
      });

      await result.subscribe((result) => {
        reply.raw.write(`data: ${JSON.stringify(result)}\n\n`);
      });
    } else {
      reply.raw.writeHead(200, {
        Connection: "keep-alive",
        "Content-Type": 'multipart/mixed; boundary="-"',
        "Transfer-Encoding": "chunked",
      });

      reply.raw.on("close", () => {
        result.unsubscribe();
      });

      reply.raw.write("---");

      await result.subscribe((result) => {
        const chunk = Buffer.from(JSON.stringify(result), "utf8");
        const data = [
          "",
          "Content-Type: application/json; charset=utf-8",
          "Content-Length: " + String(chunk.length),
          "",
          chunk,
        ];

        if (result.hasNext) {
          data.push("---");
        }

        reply.raw.write(data.join("\r\n"));
      });

      reply.raw.write("\r\n-----\r\n");
      reply.raw.end();
    }
  });
};

export default graphqlRoutes;
