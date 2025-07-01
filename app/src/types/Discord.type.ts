import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

export interface CommandModule {
  data: RESTPostAPIApplicationCommandsJSONBody;
  [key: string]: any;
}
