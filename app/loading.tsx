import Image from 'next/image';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <Image
          src="/logo/iyte-logo.svg"
          alt="IYTE Logo"
          width={120}
          height={120}
          className="mx-auto mb-6 animate-pulse"
        />
        <h1 className="text-2xl font-bold mb-2">Proje Pazarı</h1>
        <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}