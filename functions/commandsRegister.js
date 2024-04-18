import { readdirSync } from "node:fs";
import { join } from "node:path";
import { REST, Routes } from "discord.js";
import { logsEmiter } from "../functions/logs";

const commands = [];
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
      logsEmiter(
        `[WARNING] The command at ${filePath} is missing a required "data" property.`
      );
    }
  }
}

export const commandRegister = async () => {
  const rest = new REST().setToken(process.env.BOT_TOKEN);
  (async () => {
    try {
      await logsEmiter(
        `Started refreshing ${commands.length} application (/) commands.`
      );
      const data = await rest.put(
        Routes.applicationCommands(process.env.BOT_ID),
        { body: commands }
      );
      logsEmiter(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  })();
};
