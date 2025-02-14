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

  if (!accounts || accounts.length === 0) {
    return null;
  }

  const defaultBank = selected || accounts[0];

  const handleBankChange = (value: string) => {
    const account = accounts.find((account) => account.appwriteItemId === value);
    
    if (!account) return;

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
        <Image
          src="/icons/bank.svg"
          alt="account"
          width={16}
          height={16}
        />
        <p className="line-clamp-1 w-full text-left">{defaultBank.name}</p>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem 
            key={account.appwriteItemId} 
            value={account.appwriteItemId}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/icons/bank.svg"
                alt="account"
                width={16}
                height={16}
              />
              <p>{account.name}</p>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BankDropdown;
