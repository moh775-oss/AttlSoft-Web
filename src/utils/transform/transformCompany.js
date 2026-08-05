export function transformCompany(c) {
  return {
    id: c.Company_ID,
    name: c.CompanyName,
    label: c.CompanyName,

    CompanyName: c.CompanyName,
    Vat_No: c.Vat_No,
    Address: c.Address,
    Phone1: c.Phone1,
    Phone2: c.Phone2,
    Country: c.Country,
    City: c.City,
    CompanyEmail: c.CompanyEmail,
    Footer1: c.Footer1,
    Footer2: c.Footer2,
    Footer3: c.Footer3,
    Logo: c.Logo,
    branch: c.branch,
    UserID: c.UserID,
    CommreicalRegister: c.CommreicalRegister,
    street: c.street,
    AreaLocation: c.AreaLocation,
    BuildNumber: c.BuildNumber,
    postOfficeNO: c.postOfficeNO,
    schem_code: c.schem_code
  };
}