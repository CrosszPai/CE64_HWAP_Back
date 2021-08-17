import { Service } from "typedi";
import { EntityRepository, Repository } from "typeorm";
import User from "../schema/user.schema";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {}
