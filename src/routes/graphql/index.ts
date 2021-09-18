import { FastifyPluginAsync } from "fastify";
import { getGraphQLParameters, processRequest, shouldRenderGraphiQL } from "graphql-helix";
import * as cookie from "cookie";
import { AppContext } from "../../type";
import { Octokit } from "octokit";
import { processRequest as uploadProcessRequest } from "graphql-upload";
import { getRepository } from "typeorm";
import User from "../../schema/user.schema";
import renderAltair, { RenderOptions } from "altair-static";

const renderOptions: RenderOptions = {
  endpointURL: process.env.NODE_ENV === 'production' ? process.env.PUBLIC_GRAPHQL_URL : 'http://localhost:3001/graphql',
};
const altairAsString = renderAltair(renderOptions);

const graphqlRoutes: FastifyPluginAsync = async (
  fastify,
  opts: any
): Promise<void> => {
  fastify.all("/", async function (request, reply) {

    let operator = {};
    if (request.is("multipart")) {
      operator = await uploadProcessRequest(request.raw, reply.raw);
    } else {
      if (shouldRenderGraphiQL(request)) {

        reply.type('text/html').send(altairAsString)
      }
      operator = getGraphQLParameters(request);
    }

    const result = await processRequest<AppContext>({
      ...operator,
      request,
      schema: opts.schema,
      contextFactory: async () => {
        let access_token = cookie.parse(
          request.headers["set-cookie"]?.[0] ?? ""
        ).access_token;
        if (!access_token) {
          access_token = request.headers.authorization ?? ""
        }
        if (access_token) {
          const octokit = new Octokit({ auth: access_token });
          const githubUser = (await octokit.request("GET /user")).data as User;
          const user = await getRepository(User).findOne({ id: githubUser.id });
          return {
            userOctokit: octokit,
            user,
            githubUser,
          };
        }
        return {};
      },
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
