export interface OTPAuthModel {
    type: "totp" | "hotp";
    label: string;
    account?: string;
    secret: string;
    issuer?: string;
    algorithm?: "SHA1" | "SHA256" | "SHA512";
    digits?: number;
    period?: number;
    counter?: number;
  }
