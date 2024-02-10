const { PORT, BOT_ID } = require('../../../config/secret.json');
const { Events } = require('discord.js');
const { logsEmiter } = require('../../../functions/logs');
const axios = require('axios');

const commandSendLove = (client) => {
  client.on(Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;
          const { commandName } = interaction;
      
      if(commandName === 'love') {
        const hours = interaction.options.getInteger('hours').toString();
        const minutes = interaction.options.getInteger('minutes').toString();
        const user = interaction.user.id;

        try {
          const addNewLovers = await axios({
            method: "post",
            url: "/love/add",
            baseURL: `http://localhost:${PORT}`,
            headers: {
              "botid": BOT_ID
            },
            data: {
              user_id: user,
              hours: hours,
              minutes: minutes
            }
          });

          if(addNewLovers.status === 200) {
            interaction.reply({
              content: `Je t'enverrais du love tout les jours à ${hours}:${minutes.length === 2 ? minutes : '0' + minutes}`
            });
          }
        }
        catch(error) {
          logsEmiter(`An error occured [commandSendLove] : \r\n ${error}`);
          interaction.reply({
            content: `Une erreur est survenue. Réessaie plus tard.`
          })
        }
      }
  });
}

module.exports = { commandSendLove }