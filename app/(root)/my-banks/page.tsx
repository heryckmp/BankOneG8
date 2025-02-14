import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox'
import { getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import React from 'react'

// Demo accounts data
const demoAccounts = [
  {
    id: 'demo1',
    appwriteItemId: 'demo1',
    name: 'Horizon Banking',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Horizon Banking Checking'
  },
  {
    id: 'demo2',
    appwriteItemId: 'demo2',
    name: 'Bank of Australia',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Bank of Australia Checking'
  },
  {
    id: 'demo3',
    appwriteItemId: 'demo3',
    name: 'Bank of India',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Bank of India Checking'
  },
  {
    id: 'demo4',
    appwriteItemId: 'demo4',
    name: 'Bank of America',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Bank of America Checking'
  },
  {
    id: 'demo5',
    appwriteItemId: 'demo5',
    name: 'Bank of Canada',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Bank of Canada Checking'
  },
  {
    id: 'demo6',
    appwriteItemId: 'demo6',
    name: 'Bank of Pakistan',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Bank of Pakistan Checking'
  }
];

const MyBanks = async () => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({ 
    userId: loggedIn.$id 
  });

  // Use demo accounts if no real accounts exist
  const accountsToDisplay = accounts?.data?.length > 0 ? accounts.data : demoAccounts;

  return (
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox 
          title="My Bank Accounts"
          subtext="Effortlessly Manage Your Banking Activities"
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Your cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountsToDisplay.map((account: Account) => (
              <div key={account.id} className="flex flex-col gap-2">
                <BankCard 
                  account={account}
                  userName={loggedIn?.firstName}
                />
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm text-gray-500">Spending this month</span>
                  <span className="text-sm font-medium text-gray-700">$2,840.40</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyBanks