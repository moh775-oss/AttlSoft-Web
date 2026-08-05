export function transformUser(u) {
  return {
    id: u.User_ID,
    name: u.UserName,
    label: u.FullName || u.UserName,

    UserName: u.UserName,
    UserPassWord: u.UserPassWord,
    User_Type: u.User_Type,
    FullName: u.FullName,
    UserEmail: u.UserEmail,
    Address: u.Address,
    Branch_ID: u.Branch_ID,
    Role_Status: u.Role_Status,
    Branch: u.Branch,

    Settings: u.Settings,
    Cat: u.Cat,
    Unit: u.Unit,
    AddPrd: u.AddPrd,
    Prd_Manage: u.Prd_Manage,
    Store: u.Store,
    Sale: u.Sale,
    Buy: u.Buy,
    Customer: u.Customer,
    Supplier: u.Supplier,
    Users: u.Users,
    Logs: u.Logs,
    allBranch: u.allBranch
  };
}