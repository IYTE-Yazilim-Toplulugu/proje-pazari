import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../page";

// Mock the useLogin hook
jest.mock("@/lib/hooks/authHooks", () => ({
  useLogin: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

const { useLogin } = require("@/lib/hooks/authHooks");

describe("LoginPage", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const renderLoginPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <LoginPage />
      </QueryClientProvider>
    );
  };

  describe("Form Validation", () => {
    it("should render login form with all fields", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /login/i })
      ).toBeInTheDocument();
    });

    it.skip("should show validation errors for empty fields", async () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const submitButton = screen.getByRole("button", { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/required/i)).toBeInTheDocument();
      });
    });

    it.skip("should show validation error for invalid email", async () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid/i)).toBeInTheDocument();
      });
    });

    it("should submit form with valid data", async () => {
      const mockMutate = jest.fn();
      useLogin.mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /login/i });

      fireEvent.change(emailInput, {
        target: { value: "test@std.iyte.edu.tr" },
      });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({
          identity: "test@std.iyte.edu.tr",
          password: "password123",
        });
      });
    });
  });

  describe("Error States", () => {
    it("should display error message when login fails", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: new Error("Invalid credentials"),
      });

      renderLoginPage();

      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it("should display fallback error message for unknown errors", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: { message: null },
      });

      renderLoginPage();

      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("should disable button and show loading text when submitting", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
        error: null,
      });

      renderLoginPage();

      const submitButton = screen.getByRole("button", { name: /logging in/i });
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });

    it("should enable button when not loading", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      expect(submitButton).not.toBeDisabled();
    });
  });

  describe("UI Elements", () => {
    it('should render "Remember Me" checkbox', () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      expect(screen.getByText(/remember me/i)).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it('should render "Forgot Password" link', () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const forgotPasswordLink = screen.getByText(/forgot password/i);
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.closest("a")).toHaveAttribute(
        "href",
        "/forgot_password"
      );
    });

    it("should render register link", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const registerLink = screen.getByText(/register here/i);
      expect(registerLink).toBeInTheDocument();
      expect(registerLink.closest("a")).toHaveAttribute("href", "/register");
    });

    it("should have proper placeholders", () => {
      useLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      expect(
        screen.getByPlaceholderText(/you@std.iyte.edu.tr/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/enter your password/i)
      ).toBeInTheDocument();
    });
  });
});
