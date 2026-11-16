import { HttpError } from "./middleware/errors.js";

export function text(value: unknown, field: string, max: number, allowEmpty = false): string {
  if (typeof value !== "string" || value.length > max || (!allowEmpty && !value.trim())) {
    throw new HttpError(400, `${field} harus berupa teks${allowEmpty ? "" : " yang tidak kosong"} (maksimal ${max} karakter).`);
  }
  return value.trim();
}

export function positiveId(value: unknown): number {
  if ((typeof value !== "number" && typeof value !== "string") || !/^\d+$/.test(String(value))) {
    throw new HttpError(400, "ID harus berupa integer positif.");
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new HttpError(400, "ID harus berupa integer positif PostgreSQL.");
  }
  return id;
}

/** Input datetime-local lama diasumsikan WIB; input dengan Z/offset tetap dihormati. */
export function parseDeadline(value: unknown): string {
  const invalid = () => new HttpError(400, "Deadline harus datetime ISO yang valid, misalnya 2026-07-03T23:59:00+07:00.");
  if (typeof value !== "string") throw invalid();
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})?$/.exec(value);
  if (!match) throw invalid();
  const [, year, month, day, hour, minute, second, , zone] = match;
  const y = Number(year), m = Number(month), d = Number(day);
  const days = [31, y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > days[m - 1] ||
      Number(hour) > 23 || Number(minute) > 59 || Number(second || 0) > 59) throw invalid();
  if (zone && zone !== "Z" && (Number(zone.slice(1, 3)) > 14 ||
      Number(zone.slice(4)) > 59 || (Number(zone.slice(1, 3)) === 14 && Number(zone.slice(4)) !== 0))) throw invalid();
  const date = new Date(zone ? value : `${value}+07:00`);
  if (!Number.isFinite(date.getTime())) throw invalid();
  return date.toISOString();
}

export function password(value: unknown): string {
  if (typeof value !== "string" || value.length < 6 || Buffer.byteLength(value, "utf8") > 72) {
    throw new HttpError(400, "Password minimal 6 karakter dan maksimal 72 byte UTF-8.");
  }
  return value;
}

export function email(value: unknown): string {
  const result = text(value, "Email", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new HttpError(400, "Format email tidak valid.");
  return result;
}
