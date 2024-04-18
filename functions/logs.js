import { version } from "../package.json";
const tag = `lovelyBot[${version}] `;

export const logsEmiter = async (content) => {
  try {
    console.log(tag + content);
  } catch (error) {
    console.log(error);
  }
};
