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
    res.status(500);
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
    logsEmiter(`API Server : ⚠️  | ${error}`);
    res.status(500);
  }
});

router.get("/love/user/list", isBot, async (req, res) => {
  const { user_id } = req.body;

  try {
    const getAllUserRegistre = await Love.find({ user_id: user_id });
    
    if(getAllUserRegistre.length > 0) {
      res.status(200).json({ data: getAllUserRegistre });
    }
    else { res.status(404); }
  }
  catch(error) {
    logsEmiter(`API Server : ⚠️  | ${error}`);
    res.status(500);
  }
});

router.delete("/love/remove/:id", isBot, async (req, res) => {
  const _id = id;
});

router.delete("/love/exit", isBot, async (req, res) => {
  const { user_id } = req.body;

  try {
    const removeAllSchedule = await Love.find({ user_id: user_id });

    if(removeAllSchedule.length > 0) {
      removeAllSchedule.map(async (item) => {
        const { _id } = item;
        await Love.findByIdAndDelete(_id);
      });

      res.status(200).json({ message: 'All things are good' });
    }
    else {
      res.status(200).json({ message: 'All things are good' });
    }
  }
  catch(error) {
    logsEmiter(`API Server : ⚠️  | ${error}`);
    res.status(500);
  }
});

module.exports = router;