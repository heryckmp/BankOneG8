'use client';

import Image from 'next/image';
import DoughnutChart from './DoughnutChart';
import AnimatedCounter from './AnimatedCounter';
import { motion } from 'framer-motion';

interface TotalBalanceBoxProps {
  accounts: any[];
  totalBanks: number;
  totalCurrentBalance: number;
}

// Demo data
const demoAccounts = [
  {
    id: 'demo1',
    name: 'Conta Corrente',
    currentBalance: 2888900,
    availableBalance: 2888900
  },
  {
    id: 'demo2',
    name: 'Conta Poupança',
    currentBalance: 186300,
    availableBalance: 186300
  }
];

const TotalBalanceBox = ({ 
  accounts: realAccounts,
  totalBanks,
  totalCurrentBalance
}: TotalBalanceBoxProps) => {
  // Use demo data if no real accounts exist
  const accounts = realAccounts?.length > 0 ? realAccounts : demoAccounts;
  const demoTotalBanks = realAccounts?.length > 0 ? totalBanks : demoAccounts.length;
  const demoTotalBalance = realAccounts?.length > 0 ? totalCurrentBalance : 2888900;

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <motion.div 
        className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 rounded-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 bg-blue-600 rounded-lg p-2 shadow-lg">
            <Image
              src="/icons/bank-transfer.svg"
              alt="Contas Bancárias"
              fill
              className="object-contain p-1 brightness-[3] invert-0"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[10px] text-white font-semibold">
              {demoTotalBanks}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              Contas Bancárias
            </h3>
            <p className="text-sm text-gray-600">Gerencie suas finanças</p>
          </div>
        </div>

        <motion.div 
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative w-5 h-5">
            <Image
              src="/icons/dollar-circle.svg"
              alt="Total de bancos"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-gray-700 font-medium">
            Total de Bancos: <span className="text-blue-600">{demoTotalBanks}</span>
          </span>
        </motion.div>
      </motion.div>

      {/* Balance Section */}
      <div className="flex items-stretch gap-8 bg-white rounded-2xl p-8 shadow-sm">
        {/* Current Balance Card */}
        <motion.div 
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg flex-1"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 border-2 border-blue-400/30 rounded-full animate-spin-slow" />
              <div className="absolute inset-0 border-2 border-blue-400/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '10s' }} />
              <div className="relative w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Image 
                  src="/icons/coins.svg"
                  alt="Saldo"
                  width={20}
                  height={20}
                  className="object-contain brightness-200"
                />
              </div>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Saldo Total</p>
              <h2 className="text-4xl font-bold">
                $<AnimatedCounter value={demoTotalBalance} />
              </h2>
            </div>
          </div>

          <div className="relative w-full h-[200px]">
            <DoughnutChart accounts={accounts} />
          </div>
        </motion.div>

        {/* Accounts List */}
        <motion.div 
          className="flex flex-col gap-4 flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900">Distribuição de Contas</h3>
          {accounts.length > 0 ? accounts.map((account, index) => (
            <motion.div 
              key={account.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" 
                  style={{ 
                    backgroundColor: [
                      'rgba(37, 99, 235, 1)',   // blue-600
                      'rgba(59, 130, 246, 1)',  // blue-500
                      'rgba(96, 165, 250, 1)',  // blue-400
                      'rgba(147, 197, 253, 1)', // blue-300
                    ][index % 4]
                  }} 
                />
                <span className="font-medium text-gray-700">{account.name}</span>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                ${account.currentBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
            </motion.div>
          )) : (
            <motion.div 
              className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-14 h-14 flex items-center justify-center bg-blue-600/10 rounded-lg mb-4">
                <Image 
                  src="/icons/bank-transfer.svg"
                  width={24}
                  height={24}
                  alt="Sem contas"
                  className="brightness-[3] invert-0"
                />
              </div>
              <p className="text-gray-500 text-center">Nenhuma conta bancária conectada ainda.</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Adicionar Conta Bancária
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default TotalBalanceBox