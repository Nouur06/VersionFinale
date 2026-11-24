import type { RequestParamHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { fail } from "../utils/http.js";

// À brancher avec router.param("id", checkId) : refuse les ids Mongo invalides (400 au lieu de 500)
export const checkId: RequestParamHandler = (_req, res, next, value) => {
  if (!/^[0-9a-fA-F]{24}$/.test(String(value))) return fail(res, StatusCodes.BAD_REQUEST, "Identifiant invalide");
  next();
};
