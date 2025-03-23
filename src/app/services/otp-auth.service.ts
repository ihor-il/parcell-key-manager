import { inject, Injectable } from '@angular/core';
import {
    OtpTokenItem,
    OtpTokenListItem,
    OtpTokenModel,
} from 'app/model/otp-auth.model';
import { HmacSHA1, HmacSHA256, HmacSHA512 } from 'crypto-js';
import WordArray from 'crypto-js/lib-typedarrays';
import Hex from 'crypto-js/enc-hex';
import { DatabaseService } from './database.service';
import { ulid } from 'ulid';

@Injectable({ providedIn: 'root' })
export class OtpAuthService {
    private readonly _tableName = 'totp_tokens';
    private readonly _dbService = inject(DatabaseService);

    async getAuthTokens(): Promise<OtpTokenListItem[]> {
        const queryResult = await this._dbService.db.query(
            `
                SELECT id, issuer, account
                FROM ${this._tableName}
                ORDER BY label
            `,
        );
        return queryResult.values as OtpTokenListItem[];
    }

    async getAuthToken(id: string): Promise<OtpTokenItem | undefined> {
        const queryResult = await this._dbService.db.query(
            `SELECT * FROM ${this._tableName} WHERE id='${id}'`,
        );
        return queryResult.values?.at(0);
    }

    async getTokenExists(model: OtpTokenModel): Promise<boolean> {
        const queryResult = await this._dbService.db.query(
            `SELECT COUNT(*)as 'count' FROM ${this._tableName} WHERE label='${model.label}'`,
        );

        return queryResult.values?.at(0).count > 0;
    }

    async createAuthToken(model: OtpTokenModel): Promise<OtpTokenListItem> {
        const sql = `INSERT INTO ${this._tableName}
            (id, type, algorithm, secret, period, digits, label, account, issuer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        const id = ulid();
        await this._dbService.db.run(sql, [
            id,
            model.type,
            model.algorithm,
            model.secret,
            model.period,
            model.digits,
            model.label,
            model.account,
            model.issuer,
        ]);

        return (await this.getAuthToken(id))!;
    }

    async deleteAuthToken(id: string): Promise<boolean> {
        const sql = `DELETE FROM ${this._tableName} WHERE id='${id}'`;
        const queryResult = await this._dbService.db.run(sql);
        return (queryResult.changes?.changes || 0) > 0;
    }

    parseOtpAuthUrl(url: string): OtpTokenModel {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol !== 'otpauth:') {
                throw new Error(
                    "Неправильний протокол, очікується 'otpauth://'",
                );
            }

            const type = parsedUrl.host;
            if (type != 'totp') {
                throw new Error("Невідомий тип OTP (допустимі: 'totp')");
            }

            const label = decodeURIComponent(parsedUrl.pathname.slice(1));
            const [issuerFromLabel, account] = label.includes(':')
                ? label.split(':')
                : ['', label];

            const params = new URLSearchParams(parsedUrl.search);
            const secret = params.get('secret');
            if (!secret) {
                throw new Error("Secret (ключ) є обов'язковим параметром");
            }

            return {
                type,
                label,
                account,
                secret,
                issuer: params.get('issuer') || issuerFromLabel,
                algorithm:
                    (params.get('algorithm') as 'SHA1' | 'SHA256' | 'SHA512') ||
                    'SHA1',
                digits: parseInt(params.get('digits') || '6', 10),
                period: parseInt(params.get('period') || '30', 10),
            };
        } catch (error: any) {
            throw new Error('Помилка парсингу otpauth URL: ' + error.message);
        }
    }

    generateOtpCode(
        model: Omit<OtpTokenModel, 'label' | 'account' | 'issuer'>,
    ): string {
        const keyBytes = this._base32ToBytes(model.secret);
        const keyArray = WordArray.create(Uint8Array.from(keyBytes));

        let time = this.getTime(model);
        const timeBuffer = new Uint8Array(8);
        for (let i = 7; i >= 0; i--) {
            timeBuffer[i] = time & 0xff;
            time >>= 8;
        }

        let hmacHelper;
        switch (model.algorithm) {
            case 'SHA1':
                hmacHelper = HmacSHA1;
                break;
            case 'SHA256':
                hmacHelper = HmacSHA256;
                break;
            case 'SHA512':
                hmacHelper = HmacSHA512;
                break;
        }

        const timeWordArray = WordArray.create(timeBuffer);
        const hmacArray = hmacHelper(timeWordArray, keyArray);

        // Convert WordArray to byte array properly
        const hmacBytes = Hex.parse(hmacArray.toString(Hex));

        const hmac = Array.from(
            Uint8Array.from(
                hmacBytes.words
                    .map((word) => [
                        (word >> 24) & 0xff,
                        (word >> 16) & 0xff,
                        (word >> 8) & 0xff,
                        word & 0xff,
                    ])
                    .flat(),
            ),
        );

        const offset = hmac[hmac.length - 1] & 0x0f;
        const binary =
            ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff);

        const otp = (binary % 10 ** model.digits)
            .toString()
            .padStart(model.digits, '0');

        return otp;
    }

    getTime(model: { period: number }) {
        return Math.floor(Date.now() / 1000 / model.period);
    }

    private _base32ToBytes(base32: string): number[] {
        const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        let bytes: number[] = [];

        for (let i = 0; i < base32.length; i++) {
            const val = base32Chars.indexOf(base32[i].toUpperCase());
            if (val === -1) continue;
            bits += val.toString(2).padStart(5, '0');
        }

        for (let j = 0; j + 8 <= bits.length; j += 8) {
            bytes.push(parseInt(bits.substring(j, j + 8), 2));
        }

        return bytes;
    }
}
