import { Request } from "express";

export interface WindmillRequest extends Request {
  session?: string | boolean;
  user?: any;
}
