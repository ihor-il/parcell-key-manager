import { Observable, Subject } from 'rxjs';

export interface PageAction {
    icon: string;
    callback: () => void;
}

export abstract class Page {
    protected _actionsUpdated = new Subject<PageAction[]>();
    public get actionsUpdated$(): Observable<PageAction[]> {
        return this._actionsUpdated;
    }

    abstract get title(): string;
    abstract get actions(): PageAction[];
}
