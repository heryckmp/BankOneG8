"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";
import { cn } from "@/lib/utils";

// Dados de bancos demo
const demoAccounts = [
  {
    id: 'demo1',
    appwriteItemId: 'demo1',
    name: 'Banco OneG8',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Conta Corrente OneG8',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 'demo2',
    appwriteItemId: 'demo2',
    name: 'Banco Bradesco',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Conta Corrente Bradesco',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'demo3',
    appwriteItemId: 'demo3',
    name: 'Banco Itaú',
    currentBalance: 2840.40,
    availableBalance: 2840.40,
    type: 'depository',
    subtype: 'checking',
    mask: '1234',
    officialName: 'Conta Corrente Itaú',
    badgeColor: 'bg-purple-500'
  }
];

interface BankDropdownProps {
  accounts: Account[];
  setValue?: (key: string, value: string) => void;
  otherStyles?: string;
  selected?: Account | null;
}

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles = "",
  selected = null,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Usa contas demo se não houver contas reais
  const accountsToDisplay = accounts?.length > 0 ? accounts : demoAccounts;
  const defaultBank = selected || accountsToDisplay[0];
  const [selectedBank, setSelectedBank] = useState(defaultBank);

  const handleBankChange = (value: string) => {
    const account = accountsToDisplay.find((account) => account.appwriteItemId === value);
    
    if (!account) return;

    setSelectedBank(account);

    if (setValue) {
      setValue("senderBank", value);
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: value,
    });
    
    router.push(newUrl, { scroll: false });
  };

  return (
    <Select
      defaultValue={defaultBank.appwriteItemId}
      onValueChange={handleBankChange}
    >
      <SelectTrigger className={`w-full flex items-center gap-3 ${otherStyles}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${selectedBank.badgeColor || 'bg-blue-500'}`} />
          <p className="line-clamp-1 w-full text-left">{selectedBank.name}</p>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-none shadow-lg">
        <SelectGroup>
          <SelectLabel className="text-sm font-medium text-gray-500 px-2 py-1 border-b">
            Selecione um banco
          </SelectLabel>
          {accountsToDisplay.map((account) => (
            <SelectItem 
              key={account.appwriteItemId} 
              value={account.appwriteItemId}
              className={cn(
                "cursor-pointer transition-colors",
                "hover:bg-gray-50",
                "data-[state=checked]:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-3 px-2 py-2">
                <div className={`w-2 h-2 rounded-full ${account.badgeColor || 'bg-blue-500'}`} />
                <p>{account.name}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
