import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  icon: string;
  count: number;
}

export default function CategoryCard({ name, icon, count }: CategoryCardProps) {
  return (
    <Link 
      href={`/browse?category=${encodeURIComponent(name)}`}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-medium text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500">{count} listings</p>
    </Link>
  );
}