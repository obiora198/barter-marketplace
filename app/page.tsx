import Link from "next/link";
import CategoryCard from "./components/CategoryCard";
import { popularCategories } from "./assets/data";
import ListingsSection from "./components/homepage-sections/listingsSection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default function HomePage() {
  const session = getServerSession(authOptions);

  return (
    <>

      {/* Hero Section */}
      <section className="bg-indigo-50 py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Trade What You Have for What You Need
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of traders and exchange goods without money. Find
          items you want and offer what you have.
        </p>
        {!session && (
          <Link
            href={"/signin"}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-lg font-medium"
          >
            Get Started
          </Link>
        )}
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((category) => (
              <CategoryCard
                key={category.id}
                name={category.name}
                icon={category.icon}
              />
            ))}
          </div>
        </section>

        {/* Recent Listings Section */}
        <ListingsSection />

        {/* How It Works Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            How TradeHub Works
          </h2>
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
              <h3 className="text-xl font-semibold mb-2">
                Find Items You Want
              </h3>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I've traded 10 items in the last month without spending a dime!",
                author: "Sarah K.",
                location: "New York",
              },
              {
                quote:
                  "Great way to declutter and get things you actually need.",
                author: "Michael T.",
                location: "Chicago",
              },
              {
                quote: "The community is amazing and trades are always fair.",
                author: "David P.",
                location: "Seattle",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </p>
                <p className="font-medium">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.location}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
