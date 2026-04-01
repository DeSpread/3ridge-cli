import { Command } from "commander";
import { registerCampaignCommands } from "./commands/campaigns.js";
import { registerProjectCommands } from "./commands/projects.js";
import { registerQuestCommands } from "./commands/quests.js";
import { registerLeaderboardCommands } from "./commands/leaderboard.js";
import { registerRewardCommands } from "./commands/rewards.js";
import { registerMindshareCommands } from "./commands/mindshare.js";
import { registerOracleCommands } from "./commands/oracle.js";
import { registerHealthCommands } from "./commands/health.js";

export function createProgram(): Command {
  const program = new Command();

  program
    .name("3ridge")
    .description(
      "Agent-native CLI for 3ridge campaign data (read-only, public endpoints)",
    )
    .version("0.2.0")
    .option("--format <type>", "output format: json, csv, table", "json")
    .option("--api-url <url>", "override GraphQL API URL")
    .option("--no-color", "disable colored output")
    .option("--verbose", "enable debug logging");

  registerCampaignCommands(program);
  registerProjectCommands(program);
  registerQuestCommands(program);
  registerLeaderboardCommands(program);
  registerRewardCommands(program);
  registerMindshareCommands(program);
  registerOracleCommands(program);
  registerHealthCommands(program);

  return program;
}
