import api from "../../../service/api";
import type { AuthMeResponseDto } from "./dto";
import type { User } from "../../../features/auth/types/type";

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<AuthMeResponseDto>("/auth/me");

  return response.data.user;
}
