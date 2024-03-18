import userService from "../services/userService";

let getLogin = (req, res) => {
  return res.render("login.ejs");
};

const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing inputs parameter!",
    });
  }

  const userData = await userService.handleUserLogin(email, password);

  // return res.status(200).json({
  //   errCode: userData.errCode,
  //   message: userData.errMessage,
  //   user: userData.user ? userData.user : {},
  // });
  return res.render('ContentPage.ejs');
};

const handleGetAllUsers = async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
      users: [],
    });
  }

  const users = await userService.getAllUsers(id);
  // return res.status(200).json({
  //   errCode: 0,
  //   errMessage: "OK",
  //   users,

  // });
  return res.render("displayCRUD.ejs", {
    dataTable: users
  })
};

const handleCreateNewUser = async (req, res) => {
  const message = await userService.createNewUser(req.body);
  return res.status(201).json(message);
};

const handleEditUser = async (req, res) => {
  let userData = req.body;
  const message = await userService.updateUserInfo(userData);
  return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(404).json({
      errCode: 1,
      errMessage: "Missing required parameter!",
    });
  }

  const message = await userService.deleteUserById(req.body.id);
  return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
  try {
    const result = await userService.getAllCodeService(req.query.type);
    res.status(200).json(result);
  } catch (e) {
    console.log("Error get AllCode:", e);
    res.status(500).json({
      errCode: -1,
      errMessage: "Error from server.",
    });
  }
};

module.exports = {
  getLogin,
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
  getAllCode,
};
