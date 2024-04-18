// ##### API ##### \\

import express, { json } from "express";
const app = express();
import RateLimit from "express-rate-limit";
import cors from "cors";
import { connect } from "mongoose";

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(json());
app.use(cors());

// ##### BDD ##### \\

connect(process.env.MONGODB_URL);

// ##### BOT SETUP ##### \\

import { logsEmiter, logsBooter } from "./functions/logs";
import { Client, GatewayIntentBits, Partials, ActivityType } from "discord.js";
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ##### EVENTS ##### \\
import { interactionCreateEventInit } from "./events/interactionCreateEvent";
import { commandRegister } from "./functions/commandsRegister";
import { sendLove } from "./functions/sendLove";

// ##### FIX ##### \\

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, "endsWith", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function (searchString, position) {
      position = position || this.length;
      position = position - searchString.length;
      var lastIndex = this.lastIndexOf(searchString);
      return lastIndex !== -1 && lastIndex === position;
    },
  });
}

// ##### APP ##### \\

export const botBooter = async () => {
  logsEmiter(`Hello`);

  commandRegister();
  interactionCreateEventInit(client);

  try {
    // API
    const loveListRoute = require("./routes/love").default;

    app.use(loveListRoute);

    app.get("/", (req, res) => {
      res
        .status(200)
        .json({ message: "Bienvenue sur le Backend de SnedLoveBot" });
    });

    // Route 404
    app.all("*", (req, res) => {
      res.status(404).json({ message: "This route do not exist" });
    });

    app.listen(process.env.PORT, () => {
      logsEmiter(`API Server : 🚀 | Started on port ${process.env.PORT}`);
    });

    try {
      logsEmiter("Start love service");
      sendLove(client);

      client.user.setPresence({
        activities: [
          {
            name: `J'envoie du love toute la journée`,
            type: ActivityType.Custom,
          },
        ],
      });
    } catch (error) {
      logsEmiter(`Love Server : ⚠️  | An error occured : ${error}`);
    }
  } catch (error) {
    logsEmiter(`API Server : ⚠️  | An error occured on api : ${error}`);
  }
};

try {
  client.on("ready", () => {
    botBooter();
  });
  client.login(process.env.BOT_TOKEN);
} catch (error) {
  console.log(error);
}
