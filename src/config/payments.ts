// Centralized payment configuration
// Update these accounts with your real business bank details

export type BankAccount = {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
};

export const bankAccounts: BankAccount[] = [
  {
    bankName: "Meezan Bank",
    accountTitle: "FitForge",
    accountNumber: "0000-0000000-0",
  },
  {
    bankName: "HBL",
    accountTitle: "FitForge",
    accountNumber: "0000-000000-000-00",
  },
];


