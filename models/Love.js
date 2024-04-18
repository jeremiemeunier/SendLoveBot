import { model } from "mongoose";

const love = model("Love", {
  hours: String,
  minutes: String,
  user_id: String,
});

export default love;
