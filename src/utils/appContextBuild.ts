import * as cookie from "cookie";
import { FastifyRequest } from "fastify";
import { Octokit } from "octokit";
import { getRepository } from "typeorm";
import User from "../schema/user.schema";
import { AppContext } from "../type";

export async function appContextBuild<T = Object>(request: FastifyRequest, context: T): Promise<AppContext & T> {
    const access_token = cookie.parse(
        request.headers["set-cookie"]?.[0] ?? ""
    ).access_token;
    if (access_token) {
        const octokit = new Octokit({ auth: access_token });
        const githubUser = (await octokit.request("GET /user")).data as User;
        const user = await getRepository(User).findOne({ id: githubUser.id });
        return {
            userOctokit: octokit,
            user,
            githubUser,
            ...context
        };
    }
    return { githubUser: undefined, user: undefined, userOctokit: undefined, ...context };
}