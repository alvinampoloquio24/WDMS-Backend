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
    Contribution: ["manage"],
    Transaction: ["manage"],
    Announcement: ["read"],
  },
  cashier: {
    User: ["manage"],
    Contribution: ["manage"],
    Transaction: ["manage"],
    RecycleBin: ["create"],
    Announcement: ["manage"],
  },
};

module.exports = roles;
