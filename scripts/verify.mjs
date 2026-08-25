import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { existsSync, mkdirSync } from "node:fs";
import { request as httpRequest } from "node:http";

const preview = spawn("npm", ["run", "preview"], {
  stdio: "pipe",
  cwd: new URL("..", import.meta.url).pathname,
});

function waitForHttp(url, tries = 40) {
  return new Promise((resolve, reject) => {
    const tick = (left) => {
      const req = httpRequest(url, (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      });
      req.on("error", () => {
        if (left <= 0) {
          reject(new Error(`preview never came up at ${url}`));
          return;
        }
        setTimeout(() => tick(left - 1), 250);
      });
      req.end();
    };
    tick(tries);
  });
}

let code = 1;
try {
  await waitForHttp("http://127.0.0.1:4173/");
  const browser = await chromium.launch({
    executablePath: "/usr/local/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));

  await page.goto("http://127.0.0.1:4173/#/", { waitUntil: "networkidle" });
  const home = await page.locator(".era").count();
  if (home < 10) {
    throw new Error(`home listed ${home} movements`);
  }

  await page.getByRole("link", { name: /Proto-web/i }).click();
  await page.waitForSelector("h1");
  const humanTitle = await page.locator("h1").innerText();
  if (!/proto/i.test(humanTitle)) {
    throw new Error(`human view title was ${humanTitle}`);
  }
  const canvas = page.locator("#stage");
  const still = page.locator("#still-host .still");
  const stageVisible = await canvas.isVisible().catch(() => false);
  const stillVisible = await still.count();
  if (!stageVisible && stillVisible < 1) {
    throw new Error("neither canvas nor still on human era page");
  }

  await page.getByRole("link", { name: /Agent view/i }).click();
  await page.waitForSelector("table.tokens");
  const agentTitle = await page.locator("h1").innerText();
  if (!/proto/i.test(agentTitle)) {
    throw new Error("agent view dropped the selected movement");
  }

  const json = await page.goto("http://127.0.0.1:4173/catalog.json");
  if (!json || json.status() !== 200) {
    throw new Error("catalog.json missing");
  }
  const payload = await json.json();
  if (payload.count !== 12) {
    throw new Error(`catalog.json count ${payload.count}`);
  }

  const llms = await page.goto("http://127.0.0.1:4173/llms.txt");
  if (!llms || llms.status() !== 200) {
    throw new Error("llms.txt missing");
  }
  const text = await llms.text();
  if (!text.includes("id: proto-web") || !text.includes("id: spatial-agentic")) {
    throw new Error("llms.txt missing expected ids");
  }

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto("http://127.0.0.1:4173/#/", { waitUntil: "networkidle" });
  const mobileCount = await mobile.locator(".era").count();
  if (mobileCount < 10) {
    throw new Error("mobile home is empty");
  }

  mkdirSync("dist-evidence", { recursive: true });
  await page.screenshot({ path: "dist-evidence/agent.png", fullPage: true });
  await mobile.screenshot({ path: "dist-evidence/home-mobile.png", fullPage: true });

  if (errors.length) {
    throw new Error(`page errors: ${errors.join("; ")}`);
  }
  if (!existsSync("dist/catalog.json") || !existsSync("dist/llms.txt")) {
    throw new Error("dist machine files missing");
  }

  await browser.close();
  code = 0;
  console.log("verify ok", { movements: home, catalog: payload.count });
} finally {
  preview.kill("SIGTERM");
  await delay(300);
  process.exit(code);
}
