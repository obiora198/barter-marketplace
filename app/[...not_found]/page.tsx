"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFoundPage() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 h-screen w-full bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md bg-white shadow-md rounded-2xl p-6 border">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">
          Sorry, we couldn't find the page <code className="bg-gray-100 px-1 rounded text-sm">{pathname}</code>
        </p>
        <Link href="/">
          <button className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1 rounded">Go Home</button>
        </Link>
      </div>
    </div>
  );
}
