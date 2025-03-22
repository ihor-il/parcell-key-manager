import { Inject, Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { Toast } from '@capacitor/toast';
import { PasswordService } from './password.service';

@Injectable()
export class InitializeAppService {
    isAppInit: boolean = false;
    platform!: string;

    constructor(
        private sqliteService: SQLiteService,
        private passwordService: PasswordService
    ) {}

    async initializeApp() {
        await this.sqliteService.initializePlugin().then(async (ret) => {
            this.platform = this.sqliteService.platform;
            try {
                if (this.sqliteService.platform === 'web') {
                    await this.sqliteService.initWebStore();
                }
                const DB_MAIN = 'main_db';
                await this.passwordService.initializeDatabase(DB_MAIN);

                if (this.sqliteService.platform === 'web') {
                    await this.sqliteService.saveToStore(DB_MAIN);
                }

                this.isAppInit = true;
            } catch (error) {
                console.log(`initializeAppError: ${error}`);
                await Toast.show({
                    text: `initializeAppError: ${error}`,
                    duration: 'long',
                });
            }
        });
    }
}
