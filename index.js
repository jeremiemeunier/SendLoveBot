const { BOT_TOKEN, PORT, MONGODB_URL } = require('./config/secret.json');


// ##### API ##### \\

const express = require("express");
const app = express();
const RateLimit = require('express-rate-limit');
const cors = require("cors");
const mongoose = require("mongoose");

const limiter = RateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
})

app.use(limiter);
app.use(express.json());
app.use(cors());


// ##### BDD ##### \\

mongoose.connect(MONGODB_URL);


// ##### BOT SETUP ##### \\

const { logsEmiter, logsBooter } = require('./functions/logs');
const { version } = require('./package.json');
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// ##### EVENTS ##### \\
const { interactionCreateEventInit } = require('./events/interactionCreateEvent');
const { commandRegister } = require('./functions/commandsRegister');
const { sendLove } = require('./functions/sendLove');

// ##### FIX ##### \\

if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function (searchString, position) {
          position = position || this.length;
          position = position - searchString.length;
          var lastIndex = this.lastIndexOf(searchString);
          return lastIndex !== -1 && lastIndex === position;
      }
  });
}

// ##### APP ##### \\

const botBooter = async () => {

  logsBooter();
  logsEmiter(`Hello`);

  commandRegister();
  interactionCreateEventInit(client);

  try {
    // API
    const loveListRoute = require('./routes/love');

    app.use(loveListRoute);

    app.get("/", (req, res) => {
      res.status(200).json({ message: "Bienvenue sur le Backend de SnedLoveBot" });
    });

    // Route 404
    app.all("*", (req, res) => {
      res.status(404).json({ message: "This route do not exist" });
    });
    
    app.listen(PORT, () => {
      logsEmiter(`API Server : 🚀 | Started on port ${PORT}`);
    });

    try {
      logsEmiter('Start love service');
      sendLove(client);
    }
    catch(error) { logsEmiter(`Love Server : ⚠️  | An error occured : ${error}`); }
  }
  catch(error) { logsEmiter(`API Server : ⚠️  | An error occured on api : ${error}`); }
}

try {
  client.on('ready', () => { botBooter(); });
  client.login(BOT_TOKEN);
}
catch(error) { console.log(error); }