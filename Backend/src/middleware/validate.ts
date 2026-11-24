import type { RequestHandler } from "express";
import type { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { fail } from "../utils/http.js";

export const validate =
  (schema: z.ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success)
      return fail(
        res,
        StatusCodes.BAD_REQUEST,
        result.error.issues[0]?.message ?? "Données invalides",
      );
    req.body = result.data;
    next();
  };
