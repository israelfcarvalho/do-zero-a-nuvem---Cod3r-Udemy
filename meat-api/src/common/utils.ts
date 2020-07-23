import { HookNextFunction } from "mongoose";
import bcrypt from "bcrypt";

import { environment } from "./environment";

export function toNumber(value: string) {
  return value.replace(/[^0-9a-zA-Z]+/g, "");
}

export function hashPassword(
  obj: { password: string },
  next: HookNextFunction
) {
  return bcrypt
    .hash(obj.password, parseInt(environment.security.saltRounds))
    .then((hashedPass) => {
      obj.password = hashedPass;
      next();
    })
    .catch(next);
}
