/** Display name for StaffDto shape: { user: { firstName, lastName, name } }. */
export function staffAssigneeDisplayName(assignedTo) {
  if (!assignedTo) return "";
  if (typeof assignedTo !== "object") return String(assignedTo);
  const u = assignedTo?.user;
  if (!u) return "";
  return [u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.name || "";
}
