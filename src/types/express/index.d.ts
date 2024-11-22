export {};

declare global {
  namespace Express {
    interface Locals {
      user: {
        userID: number;
        email: string;
      } | null;
    }
  }
}
