const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { BOT_ID, BOT_TOKEN } = require('../config/secret.json');
const { logsEmiter } = require('../functions/logs');

const commands = [];
const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

let client;

for(const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if('data' in command) {
            commands.push(command.data);
        } else {
            logsEmiter(`[WARNING] The command at ${filePath} is missing a required "data" property.`);
        }
    }
}

const commandRegister = async () => {
    const rest = new REST().setToken(BOT_TOKEN);
    (async () => {
        try {
            await logsEmiter(`Started refreshing ${commands.length} application (/) commands.`);
            const data = await rest.put(
                Routes.applicationCommands(BOT_ID),
                { body: commands },
            );
            logsEmiter(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) { console.error(error); }
    })();
}

module.exports = { commandRegister };