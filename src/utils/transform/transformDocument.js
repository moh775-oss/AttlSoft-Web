export function transformDocument(d) {
  return {
    id: d.ID,
    name: d.trans_name_ar,
    label: `${d.trans_name_ar}`,

    ID: d.ID,
    trans_code: d.trans_code,
    trans_name_ar: d.trans_name_ar,
    trans_name_en: d.trans_name_en,
    trans_rest_type: d.trans_rest_type,
    system_id: d.system_id,
    op_calc: d.op_calc,
    branch: d.branch,
    create_user: d.create_user,
    create_date: d.create_date,
    Is_Sync: d.Is_Sync,
    Pc_ID: d.Pc_ID,
    update_user: d.update_user
  };
}