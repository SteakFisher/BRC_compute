import { App } from "octokit";
import { createGitHubApp, BRC_INSTALLATION_ID } from "../config/app-config.js";

export class GitHubService {
  private app: App;

  constructor() {
    this.app = createGitHubApp();
  }

  async getOctokit(installationId: number) {
    return await this.app.getInstallationOctokit(installationId);
  }

  async getInstallationToken(installationId: number, repoName: string) {
    const octokit = await this.getOctokit(installationId);

    const { data } = await octokit.request(
      `POST /app/installations/${installationId}/access_tokens`,
      {
        repositories: [repoName],
        permissions: {
          contents: "read",
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return data.token;
  }

  async getBrcToken() {
    const octokit = await this.getOctokit(BRC_INSTALLATION_ID);

    const { data } = await octokit.request(
      `POST /app/installations/${BRC_INSTALLATION_ID}/access_tokens`,
      {
        repositories: ["BRC"],
        permissions: {
          contents: "read",
        },
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    return data.token;
  }

  async updateCommitStatus(
    octokit: any,
    repo: any,
    sha: string,
    state: string,
    description: string
  ) {
    await octokit.rest.repos.createCommitStatus({
      owner: repo.owner.login,
      repo: repo.name,
      sha: sha,
      state,
      description,
    });
  }
}
