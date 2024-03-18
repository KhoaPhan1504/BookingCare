import bcrypt from "bcryptjs";
import db from "../models";

let createNewUser = (dataUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcrypt = await hashUserPassword(dataUser.password);
      await db.User.create({
        email: dataUser.email,
        password: hashPasswordFromBcrypt,
        firstName: dataUser.firstName,
        lastName: dataUser.lastName,
        address: dataUser.address,
        phoneNumber: dataUser.phoneNumber,
        gender: dataUser.gender === "1" ? true : false,
        roleId: dataUser.roleId,
      });
      resolve("Created successfully new User!");
    } catch (error) {
      reject(error);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise((resolve, reject) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = async (req, res) => {
  try {
    const allUsers = await db.User.findAll({
      raw: true,
    });
    return allUsers;
  } catch (error) {
    console.error(error);
    res.status(404).send("Get All User failed!");
  }
};
const getUserInfoById = async (id) => {
  try {
    const user = await db.User.findOne({
      where: {
        id,
      },
      raw: true,
    });
    return user;
  } catch (error) {
    console.log("Not found user in database" + error);
  }
};

const updateUserData = async (userData) => {
  try {
    let userUpdate = await db.User.findOne({ where: { id: userData.id } });
    if (userUpdate) {
      userUpdate.firstName = userData.firstName;
      userUpdate.lastName = userData.lastName;
      userUpdate.address = userData.address;

      await userUpdate.save();
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteUserById = async (userId) => {
  try {
    await db.User.destroy({ where: { id: userId } });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createNewUser,
  getAllUser,
  getUserInfoById,
  updateUserData,
  deleteUserById,
};
