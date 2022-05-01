import { FastifyPluginAsync } from "fastify"
import { db } from "../../utils/db"

const queue: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params as any
    const queue = await db.queue.findFirst({
      where: {
        id: +id
      },
      include: {
        working: {
          include: {
            lab: true
          }
        }
      }
    })
    reply
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(queue)
  })
}

export default queue;
