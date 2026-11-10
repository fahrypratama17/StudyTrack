import type { User} from "../../../features/auth/types/type";

export interface AuthMeResponseDto {
  user: User;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  user: User;
}