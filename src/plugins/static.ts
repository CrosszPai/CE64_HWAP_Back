import { getDistDirectory } from "altair-static";
import fp from 'fastify-plugin'
import fastifyStatic, { FastifyStaticOptions } from "fastify-static";

const altairAssetsPath = getDistDirectory();

export default fp<FastifyStaticOptions>(async (fastify, opts) => {
    fastify.register(fastifyStatic, {
        root: altairAssetsPath
    })
})


