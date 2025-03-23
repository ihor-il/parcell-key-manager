export interface OtpTokenModel {
    type: 'totp';
    algorithm: 'SHA1' | 'SHA256' | 'SHA512';
    secret: string;
    period: number;
    digits: number;

    label: string;
    account: string;
    issuer: string;
}

export interface OtpTokenListItem {
    id: string;
    issuer: string;
    account: string;
}

export type OtpTokenItem = OtpTokenModel & { id: string };
