
const rolesHierarchy = {
  SUPER_ADMIN: ["SUPER_DISTRIBUTOR", "DISTRIBUTOR", "RETAILER", "USER"],
  SUPER_DISTRIBUTOR: ["DISTRIBUTOR"],
  DISTRIBUTOR: ["RETAILER"],
  RETAILER: ["USER"]
};

function canCreate(parentRole, childRole) {
  return rolesHierarchy[parentRole]?.includes(childRole);
}

module.exports = { canCreate };
