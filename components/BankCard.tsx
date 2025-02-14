'use client';

import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface BankCardProps {
  account: any;
  userName: string;
  showBalance?: boolean;
}

const BankCard = ({ account, userName, showBalance = false }: BankCardProps) => {
  return (
    <Link href={`/transaction-history/?id=${account.appwriteItemId}`} 
      className="block w-full max-w-[360px] h-[200px] rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 relative overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <Image 
          src="/icons/lines.png"
          alt="Card pattern"
          fill
          className="object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">
            {account.name}
          </h3>
          <Image 
            src="/icons/copy.svg"
            width={20}
            height={20}
            alt="Copy"
            className="opacity-60 hover:opacity-100 cursor-pointer"
          />
        </div>

        <div className="space-y-4">
          {/* Card Number */}
          <div className="text-xl text-white tracking-wider font-medium">
            1234 1234 1234 {account.mask || '1234'}
          </div>

          {/* Card Footer */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white/60 text-sm">Card Holder</p>
              <p className="text-white text-sm font-medium">{userName}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm">Expires</p>
              <p className="text-white text-sm font-medium">06/24</p>
            </div>
            <Image 
              src="/icons/mastercard.svg"
              width={40}
              height={25}
              alt="Mastercard"
              className="brightness-200"
            />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BankCard