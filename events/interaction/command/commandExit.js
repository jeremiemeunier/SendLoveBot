const { Events } = require('discord.js');
const { logsEmiter } = require('../../../functions/logs');

let client;

const commandExitLove = (clientItem) => {

    client = clientItem;

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
            const { commandName } = interaction;
        
        if(commandName === 'exit') {
            try {
                
            }
            catch(error) { logsEmiter(`An error occured [commandExitLove] : \r\n ${error}`); }
        }
    });
}

module.exports = { commandExitLove }