import AnimatedCounter from './AnimatedCounter';
import DoughnutChart from './DoughnutChart';

const TotalBalanceBox = ({
  accounts = [], totalBanks, totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="w-full max-w-[200px] aspect-square">
        <DoughnutChart accounts={accounts} />
      </div>

      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="plaid-heading text-2xl">
            Bank Accounts
          </h2>
          <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            {totalBanks}
          </span>
        </div>
        
        <div className="flex flex-col gap-2">
          <p className="text-gray-600 font-medium">
            Total Current Balance
          </p>

          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
              $
            </span>
            <AnimatedCounter 
              amount={totalCurrentBalance} 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TotalBalanceBox