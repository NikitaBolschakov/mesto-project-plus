import { NextFunction, Request, Response } from "express";
import { RequestCastom } from "types";

export const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  const reqCustom = req as RequestCastom;
  reqCustom.user = {
    _id: '643f3a9b7a450c0a8ab3d762', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
}