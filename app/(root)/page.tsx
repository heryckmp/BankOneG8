import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/bank.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import Image from 'next/image';
import { redirect } from 'next/navigation';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
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

  return (
    <main className="flex min-h-screen w-full bg-gray-50">
      <section className="home">
        <div className="home-content">
          <div className="home-header relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 h-[200px]">
              <Image
                src="/images/welcomelay.jpg"
                alt="Imagem de boas-vindas"
                fill
                className="object-cover opacity-25 brightness-110 contrast-125 saturate-150"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-white/95" />
            </div>
            
            <div className="relative z-10 pt-8">
              <HeaderBox 
                type="greeting"
                title="Bem-vindo"
                user={loggedIn?.firstName || 'Convidado'}
                subtext="Acesse e gerencie sua conta e transações de forma eficiente."
              />
            </div>

            <div className="relative z-10 mt-6">
              <div className="total-balance">
                <div className="total-balance-chart w-full">
                  <TotalBalanceBox 
                    accounts={accountsData}
                    totalBanks={accounts?.totalBanks || 0}
                    totalCurrentBalance={accounts?.totalCurrentBalance || 0}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="recent-transactions">
            <div className="flex items-center justify-between">
              <h3 className="recent-transactions-label">Transações Recentes</h3>
            </div>

            <RecentTransactions 
              accounts={accountsData}
              transactions={account?.transactions || []}
              appwriteItemId={appwriteItemId}
              page={currentPage}
            />
          </div>
        </div>

        <RightSidebar 
          user={loggedIn}
          transactions={account?.transactions || []}
          banks={accountsData?.slice(0, 2)}
        >
          {/* Seção do Cartão de Crédito */}
          <div className="credit-card-section">
            {/* Cartão de Fundo */}
            <div className="credit-card absolute right-4 top-4 z-0">
              <div className="credit-card-overlay" />
              
              <div className="p-6 relative h-full flex flex-col justify-between">
                {/* Seção Superior */}
                <div className="flex justify-between items-start">
                  <div className="credit-card-chip" />
                  <div className="credit-card-icons">
                    <Image 
                      src="/icons/visa.svg" 
                      alt="Visa" 
                      width={40} 
                      height={20}
                      className="credit-card-icon"
                    />
                    <Image 
                      src="/icons/mastercard.svg" 
                      alt="Mastercard" 
                      width={30} 
                      height={20}
                      className="credit-card-icon"
                    />
                  </div>
                </div>

                {/* Seção Inferior */}
                <div className="space-y-4">
                  <div className="credit-card-number">
                    **** **** **** 4242
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-white/80 text-sm">
                      <div>Titular do Cartão</div>
                      <div className="font-medium">{loggedIn.firstName} {loggedIn.lastName}</div>
                    </div>
                    <div className="text-white/80 text-sm">
                      <div>Validade</div>
                      <div className="font-medium">12/24</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cartão Principal */}
            <div className="credit-card relative z-10">
              <div className="credit-card-overlay" />
              
              <div className="p-6 relative h-full flex flex-col justify-between">
                {/* Seção Superior */}
                <div className="flex justify-between items-start">
                  <div className="credit-card-chip" />
                  <div className="credit-card-icons">
                    <Image 
                      src="/icons/visa.svg" 
                      alt="Visa" 
                      width={40} 
                      height={20}
                      className="credit-card-icon"
                    />
                    <Image 
                      src="/icons/mastercard.svg" 
                      alt="Mastercard" 
                      width={30} 
                      height={20}
                      className="credit-card-icon"
                    />
                  </div>
                </div>

                {/* Seção Inferior */}
                <div className="space-y-4">
                  <div className="credit-card-number">
                    **** **** **** 4242
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-white/80 text-sm">
                      <div>Titular do Cartão</div>
                      <div className="font-medium">{loggedIn.firstName} {loggedIn.lastName}</div>
                    </div>
                    <div className="text-white/80 text-sm">
                      <div>Validade</div>
                      <div className="font-medium">12/24</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RightSidebar>
      </section>
    </main>
  )
}

export default Home