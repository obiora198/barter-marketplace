import React from 'react'
import prisma from '../../../lib/prisma'
import Link from 'next/link'
import ListingCard from '../ListingCard'
import { Listing } from '../../../prisma/app/generated/prisma/client'

export default async function ListingsSection() {
    const listings: Listing[] = await prisma.listing.findMany({
        include: { owner: true },
        orderBy: { createdAt: 'desc' },
        take: 4, 
    })

  return (
    <div>
         {/* Recent Listings Section */}
         <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recent Listings
            </h2>
            <Link href="/listings" className="text-indigo-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
               listing={listing}
               variant="full" // Show location and trade preference
              />
            ))}
          </div>
        </section>
    </div>
  )
}