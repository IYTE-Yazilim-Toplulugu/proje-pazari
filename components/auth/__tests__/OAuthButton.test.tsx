import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import OAuthButton from "../OAuthButton";

describe("OAuthButton", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Provider Rendering", () => {
    it("should render Google button with correct styling", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
      expect(screen.getByAltText(/google/i)).toBeInTheDocument();
    });

    it("should render Microsoft button with correct styling", () => {
      render(<OAuthButton provider="microsoft" onClick={mockOnClick} />);

      expect(screen.getByText(/continue with microsoft/i)).toBeInTheDocument();
      expect(screen.getByAltText(/microsoft/i)).toBeInTheDocument();
    });

    it("should render Meta button with correct styling", () => {
      render(<OAuthButton provider="meta" onClick={mockOnClick} />);

      expect(screen.getByText(/continue with meta/i)).toBeInTheDocument();
      expect(screen.getByAltText(/meta/i)).toBeInTheDocument();
    });
  });

  describe("Button Interactions", () => {
    it("should call onClick when button is clicked", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onClick when disabled", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} disabled />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe("Disabled State", () => {
    it("should render as disabled when disabled prop is true", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} disabled />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("should render as enabled by default", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      const button = screen.getByRole("button");
      expect(button).not.toBeDisabled();
    });

    it("should have opacity-50 class when disabled", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} disabled />);

      const button = screen.getByRole("button");
      expect(button.className).toContain("disabled:opacity-50");
    });
  });

  describe("Image Rendering", () => {
    it("should render image with correct dimensions", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      const image = screen.getByAltText(/google/i);
      expect(image).toHaveAttribute("width", "20");
      expect(image).toHaveAttribute("height", "20");
    });

    it("should have correct logo path for each provider", () => {
      const { rerender } = render(
        <OAuthButton provider="google" onClick={mockOnClick} />
      );
      expect(screen.getByAltText(/google/i)).toHaveAttribute(
        "src",
        expect.stringContaining("/oauth/google.svg")
      );

      rerender(<OAuthButton provider="microsoft" onClick={mockOnClick} />);
      expect(screen.getByAltText(/microsoft/i)).toHaveAttribute(
        "src",
        expect.stringContaining("/oauth/microsoft.svg")
      );

      rerender(<OAuthButton provider="meta" onClick={mockOnClick} />);
      expect(screen.getByAltText(/meta/i)).toHaveAttribute(
        "src",
        expect.stringContaining("/oauth/meta.svg")
      );
    });
  });

  describe("Accessibility", () => {
    it("should have button role", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should have descriptive text", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      expect(screen.getByText(/continue with google/i)).toBeInTheDocument();
    });

    it("should have alt text for image", () => {
      render(<OAuthButton provider="google" onClick={mockOnClick} />);

      const image = screen.getByAltText(/google/i);
      expect(image).toBeInTheDocument();
    });
  });
});
