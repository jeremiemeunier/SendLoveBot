import {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { logsEmiter } from "../../../functions/logs";
import axios from "axios";
import { color } from "../../../config/settings.json";

export const commandListLove = (client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === "list") {
      const user = interaction.user.id;

      try {
        const getLoves = await axios({
          method: "get",
          url: "/love/user/list",
          baseURL: `http://localhost:${process.env.PORT}`,
          headers: {
            botid: process.env.BOT_ID,
          },
          data: {
            user_id: user,
          },
        });

        if (getLoves.status === 200) {
          const allLoves = getLoves.data.data;
          let allEmbeds = [];
          let allButtons = [];

          allLoves.map((item, index) => {
            const { _id, hours, minutes } = item;
            const loveEmbed = new EmbedBuilder({
              title: `Love message ${index + 1}`,
              description: `Tout les jours à ${hours}:${minutes.length === 2 ? minutes : "0" + minutes}`,
              color: color,
            });
            const loveButton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setLabel(`Supprimer le message ${index + 1}`)
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`${_id}`)
            );

            allButtons.push(loveButton);
            allEmbeds.push(loveEmbed);
          });

          try {
            interaction.reply({
              content: `Voici tout tes messages programmés ❤️ :`,
              embeds: allEmbeds,
              components: allButtons,
              ephemeral: true,
            });
          } catch (error) {
            interaction.reply({
              content: `Une erreur est survenue`,
              ephemeral: true,
            });
            logsEmiter(error);
          }
        } else {
          interaction.reply({
            content: `Tu n'a pas de love de programmé ❤️ :`,
            ephemeral: true,
          });
        }
      } catch (error) {
        logsEmiter(`An error occured [commandListLove] : \r\n ${error}`);
        interaction.reply({
          content: `Une erreur est survenue il faudra réessayer plus tard.`,
          ephemeral: true,
        });
      }
    }
  });
};
