import { inject, Injectable } from '@angular/core';
import { SQLiteService } from './sqlite.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { userUpgrades } from 'app/upgrades/user.upgrade.statements';

@Injectable()
export class DatabaseService {
    private sqliteService = inject(SQLiteService);
    private _db!: SQLiteDBConnection;

    get db(): SQLiteDBConnection {
        return this._db;
    }

    async initializeDatabase(dbName: string) {
        await this.sqliteService.addUpgradeStatement({
            database: dbName,
            upgrade: userUpgrades,
        });

        this._db = await this.sqliteService.openDatabase(
            dbName,
            false,
            'no-encryption',
            userUpgrades[userUpgrades.length - 1].toVersion,
            false,
        );
    }
}
