import React from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">TradeHub</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The modern way to barter goods and services without money. 
              Join our community of traders today.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/listings', text: 'Browse Listings' },
                { href: '/create-listing', text: 'Post a Listing' },
                { href: '/how-it-works', text: 'How It Works' },
                { href: '/categories', text: 'Categories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                { href: '/faq', text: 'FAQ' },
                { href: '/safety-tips', text: 'Safety Tips' },
                { href: '/contact', text: 'Contact Us' },
                { href: '/feedback', text: 'Give Feedback' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                {[
                  { href: '/terms', text: 'Terms of Service' },
                  { href: '/privacy', text: 'Privacy Policy' },
                  { href: '/cookie-policy', text: 'Cookie Policy' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Newsletter</h3>
              <p className="text-gray-300 text-sm mb-2">
                Subscribe for updates and offers
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 text-sm text-gray-800 rounded-l focus:outline-none w-full"
                />
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-r text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-10 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} TradeHub. All rights reserved.</p>
            <div className="mt-3 md:mt-0 flex space-x-4">
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer