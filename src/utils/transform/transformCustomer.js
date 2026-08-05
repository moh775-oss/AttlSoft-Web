export function transformCustomer(c) {
  return {
    id: c.Customer_ID,
    name: c.Cus_Name,
    label: `${c.Cus_Name} - ${c.Phone || ''}`,

    Vat_No: c.Vat_No,
    Acc_NO: c.Acc_NO,
    Address: c.Address,
    Phone: c.Phone,
    Depit_Limit: c.Depit_Limit,
    Balance: c.Balance,
    branch: c.branch,
    UserID: c.UserID,
    srl_code: c.srl_code,
    address2: c.address2,
    bussns_no: c.bussns_no,
    country: c.country,
    city: c.city,
    street: c.street,
    AreaLocation: c.AreaLocation,
    BuildNumber: c.BuildNumber,
    TheCode: c.TheCode,
    paid_type: c.paid_type,
    schem_code: c.schem_code,
    both: c.both
  };
}