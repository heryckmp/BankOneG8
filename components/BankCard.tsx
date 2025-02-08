'use client';

import { formatAmount } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Copy from './Copy'
import AccountBalance from './AccountBalance'

interface BankCardProps {
  account: any;
  userName: string;
  showBalance?: boolean;
}

const BankCard = ({ account, userName, showBalance = true }: BankCardProps) => {
  console.log(account);
  return (
    <div className="flex flex-col">
      <Link href={`/transaction-history/?id=${account.appwriteItemId}`} className="bank-card">
        <div className="bank-card_content">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image 
                src="/icons/bank.svg"
                alt="Bank"
                width={24}
                height={24}
                className="brightness-[3] invert-0"
              />
              <h3 className="text-16 font-semibold text-white">
                {account.name}
              </h3>
            </div>

            {showBalance && (
              <AccountBalance 
                balance={account.currentBalance}
                previousBalance={account.availableBalance}
                currency="USD"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-12 font-normal text-white/60">
              Card Holder
            </p>
            <p className="text-14 font-medium text-white">
              {userName}
            </p>
          </div>
        </div>

        <div className="bank-card_icon">
          <Image 
            src="/icons/visa.svg"
            alt="Visa"
            width={40}
            height={20}
            className="brightness-[3] invert-0"
          />
        </div>

        <Image 
          src="/icons/lines.png"
          width={316}
          height={190}
          alt="lines"
          className="absolute top-0 left-0"
        />
      </Link>

      {showBalance && <Copy title={account?.sharaebleId} />}
    </div>
  )
}

export default BankCard