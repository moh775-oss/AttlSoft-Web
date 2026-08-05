export function transformOmlat(o) {
  return {
    id: o.id,
    name: o.name,
    label: o.name,

    exchange: o.exchange,
    IS_Default: o.IS_Default,
    IS_Active: o.IS_Active,
    symbol: o.symbol,
    NameEn: o.NameEn,
    Country: o.Country,
    oneEqualto: o.oneEqualto,
    TotalFaka: o.TotalFaka,
    is_main: o.is_main,
    create_user: o.create_user,
    create_date: o.create_date,
    update_user: o.update_user,
    update_date: o.update_date,
    branch: o.branch,
    omla_desc: o.omla_desc,
    Is_Sync: o.Is_Sync,
    Pc_ID: o.Pc_ID,
    omltCode: o.omltCode
  };
}