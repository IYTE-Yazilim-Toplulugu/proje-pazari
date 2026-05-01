"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { authModel } from "@/lib/models";
import { useLogin } from "@/lib/hooks/authHooks";
import { LoginRequest } from "@/lib/models/Auth";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const { mutate: login, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest & { rememberMe?: boolean }>({
    resolver: zodResolver(authModel.LoginRequestSchema),
  });

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <main className="form-container">
      <div className="form-wrapper">
        <h2 className="form-title">{t("title")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Display general API errors */}
          {error && (
            <div className="form-error" role="alert">
              <strong>Error: </strong>
              {error.message || t("errors.generic")}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              {t("email")}
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`form-input ${
                errors.email ? "form-input-error" : ""
              }`}
              placeholder={t("placeholders.email")}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password" className="form-label">
              {t("password")}
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`form-input ${
                errors.password ? "form-input-error" : ""
              }`}
              placeholder={t("placeholders.password")}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && (
              <p className="form-error">{errors.password.message}</p>
            )}
          </div>

          <div
            className="flex items-center justify-between
          mt-3 mb-4"
          >
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="mr-2 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {t("rememberMe")}
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <button type="submit" className="form-button" disabled={isPending}>
            {isPending ? t("submitting") : t("submit")}
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]"
          >
            {t("registerLink")}
          </Link>
        </p>
      </div>
    </main>
  );
}
