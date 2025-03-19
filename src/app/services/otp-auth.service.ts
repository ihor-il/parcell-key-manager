import { Injectable } from '@angular/core';
import { OTPAuthModel } from 'app/model/otp-auth.model';

@Injectable({ providedIn: 'root' })
export class OtpAuthService {
    parseOtpAuthUrl(url: string): OTPAuthModel {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.protocol !== 'otpauth:') {
                throw new Error(
                    "Неправильний протокол, очікується 'otpauth://'",
                );
            }

            const type = parsedUrl.host as 'totp' | 'hotp';
            if (!['totp', 'hotp'].includes(type)) {
                throw new Error(
                    "Невідомий тип OTP (допустимі: 'totp', 'hotp')",
                );
            }

            const label = decodeURIComponent(parsedUrl.pathname.slice(1));
            const [issuerFromLabel, account] = label.includes(':')
                ? label.split(':')
                : [undefined, label];

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
                counter:
                    type === 'hotp'
                        ? parseInt(params.get('counter') || '0', 10)
                        : undefined,
            };
        } catch (error: any) {
            throw new Error('Помилка парсингу otpauth URL: ' + error.message);
        }
    }
}
