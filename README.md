# 3ridge CLI

[![npm version](https://img.shields.io/npm/v/@despread/3ridge-cli)](https://www.npmjs.com/package/@despread/3ridge-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Ready](https://img.shields.io/badge/MCP-Ready-blue)](https://modelcontextprotocol.io)

Agent-native CLI for [3ridge](https://3ridge.io) — read-only access to campaigns, leaderboards, rewards, and more. Includes an **MCP Server** for AI agent integration (Claude, Codex, etc.).

---

## Installation

```bash
# Run without installing
npx -p @despread/3ridge-cli 3ridge <command>

# Install globally
npm install -g @despread/3ridge-cli
```

---

## Quick Start

```bash
# Check API health
3ridge health

# List active campaigns
3ridge campaigns list --visible

# View campaign statistics
3ridge campaigns stats <campaign-id>

# Get leaderboard top 10
3ridge leaderboard top <leaderboard-id> --limit 10

# Export campaigns to CSV
3ridge --format csv campaigns list > campaigns.csv
```

---

## Commands

### Campaigns

| Command | Description |
|---------|-------------|
| `campaigns list [--visible]` | List all campaigns (optionally filter visible only) |
| `campaigns get <id>` | Get campaign details |
| `campaigns stats <id>` | Get aggregated campaign statistics |

### Projects

| Command | Description |
|---------|-------------|
| `projects list` | List partner projects |
| `projects get <id>` | Get project details |

### Quests & Rewards

| Command | Description |
|---------|-------------|
| `quests list <campaign-id>` | List quests for a campaign |
| `rewards summary <campaign-id>` | Get reward breakdown |

### Leaderboard

| Command | Description |
|---------|-------------|
| `leaderboard list` | List all leaderboards |
| `leaderboard get <id>` | Get leaderboard details |
| `leaderboard top <id> [--limit N]` | Get top participants |

### Mindshare & Oracle

| Command | Description |
|---------|-------------|
| `mindshare community` | Community mindshare data |
| `mindshare keywords` | Trending keywords |
| `oracle summary` | Market data (kimchi premium, stocks) |

### Utility

| Command | Description |
|---------|-------------|
| `health` | API health check |

All commands are **public** and require **no authentication**.

---

## Output Formats

```bash
3ridge campaigns list                      # JSON (default, agent-friendly)
3ridge --format table campaigns list       # Table (human-readable)
3ridge --format csv campaigns list         # CSV (spreadsheet export)
```

---

## Global Options

| Option | Description |
|--------|-------------|
| `--format <type>` | `json` \| `csv` \| `table` (default: `json`) |
| `--api-url <url>` | Override API base URL (e.g., staging) |
| `--no-color` | Disable colored output |
| `--verbose` | Enable debug logging |

---

## MCP Server

Integrate with AI agents (Claude Code, Codex, etc.) via the [Model Context Protocol](https://modelcontextprotocol.io).

### Setup for Claude Code

Add to `.mcp.json` in your project or `~/.claude/`:

```json
{
  "mcpServers": {
    "3ridge": {
      "command": "npx",
      "args": ["-p", "@despread/3ridge-cli", "3ridge-mcp"]
    }
  }
}
```

### Available MCP Tools (13)

| Tool | Description |
|------|-------------|
| `list_campaigns` | List campaigns with filters |
| `get_campaign` | Campaign details |
| `get_campaign_stats` | Aggregated statistics |
| `list_projects` | Partner projects |
| `get_project` | Project details |
| `list_quests` | Quests for a campaign |
| `get_rewards_summary` | Reward breakdown |
| `get_leaderboard_list` | All leaderboards |
| `get_leaderboard_top` | Top leaderboard entries |
| `get_mindshare` | Community mindshare |
| `get_trending_keywords` | Keyword trends |
| `get_oracle_summary` | Market data oracle |
| `check_health` | API health status |

### Example

```
User: "3ridge 캠페인 3개의 이번 달 참여자 수 비교해줘"
Agent: [list_campaigns] → [get_campaign_stats × 3] → comparison table
```

---

## Security

- **Public endpoints only** — no user data, no admin operations
- **Read-only** — no write, update, or delete operations
- **CSV safety** — formula injection prevention
- **URL encoding** — parameters sanitized to prevent injection

---

## Contributing

```bash
git clone https://github.com/DeSpread/3ridge-cli.git
cd 3ridge-cli
npm install
npm run build
npm run dev -- health   # run locally
```

PRs and issues welcome. Please open an issue before submitting large changes.

---

## License

MIT © [DeSpread](https://github.com/DeSpread)
