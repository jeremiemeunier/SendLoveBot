const express = require("express");
const router = express.Router();
const Love = require("../models/Love");
const isBot = require("../middlewares/isBot");
const { logsEmiter } = require('../functions/logs');

router.post("/love/add", isBot, async (req, res) => {
  const { hours, minutes, user_id } = req.body;

  try {
    const newLove = new Love({
      hours: hours,
      minutes: minutes,
      user_id: user_id
    })
    await newLove.save();

    res.status(200).json({ message: 'Add user to love list' });
    logsEmiter(`API Server : 🟢 | New love list user`);
  }
  catch(error) {
    logsEmiter(`API Server : ⚠️  | ${error}`);
  }
});

router.get("/love/list", isBot, async (req, res) => {
  const { hours, minutes } = req.body;

  try {
    const allLoveUser = await Love.find({ hours: hours, minutes: minutes });

    if(allLoveUser.length > 0) {
      res.status(200).json({ data: allLoveUser });
    }
    else { res.status(404); }
  }
  catch(error) {
    logsEmiter(error);
  }
});

router.delete("/love/exit", isBot, async (req, res) => {

});

module.exports = router;