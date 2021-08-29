import { App, Octokit } from "octokit";
import * as fs from "fs";

const publicKey = fs.readFileSync("/app/pv_key.pem", { encoding: "utf8" });

export const GithubApp = new App({
  appId: process.env.GITHUB_APP_ID as string,
  privateKey: publicKey,
});

const appOctokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: 1,
    privateKey: "-----BEGIN PRIVATE KEY-----\n...",
    clientId: "1234567890abcdef1234",
    clientSecret: "1234567890abcdef1234567890abcdef12345678",
  },
});
