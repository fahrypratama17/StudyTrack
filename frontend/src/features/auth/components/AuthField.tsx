import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon: LucideIcon;
  error?: string;
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  (
    { id, label, icon: Icon, type = "text", error, className = "", ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex w-full flex-col gap-2">
        <label htmlFor={id} className="text-primary-text text-sm font-semibold">
          {label}
        </label>

        <div
          className={`focus-within:ring-primary/10 flex items-center gap-3 rounded-xl border bg-white px-4 transition-all duration-200 focus-within:ring-2 ${
            error
              ? "border-red-400 focus-within:border-red-400"
              : "focus-within:border-primary border-slate-200"
          }`}
        >
          <Icon size={20} className="text-secondary-text shrink-0" />

          <input
            {...props}
            ref={ref}
            id={id}
            type={inputType}
            className={`text-primary-text min-w-0 flex-1 bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-400 ${className}`}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-secondary-text hover:text-primary shrink-0 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

AuthField.displayName = "AuthField";

export default AuthField;
