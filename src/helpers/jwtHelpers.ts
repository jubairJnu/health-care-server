import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};

const verifyToken = (token: string, sercet: Secret) => {
  return jwt.verify(token, sercet) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
