'use client';

import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import { formatAmount, getTransactionStatus } from '@/lib/utils'
import { motion } from 'framer-motion'

// Demo transactions data
const demoTransactions: Transaction[] = [
  {
    $id: 'plaid_txn_001',
    id: 'plaid_txn_001',
    accountId: 'demo_account',
    name: 'Supermercado Extra',
    amount: 156.78,
    date: new Date().toISOString(),
    paymentChannel: 'in_store',
    category: 'Food and Drink',
    type: 'debit',
    merchant_name: 'Extra Supermercados',
    pending: false,
    payment_method: 'credit_card',
    location: {
      address: 'Av. Paulista, 1500',
      city: 'São Paulo',
      region: 'SP'
    },
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_002',
    id: 'plaid_txn_002',
    accountId: 'demo_account',
    name: 'Salário',
    amount: 4500.00,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Income',
    type: 'credit',
    merchant_name: 'EMPRESA LTDA',
    pending: false,
    payment_method: 'ach',
    transaction_code: 'direct_deposit',
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_003',
    id: 'plaid_txn_003',
    accountId: 'demo_account',
    name: 'Netflix Streaming',
    amount: 39.90,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Entertainment',
    type: 'debit',
    merchant_name: 'NETFLIX.COM',
    pending: false,
    payment_method: 'credit_card',
    recurring: true,
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_004',
    id: 'plaid_txn_004',
    accountId: 'demo_account',
    name: 'Uber *TRIP SAO PAULO',
    amount: 24.50,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Transport',
    type: 'debit',
    merchant_name: 'UBER',
    pending: true,
    payment_method: 'credit_card',
    location: {
      city: 'São Paulo',
      region: 'SP'
    },
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_005',
    id: 'plaid_txn_005',
    accountId: 'demo_account',
    name: 'Drogaria São Paulo',
    amount: 89.90,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'in_store',
    category: 'Health',
    type: 'debit',
    merchant_name: 'DROGARIA SAO PAULO',
    pending: false,
    payment_method: 'debit_card',
    location: {
      address: 'Rua Augusta, 789',
      city: 'São Paulo',
      region: 'SP'
    },
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_006',
    id: 'plaid_txn_006',
    accountId: 'demo_account',
    name: 'Amazon.com.br *PRIME',
    amount: 14.90,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Subscription',
    type: 'debit',
    merchant_name: 'AMAZON PRIME',
    pending: false,
    payment_method: 'credit_card',
    recurring: true,
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_007',
    id: 'plaid_txn_007',
    accountId: 'demo_account',
    name: 'Transferência PIX',
    amount: 250.00,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Transfer',
    type: 'debit',
    merchant_name: 'PIX TRANSFER',
    pending: false,
    payment_method: 'pix',
    transaction_code: 'p2p_transfer',
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_008',
    id: 'plaid_txn_008',
    accountId: 'demo_account',
    name: 'iFood *DELIVERY',
    amount: 65.90,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Food and Drink',
    type: 'debit',
    merchant_name: 'IFOOD',
    pending: false,
    payment_method: 'credit_card',
    location: {
      city: 'São Paulo',
      region: 'SP'
    },
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_009',
    id: 'plaid_txn_009',
    accountId: 'demo_account',
    name: 'Spotify Premium',
    amount: 19.90,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Entertainment',
    type: 'debit',
    merchant_name: 'SPOTIFY',
    pending: false,
    payment_method: 'credit_card',
    recurring: true,
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  },
  {
    $id: 'plaid_txn_010',
    id: 'plaid_txn_010',
    accountId: 'demo_account',
    name: 'Rendimento Poupança',
    amount: 23.45,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Interest',
    type: 'credit',
    merchant_name: 'BANK INTEREST',
    pending: false,
    payment_method: 'account',
    transaction_code: 'interest_credit',
    image: '/icons/transaction.svg',
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
    $permissions: []
  }
];

interface RecentTransactionsProps {
  accounts: any[];
  transactions: any[];
  appwriteItemId: string;
  page: number;
}

const DemoAccountState = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
    <div className="flex flex-col gap-6">
      <TransactionsTable transactions={demoTransactions.slice(0, 5)} />
    </div>
  </div>
)

const RecentTransactions = ({
  accounts,
  transactions: realTransactions,
  appwriteItemId,
  page
}: RecentTransactionsProps) => {
  // Use demo transactions if no real transactions exist
  const transactions = realTransactions?.length > 0 ? realTransactions : demoTransactions;
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return (
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-end">
        <Link 
          href="/transaction-history"
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <span>Ver Todas</span>
          <Image
            src="/icons/arrow-right.svg"
            alt="Ver todas"
            width={16}
            height={16}
          />
        </Link>
      </div>

      {!accounts || accounts.length === 0 ? (
        <DemoAccountState />
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
          <Tabs defaultValue={appwriteItemId} className="w-full">
            <TabsList className="mb-6 bg-gray-50 p-1 rounded-lg">
              {accounts.map((account: Account) => (
                <TabsTrigger 
                  key={account.id} 
                  value={account.appwriteItemId}
                  className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <BankTabItem
                    key={account.id}
                    account={account}
                    appwriteItemId={appwriteItemId}
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            {accounts.map((account: Account) => (
              <TabsContent
                value={account.appwriteItemId}
                key={account.id}
                className="space-y-6"
              >
                <BankInfo 
                  account={account}
                  appwriteItemId={appwriteItemId}
                  type="full"
                />

                <TransactionsTable transactions={currentTransactions} />

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination totalPages={totalPages} page={page} />
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </motion.div>
  )
}

export default RecentTransactions