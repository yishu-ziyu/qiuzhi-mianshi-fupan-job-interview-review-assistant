#!/usr/bin/env node

import { spawn } from "node:child_process";
import { once } from "node:events";
import process from "node:process";
import { setTimeout as sleep } from "node:timers/promises";

const baseUrl = process.env.BASE_URL?.trim() || "http://localhost:3000";
const bootTimeoutMs = Number(process.env.CLOSED_LOOP_BOOT_TIMEOUT_MS ?? 120000);

function log(message) {
  console.log(`[closed-loop:auto] ${message}`);
}

async function pingServer(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${url}/api/project/health`, {
      method: "GET",
      signal: controller.signal,
    });
    return response.status < 500;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function startDevServer() {
  const child = spawn("npm", ["run", "dev"], {
    cwd: process.cwd(),
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (child.stdout) {
    child.stdout.on("data", (chunk) => {
      process.stdout.write(String(chunk));
    });
  }
  if (child.stderr) {
    child.stderr.on("data", (chunk) => {
      process.stderr.write(String(chunk));
    });
  }

  return child;
}

async function waitUntilReady(child) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < bootTimeoutMs) {
    if (child.exitCode !== null) {
      throw new Error(`开发服务器提前退出，exitCode=${child.exitCode}`);
    }
    if (await pingServer(baseUrl)) {
      return;
    }
    await sleep(800);
  }
  throw new Error(`等待开发服务器超时（${bootTimeoutMs}ms）`);
}

function runClosedLoop() {
  return new Promise((resolve) => {
    const runner = spawn("node", ["scripts/closed_loop_e2e.mjs"], {
      cwd: process.cwd(),
      env: { ...process.env, BASE_URL: baseUrl },
      stdio: "inherit",
    });

    runner.on("exit", (code) => {
      resolve(code ?? 1);
    });
    runner.on("error", () => {
      resolve(1);
    });
  });
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) return;
  child.kill("SIGTERM");

  const result = await Promise.race([once(child, "exit").then(() => "stopped"), sleep(8000).then(() => "timeout")]);
  if (result === "timeout" && child.exitCode === null) {
    child.kill("SIGKILL");
    await once(child, "exit").catch(() => undefined);
  }
}

async function main() {
  let startedServer = null;

  try {
    const online = await pingServer(baseUrl);
    if (online) {
      log(`检测到服务已运行，直接执行严格闭环测试（BASE_URL=${baseUrl}）`);
    } else {
      log(`未检测到服务，自动启动开发服务器（BASE_URL=${baseUrl}）`);
      startedServer = startDevServer();
      await waitUntilReady(startedServer);
      log("开发服务器已就绪，开始执行严格闭环测试");
    }

    const code = await runClosedLoop();
    process.exitCode = code;
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error(`[closed-loop:auto] 执行失败: ${message}`);
    process.exitCode = 1;
  } finally {
    await stopServer(startedServer);
  }
}

await main();
