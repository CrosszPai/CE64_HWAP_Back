import { getConnection } from "typeorm";
import Logging from "../schema/logging.schema";

function Log() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      getConnection().getRepository(Logging).insert({
        query: propertyKey,
        user: args[0].user
      })
      return originalMethod.apply(this, args);
    }

  };
}
export default Log