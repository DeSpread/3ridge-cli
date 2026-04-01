import { Command } from "commander";
import { registerAuthCommands } from "./commands/auth.js";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerProjectCommands } from "./commands/projects.js";
import { registerQuestCommands } from "./commands/quests.js";
import { registerParticipantCommands } from "./commands/participants.js";
import { registerLeaderboardCommands } from "./commands/leaderboard.js";
import { registerRewardCommands } from "./commands/rewards.js";
import { registerMindshareCommands } from "./commands/mindshare.js";
import { registerOracleCommands } from "./commands/oracle.js";
import { registerHealthCommands } from "./commands/health.js";
import { registerAdminCommands } from "./commands/admin.js";
import { registerMeCommands } from "./commands/me.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("3ridge")
    .description(
      "Agent-native CLI for 3ridge campaign data (read-only)",
    )
    .version("0.1.0")
    .option("--format <type>", "output format: json, csv, table", "json")
    .option("--api-url <url>", "override GraphQL API URL")
    .option("--no-color", "disable colored output")
    .option("--verbose", "enable debug logging");

  registerAuthCommands(program);
  registerCampaignCommands(program);
  registerProjectCommands(program);
  registerQuestCommands(program);
  registerParticipantCommands(program);
  registerLeaderboardCommands(program);
  registerRewardCommands(program);
  registerMindshareCommands(program);
  registerOracleCommands(program);
  registerHealthCommands(program);
  registerAdminCommands(program);
  registerMeCommands(program);

  return program;
}
