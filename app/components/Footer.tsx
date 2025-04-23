import React from 'react'
import Link from 'next/link'

const Footer = () => {
  return (
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
           <li>
             <Link href="/browse" className="text-gray-300 hover:text-white">
               Browse Listings
             </Link>
           </li>
           <li>
             <Link
               href="/create-listing"
               className="text-gray-300 hover:text-white"
             >
               Post a Listing
             </Link>
           </li>
           <li>
             <Link
               href="/how-it-works"
               className="text-gray-300 hover:text-white"
             >
               How It Works
             </Link>
           </li>
         </ul>
       </div>
       <div>
         <h3 className="text-lg font-semibold mb-4">Support</h3>
         <ul className="space-y-2">
           <li>
             <Link href="/faq" className="text-gray-300 hover:text-white">
               FAQ
             </Link>
           </li>
           <li>
             <Link
               href="/safety-tips"
               className="text-gray-300 hover:text-white"
             >
               Safety Tips
             </Link>
           </li>
           <li>
             <Link
               href="/contact"
               className="text-gray-300 hover:text-white"
             >
               Contact Us
             </Link>
           </li>
         </ul>
       </div>
       <div>
         <h3 className="text-lg font-semibold mb-4">Legal</h3>
         <ul className="space-y-2">
           <li>
             <Link href="/terms" className="text-gray-300 hover:text-white">
               Terms of Service
             </Link>
           </li>
           <li>
             <Link
               href="/privacy"
               className="text-gray-300 hover:text-white"
             >
               Privacy Policy
             </Link>
           </li>
         </ul>
       </div>
     </div>
     <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
       <p>© {new Date().getFullYear()} TradeHub. All rights reserved.</p>
     </div>
   </footer>
  )
}

export default Footer