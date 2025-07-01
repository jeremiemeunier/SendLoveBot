import { LoveModelTypes } from "@/types/Model.type";
import { Logs } from "@libs/Logs";
import WindmillAxios from "@libs/WindmillAxios";
import { User } from "discord.js";

export const sendLove = async (client: any) => {
  try {
    const now = new Date();
    const hours = now.getHours().toString();
    const minutes = now.getMinutes().toString();

    const request = await WindmillAxios.get("/love/list", {
      params: {
        hours: hours,
        minutes: minutes,
      },
    });

    request.data.map((item: LoveModelTypes) => {
      const { user_id } = item;

      try {
        const user = client.users.fetch(user_id, false).then((user: User) => {
          user.send(`It's love time ! Je te love ❤️`);
        });
      } catch (err: any) {
        Logs("", "error", err);
      }
    });
  } catch (err: any) {
    if (err.code !== 404) {
      Logs("", "error", err);
    }
  }
};
