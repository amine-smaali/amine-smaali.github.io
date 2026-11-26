// Fetches public repos and writes data/projects.json. Run by the GitHub Action.
import { writeFile, mkdir } from "node:fs/promises";

const USER = process.env.GITHUB_REPOSITORY_OWNER || "amine-smaali";
const MAX = 6;
const EXCLUDED = [`${USER}.github.io`, USER];

const headers = { "User-Agent": "portfolio-updater", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`, { headers });
if (!res.ok) {
  console.error(`GitHub API error: ${res.status}`);
  process.exit(1);
}

const repos = (await res.json())
  .filter((r) => !r.fork && !EXCLUDED.includes(r.name))
  .slice(0, MAX)
  .map((r) => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count,
    homepage: r.homepage || null,
    url: r.html_url,
  }));

await mkdir("data", { recursive: true });
await writeFile("data/projects.json", JSON.stringify({ repos }, null, 2) + "\n");
console.log(`Saved ${repos.length} repositories.`);
