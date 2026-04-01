import { readFileSync, writeFileSync, mkdirSync, existsSync, chmodSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface StoredCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  apiUrl: string;
}

const CONFIG_DIR = join(homedir(), ".3ridge");
const CREDS_FILE = join(CONFIG_DIR, "credentials.json");

export function loadCredentials(): StoredCredentials | null {
  if (!existsSync(CREDS_FILE)) return null;
  try {
    const raw = readFileSync(CREDS_FILE, "utf-8");
    return JSON.parse(raw) as StoredCredentials;
  } catch {
    return null;
  }
}

export function saveCredentials(creds: StoredCredentials): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
  writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2), "utf-8");
  chmodSync(CREDS_FILE, 0o600);
}

export function clearCredentials(): void {
  if (existsSync(CREDS_FILE)) {
    unlinkSync(CREDS_FILE);
  }
}
