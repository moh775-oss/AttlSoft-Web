export function transformTaxGroup(t) {
  return {
    id: t.id,
    name: t.nameAR,
    label: `${t.nameAR} - ${t.TaxPercent}%`,

    nameAR: t.nameAR,
    nameEN: t.nameEN,
    TaxPercent: t.TaxPercent,
    IS_Default: t.IS_Default,
    IS_Active: t.IS_Active,
    create_date: t.create_date,
    UserID: t.UserID,
    branch: t.branch,
    UpdateDate: t.UpdateDate,
    Is_Sync: t.Is_Sync,
    Pc_ID: t.Pc_ID,
    UserUpd: t.UserUpd
  };
}