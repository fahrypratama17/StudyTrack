import { KeyRound, Save, UserRound } from "lucide-react";
import ProfileHeader from "../components/ProfileHeader";
import { useProfile } from "../hooks/useProfile";

const Profile = () => {
  const {
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
  } = useProfile();

  const inputClass =
    "text-primary-text w-full rounded-2xl border border-[#E3ECF1] bg-white px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10";

  const labelClass = "text-primary-text text-sm font-semibold";

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-primary-text text-3xl font-bold md:text-4xl">
          Profil Saya
        </h1>

        <p className="text-secondary-text mt-2">
          Kelola informasi pribadi dan keamanan akunmu.
        </p>
      </header>

      <ProfileHeader name={currentName} email={email} initials={initials} />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="bg-secondary-light flex h-12 w-12 items-center justify-center rounded-2xl">
              <UserRound size={23} className="text-secondary" />
            </div>

            <div>
              <h2 className="text-primary-text text-xl font-bold">
                Informasi Pribadi
              </h2>

              <p className="text-secondary-text mt-1 text-sm">
                Perbarui nama yang ditampilkan.
              </p>
            </div>
          </div>

          <form onSubmit={saveName} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-name" className={labelClass}>
                Nama Lengkap
              </label>

              <input
                id="profile-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="profile-email" className={labelClass}>
                Alamat Email
              </label>

              <input
                id="profile-email"
                type="email"
                value={email}
                readOnly
                className={`${inputClass} text-secondary-text bg-slate-50`}
              />

              <p className="text-secondary-text text-xs">
                Email tidak dapat diubah.
              </p>
            </div>

            {nameError && (
              <p role="alert" className="text-sm text-red-600">
                {nameError}
              </p>
            )}

            <div className="mt-3 border-t border-[#E3ECF1] pt-5">
              <button
                type="submit"
                disabled={nameSaving || name.trim() === currentName}
                className="bg-primary hover:bg-secondary flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {nameSaving ? "Menyimpan..." : "Simpan Nama"}
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-[#E3ECF1] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-7 flex items-center gap-3">
            <div className="bg-secondary-light flex h-12 w-12 items-center justify-center rounded-2xl">
              <KeyRound size={23} className="text-secondary" />
            </div>

            <div>
              <h2 className="text-primary-text text-xl font-bold">
                Ubah Password
              </h2>

              <p className="text-secondary-text mt-1 text-sm">
                Perbarui password untuk keamanan akun.
              </p>
            </div>
          </div>

          <form onSubmit={changePassword} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="current-password" className={labelClass}>
                Password Saat Ini
              </label>

              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan password lama"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="new-password" className={labelClass}>
                Password Baru
              </label>

              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirm-password" className={labelClass}>
                Konfirmasi Password Baru
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            {passwordError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {passwordError}
              </p>
            )}

            {passwordSuccess && (
              <p
                role="status"
                className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {passwordSuccess}
              </p>
            )}

            <div className="mt-3 border-t border-[#E3ECF1] pt-5">
              <button
                type="submit"
                disabled={passwordSaving}
                className="bg-primary hover:bg-secondary flex cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />
                {passwordSaving ? "Menyimpan..." : "Ubah Password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Profile;
