import { readdirSync } from "node:fs";
import { join } from "node:path";
import { REST, Routes } from "discord.js";
import { Logs } from "@libs/Logs";
import { CommandModule } from "@/types/Discord.type";

const commands: CommandModule[] = [];
const foldersPath = join(__dirname, "../commands");
const commandFolders = readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder);
  const commandFiles = readdirSync(commandsPath).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    const filePath = join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command) {
      commands.push(command.data);
    } else {
      Logs(
        "",
        "warning",
        `The command at ${filePath} is missing a required "data" property.`
      );
    }
  }
}

export const commandRegister = async () => {
  const rest = new REST().setToken(process.env.BOT_TOKEN as string);
  (async () => {
    try {
      Logs(
        "",
        "start",
        `Started refreshing ${commands.length} application (/) commands.`
      );

      const data = await rest.put(
        Routes.applicationCommands(process.env.BOT_ID as string),
        { body: commands }
      );

      Logs(
        "",
        "success",
        `Successfully reloaded ${
          (data as Array<unknown>).length
        } application (/) commands.`
      );
    } catch (err: any) {
      Logs("", "error", err);
    }
  })();
};
