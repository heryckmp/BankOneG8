import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'
import { formatAmount, getTransactionStatus } from '@/lib/utils'

interface RecentTransactionsProps {
  accounts: any[];
  transactions: any[];
  appwriteItemId: string;
  page: number;
}

const RecentTransactions = ({
  accounts,
  transactions,
  appwriteItemId,
  page
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(
    indexOfFirstTransaction, indexOfLastTransaction
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/transaction.svg"
            alt="Transactions"
            width={24}
            height={24}
          />
          <h3 className="text-xl font-semibold">Recent Transactions</h3>
        </div>

        <Link 
          href="/transaction-history"
          className="flex items-center gap-2 text-blue-600 hover:opacity-80 transition-opacity"
        >
          <span>View All</span>
          <Image
            src="/icons/arrow-right.svg"
            alt="View all"
            width={16}
            height={16}
          />
        </Link>
      </div>

      <Tabs defaultValue={appwriteItemId} className="w-full">
      <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.appwriteItemId}>
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
            className="space-y-4"
          >
            <BankInfo 
              account={account}
              appwriteItemId={appwriteItemId}
              type="full"
            />

            <TransactionsTable transactions={currentTransactions} />
            

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default RecentTransactions