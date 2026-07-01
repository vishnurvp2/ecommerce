export interface User {
  _id?: string;
  email: string;
  password: string;
  name?: string;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  refreshToken?: string; // hashed version (optional)
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
