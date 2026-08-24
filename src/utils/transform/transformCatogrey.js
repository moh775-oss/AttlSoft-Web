export function transformCategory(c) {
  return {
    id: c.Cat_ID,
    name: c.catName,
    label: c.catName,

    branch: c.branch,
    userID: c.userId,
    dep_ID: c.dep_ID,
    cat_Status: c.Cat_Status,
    // FontName: c.FontName,
    // FontSize: c.FontSize,
    // FontStyle: c.FontStyle,
    // BtnColor: c.BtnColor,
    // BtnFontColor: c.BtnFontColor
  };
}