import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import BankDropdown from '@/components/BankDropdown';
import TransactionsTable from '@/components/TransactionsTable';
import { Pagination } from '@/components/Pagination';

// Demo transactions data
const demoTransactions = [
  {
    id: 'plaid_txn_001',
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
    }
  },
  {
    id: 'plaid_txn_002',
    name: 'Salario',
    amount: 4500.00,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Income',
    type: 'credit',
    merchant_name: 'EMPRESA LTDA',
    pending: false,
    payment_method: 'ach',
    transaction_code: 'direct_deposit'
  },
  {
    id: 'plaid_txn_003',
    name: 'Netflix Streaming',
    amount: 39.90,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Entertainment',
    type: 'debit',
    merchant_name: 'NETFLIX.COM',
    pending: false,
    payment_method: 'credit_card',
    recurring: true
  },
  {
    id: 'plaid_txn_004',
    name: 'Uber',
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
    }
  },
  {
    id: 'plaid_txn_005',
    name: 'Drogaria Pacheco',
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
    }
  },
  {
    id: 'plaid_txn_006',
    name: 'Amazon *PRIME',
    amount: 14.90,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Subscription',
    type: 'debit',
    merchant_name: 'AMAZON PRIME',
    pending: false,
    payment_method: 'credit_card',
    recurring: true
  },
  {
    id: 'plaid_txn_007',
    name: 'Transferência PIX',
    amount: 250.00,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Transfer',
    type: 'debit',
    merchant_name: 'PIX TRANSFER',
    pending: false,
    payment_method: 'pix',
    transaction_code: 'p2p_transfer'
  },
  {
    id: 'plaid_txn_008',
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
    }
  },
  {
    id: 'plaid_txn_009',
    name: 'Spotify Premium',
    amount: 19.90,
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Entertainment',
    type: 'debit',
    merchant_name: 'SPOTIFY',
    pending: false,
    payment_method: 'credit_card',
    recurring: true
  },
  {
    id: 'plaid_txn_010',
    name: 'Rendimento',
    amount: 23.45,
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    paymentChannel: 'online',
    category: 'Interest',
    type: 'credit',
    merchant_name: 'BANK INTEREST',
    pending: false,
    payment_method: 'account',
    transaction_code: 'interest_credit'
  }
];

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page) || 1;
  const loggedIn = await getLoggedInUser();
  
  if (!loggedIn) {
    redirect('/sign-in');
  }

  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  });

  const accountsData = accounts?.data || [];
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const account = appwriteItemId ? await getAccount({ appwriteItemId }) : null;

  // Use demo transactions if no real transactions exist
  const transactions = account?.transactions?.length > 0 ? account.transactions : demoTransactions;
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <Image
              src="/icons/transaction.svg"
              alt="Transactions"
              width={24}
              height={24}
              className="opacity-70"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Histórico de Transações</h3>
            <p className="text-sm text-gray-500">Visualize todas as suas transações</p>
          </div>
        </div>

        <BankDropdown 
          accounts={accountsData}
          selected={account}
          otherStyles="bg-white shadow-sm"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-6">
        <TransactionsTable transactions={currentTransactions} />
        
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination totalPages={totalPages} page={currentPage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistory;