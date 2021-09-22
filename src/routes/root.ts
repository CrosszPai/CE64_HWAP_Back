import { FastifyPluginAsync } from 'fastify'
import { AppOptions } from '../app'
import { nanoid } from 'nanoid'

const root: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  fastify.get('/', { websocket: true }, async function (connection, req) {
    connection.socket.onmessage = (e) => {
      if (e.data === 'connected') {
        const id = nanoid()
        connection.socket.send(JSON.stringify({ id, event: 'connected' }))
        opts.redis.set(id, "idle")
      }
    }

    return { root: true }
  })
}

export default root;
