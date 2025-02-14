import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, getTransactionStatus, removeSpecialCharacters } from "@/lib/utils"
import Image from "next/image"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
   } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
   
  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
} 

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
      <Image
        src="/icons/transaction.svg"
        width={32}
        height={32}
        alt="Sem transações"
        className="opacity-50"
      />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma transação encontrada</h3>
    <p className="text-gray-500 text-center">As transações aparecerão aqui quando você começar a usar sua conta.</p>
  </div>
)

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  if (!transactions || transactions.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader className="bg-[#f9fafb] sticky top-0">
          <TableRow>
            <TableHead className="px-4 py-3">Transação</TableHead>
            <TableHead className="px-4 py-3">Valor</TableHead>
            <TableHead className="px-4 py-3">Status</TableHead>
            <TableHead className="px-4 py-3">Data</TableHead>
            <TableHead className="px-4 py-3 max-md:hidden">Canal</TableHead>
            <TableHead className="px-4 py-3 max-md:hidden">Categoria</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.date))
            const amount = formatAmount(t.amount)

            const isDebit = t.type === 'debit';
            const isCredit = t.type === 'credit';

            return (
              <TableRow 
                key={t.id} 
                className={cn(
                  'hover:bg-gray-50/50 transition-colors',
                  isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'
                )}
              >
                <TableCell className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      isDebit ? 'bg-red-50' : 'bg-green-50'
                    )}>
                      <Image
                        src={isDebit ? '/icons/arrow-down.svg' : '/icons/arrow-up.svg'}
                        width={20}
                        height={20}
                        alt={isDebit ? 'débito' : 'crédito'}
                        className={cn(
                          isDebit ? 'text-red-500' : 'text-green-500'
                        )}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-medium text-gray-900">
                        {removeSpecialCharacters(t.name)}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {t.category}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className={cn(
                  'px-4 py-4 font-medium',
                  isDebit || amount[0] === '-' ? 'text-red-600' : 'text-green-600'
                )}>
                  {isDebit ? `-${amount}` : amount}
                </TableCell>

                <TableCell className="px-4 py-4">
                  <CategoryBadge category={status} /> 
                </TableCell>

                <TableCell className="px-4 py-4 text-sm text-gray-500">
                  {formatDateTime(new Date(t.date)).dateTime}
                </TableCell>

                <TableCell className="px-4 py-4 capitalize text-sm text-gray-500 max-md:hidden">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="px-4 py-4 max-md:hidden">
                  <CategoryBadge category={t.category} /> 
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default TransactionsTable