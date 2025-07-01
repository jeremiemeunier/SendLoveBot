import isBot from "@/middlewares/MiddlewareIsBot";
import { WindmillRequest } from "@/types/Request.type";
import { Logs } from "@libs/Logs";
import Love from "@models/Love.model";
import { Response, Router } from "express";

const routes = Router();

routes.get("/love/list", isBot, async (req: WindmillRequest, res: Response) => {
  const { hours, minutes } = req.query;

  try {
    const query = await Love.find({ hours: hours, minutes: minutes });

    if (query.length > 0) {
      res.status(200).json(query);
    } else res.status(404).json({ message: "No love found" });
  } catch (err: any) {
    Logs("", "error", err);
    res.status(500).json({ message: "An error occured" });
  }
});

routes.get(
  "/love/user/list",
  isBot,
  async (req: WindmillRequest, res: Response) => {
    const { user } = req.query;

    try {
      const query = await Love.find({ user_id: user });

      if (query.length > 0) {
        res.status(200).json(query);
      } else res.status(404).json({ message: "No love found" });
    } catch (err: any) {
      Logs("", "error", err);
      res.status(500).json({ message: "An error occured" });
    }
  }
);

routes.post("/love/add", isBot, async (req: WindmillRequest, res: Response) => {
  const { hours, minutes, user_id } = req.body;

  try {
    const query = new Love({
      hours: hours,
      minutes: minutes,
      user_id: user_id,
    });
    await query.save();

    res.status(200).json(query);
  } catch (err: any) {
    Logs("", "error", err);
    res.status(500).json({ message: "An error occured" });
  }
});

routes.delete(
  "/love/exit",
  isBot,
  async (req: WindmillRequest, res: Response) => {
    const { user } = req.query;

    try {
      const query = await Love.find({ user_id: user });

      if (query.length > 0) {
        query.map(async (i) => {
          const { _id } = i;
          await Love.findByIdAndDelete(_id);
        });
      }

      res.status(200).json({ message: "All love exited" });
    } catch (err: any) {
      Logs("", "error", err);
      res.status(500).json({ message: "An error occured" });
    }
  }
);

export default routes;
