import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginPage from "../page";
import { useLogin } from "@/lib/hooks/authHooks";

// Mock the useLogin hook
jest.mock("@/lib/hooks/authHooks", () => ({
  useLogin: jest.fn(),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const translations: Record<string, string> = {
      title: "Login",
      email: "Email",
      password: "Password",
      rememberMe: "Remember Me",
      forgotPassword: "Forgot Password",
      submit: "Login",
      submitting: "Logging in",
      noAccount: "No account?",
      registerLink: "Register here",
      "placeholders.email": "you@std.iyte.edu.tr",
      "placeholders.password": "Enter your password",
      "errors.generic": "Unexpected error",
    };

    return (key: string) => translations[key] ?? key;
  },
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

const mockUseLogin = jest.mocked(useLogin);

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
      mockUseLogin.mockReturnValue({
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
      mockUseLogin.mockReturnValue({
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
      mockUseLogin.mockReturnValue({
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
      mockUseLogin.mockReturnValue({
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
          email: "test@std.iyte.edu.tr",
          password: "password123",
        });
      });
    });
  });

  describe("Error States", () => {
    it("should display error message when login fails", () => {
      mockUseLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: new Error("Invalid credentials"),
      });

      renderLoginPage();

      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it("should display fallback error message for unknown errors", () => {
      mockUseLogin.mockReturnValue({
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
      mockUseLogin.mockReturnValue({
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
      mockUseLogin.mockReturnValue({
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
      mockUseLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      expect(screen.getByText(/remember me/i)).toBeInTheDocument();
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it('should render "Forgot Password" link', () => {
      mockUseLogin.mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
        error: null,
      });

      renderLoginPage();

      const forgotPasswordLink = screen.getByText(/forgot password/i);
      expect(forgotPasswordLink).toBeInTheDocument();
      expect(forgotPasswordLink.closest("a")).toHaveAttribute(
        "href",
        "/forgot-password"
      );
    });

    it("should render register link", () => {
      mockUseLogin.mockReturnValue({
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
