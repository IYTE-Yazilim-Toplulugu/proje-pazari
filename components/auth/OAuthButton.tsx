import Image from "next/image";

interface OAuthButtonProps {
  provider: "google" | "microsoft" | "meta";
  onClick: () => void;
  disabled?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    name: "Google",
    logo: "/oauth/google.svg",
    bgColor: "bg-white hover:bg-gray-50",
    textColor: "text-gray-700",
  },
  microsoft: {
    name: "Microsoft",
    logo: "/oauth/microsoft.svg",
    bgColor: "bg-[#2F2F2F] hover:bg-[#1F1F1F]",
    textColor: "text-white",
  },
  meta: {
    name: "Meta",
    logo: "/oauth/meta.svg",
    bgColor: "bg-[#1877F2] hover:bg-[#166FE5]",
    textColor: "text-white",
  },
};

export default function OAuthButton({
  provider,
  onClick,
  disabled,
}: OAuthButtonProps) {
  const config = PROVIDER_CONFIG[provider];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-center gap-3 px-4 py-2 
                rounded-lg border border-gray-300 dark:border-gray-600
                 ${config.bgColor} ${config.textColor} 
                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Image src={config.logo} alt={config.name} width={20} height={20} />
      <span className="font-medium">Continue with {config.name}</span>
    </button>
  );
}
