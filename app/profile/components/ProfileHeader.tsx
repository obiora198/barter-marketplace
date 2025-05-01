import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit } from 'react-icons/fi';
import {User} from "../../../types/types";

interface ProfileHeaderProps {
    user: User;
    listingsCount: number;
  }
  
  export default function ProfileHeader({ 
    user,
    listingsCount 
  }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100">
          <Image
            src={user.image || '/user.png'}
            alt={user.name || 'User'}
            fill
            className="object-cover"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user.name || 'Anonymous User'}
              </h1>
              {user.email && <p className="text-gray-600">{user.email}</p>}
              {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
            </div>
            
            <div className="flex p-2">
              <Link 
                href="/profile/edit" 
                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full"
              >
                <FiEdit size={18} />
              </Link>
            </div>
          </div>
          
          <div className="mt-4 flex gap-6">
            <div>
              <span className="font-bold text-gray-800">{listingsCount}</span>
              <span className="text-gray-600 ml-1">Listings</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">24</span>
              <span className="text-gray-600 ml-1">Trades</span>
            </div>
            <div>
              <span className="font-bold text-gray-800">4.8</span>
              <span className="text-gray-600 ml-1">Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}