import type { Response } from "express";

export const fail = (res: Response, code: number, error: string): void => {
  res.status(code).json({ error });
};

export const pub = (u: {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  phone: u.phone ?? "",
});
