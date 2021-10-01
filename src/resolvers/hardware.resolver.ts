import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { HardwareRepository } from "../repository/hardware.repository";
import { Hardware } from "../schema/hardware.schema";
import { Role } from "../schema/user.schema";
import type { AppContext } from "../type";



@Service()
@Resolver(Hardware)
class HardwareResolver {
    constructor(@InjectRepository() private readonly hardwareRepository: HardwareRepository) { }
    @Authorized(Role.admin)
    @Query(returns => [Hardware])
    async hardwares() {
        return await this.hardwareRepository.find()
    }

    @FieldResolver()
    async status(@Ctx() ctx: AppContext, @Root() hardware: Hardware) {
        return ctx.redis.get(hardware.id as string)
    }
}

export default HardwareResolver