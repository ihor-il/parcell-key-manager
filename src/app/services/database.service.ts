import { inject, Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { UserUpgradeStatements } from 'app/upgrades/user.upgrade.statements';

@Injectable()
export class DatabaseService {
    private sqliteService = inject(SQLiteService);
    private _db!: SQLiteDBConnection;

    private readonly uUpdStmts: UserUpgradeStatements =
        new UserUpgradeStatements();
    private readonly versionUpgrades = this.uUpdStmts.userUpgrades;
    private readonly loadToVersion =
        this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;

    get db(): SQLiteDBConnection {
        return this._db;
    }

    async initializeDatabase(dbName: string) {
        await this.sqliteService.addUpgradeStatement({
            database: dbName,
            upgrade: this.versionUpgrades,
        });

        this._db = await this.sqliteService.openDatabase(
            dbName,
            false,
            'no-encryption',
            this.loadToVersion,
            false,
        );
    }
}
