import * as cookie from "cookie";
import { FastifyRequest } from "fastify";
import { Octokit } from "octokit";
import { getRepository } from "typeorm";
import { AppOptions } from "../app";
import User from "../schema/user.schema";
import { AppContext } from "../type";

export async function appContextBuild<T extends AppOptions>(request: FastifyRequest, context: T): Promise<AppContext & T> {
    let access_token = cookie.parse(
        request.headers["set-cookie"]?.[0] ?? ""
    ).access_token;
    if (!access_token) {
        access_token = request.headers.authorization as string
    }
    if (access_token) {
        const octokit = new Octokit({ auth: access_token });
        const emails = (await octokit.request('GET /user/public_emails',))

        const githubUser = (await octokit.request("GET /user")).data as any
        githubUser.email = emails.data.find(v => v.primary && v.verified && v.visibility === 'public')?.email ?? null
        const user = await getRepository(User).findOne({ id: githubUser.id });

        return {
            userOctokit: octokit,
            user,
            githubUser: githubUser,
            ...context
        };
    }
    return { githubUser: undefined, user: undefined, userOctokit: undefined, ...context };
}