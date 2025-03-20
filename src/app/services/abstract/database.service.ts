import { InjectionToken } from "@angular/core";

export const DATABASE_SERVICE = new InjectionToken('DATABASE_SERVICE');
export interface IDatabaseService {
    initializeDatabase(dbName: string): Promise<void>;
}
