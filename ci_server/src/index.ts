import { Probot } from "probot";
import axios from "axios";

export = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });
  app.on("check_suite", async (context) => {
    console.log(context.name, context.payload.check_suite.head_commit.id);
    console.log(context.payload.repository.url);
    await axios.post("http://localhost:3001/hook", {
      url: context.payload.repository.html_url,
      commit: context.payload.check_suite.head_commit.id,
    });
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
