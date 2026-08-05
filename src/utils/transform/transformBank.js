export function transformBank(b) {
  return {
    id: b.Bank_ID,
    name: b.BankName,
    label: b.BankName,

    Account_No: b.Account_No,
    BranchName: b.BranchName,
    AccountType: b.AccountType,
    AccountIban: b.AccountIban,
    AccountBalance: b.AccountBalance,
    userID: b.userID,
    branch: b.branch,
    srl_code: b.srl_code
  };
}