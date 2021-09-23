import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/user.repository";
import User from "../schema/user.schema";
import { AppContext } from "../type";

@Service()
@Resolver(User)
class UserResolver {
  constructor(
    @InjectRepository() private readonly userRepository: UserRepository
  ) {}
  @Authorized()
  @Query((returns) => User, { nullable: true })
  async user(@Ctx() ctx: AppContext): Promise<User | undefined> {
    if (!ctx.user && ctx.githubUser) {
      const user = this.userRepository.create({
        id: ctx.githubUser.id,
        email: ctx.githubUser.email,
        name: ctx.githubUser.name,
        entered_at: new Date(),
      });
      return await this.userRepository.save(user);
    }
    return ctx.user;
  }

  @Mutation((returns) => User, { description: "create user" })
  async createUser(@Arg("name") name: string) {
    return this.userRepository.save({ name });
  }

  @Query((returns) => [User])
  async users() {
    return this.userRepository.find();
  }
}

export default UserResolver;
