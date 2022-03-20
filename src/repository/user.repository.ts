import { Repository } from "typeorm";
import User from "../schema/user.schema";

export class UserRepository extends Repository<User> {}
