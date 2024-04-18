import axios from "axios";
import { logsEmiter } from "./logs";

export const sendLove = (client) => {
  setInterval(async () => {
    try {
      const now = new Date();
      const hours = now.getHours().toString();
      const minutes = now.getMinutes().toString();

      const allLoveMessages = await axios({
        method: "get",
        url: "/love/list",
        baseURL: `http://localhost:${process.env.PORT}`,
        headers: {
          botid: process.env.BOT_ID,
        },
        data: {
          hours: hours,
          minutes: minutes,
        },
      });

      const allUsers = allLoveMessages.data.data;

      allUsers.map((item) => {
        const { user_id } = item;

        try {
          const user = client.users.fetch(user_id, false).then((user) => {
            user.send(`It's love time ! Je te love ❤️`);
          });
        } catch (error) {
          logsEmiter(error);
        }
      });
    } catch (error) {
      if (error.request.status !== 404) {
        console.log(error);
      }
    }
  }, 60000);
};
