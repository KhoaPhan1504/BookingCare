import db from "../models";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist

        let user = await db.User.findOne({
          where: { email },
          attributes: ["email", "roleId", "password", "firstName", "lastName"],
          raw: true,
        });
        if (user) {
          //compare password
          let check = bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "OK";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong password!";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User not found!";
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage =
          "Your's email is not exist!, please register first!";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = async (userEmail) => {
  try {
    let user = await db.User.findOne({
      where: { email: userEmail },
    });
    if (user) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const getAllUsers = async (userId) => {
  try {
    let users = "";

    if (userId === "ALL") {
      users = await db.User.findAll({
        attributes: {
          exclude: ["password"],
        },
      });
    } else if (userId && userId !== "ALL") {
      users = await db.User.findOne({
        where: { id: userId },
        attributes: {
          exclude: ["password"],
        },
      });
    }

    return users;
  } catch (error) {
    console.error(error);
  }
};

const createNewUser = (dataUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      // check email is existed
      const checkEmailExisted = await checkUserEmail(dataUser.email);
      if (checkEmailExisted) {
        resolve({
          errCode: 1,
          errMessage:
            "Your email is already existed. Please try another email!",
        });
      } else {
        const hashPasswordFromBcrypt = await hashUserPassword(
          dataUser.password
        );
        await db.User.create({
          email: dataUser.email,
          password: hashPasswordFromBcrypt,
          firstName: dataUser.firstName,
          lastName: dataUser.lastName,
          address: dataUser.address,
          phoneNumber: dataUser.phoneNumber,
          gender: dataUser.gender,
          roleId: dataUser.role,
          positionId: dataUser.position,
          image: dataUser.avatar,
        });

        resolve({ errCode: 0, message: "Created successfully new User!" });
      }
    } catch (error) {
      reject(error);
    }
  });
};

const hashUserPassword = (password) => {
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

const deleteUserById = async (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });

      if (!user) {
        resolve({
          errCode: 2,
          errMessage: "The user is not exist!",
        });
      }

      await db.User.destroy({
        where: { id: userId },
      });
      resolve({
        errCode: 0,
        message: "The user is deleted!",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserInfo = async (data) => {
  try {
    if (!data.id || !data.gender || !data.position || !data.role) {
      return {
        errCode: 1,
        errMessage: "Missing required parameter!",
      };
    }
    let user = await db.User.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (user) {
      user.email = data.email;
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;
      user.roleId = data.role;
      user.positionId = data.position;
      user.gender = data.gender;
      user.phoneNumber = data.phoneNumber;
      user.image = data.avatar;

      await user.save();
      return {
        errCode: 0,
        message: "Update user data successfully!",
      };
    } else {
      return {
        errCode: 2,
        errMessage: "The user is not exist!",
      };
    }
  } catch (error) {
    return error;
  }
};

const getAllCodeService = async (type) => {
  try {
    if (!type) {
      return {
        errCode: 1,
        errMessage: "Missing required parameters!",
      };
    }

    const allCode = await db.Allcode.findAll({
      where: { type },
    });
    return {
      errCode: 0,
      data: allCode,
    };
  } catch (error) {
    return error;
  }
};

module.exports = {
  handleUserLogin,
  getAllUsers,
  createNewUser,
  deleteUserById,
  updateUserInfo,
  getAllCodeService,
};
