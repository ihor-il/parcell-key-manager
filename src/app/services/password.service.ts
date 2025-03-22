import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import {
    PasswordCreateModel,
    PasswordListItem,
    PasswordModel,
} from 'app/model/password.model';
import { ulid } from 'ulid';
import { UserUpgradeStatements } from '../upgrades/user.upgrade.statements';
import { DbnameVersionService } from './dbname-version.service';
import { SQLiteService } from './sqlite.service';

@Injectable()
export class PasswordService {
    private databaseName: string = '';
    private uUpdStmts: UserUpgradeStatements = new UserUpgradeStatements();
    private versionUpgrades;
    private loadToVersion;
    private db!: SQLiteDBConnection;

    constructor(
        private sqliteService: SQLiteService,
        private dbVerService: DbnameVersionService,
    ) {
        this.versionUpgrades = this.uUpdStmts.userUpgrades;
        this.loadToVersion =
            this.versionUpgrades[this.versionUpgrades.length - 1].toVersion;
    }

    async initializeDatabase(dbName: string) {
        this.databaseName = dbName;

        await this.sqliteService.addUpgradeStatement({
            database: this.databaseName,
            upgrade: this.versionUpgrades,
        });

        this.db = await this.sqliteService.openDatabase(
            this.databaseName,
            true,
            'encryption',
            this.loadToVersion,
            false,
        );
        this.dbVerService.set(this.databaseName, this.loadToVersion);
    }

    async getPasswords(): Promise<PasswordListItem[]> {
        const queryResult = await this.db.query(
            'SELECT id, url, username FROM passwords',
        );
        return queryResult.values as PasswordListItem[];
    }

    async getPassword(id: string): Promise<PasswordModel | undefined> {
        const queryResult = await this.db.query(
            `SELECT * FROM passwords WHERE id='${id}'`,
        );
        return queryResult.values?.at(0);
    }

    async createPassword(model: PasswordCreateModel): Promise<PasswordModel> {
        const sql = `INSERT INTO passwords (id, url, username, password) VALUES (?, ?, ?, ?);`;
        const id = ulid();
        await this.db.run(sql, [id, model.url, model.username, model.password]);

        return (await this.getPassword(id))!;
    }

    async updatePassword(model: PasswordModel) {
        const sql = `
            UPDATE passwords
            SET url=${model.url}, username=${model.username}, password=${model.password}
            WHERE id=${model.id}
        `;

        await this.db.run(sql);
        return (await this.getPassword(model.id))!;
    }

    async deletePassword(id: string) {
        const sql = `DELETE FROM passwords WHERE id='${id}'`;
        const queryResult = await this.db.run(sql);
        return (queryResult.changes?.changes || 0) > 0;
    }
}
