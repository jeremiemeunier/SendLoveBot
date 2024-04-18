import { Events } from "discord.js";
import { logsEmiter } from "../../../functions/logs";
import axios from "axios";

export const commandExitLove = (client) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === "exit") {
      const user = interaction.user.id;

      try {
        const removeLover = await axios({
          method: "delete",
          url: "/love/exit",
          baseURL: `http://localhost:${process.env.PORT}`,
          headers: {
            botid: process.env.BOT_ID,
          },
          data: {
            user_id: user,
          },
        });

        if (removeLover.status === 200) {
          interaction.reply({
            content: `Tu n'a plus de love de programmé mais je te love quand même. ❤️`,
            ephemeral: true,
          });
        }
      } catch (error) {
        logsEmiter(`An error occured [commandExitLove] : \r\n ${error}`);
        interaction.reply({
          content: `Une erreur est survenue il faudra réessayer plus tard.`,
          ephemeral: true,
        });
      }
    }
  });
};
