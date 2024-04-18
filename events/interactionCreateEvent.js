import { commandExitLove } from "./interaction/command/commandExit";
import { commandSendLove } from "./interaction/command/commandLove";
import { commandListLove } from "./interaction/command/commandList";

export const interactionCreateEventInit = (client) => {
  // Commands
  commandSendLove(client);
  commandExitLove(client);
  commandListLove(client);
};
