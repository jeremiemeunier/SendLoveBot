const { commandExitLove } = require('./interaction/command/commandExit');
const { commandSendLove } = require('./interaction/command/commandLove');
const { commandListLove } = require('./interaction/command/commandList');

const interactionCreateEventInit = (clientItem) => {
    const client = clientItem;

    // Commands
    commandSendLove(client);
    commandExitLove(client);
    commandListLove(client);
}

module.exports = { interactionCreateEventInit }