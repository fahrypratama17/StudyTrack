import { TOKEN_KEY } from "../../../service/api";

/** Menyimpan token setelah login berhasil. */
export function loginAction(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Menghapus sesi pengguna. */
export function logoutAction(): void {
  localStorage.removeItem(TOKEN_KEY);
}