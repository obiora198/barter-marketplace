import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  icon: string;
}

export default function CategoryCard({ name, icon }: CategoryCardProps) {
  return (
    <Link 
      href={`/listings?category=${encodeURIComponent(name)}`}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-medium text-gray-800">{name}</h3>
    </Link>
  );
}