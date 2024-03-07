const Permissions = require("../config/roleTable");
const { AbilityBuilder, Ability } = require("@casl/ability");

function defineAbilitiesFor(role) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  const permissions = Permissions[role];

  if (permissions) {
    Object.keys(permissions).forEach((resource) => {
      const actions = permissions[resource];
      if (actions.includes("manage")) {
        can("manage", resource);
      } else {
        actions.forEach((action) => {
          if (action) {
            can(action, resource);
          }
        });
      }
    });
  }

  return build();
}

function checkAbility(action, resource) {
  return (req, res, next) => {
    const role = req.user.role; // Assuming `req.user.role` contains the user's role
    const ability = defineAbilitiesFor(role);

    if (ability.can(action, resource)) {
      return next();
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  };
}

module.exports = checkAbility;
