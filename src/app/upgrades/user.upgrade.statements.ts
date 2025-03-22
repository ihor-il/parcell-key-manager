export class UserUpgradeStatements {
    userUpgrades = [
        {
            toVersion: 1,
            statements: [
                `CREATE TABLE IF NOT EXISTS passwords(id TEXT PRIMARY KEY, url TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL);`,
            ],
        },
    ];
}
