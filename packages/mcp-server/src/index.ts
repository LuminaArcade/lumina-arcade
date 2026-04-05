#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_BASE = process.env.LUMINA_API_URL || "https://luminaarcade.com/api/v1";

async function apiFetch(path: string): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// Create MCP server
const server = new McpServer({
  name: "lumina-arcade",
  version: "1.0.0",
});

// --- Tools ---

// 1. List pools
server.tool(
  "list_pools",
  "List token pools on Lumina Arcade. Filter by status (active/launched/expired), creator wallet, and sort order.",
  {
    status: z.enum(["active", "launched", "expired"]).optional().describe("Filter by pool status"),
    creator: z.string().optional().describe("Filter by creator wallet address"),
    sort: z.enum(["created_desc", "created_asc", "raised_desc", "progress_desc"]).optional().describe("Sort order"),
    limit: z.number().min(1).max(100).optional().describe("Number of results (default 20)"),
    offset: z.number().min(0).optional().describe("Pagination offset"),
  },
  async ({ status, creator, sort, limit, offset }) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (creator) params.set("creator", creator);
    if (sort) params.set("sort", sort);
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));

    const query = params.toString();
    const data = await apiFetch(`/pools${query ? `?${query}` : ""}`);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// 2. Get pool details
server.tool(
  "get_pool",
  "Get detailed information about a specific pool, including all pledges, participants, and progress.",
  {
    pool_id: z.string().describe("The UUID of the pool"),
  },
  async ({ pool_id }) => {
    const data = await apiFetch(`/pools/${pool_id}`);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// 3. Get leaderboard
server.tool(
  "get_leaderboard",
  "Get the player leaderboard ranked by XP. Shows wallet, display name, XP, rank, and pools created.",
  {
    limit: z.number().min(1).max(100).optional().describe("Number of results (default 20)"),
    offset: z.number().min(0).optional().describe("Pagination offset"),
  },
  async ({ limit, offset }) => {
    const params = new URLSearchParams();
    if (limit) params.set("limit", String(limit));
    if (offset) params.set("offset", String(offset));

    const query = params.toString();
    const data = await apiFetch(`/leaderboard${query ? `?${query}` : ""}`);

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// 4. Get platform stats
server.tool(
  "get_stats",
  "Get overall Lumina Arcade platform statistics: pool counts, total volume, player count, and total XP.",
  {},
  async () => {
    const data = await apiFetch("/stats");
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// 5. Get AI characters for a wallet
server.tool(
  "get_characters",
  "Get AI-generated characters owned by a specific wallet address. Each character has unique traits, stats, and backstory.",
  {
    wallet: z.string().describe("Solana wallet address (Base58)"),
  },
  async ({ wallet }) => {
    const data = await apiFetch(`/characters/${wallet}`);
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// 6. Search pools
server.tool(
  "search_pools",
  "Search for pools by name or ticker symbol. Returns matching pools sorted by relevance.",
  {
    query: z.string().describe("Search query (pool name or ticker)"),
  },
  async ({ query }) => {
    // Fetch all pools and filter client-side (API doesn't have search yet)
    const data = await apiFetch("/pools?limit=100");
    const q = query.toLowerCase();

    if (data.success && data.data) {
      data.data = data.data.filter(
        (p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.ticker.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
      data.pagination.total = data.data.length;
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// 7. Get API health/info
server.tool(
  "get_api_info",
  "Check the Lumina Arcade API status and see available endpoints and service health.",
  {},
  async () => {
    const data = await apiFetch("");
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

// --- Resources ---

server.resource(
  "platform-overview",
  "lumina://overview",
  async (uri) => {
    const stats = await apiFetch("/stats");
    const topPlayers = await apiFetch("/leaderboard?limit=5");
    const hotPools = await apiFetch("/pools?status=active&sort=progress_desc&limit=5");

    const overview = {
      stats: stats.data,
      topPlayers: topPlayers.data,
      hotPools: hotPools.data,
    };

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(overview, null, 2),
        },
      ],
    };
  }
);

// --- Start server ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Lumina Arcade MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
