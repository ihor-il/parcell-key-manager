import { inject, Inject, Injectable } from '@angular/core';

import { SQLiteService } from './sqlite.service';
import { Toast } from '@capacitor/toast';
import { PasswordService } from './password.service';
import { DatabaseService } from './database.service';

@Injectable()
export class InitializeAppService {
    private readonly dbService = inject(DatabaseService);
    private readonly sqliteService = inject(SQLiteService);

    isAppInit: boolean = false;

    async initializeApp() {
        await this.sqliteService.initializePlugin().then(async () => {
            try {
                if (this.sqliteService.platform === 'web') {
                    await this.sqliteService.initWebStore();
                }
                const DB_MAIN = 'main_db';
                await this.dbService.initializeDatabase(DB_MAIN);

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
