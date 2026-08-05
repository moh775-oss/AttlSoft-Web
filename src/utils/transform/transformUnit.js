export function transformUnit(u) {
  return {
    id: u.Unit_ID,
    name: u.UnitName,
    label: u.UnitName,

    UnitName: u.UnitName,
    branch: u.branch,
    Is_Sync: u.Is_Sync,
    Pc_ID: u.Pc_ID,
    UserID: u.UserID
  };
}