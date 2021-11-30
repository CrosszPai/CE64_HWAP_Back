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
import { UserRepository } from "../repository/user.repository";
import User, { Role } from "../schema/user.schema";
import { AppContext } from "../type";
import Log from "../utils/loggingDocorator";

@Service()
@Resolver(User)
class UserResolver {
  constructor(
    @InjectRepository() private readonly userRepository: UserRepository
  ) {}
  @Authorized()
  @Query((returns) => User, { nullable: true })
  @Log()
  async user(@Ctx() ctx: AppContext): Promise<User | undefined> {
    if (!ctx.user && ctx.githubUser) {
      const user = this.userRepository.create({
        id: ctx.githubUser.id,
        email: ctx.githubUser.email ?? undefined,
        name: ctx.githubUser.name,
        entered_at: new Date(),
        avatar_url: ctx.githubUser.avatar_url,
        is_admin:
          process.env.ADMIN_EMAIL === ctx.githubUser.email ? true : false,
      });
      if(process.env.INSTRUCTOR_EMAIL === ctx.githubUser.email) {
        user.role = Role.instructor;
      }
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

  @FieldResolver()
  async role(@Root() user: User) {
    return user.is_admin ? "admin" : user.role;
  }
}

export default UserResolver;
