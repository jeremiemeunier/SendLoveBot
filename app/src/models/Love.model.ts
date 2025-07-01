import { LoveModelTypes } from "@/types/Model.type";
import pkg from "mongoose";

const { Schema, model, models } = pkg;

const schema = new Schema<LoveModelTypes>({
  hours: String,
  minutes: String,
  user_id: String,
});

export default models.Love || model("Love", schema);
