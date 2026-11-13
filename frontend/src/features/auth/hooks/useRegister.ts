import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

import { useAuth } from "../../../shared/hooks/useAuth";
import { registerAction } from "../../../shared/repository/auth/action";
import type { RegisterRequestDto } from "../../../shared/repository/auth/dto";

interface ApiErrorResponse {
  error?: string;
}

export const useRegister = () => {
  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (loading) return;

    setError("");

    const formData: RegisterRequestDto = {
      nama: nama.trim(),
      email: email.trim(),
      password,
    };

    if (!formData.nama || !formData.email) {
      setError("Nama dan email wajib diisi.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      const { token, user } = await registerAction(formData);

      login(token, user);

      navigate("/tasks", { replace: true });
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorResponse>(err)) {
        setError(err.response?.data?.error ?? "Gagal mendaftar.");
      } else {
        setError("Terjadi kesalahan saat mendaftar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    nama,
    setNama,
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
};
