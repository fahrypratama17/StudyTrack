import api, { TOKEN_KEY } from "../../../service/api";
import type {
  LoginRequestDto,
  LoginResponseDto, RegisterRequestDto, RegisterResponseDto
} from "./dto";

/** Mengirim kredensial login ke backend. */
export async function authenticate(
  credentials: LoginRequestDto
): Promise<LoginResponseDto> {
  const response = await api.post<LoginResponseDto>(
    "/auth/login",
    credentials
  );

  return response.data;
}

/** Menyimpan token setelah login berhasil. */
export function loginAction(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/** Menghapus token saat logout. */
export function logoutAction(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function registerAction(
  data: RegisterRequestDto
): Promise<RegisterResponseDto> {
  const response = await api.post<RegisterResponseDto>(
    "/auth/register",
    data
  );

  return response.data;
}