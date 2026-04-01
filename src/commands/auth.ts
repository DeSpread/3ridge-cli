import { Command } from "commander";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { login } from "../auth/login.js";
import { loadCredentials, clearCredentials } from "../auth/credentials.js";
import { getGlobalOptions, output } from "../utils/output.js";
import { handleError } from "../utils/errors.js";

const DEFAULT_API_URL = "https://api.3ridge.io/graphql";

async function readPassword(prompt: string): Promise<string> {
  // Disable echo for password input
  if (process.stdin.isTTY) {
    process.stdout.write(prompt);
    const rl = createInterface({ input: stdin, terminal: false });
    return new Promise((resolve) => {
      let pw = "";
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", (chunk: Buffer) => {
        const ch = chunk.toString();
        if (ch === "\n" || ch === "\r") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write("\n");
          rl.close();
          resolve(pw);
        } else if (ch === "\u007F" || ch === "\b") {
          pw = pw.slice(0, -1);
        } else {
          pw += ch;
        }
      });
    });
  }
  const rl = createInterface({ input: stdin, output: stdout });
  const pw = await rl.question(prompt);
  rl.close();
  return pw;
}

export function registerAuthCommands(program: Command): void {
  program
    .command("login")
    .description("Authenticate with 3ridge API")
    .option("-e, --email <email>", "email address")
    .action(async (opts, cmd) => {
      try {
        const { apiUrl } = getGlobalOptions(cmd);
        let { email } = opts;

        if (!email) {
          const rl = createInterface({ input: stdin, output: stdout });
          email = await rl.question("Email: ");
          rl.close();
        }
        const password = await readPassword("Password: ");

        const result = await login(
          email,
          password,
          apiUrl ?? DEFAULT_API_URL,
        );

        console.log(`Logged in as ${result.user.username ?? result.user.sub}`);
        if (result.user.group === "Admin") {
          console.log(`Role: Admin (${result.user.adminRoles?.join(", ") ?? ""})`);
        }
      } catch (err) {
        handleError(err);
      }
    });

  program
    .command("logout")
    .description("Clear stored credentials")
    .action(() => {
      clearCredentials();
      console.log("Logged out");
    });

  program
    .command("whoami")
    .description("Show current authentication status")
    .action((_, cmd) => {
      const { format } = getGlobalOptions(cmd);
      const creds = loadCredentials();
      if (!creds) {
        console.log("Not logged in");
        return;
      }

      // Decode JWT payload
      const payload = creds.accessToken.split(".")[1];
      if (!payload) {
        console.log("Invalid token");
        return;
      }

      try {
        const decoded = JSON.parse(
          Buffer.from(payload, "base64url").toString("utf-8"),
        );
        const info = {
          userId: decoded.sub,
          username: decoded.username,
          group: decoded.group ?? "User",
          adminRoles: decoded.adminRoles ?? [],
          apiUrl: creds.apiUrl,
          expiresAt: creds.expiresAt,
        };
        output(info, format);
      } catch {
        console.error("Failed to decode token");
      }
    });
}
