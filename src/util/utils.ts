export function unique<T>(list?: T[]): T[] {
    const uniqueList = new Set(list);
    return [...uniqueList];
}
