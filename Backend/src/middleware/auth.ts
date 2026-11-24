import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User.js";
import { fail } from "../utils/http.js";
import { env } from "../config/env.js";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

interface AccessTokenPayload extends JwtPayload {
  id?: string;
  sub?: string;
  role?: string;
}

const getJwtSecret = (): string => env.JWT_SECRET;

export function signToken(userId: string): string {
  return jwt.sign({ id: userId }, getJwtSecret(), { expiresIn: "7d" });
}

export const auth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization ?? "";
    const [scheme, token] = authHeader.split(" ");

    if (!token || scheme?.toLowerCase() !== "bearer") {
      return fail(res, StatusCodes.UNAUTHORIZED, "Token manquant");
    }

    const payload = jwt.verify(token, getJwtSecret()) as AccessTokenPayload;
    const userId = payload.id ?? payload.sub;

    if (!userId) {
      return fail(res, StatusCodes.UNAUTHORIZED, "Token invalide");
    }

    const user = await User.findById(userId);
    if (!user || !user.active) {
      return fail(res, StatusCodes.UNAUTHORIZED, "Utilisateur introuvable");
    }

    req.user = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch {
    return fail(res, StatusCodes.UNAUTHORIZED, "Token invalide");
  }
};

export const requireRole = (...allowedRoles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return fail(res, StatusCodes.FORBIDDEN, "Accès refusé");
    }

    return next();
  };
};

export const CheckAuth = auth;

export const isAdmin: RequestHandler = (req, res, next) => {
  return requireRole("admin", "super_admin")(req, res, next);
};

export default auth;
