'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

export default function SearchFilters({
  categories,
  locations,
  searchParams,
}: {
  categories: string[];
  locations: string[];
  searchParams: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(useSearchParams());

  const handleFilter = (name: string, value: string) => {
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    ['category', 'location', 'search'].forEach(param => params.delete(param));
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters = 
    params.get('category') || 
    params.get('location') || 
    params.get('search');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <FaFilter className="mr-2" /> Filters
        {hasFilters && (
          <button 
            onClick={clearFilters}
            className="ml-auto text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <FaTimes className="mr-1" /> Clear all
          </button>
        )}
      </h2>

      {/* Search Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search listings..."
            defaultValue={params.get('search') || ''}
            onChange={(e) => handleFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={params.get('category') || ''}
          onChange={(e) => handleFilter('category', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={params.get('location') || ''}
          onChange={(e) => handleFilter('location', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}