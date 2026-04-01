# 3ridge CLI

Agent-native CLI for [3ridge](https://3ridge.io) campaign data. Read-only access to campaigns, leaderboards, rewards, and more.

Includes an **MCP Server** for AI agent integration (Claude, Codex, etc.).

## Install

```bash
# Run without installing
npx 3ridge-cli campaigns list

# Or install globally
npm install -g 3ridge-cli
3ridge campaigns list
```

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

## Commands

### Public (no auth required)

| Command | Description |
|---------|-------------|
| `3ridge health` | API health check |
| `3ridge campaigns list [--visible]` | List campaigns |
| `3ridge campaigns get <id>` | Campaign details |
| `3ridge campaigns stats <id>` | Campaign statistics |
| `3ridge projects list` | List partner projects |
| `3ridge projects get <id>` | Project details |
| `3ridge quests list <campaign-id>` | List quests for a campaign |
| `3ridge rewards summary <campaign-id>` | Reward details |
| `3ridge leaderboard list` | List leaderboards |
| `3ridge leaderboard get <id>` | Leaderboard details |
| `3ridge leaderboard top <id> [--limit N]` | Top participants |
| `3ridge mindshare community` | Community mindshare data |
| `3ridge mindshare keywords` | Trending keywords |
| `3ridge oracle summary` | Market data (kimchi premium, stocks) |

### Authenticated

| Command | Description |
|---------|-------------|
| `3ridge login -e <email>` | Login (password prompt, hidden input) |
| `3ridge logout` | Clear credentials |
| `3ridge whoami` | Current auth status |
| `3ridge me` | My profile |
| `3ridge my completions [--event <id>]` | My completed quests |
| `3ridge my events` | My participated events |
| `3ridge participants export <id>` | Export participants CSV (admin) |
| `3ridge admin users` | List admin users (admin) |

## Output Formats

```bash
# JSON (default, agent-friendly)
3ridge campaigns list

# Table (human-readable)
3ridge --format table campaigns list

# CSV (spreadsheet export)
3ridge --format csv campaigns list > campaigns.csv
```

## Global Options

```
--format <type>   json | csv | table (default: json)
--api-url <url>   Override API URL (e.g., staging)
--no-color        Disable colored output
--verbose         Debug logging
```

## MCP Server

For AI agent integration (Claude Code, Codex, etc.):

### Claude Code Setup

Add to `.mcp.json` in your project or `~/.claude/` directory:

```json
{
  "mcpServers": {
    "3ridge": {
      "command": "npx",
      "args": ["3ridge-cli", "--mcp"]
    }
  }
}
```

Or with a local install:

```json
{
  "mcpServers": {
    "3ridge": {
      "command": "node",
      "args": ["/path/to/3ridge-cli/dist/bin/3ridge-mcp.js"]
    }
  }
}
```

### Available MCP Tools (14)

| Tool | Description |
|------|-------------|
| `list_campaigns` | List campaigns with filters |
| `get_campaign` | Campaign details |
| `get_campaign_stats` | Aggregated statistics |
| `list_projects` | Partner projects |
| `get_project` | Project details |
| `list_quests` | Quests for a campaign |
| `get_rewards_summary` | Reward breakdown |
| `export_participants` | Participants CSV (admin) |
| `get_leaderboard_list` | All leaderboards |
| `get_leaderboard_top` | Top leaderboard entries |
| `get_mindshare` | Community mindshare |
| `get_trending_keywords` | Keyword trends |
| `get_oracle_summary` | Market data oracle |
| `check_health` | API health status |

### Example Agent Interaction

```
User: "3ridge 캠페인 3개의 이번 달 참여자 수 비교해줘"
Agent: [calls list_campaigns] -> [calls get_campaign_stats x3] -> comparison table
```

## API Sources

- **3ridge GraphQL**: `api.3ridge.io/graphql` (campaigns, projects, quests, rewards)
- **Mashboard REST**: `mashboard-api.despreadlabs.io` (leaderboards, mindshare, oracle)

## Security

- Read-only: no write/update/delete operations
- Password input: hidden (no shell history exposure)
- Credentials: `~/.3ridge/credentials.json` (0600 permissions)
- CSV export: formula injection prevention
- URL params: encoded to prevent injection
- Codex-verified: security audit score 7/10, all findings addressed

## License

MIT
