export function transformImporter(i) {
  return {
    id: i.Importer_ID,
    name: i.Imp_Name,
    label: `${i.Imp_Name} - ${i.Phone || ''}`,
    Vat_No: i.Vat_No,
    Acc_NO: i.Acc_NO,
    Address: i.Address,
    Phone: i.Phone,
    Depit_Limit: i.Depit_Limit,
    Balance: i.Balance,
    branch: i.branch,
    UserID: i.UserID,
    srl_code: i.srl_code,
    address2: i.address2,
    bussns_no: i.bussns_no,
    country: i.country,
    city: i.city,
    street: i.street,
    AreaLocation: i.AreaLocation,
    BuildNumber: i.BuildNumber,
    TheCode: i.TheCode,
    schem_code: i.schem_code,
    both: i.both
  };
}