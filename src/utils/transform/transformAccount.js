export function transformAccount(a) {
  return {
    id: a.Code,
    name: a.AName,
    label: `${a.AName} - ${a.Code}`,

    Code: a.Code,
    AName: a.AName,
    Nature: a.Nature,
    Type: a.Type,
    ParentCode: a.ParentCode,
    UserName: a.UserName,
    FinalAcc: a.FinalAcc,
    Total_Debts: a.Total_Debts,
    Total_Credits: a.Total_Credits,
    Acc_branch: a.Acc_branch,
    is_center: a.is_center,
    default_center: a.default_center,
    create_user: a.create_user,
    create_date: a.create_date,
    update_user: a.update_user,
    update_date: a.update_date,
    branch: a.branch,
    srl: a.srl,
    res_id: a.res_id,
    acc_level: a.acc_level,
    IS_AccStopped: a.IS_AccStopped,
    Is_Sync: a.Is_Sync,
    Pc_ID: a.Pc_ID,
    Notes: a.Notes
  };
}