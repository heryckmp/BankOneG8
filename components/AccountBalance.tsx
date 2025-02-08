'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { formatAmount } from '@/lib/utils';

interface AccountBalanceProps {
  balance: number;
  previousBalance?: number;
  currency?: string;
}

const AccountBalance = ({ 
  balance, 
  previousBalance = 0,
  currency = 'USD' 
}: AccountBalanceProps) => {
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    if (balance > previousBalance) {
      setIsIncreasing(true);
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 2000);
      return () => clearTimeout(timer);
    } else if (balance < previousBalance) {
      setIsIncreasing(false);
      setShowSparkles(false);
    }
  }, [balance, previousBalance]);

  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-600/10 to-blue-700/10 backdrop-blur-sm border border-blue-500/20">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent animate-gradient" />
      
      {/* Sparkles Effect */}
      {showSparkles && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              initial={{ 
                opacity: 0,
                x: '50%',
                y: '50%'
              }}
              animate={{ 
                opacity: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1.5, 0]
              }}
              transition={{ 
                duration: 2,
                delay: Math.random() * 0.5,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="relative">
        <p className="text-sm font-medium text-gray-600 mb-1">Total Balance</p>
        
        <div className="flex items-baseline gap-2">
          <motion.span
            className="text-3xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={balance} // Force animation on balance change
          >
            {formatAmount(balance)}
          </motion.span>
          
          <span className="text-sm text-gray-500">{currency}</span>
          
          {balance !== previousBalance && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-1 text-sm ${
                isIncreasing ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <span className="text-lg">
                {isIncreasing ? '↑' : '↓'}
              </span>
              <span>
                {formatAmount(Math.abs(balance - previousBalance))}
              </span>
            </motion.div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${(balance / (previousBalance || balance)) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        {/* Mini Graph */}
        <div className="mt-4 h-12 flex items-end gap-1">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-blue-500/40 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 100}%` }}
              transition={{ 
                duration: 0.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountBalance; 