const bcrypt = require("bcryptjs");
const { tx } = require("../../config/db");
const AppError = require("../../utils/AppError");
const { CHILD_ROLES, ROLES } = require("../../constants/roles");
const userRepo = require("../users/user.repository");

function canCreate(actorRole, targetRole) {
  return (CHILD_ROLES[actorRole] || []).includes(targetRole);
}

function getAllowedRoles(actor) {
  return CHILD_ROLES[actor.role_key] || [];
}

async function createChild(actor, payload) {
  return tx(async (con) => {
    if (!payload.role_key) throw new AppError("Role is required");
    if (!payload.name) throw new AppError("Name is required");
    if (!payload.username) throw new AppError("Username is required");
    if (!payload.password) throw new AppError("Password is required");

    if (!canCreate(actor.role_key, payload.role_key)) {
      throw new AppError("You cannot create this role", 403);
    }

    const role = await userRepo.getRoleByKey(payload.role_key, con);
    if (!role) throw new AppError("Invalid role");

    const parentId = payload.parent_id || actor.id;

    const parent = await userRepo.findById(parentId, con);
    if (!parent) throw new AppError("Parent not found");

    if (parent.id !== actor.id) {
      throw new AppError("You can create user only under yourself", 403);
    }

    if (parent.role_key === payload.role_key) {
      throw new AppError("Same level parent-child is not allowed");
    }

    const hash = await bcrypt.hash(payload.password, 10);

    const id = await userRepo.createUser(
      {
        role_id: role.id,
        parent_id: parentId,
        name: payload.name,
        username: payload.username,
        mobile: payload.mobile,
        password_hash: hash,
        created_by: actor.id,
      },
      con,
    );

    await userRepo.createWallet(id, 0, con);

    await con.query(
      "INSERT INTO audit_logs(actor_user_id,action,entity_name,entity_id,details) VALUES(?,?,?,?,?)",
      [
        actor.id,
        "CREATE_USER",
        "users",
        String(id),
        JSON.stringify({ role_key: payload.role_key, parent_id: parentId }),
      ],
    );

    return userRepo.findById(id, con);
  });
}

async function getMyTree(actor) {
  return userRepo.listByScope(actor.id);
}

async function getDirectChildren(actor) {
  return userRepo.listDirectChildren(actor.id);
}

module.exports = {
  createChild,
  getMyTree,
  getDirectChildren,
  getAllowedRoles,
};
