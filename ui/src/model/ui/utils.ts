import { format, parse, parseISO } from "date-fns";

export function sortByString<T>(list: T[], getter: (item: T) => string) {
  return list.sort((a, b) => (getter(a) > getter(b) ? 1 : getter(b) > getter(a) ? -1 : 0));
}

export function FormatDate(dateString: string, pattern?: string | undefined) {
  if (!pattern) {
    pattern = "PPPP";
  }
  return format(parseISO(dateString), pattern);
}

export function parseDate(dateString: string): Date {
  return parse(dateString, "yyyy-MM-dd", new Date());
}

export function parseIsoDate(dateString: string): Date {
    return parseISO(dateString);
  }
  
  