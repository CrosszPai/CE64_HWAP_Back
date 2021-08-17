import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repository/user.repository";
import User from "../schema/user.schema";

@Service()
@Resolver(User)
class UserResolver {
  constructor(
    @InjectRepository() private readonly userRepository: UserRepository
  ) {}
  @Query((returns) => User, { nullable: true })
  async user(): Promise<User | undefined> {
    return this.userRepository.findOne();
  }

  @Mutation((returns) => User)
  async createUser(@Arg("name") name: string) {
    return this.userRepository.save({ name });
  }

  @Query(returns => [User])
  async users(){
    return this.userRepository.find()
  }
}

export default UserResolver;
