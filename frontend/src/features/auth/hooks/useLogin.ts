import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { useAuth } from "../../../shared/hooks/useAuth";
import { authenticate } from "../../../shared/repository/auth/action";
import type { LoginRequestDto } from "../../../shared/repository/auth/dto";

interface ApiErrorResponse {
  error?: string;
}

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const credentials: LoginRequestDto = {
      email,
      password,
    };

    try {
      const { token, user } = await authenticate(credentials);

      login(token, user);
      navigate("/tasks", { replace: true });
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.error ?? "Gagal login.");
      } else {
        setError("Terjadi kesalahan saat login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
};
