const { commandExitLove } = require('./interaction/command/commandExit');
const { commandSendLove } = require('./interaction/command/commandLove');

const interactionCreateEventInit = (clientItem) => {
    const client = clientItem;

    // Commands
    commandSendLove(client);
    commandExitLove(client);
}

module.exports = { interactionCreateEventInit }