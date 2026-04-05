# lumina-arcade-mcp

MCP (Model Context Protocol) server for [Lumina Arcade](https://luminaarcade.com) -- the gamified SocialFi arcade on Solana, powered by Bags.fm.

Lets AI agents interact with Lumina Arcade to browse pools, check leaderboards, view characters, and more.

## Quick Start

### With Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "lumina-arcade": {
      "command": "npx",
      "args": ["-y", "lumina-arcade-mcp"]
    }
  }
}
```

### With Claude Code

```bash
claude mcp add lumina-arcade -- npx -y lumina-arcade-mcp
```

### Manual

```bash
npm install -g lumina-arcade-mcp
lumina-arcade-mcp
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_pools` | List token pools with filters (status, creator, sort) |
| `get_pool` | Get detailed pool info including pledges |
| `get_leaderboard` | Player rankings by XP |
| `get_stats` | Platform-wide statistics |
| `get_characters` | AI-generated characters for a wallet |
| `search_pools` | Search pools by name/ticker |
| `get_api_info` | API health and endpoint info |

## Resources

| Resource | URI | Description |
|----------|-----|-------------|
| Platform Overview | `lumina://overview` | Stats + top players + hot pools |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LUMINA_API_URL` | `https://luminaarcade.com/api/v1` | API base URL |

## Examples

Ask your AI agent:
- "What are the hottest pools on Lumina Arcade right now?"
- "Show me the top 10 players on the leaderboard"
- "Get details for pool XYZ"
- "What are the platform stats for Lumina Arcade?"
- "Show me AI characters for wallet ABC..."

## License

MIT
