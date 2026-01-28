import { useFormatter } from "next-intl";

export function useFormatters() {
    const format = useFormatter();

    return {
        date: (date: Date) => format.dateTime(date, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        relativeTime: (date: Date) => format.relativeTime(date),
        number: (num: number) => format.number(num),
    };
}