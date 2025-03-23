export interface UserUpgradeStatement {
    toVersion: number;
    statements: string[];
}

export const userUpgrades: UserUpgradeStatement[] = [
    {
        toVersion: 1,
        statements: [
            `CREATE TABLE IF NOT EXISTS passwords(id TEXT PRIMARY KEY, url TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL);`,
        ],
    },
    {
        toVersion: 2,
        statements: [
            `CREATE TABLE IF NOT EXISTS totp_tokens(
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                algorithm TEXT NOT NULL,
                secret TEXT NOT NULL,
                period TINYINT NOT NULL,
                digits TINYINT NOT NULL,
                label TEXT NOT NULL,
                account TEXT NOT NULL,
                issuer TEXT NOT NULL
            );`,
        ],
    },
];
