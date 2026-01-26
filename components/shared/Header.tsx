"use client"

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-full border-b bg-white py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Title Section */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo/iyte-icon.svg" 
            alt="IYTE" 
            width={32} 
            height={32} 
          />
          <span className="text-xl font-bold text-gray-900">Proje Pazarı</span>
        </Link>
      </div>
    </div>
  );
}