import React from 'react'
import {getServerSession} from 'next-auth/next'
import { authOptions } from '../../lib/auth';
import ProfilePageClient from './ProfilePageClient';
import prisma from '../../lib/prisma';
import { redirect } from 'next/navigation';


export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      listings: true,
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <ProfilePageClient 
      user={{
        id: user.id,
        name: user.name || 'Anonymous',
        email: user.email || '',
        image: user.image || '/user-placeholder.jpg',
        bio: user.bio || '',
        listings: user.listings,
      }}
    />
  );
}