"use client";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authModel } from "@/lib/models";
import { useLogin } from "@/lib/hooks/authHooks";
import { LoginRequest } from "@/lib/models/Auth";

export default function LoginPage() {
  // 1. Get the login mutation function and its state
  const { mutate: login, isPending, error } = useLogin();

  // 2. Set up the form with Zod for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest & { rememberMe?: boolean }>({
    resolver: zodResolver(authModel.LoginRequestSchema),
  });

  // 3. This function is called on successful form validation
  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <main className="form-container">
      <div className="form-wrapper">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Display general API errors */}
          {error && (
            <div className="form-error" role="alert">
              <strong>Error: </strong>
              {error.message ||
                "An unexpected error occurred. Please try again."}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="identity" className="form-label">
              Email
            </label>
            <input
              id="identity"
              type="email"
              {...register("identity")}
              className={`form-input ${
                errors.identity ? "form-input-error" : ""
              }`}
              placeholder="you@std.iyte.edu.tr"
              aria-invalid={errors.identity ? "true" : "false"}
            />
            {errors.identity && (
              <p className="form-error">{errors.identity.message}</p>
            )}
          </div>

          <div className="form-group mt-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`form-input ${
                errors.password ? "form-input-error" : ""
              }`}
              placeholder="Enter your password"
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
                className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot_password"
              className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400"
            >
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="form-button" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-600 hover:text-orange-700 dark:text-orange-400"
          >
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
