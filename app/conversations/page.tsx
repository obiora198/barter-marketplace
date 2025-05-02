import React from 'react'
import MessageLayout from './components/MessageLayout'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getServerSession(authOptions) 
  if (!session || !session.user?.email) {
    redirect('/signin');
  }

  return (
    <MessageLayout />
  )
}

export default page