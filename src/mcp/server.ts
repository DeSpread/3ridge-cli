import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createGraphQLClient } from "../clients/graphql.js";
import { mashboardRest, trigeRest } from "../clients/rest.js";
import {
  EVENTS_QUERY,
  EVENT_QUERY,
  PROJECTS_QUERY,
  PROJECT_QUERY,
  QUESTS_QUERY,
} from "../queries/index.js";
import type { Event, Project, Quest } from "../clients/types.js";

export function startMcpServer(): void {
  const server = new McpServer({
    name: "3ridge",
    version: "0.3.1",
    description: `3ridge is a Web3 campaign & reward platform (StoryTeller). This MCP server provides read-only access to:
- Campaigns: quest-based marketing campaigns with rewards (called "events" internally)
- Projects: partner blockchain projects running campaigns on 3ridge
- Quests: tasks participants complete (Twitter follow, Discord join, quiz, survey, etc.)
- Leaderboards: storyteller community rankings by score
- Mindshare: Telegram community mention share data (1d~90d, custom date range)
- Keywords: trending narrative/project keyword tracking
- Oracle: Korean market data (kimchi premium, stock indices, real estate)

Typical workflow: list_campaigns -> get_campaign_stats/get_rewards_summary for analysis.
For mindshare analysis: get_mindshare with days parameter (1,7,14,30,90).
For market context: get_oracle_summary with range (7d,30d,90d,1y,all).
All data is public. No authentication required.`,
  });

  // --- Tool: list_campaigns ---
  server.tool(
    "list_campaigns",
    "List 3ridge campaigns (events). Returns campaign ID, title, project, quest count, participant count, dates.",
    { visible_only: z.boolean().optional().describe("Only return visible campaigns") },
    async ({ visible_only }) => {
      const client = createGraphQLClient();
      const data = await client.request<{ events: Event[] }>(EVENTS_QUERY, {
        isVisible: visible_only ? true : undefined,
      });

      const campaigns = data.events.map((e) => ({
        id: e._id,
        title: e.title,
        project: e.project?.name ?? null,
        questCount: e.questCounts,
        participantCount: e.participants.length,
        visible: e.isVisible,
        beginDate: e.beginDate,
        untilDate: e.untilDate,
      }));

      return { content: [{ type: "text" as const, text: JSON.stringify(campaigns, null, 2) }] };
    },
  );

  // --- Tool: get_campaign ---
  server.tool(
    "get_campaign",
    "Get detailed information about a specific 3ridge campaign including reward, project, and participants.",
    { campaign_id: z.string().describe("Campaign (event) ID") },
    async ({ campaign_id }) => {
      const client = createGraphQLClient();
      const data = await client.request<{ event: Event }>(EVENT_QUERY, { _id: campaign_id });
      return { content: [{ type: "text" as const, text: JSON.stringify(data.event, null, 2) }] };
    },
  );

  // --- Tool: get_campaign_stats ---
  server.tool(
    "get_campaign_stats",
    "Get aggregated statistics for a campaign: participant count, quest count, reward summary, duration.",
    { campaign_id: z.string().describe("Campaign (event) ID") },
    async ({ campaign_id }) => {
      const client = createGraphQLClient();
      const data = await client.request<{ event: Event }>(EVENT_QUERY, { _id: campaign_id });
      const e = data.event;

      const stats = {
        id: e._id,
        title: e.title,
        project: e.project?.name ?? null,
        participantCount: e.participants.length,
        questCount: e.questCounts,
        rewardType: e.reward?.type ?? "NONE",
        rewardPoint: e.reward?.point ?? 0,
        prizeCount: e.reward?.prizes.length ?? 0,
        durationDays: Math.ceil(
          (new Date(e.untilDate).getTime() - new Date(e.beginDate).getTime()) / (1000 * 60 * 60 * 24),
        ),
        beginDate: e.beginDate,
        untilDate: e.untilDate,
      };

      return { content: [{ type: "text" as const, text: JSON.stringify(stats, null, 2) }] };
    },
  );

  // --- Tool: list_projects ---
  server.tool(
    "list_projects",
    "List all 3ridge partner projects with their social links.",
    {},
    async () => {
      const client = createGraphQLClient();
      const data = await client.request<{ projects: Project[] }>(PROJECTS_QUERY);
      return { content: [{ type: "text" as const, text: JSON.stringify(data.projects, null, 2) }] };
    },
  );

  // --- Tool: get_project ---
  server.tool(
    "get_project",
    "Get details for a specific 3ridge partner project.",
    { project_id: z.string().describe("Project ID") },
    async ({ project_id }) => {
      const client = createGraphQLClient();
      const data = await client.request<{ project: Project }>(PROJECT_QUERY, { _id: project_id });
      return { content: [{ type: "text" as const, text: JSON.stringify(data.project, null, 2) }] };
    },
  );

  // --- Tool: list_quests ---
  server.tool(
    "list_quests",
    "List all quests for a campaign. Shows quest type, display text, and type-specific details.",
    { campaign_id: z.string().describe("Campaign (event) ID") },
    async ({ campaign_id }) => {
      const client = createGraphQLClient();
      const data = await client.request<{ quests: Quest[] }>(QUESTS_QUERY, { eventId: campaign_id });
      return { content: [{ type: "text" as const, text: JSON.stringify(data.quests, null, 2) }] };
    },
  );

  // --- Tool: get_rewards_summary ---
  server.tool(
    "get_rewards_summary",
    "Get reward details for a campaign: reward type, points, prizes, and winner limits.",
    { campaign_id: z.string().describe("Campaign (event) ID") },
    async ({ campaign_id }) => {
      const client = createGraphQLClient();
      const data = await client.request<{ event: Event }>(EVENT_QUERY, { _id: campaign_id });
      const e = data.event;

      if (!e.reward) {
        return { content: [{ type: "text" as const, text: "No reward configured for this campaign" }] };
      }

      const summary = {
        campaignId: e._id,
        campaignTitle: e.title,
        rewardType: e.reward.type,
        description: e.reward.description,
        point: e.reward.point,
        prizes: e.reward.prizes,
        totalPrizes: e.reward.prizes.length,
        participantCount: e.participants.length,
      };

      return { content: [{ type: "text" as const, text: JSON.stringify(summary, null, 2) }] };
    },
  );

  // --- Tool: get_leaderboard_list ---
  server.tool(
    "get_leaderboard_list",
    "List all storyteller leaderboards.",
    {},
    async () => {
      const data = await mashboardRest("/storyteller-leaderboard");
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );

  // --- Tool: get_leaderboard_top ---
  server.tool(
    "get_leaderboard_top",
    "Get top participants from a storyteller leaderboard with scores and timeseries data.",
    {
      leaderboard_id: z.string().describe("Leaderboard ID"),
      limit: z.number().optional().default(20).describe("Number of top entries to return"),
      days: z.number().optional().default(30).describe("Lookback period in days (e.g. 7, 30, 90)"),
    },
    async ({ leaderboard_id, limit, days }) => {
      const params = new URLSearchParams({ limit: String(limit), lookbacks: String(days) });
      const data = await mashboardRest(
        `/storyteller-leaderboard/${encodeURIComponent(leaderboard_id)}/timeseries-group?${params}`,
      );
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );

  // --- Tool: get_mindshare ---
  server.tool(
    "get_mindshare",
    "Get community mindshare data from Telegram tracking. Supports 1/7/14/30/90 day intervals. Use end_date for custom date range.",
    {
      days: z.number().optional().default(30).describe("Interval: 1 (24h), 7, 14, 30, or 90 days"),
      end_date: z.string().optional().describe("End date (YYYY-MM-DD) for custom range. Omit for latest data."),
      pretge: z.boolean().optional().describe("Show pre-TGE projects only"),
      limit: z.number().optional().default(50).describe("Number of projects to return"),
    },
    async ({ days, end_date, pretge, limit }) => {
      const params = new URLSearchParams({
        intervalDays: String(days),
        limit: String(limit),
        offset: "0",
      });
      if (pretge) params.set("pretge", "true");

      let path: string;
      if (end_date) {
        params.set("endDate", end_date);
        path = `/telegram/mindshare/community/custom-range?${params}`;
      } else {
        path = `/telegram/mindshare/community?${params}`;
      }

      const data = await mashboardRest(path);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );

  // --- Tool: get_trending_keywords ---
  server.tool(
    "get_trending_keywords",
    "Get trending keyword mentions and narrative tracking data.",
    {
      days: z.number().optional().default(30).describe("Lookback period in days"),
      type: z.string().optional().default("narrative").describe("Keyword type: narrative or project"),
      limit: z.number().optional().default(20).describe("Number of keywords to return"),
    },
    async ({ days, type, limit }) => {
      const params = new URLSearchParams({
        nDays: String(days),
        type,
        limit: String(limit),
      });
      const data = await mashboardRest(
        `/telegram/tracking-keywords/mentions/top-series?${params}`,
      );
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );

  // --- Tool: get_oracle_summary ---
  server.tool(
    "get_oracle_summary",
    "Get market data oracle summary: kimchi premium, stock indices, real estate data. Supports ranges: 7d, 30d, 90d, 1y, all.",
    {
      range: z.string().optional().default("30d").describe("Date range: 7d, 30d, 90d, 1y, or all"),
    },
    async ({ range }) => {
      const params = new URLSearchParams({ range });
      const data = await mashboardRest(`/oracle/summary?${params}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );

  // --- Tool: check_health ---
  server.tool(
    "check_health",
    "Check 3ridge API and database health status.",
    {},
    async () => {
      const data = await trigeRest("/health");
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Start server on stdio
  const transport = new StdioServerTransport();
  server.connect(transport);
}
