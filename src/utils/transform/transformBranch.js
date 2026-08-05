export function transformBranch(b) {
  return {
    id: b.Branch_ID,
    name: b.BranchName,
    label: b.BranchName,

    BranchAddress: b.BranchAddress,
    BranchPhone: b.BranchPhone,
    BranchManger: b.BranchManger,
    branch: b.branch,
    UserID: b.UserID
  };
}