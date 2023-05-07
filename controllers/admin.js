const userSchema = require("../model/userModel");

const retriveSysUsers = async () => {
  const sysUsers = await userSchema.find({});
  sysUsers.forEach((element) => {
    const id = JSON.stringify(element["_id"]).replace(/['"]+/g, "");
    console.log(id);
  });
};

module.exports = { retriveSysUsers };
