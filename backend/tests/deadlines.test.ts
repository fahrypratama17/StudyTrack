import { test } from "node:test";
import assert from "node:assert/strict";
import { DAY_MS, deadlineCategory, presentTask, sortTasks } from "../services/deadlines.js";
import { parseDeadline } from "../validation.js";
import type { Task } from "../types.js";

const now = new Date("2026-07-02T12:00:00+07:00");
const task = (id: number, deadline: string, status: Task["status"] = "belum") => ({
  id, deadline: parseDeadline(deadline), status, user_id: 1, mata_kuliah_id: id,
  judul: `Tugas ${id}`, deskripsi: "", created_at: `2026-06-${String(14 + id).padStart(2, "0")}T00:00:00.000Z`,
  mata_kuliah: `Mata kuliah ${id}`,
});

for (const [name, delta, expected] of [
  ["kurang dari 24 jam", DAY_MS - 1, "mendekati_deadline"],
  ["tepat 24 jam", DAY_MS, "normal"],
  ["lebih dari 24 jam", DAY_MS + 1, "normal"],
  ["1 ms sebelum deadline", 1, "mendekati_deadline"],
  ["tepat deadline", 0, "overdue"],
  ["1 ms setelah deadline", -1, "overdue"],
] as const) {
  test(name, () => {
    assert.equal(deadlineCategory({ deadline: new Date(now.getTime() + delta).toISOString(), status: "belum" }, now), expected);
  });
}

test("tugas selesai tidak diberi peringatan, meskipun overdue atau dekat", () => {
  for (const delta of [-DAY_MS, 1000]) {
    assert.equal(deadlineCategory({ deadline: new Date(now.getTime() + delta).toISOString(), status: "selesai" }, now), "normal");
  }
});

test("data soal pada 2 Juli 12:00 WIB: BSTMap overdue, lainnya normal", () => {
  const tasks = [task(1, "2026-07-03T23:59"), task(2, "2026-07-02T10:00"), task(3, "2026-07-06T23:59")];
  assert.deepEqual(tasks.map((item) => deadlineCategory(item, now)), ["normal", "overdue", "normal"]);
  assert.deepEqual(sortTasks(tasks.map((item) => presentTask(item, now))).map((item) => item.id), [2, 3, 1]);
});

test("data soal pada 3 Juli 12:00 WIB: Lab 4 teratas, lalu overdue", () => {
  const time = new Date("2026-07-03T12:00:00+07:00");
  const tasks = [task(1, "2026-07-03T23:59"), task(2, "2026-07-02T10:00"), task(3, "2026-07-06T23:59")];
  const sorted = sortTasks(tasks.map((item) => presentTask(item, time)));
  assert.deepEqual(sorted.map((item) => [item.id, item.deadline_category]), [[1, "mendekati_deadline"], [2, "overdue"], [3, "normal"]]);
});

test("pengurutan kategori, deadline, created_at dan ID deterministik", () => {
  const items = [
    task(1, "2026-07-02T20:00"), task(2, "2026-07-02T14:00"),
    task(3, "2026-07-01T00:00"), task(4, "2026-07-02T01:00"),
    task(5, "2026-07-10T00:00"), task(6, "2026-07-11T00:00"),
  ].map((item) => presentTask(item, now));
  assert.deepEqual(sortTasks(items).map((item) => item.id), [2, 1, 3, 4, 6, 5]);
  const tie = { ...items[0], created_at: items[0].created_at, id: 7 };
  assert.deepEqual(sortTasks([items[0], tie]).map((item) => item.id), [7, 1]);
});

test("zona waktu setara menghasilkan waktu dan kategori yang sama", () => {
  assert.equal(parseDeadline("2026-07-03T23:59"), "2026-07-03T16:59:00.000Z");
  assert.equal(parseDeadline("2026-07-03T23:59:00+07:00"), parseDeadline("2026-07-03T16:59:00Z"));
  assert.equal(parseDeadline("2028-02-29T00:00Z"), "2028-02-29T00:00:00.000Z");
});

test("tanggal mustahil, tipe salah, dan offset tidak valid ditolak", () => {
  for (const value of ["", "invalid", "2026-02-29T10:00", "2026-02-30T10:00Z", "2026-04-31T10:00", "2026-07-02T24:00", "2026-07-02T12:00+14:01", null, {}, 123]) {
    assert.throws(() => parseDeadline(value));
  }
});
