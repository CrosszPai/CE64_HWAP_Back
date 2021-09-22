import fp from 'fastify-plugin'
import websocket, { WebsocketPluginOptions } from 'fastify-websocket'

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<WebsocketPluginOptions>(async (fastify, opts) => {
    fastify.register(websocket, {
        options: {

        }
    })
})
