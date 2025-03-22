import { Injectable, inject } from '@angular/core';
import {
    PasswordCreateModel,
    PasswordListItem,
    PasswordModel,
} from 'app/model/password.model';
import { ulid } from 'ulid';
import { DatabaseService } from './database.service';

@Injectable()
export class PasswordService {
    private dbService = inject(DatabaseService);

    async getPasswords(): Promise<PasswordListItem[]> {
        const queryResult = await this.dbService.db.query(
            'SELECT id, url, username FROM passwords',
        );
        return queryResult.values as PasswordListItem[];
    }

    async getPassword(id: string): Promise<PasswordModel | undefined> {
        const queryResult = await this.dbService.db.query(
            `SELECT * FROM passwords WHERE id='${id}'`,
        );
        return queryResult.values?.at(0);
    }

    async createPassword(model: PasswordCreateModel): Promise<PasswordModel> {
        const sql = `INSERT INTO passwords (id, url, username, password) VALUES (?, ?, ?, ?);`;
        const id = ulid();
        await this.dbService.db.run(sql, [id, model.url, model.username, model.password]);

        return (await this.getPassword(id))!;
    }

    async updatePassword(model: PasswordModel) {
        const sql = `
            UPDATE passwords
            SET url=${model.url}, username=${model.username}, password=${model.password}
            WHERE id=${model.id}
        `;

        await this.dbService.db.run(sql);
        return (await this.getPassword(model.id))!;
    }

    async deletePassword(id: string) {
        const sql = `DELETE FROM passwords WHERE id='${id}'`;
        const queryResult = await this.dbService.db.run(sql);
        return (queryResult.changes?.changes || 0) > 0;
    }
}
