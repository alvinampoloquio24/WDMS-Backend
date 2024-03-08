const roles = {
  admin: {
    User: ["manage"],
    Contribution: ["manage"],
    Transaction: ["manage"],
    RecycleBin: ["manage"],
    Announcement: ["manage"],
  },
  member: {
    User: ["updateSelf", "readSelf"],
    Contribution: ["read"],
    Transaction: ["create", "readSelf"],
  },
  cashier: {
    User: ["read", "readSelf", "updateSelf"],
    Contribution: ["read", "readALL"],
    Transaction: ["manage"],
    RecycleBin: ["create"],
  },
};

module.exports = roles;
