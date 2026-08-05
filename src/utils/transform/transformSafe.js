export function transformSafe(s) {
  return {
    id: s.Safe_ID,
    name: s.SafeName,
    label: s.SafeName,

    SafeBalance: s.SafeBalance,
    StartDate: s.StartDate,
    acc_code: s.acc_code,
    Branch_ID: s.Branch_ID,
    branch: s.branch,
    UserID: s.UserID,
    srl_code: s.srl_code,
    Is_Sync: s.Is_Sync,
    Pc_ID: s.Pc_ID
  };
}