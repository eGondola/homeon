export function addDays(date: Date, days: number) {
    const copy = new Date(date);
    copy.setDate(date.getDate() + days);
    return copy;
}
