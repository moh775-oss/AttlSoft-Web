export function transformCategory(c) {
  return {
    id: c.Cat_ID,
    name: c.CatName,
    label: c.CatName,

    branch: c.branch,
    UserID: c.UserID,
    Dep_ID: c.Dep_ID,
    Cat_Status: c.Cat_Status,
    FontName: c.FontName,
    FontSize: c.FontSize,
    FontStyle: c.FontStyle,
    BtnColor: c.BtnColor,
    BtnFontColor: c.BtnFontColor
  };
}