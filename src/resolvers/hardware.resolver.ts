import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { HardwareRepository } from "../repository/hardware.repository";
import { Hardware, HardwareStatus } from "../schema/hardware.schema";
import { Role } from "../schema/user.schema";
import type { AppContext } from "../type";

@Service()
@Resolver(Hardware)
class HardwareResolver {
  constructor(
    @InjectRepository() private readonly hardwareRepository: HardwareRepository
  ) {}
  @Authorized(Role.admin)
  @Query((returns) => [Hardware])
  async hardwares() {
    const hw = await this.hardwareRepository.find();
    return hw;
  }

  @FieldResolver()
  async status(@Ctx() ctx: AppContext, @Root() hardware: Hardware) {
    return ctx.redis.get(hardware.id as string) ?? HardwareStatus.IDLE;
  }

  @Authorized(Role.admin)
  @Mutation((returns) => Hardware)
  async addHardware(@Ctx() ctx: AppContext, @Arg("hwid") id: string) {
    ctx.redis.set(id, HardwareStatus.CREATED);
    return await this.hardwareRepository.save({ id });
  }
}

export default HardwareResolver;
