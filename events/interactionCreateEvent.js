const { commandSendLove } = require('./interaction/command/commandLove');

const interactionCreateEventInit = (clientItem) => {
    const client = clientItem;

    // Commands
    commandSendLove(client);
}

module.exports = { interactionCreateEventInit }