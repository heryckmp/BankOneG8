'use client';

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import BankCard from './BankCard'
import { countTransactionCategories } from '@/lib/utils'
import Category from './Category'

interface RightSidebarProps {
  user: any;
  transactions: any[];
  banks: any[];
  children?: React.ReactNode;
}

const RightSidebar = ({ 
  user,
  transactions,
  banks,
  children
}: RightSidebarProps) => {
  const categories: CategoryCount[] = countTransactionCategories(transactions);

  return (
    <aside className="right-sidebar">
      <div className="relative w-full h-full flex flex-col z-10">
        <section className="flex flex-col pb-8">
          <div className="profile-banner" style={{
            backgroundImage: 'url(/images/crypto-banner.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '140px'
          }} />
          <div className="profile relative z-10">
            <div className="profile-img flex-center">
              <span className="text-16 font-semibold text-gray-900">
                {user.firstName.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="profile-details">
              <h1 className='profile-name'>
                {user.firstName} {user.lastName}
              </h1>
              <p className="profile-email">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        <section className="banks flex-1">
          <div className="mt-10 flex flex-1 flex-col gap-6">
            <h2 className="header-2">Top categories</h2>

            <div className='space-y-5'>
              {categories.map((category, index) => (
                <Category key={category.name} category={category} />
              ))}
            </div>
          </div>
        </section>

        {children}
      </div>
    </aside>
  )
}

export default RightSidebar