const { PORT, BOT_ID } = require('../../../config/secret.json');
const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { logsEmiter } = require('../../../functions/logs');
const axios = require('axios');

const commandListLove = (client) => {
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    
    if(commandName === 'list') {
      const user = interaction.user.id;

      try {
        const getLoves = await axios({
          method: "get",
          url: "/love/user/list",
          baseURL: `http://localhost:${PORT}`,
          headers: {
            "botid": BOT_ID
          },
          data: {
            user_id: user,
          }
        });

        if(getLoves.status === 200) {
          const allLoves = getLoves.data.data;
          let allEmbeds = [];
          let allButtons = [];

          allLoves.map((item, index) => {
            const { _id, hours, minutes } = item;
            const loveEmbed = new EmbedBuilder()
              .setTitle(`Love message ${index + 1}`)
              .setDescription(`Tout les jours à ${hours}:${minutes.length === 2 ? minutes : '0' + minutes}`);
            const loveButton = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setLabel(`Supprimer le message ${index + 1}`)
                  .setStyle(ButtonStyle.Danger)
                  .setCustomId(`${_id}`));

            allButtons.push(loveButton);
            allEmbeds.push(loveEmbed);
          });

          try {
            interaction.reply({
              content: `Voici tout tes messages programmés ❤️ :`,
              embeds: allEmbeds,
              components: allButtons
            });
          }
          catch(error) {
            interaction.reply({
              content: `Une erreur est survenue`
            })
            logsEmiter(error);
          }
        }
        else {
          interaction.reply({
            content: `Tu n'a pas de love de programmé ❤️ :`
          });
        }
      }
      catch(error) {
        logsEmiter(`An error occured [commandListLove] : \r\n ${error}`);
        interaction.reply({
          content: `Une erreur est survenue il faudra réessayer plus tard.`
        });
      }
    }
  });
}

module.exports = { commandListLove }