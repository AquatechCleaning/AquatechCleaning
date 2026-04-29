declare module "jsonwebtoken" {
  export type Algorithm = "RS256";

  export function sign(
    payload: string | Buffer | object,
    secretOrPrivateKey: string,
    options?: { algorithm?: Algorithm }
  ): string;

  const jwt: {
    sign: typeof sign;
  };

  export default jwt;
}
