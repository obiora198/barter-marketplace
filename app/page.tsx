"use client";

import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import AuthButton from "./components/AuthButton";
import SearchBar from "./components/SearchBar";
import CategoryCard from "./components/CategoryCard";
import ListingCard from "./components/ListingCard";
import {popularCategories, recentListings} from "./assets/data"; // Assuming you have a data file for sample data}

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>TradeHub - Barter Marketplace</title>
        <meta name="description" content="Trade goods without money" />
      </Head>

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
          Barter <span className="text-xs text-gray-900 font-light">Marketplace</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <SearchBar />
          <Link 
            href="/create-listing" 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Post Listing
          </Link>
          <AuthButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-indigo-50 py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Trade What You Have for What You Need
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of traders and exchange goods without money. Find items you want and offer what you have.
        </p>
        {!session && (
          <button 
            onClick={() => signIn('google')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-lg font-medium"
          >
            Get Started - Sign Up Free
          </button>
        )}
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <CategoryCard 
                key={category.id}
                name={category.name}
                icon={category.icon}
                count={category.count}
              />
            ))}
          </div>
        </section>

        {/* Recent Listings Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Listings</h2>
            <Link href="/browse" className="text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                description={listing.description}
                image={listing.image}
                owner={listing.owner}
                category={listing.category}
              />
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">How TradeHub Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Listing</h3>
              <p className="text-gray-600">
                Post items you want to trade with photos and description.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Items You Want</h3>
              <p className="text-gray-600">
                Browse listings and make offers with items you have.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete the Trade</h3>
              <p className="text-gray-600">
                Agree on terms and exchange items in person or by mail.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I've traded 10 items in the last month without spending a dime!",
                author: "Sarah K.",
                location: "New York"
              },
              {
                quote: "Great way to declutter and get things you actually need.",
                author: "Michael T.",
                location: "Chicago"
              },
              {
                quote: "The community is amazing and trades are always fair.",
                author: "David P.",
                location: "Seattle"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">TradeHub</h3>
            <p className="text-gray-300">
              The modern way to barter goods and services without money.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/browse" className="text-gray-300 hover:text-white">Browse Listings</Link></li>
              <li><Link href="/create-listing" className="text-gray-300 hover:text-white">Post a Listing</Link></li>
              <li><Link href="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link href="/safety-tips" className="text-gray-300 hover:text-white">Safety Tips</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} TradeHub. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}