import * as cron from "node-cron";
import express, { json } from "express";
import RateLimit from "express-rate-limit";
import cors from "cors";
import { connect } from "mongoose";
import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js";
import { Logs } from "@libs/Logs";
import { sendLove } from "@functions/SendMessage.fn";

import { default as LoveListRoutes } from "@routes/Love.route";

const app = express();
const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(json());
app.use(cors());

connect(process.env.MONGODB_URL as string);

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, "endsWith", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString: any, position: any) {
      position = position || this.length;
      position = position - searchString.length;
      var lastIndex = this.lastIndexOf(searchString);
      return lastIndex !== -1 && lastIndex === position;
    },
  });
}

const botBooter = async () => {
  Logs("", null, "Hello");

  // commandRegister();
  // interactionCreateEventInit(client);

  try {
    // API
    app.use(LoveListRoutes);

    app.get("/", (req, res) => {
      res.status(200).json({ message: "" });
    });

    // Route 404
    app.all(/(.*)/, (req, res) => {
      res.status(404).json({ message: "This route do not exist" });
    });

    app.listen(process.env.PORT, () => {
      Logs("", "start", `Started on port ${process.env.PORT}`);
    });

    try {
      Logs("", "start", "Start love service");

      cron.schedule("* * * * *", () => {
        sendLove(client);
      });

      client.user!.setPresence({
        activities: [
          {
            name: `J'envoie du love toute la journée`,
            type: ActivityType.Custom,
          },
        ],
      });
    } catch (err: any) {
      Logs("", "error", err);
    }
  } catch (err: any) {
    Logs("", "error", err);
  }
};

try {
  client.on("ready", () => {
    botBooter();
  });
  client.login(process.env.BOT_TOKEN);
} catch (err: any) {
  Logs("", "error", err);
}
