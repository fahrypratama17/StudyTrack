import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";

import api from "../../../service/api";
import { useAuth } from "../../../shared/hooks/useAuth";

interface ProfileUser {
  id: string | number;
  nama: string;
  email: string;
}

interface UpdateProfileResponse {
  user: ProfileUser;
  token: string;
}

interface ApiErrorResponse {
  error?: string;
}

function getErrorMessage(error: unknown): string {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.error ?? "Terjadi kesalahan. Silakan coba lagi."
    );
  }

  return "Terjadi kesalahan. Silakan coba lagi.";
}

export function useProfile() {
  const { user } = useAuth();

  const account = user as {
    nama?: string;
    name?: string;
    email?: string;
  } | null;

  const currentName = account?.nama ?? account?.name ?? "";
  const email = account?.email ?? "";

  const [name, setName] = useState(currentName);
  const [nameSaving, setNameSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const initials = currentName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  const saveName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (nameSaving) return;

    setNameError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      setNameError("Nama harus terdiri dari 2–100 karakter.");
      return;
    }

    if (trimmedName === currentName) {
      return;
    }

    setNameSaving(true);

    try {
      const response = await api.patch<UpdateProfileResponse>("/auth/profile", {
        nama: trimmedName,
      });

      localStorage.setItem("studytrack_token", response.data.token);

      window.location.reload();
    } catch (error: unknown) {
      setNameError(getErrorMessage(error));
    } finally {
      setNameSaving(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordSaving) return;

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword) {
      setPasswordError("Password lama wajib diisi.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password tidak cocok.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError("Password baru harus berbeda dari password lama.");
      return;
    }

    setPasswordSaving(true);

    try {
      await api.patch("/auth/password", {
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess("Password berhasil diperbarui.");
    } catch (error: unknown) {
      setPasswordError(getErrorMessage(error));
    } finally {
      setPasswordSaving(false);
    }
  };

  return {
    currentName,
    email,
    initials,

    name,
    setName,
    nameSaving,
    nameError,
    saveName,

    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordSaving,
    passwordError,
    passwordSuccess,
    changePassword,
  };
}
