const { BOT_ID } = require("../config/secret.json");

const isBot = async (req, res, next) => {

    if(req.headers.botid === BOT_ID) {
        next();
    }
    else {
        res.status(403).json({ message: "Not authorized" });
    }
}

module.exports = isBot;