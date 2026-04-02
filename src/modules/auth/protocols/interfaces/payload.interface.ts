export interface PayloadInterface {
  user: { name: string; email: string };
  sub: number;
  iat: number;
  exp: number;
}
