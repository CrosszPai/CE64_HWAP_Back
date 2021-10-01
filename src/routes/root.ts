import { FastifyPluginAsync } from 'fastify'
import { AppOptions } from '../app'
import { nanoid } from 'nanoid'
import { getConnection } from 'typeorm'
import { Hardware } from '../schema/hardware.schema'

const root: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  fastify.get('/', { websocket: true }, async function (connection, req) {
    connection.socket.onmessage = (e) => {
      if (e.data === 'connected') {
        const id = nanoid()
        connection.socket.send(JSON.stringify({ id, event: 'connected' }))
        opts.redis.set(id, "idle")
        getConnection().getRepository(Hardware).insert({
          id,
        })
      }
    }

    return { root: true }
  })
}

export default root;
