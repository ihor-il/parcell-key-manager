import { Dictionary } from './type.helpers';

export function groupByKey<T extends object>(
    array: T[],
    key: string
): Dictionary<T> {
    return array.reduce((result, item) => {
        const hasKey = Object.hasOwn(item, key);
        if (!hasKey) {
            return result;
        }

        const keyValue = (item as any)[key];
        if (typeof keyValue !== 'string') {
            return result;
        }

        (result[keyValue] ??= []).push(item);
        return result;
    }, {} as Dictionary<T>);
}

export function groupByFn<T extends object>(
    array: Array<T>,
    keyFn: (item: T) => string
): Dictionary<T> {
    return array.reduce((result, item) => {
        (result[keyFn(item)] ??= []).push(item);
        return result;
    }, {} as Dictionary<T>);
}
