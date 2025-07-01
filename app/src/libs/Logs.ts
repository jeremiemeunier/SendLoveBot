const composeTime: () => string = () => {
  const now = new Date();

  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const miliseconds = now.getMilliseconds().toString().padStart(3, "0");

  return `[${day}/${month}/${year}][${hours}:${minutes}:${seconds}.${miliseconds}]`;
};

const composeState: (
  data: "error" | "success" | "warning" | "start" | "sql" | null
) => string = (
  data: "error" | "success" | "warning" | "start" | "sql" | null
) => {
  switch (data) {
    case "error":
      return "[\x1b[41m ERROR \x1b[0m]";
    case "success":
      return "[\x1b[32mSUCCESS\x1b[0m]";
    case "warning":
      return "[\x1b[33mWARNING\x1b[0m]";
    case "start":
      return "[\x1b[47m START \x1b[0m]";
    default:
      return "[\x1b[34m INFOS \x1b[0m]";
  }
};

export const Logs: (
  node: string,
  state: "error" | "success" | "warning" | "start" | "sql" | null,
  content: string | {},
  details?: string
) => void = (
  node: string,
  state: "error" | "success" | "warning" | "start" | "sql" | null,
  content: string | {},
  details?: string
) => {
  if (state === "sql") {
    if (node === "cron") {
      process.env.LOG_SQL === "1" &&
        console.log(
          `${composeTime()}[ \x1b[43m SQL \x1b[0m \x1b[42m CRON \x1b[0m ] » \x1b[33m${content
            .toString()
            .replace("Executing (default): ", "")}\x1b[0m`
        );
    } else {
      process.env.LOG_SQL === "1" &&
        console.log(
          `${composeTime()}[ \x1b[43m SQL \x1b[0m ] » \x1b[33m${content
            .toString()
            .replace("Executing (default): ", "")}\x1b[0m`
        );
    }
  } else {
    details
      ? console.log(
          `${composeTime()}[${node.padEnd(24, ".")}]${composeState(
            state
          )}(${details}) » ${
            typeof content === "string" ? content : JSON.stringify(content)
          }`
        )
      : console.log(
          `${composeTime()}[${node.padEnd(24, ".")}]${composeState(state)} » ${
            typeof content === "string" ? content : JSON.stringify(content)
          }`
        );
  }
};
