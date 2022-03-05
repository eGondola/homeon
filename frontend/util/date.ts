export function addDays(date: Date, days: number) {
    const copy = new Date(date);
    copy.setDate(date.getDate() + days);
    return copy;
}

export function getFractionOfDayPassed(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return (hours + minutes / 60) / 24;
}

export function getMonday(date: Date) {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDay() == 0
            ? date.getDate() - 6
            : date.getDate() - date.getDay() + 1
    );
}

export function isSameDate(first: Date, second: Date) {
    return (
        first.getFullYear() == second.getFullYear() &&
        first.getMonth() == second.getMonth() &&
        first.getDate() == second.getDate()
    );
}