const isBot = async (req, res, next) => {
  if (req.headers.botid === process.env.BOT_ID) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

export default isBot;
