export const JWT_CONFIG = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || "default_access_secret",
  refreshTokenSecret:
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "7d",
} as const;
