import jwt from 'jsonwebtoken';

export interface TokenPayload extends jwt.JwtPayload {
  id: string;
  userName: string;
  role: string;
}
