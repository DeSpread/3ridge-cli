# 3ridge CLI

[![npm version](https://img.shields.io/npm/v/@despread/3ridge-cli)](https://www.npmjs.com/package/@despread/3ridge-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >= 18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

> Agent-native CLI for [3ridge](https://3ridge.io) — the Web3 quest & campaign platform.  
> Query campaigns, leaderboards, rewards, and market data with zero authentication required.  
> Ships with a built-in **MCP Server** for seamless AI agent integration (Claude, Codex, etc.).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Quick Start](#quick-start)
- [Commands](#commands)
  - [Health](#health)
  - [Campaigns](#campaigns)
  - [Projects](#projects)
  - [Quests](#quests)
  - [Rewards](#rewards)
  - [Leaderboard](#leaderboard)
  - [Mindshare](#mindshare)
  - [Oracle](#oracle)
- [Output Formats](#output-formats)
- [Global Options](#global-options)
- [MCP Server (AI Agent Integration)](#mcp-server-ai-agent-integration)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

- **Node.js >= 18** ([download](https://nodejs.org/))

---

## Install

```bash
# Run without installing (recommended for one-off use)
npx -p @despread/3ridge-cli 3ridge campaigns list

# Install globally
npm install -g @despread/3ridge-cli
```

---

## Quick Start

```bash
# Check API health
3ridge health

# List visible campaigns
3ridge campaigns list --visible

# Campaign statistics
3ridge campaigns stats <campaign-id>

# Leaderboard top participants
3ridge leaderboard top <leaderboard-id> --limit 10
```

---

## Commands

All commands are **public** and require **no authentication**.

### Health

| Command | Description |
|---------|-------------|
| `3ridge health` | API health check |

### Campaigns

| Command | Description |
|---------|-------------|
| `3ridge campaigns list [--visible]` | List all campaigns (optionally filter to visible only) |
| `3ridge campaigns get <id>` | Get campaign details |
| `3ridge campaigns stats <id>` | Get campaign statistics |

### Projects

| Command | Description |
|---------|-------------|
| `3ridge projects list` | List partner projects |
| `3ridge projects get <id>` | Get project details |

### Quests

| Command | Description |
|---------|-------------|
| `3ridge quests list <campaign-id>` | List quests for a campaign |

### Rewards

| Command | Description |
|---------|-------------|
| `3ridge rewards summary <campaign-id>` | Get reward breakdown for a campaign |

### Leaderboard

| Command | Description |
|---------|-------------|
| `3ridge leaderboard list` | List all leaderboards |
| `3ridge leaderboard get <id>` | Get leaderboard details |
| `3ridge leaderboard top <id> [--limit N]` | Top N participants |

### Mindshare

| Command | Description |
|---------|-------------|
| `3ridge mindshare community` | Community mindshare data |
| `3ridge mindshare keywords` | Trending keywords |

### Oracle

| Command | Description |
|---------|-------------|
| `3ridge oracle summary` | Market data (kimchi premium, stocks, etc.) |

---

## Output Formats

```bash
# JSON — default, agent-friendly
3ridge campaigns list

# Table — human-readable terminal output
3ridge --format table campaigns list

# CSV — export to spreadsheet
3ridge --format csv campaigns list > campaigns.csv
```

---

## Global Options

| Option | Values | Description |
|--------|--------|-------------|
| `--format <type>` | `json` \| `csv` \| `table` | Output format (default: `json`) |
| `--api-url <url>` | URL | Override API base URL (e.g., staging) |
| `--no-color` | — | Disable colored output |
| `--verbose` | — | Enable debug logging |

---

## MCP Server (AI Agent Integration)

3ridge CLI ships with an **MCP (Model Context Protocol) server** that exposes all data as tools for AI agents — making it easy to build agents that query 3ridge data conversationally.

### Setup — Claude Code

Add to `.mcp.json` in your project root or `~/.claude/`:

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

> **With a local install:**
> ```json
> {
>   "mcpServers": {
>     "3ridge": {
>       "command": "node",
>       "args": ["/path/to/3ridge-cli/dist/bin/3ridge-mcp.js"]
>     }
>   }
> }
> ```

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

### Example Agent Interaction

```
User:  "3ridge 캠페인 3개의 이번 달 참여자 수 비교해줘"
Agent: [list_campaigns] → [get_campaign_stats ×3] → comparison table
```

---

## Security

| Area | Detail |
|------|--------|
| Endpoints | Public only — no user data, no admin operations |
| Access | Read-only — no write, update, or delete |
| CSV output | Formula injection prevention built-in |
| URL params | Encoded to prevent injection |

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repo and create a feature branch (`git checkout -b feat/my-feature`)
2. Make your changes and add tests if applicable
3. Ensure the build passes (`npm run build`)
4. Open a Pull Request with a clear description

Please follow the existing code style and keep PRs focused in scope.

---

## License

MIT © [DeSpread](https://despread.io)
