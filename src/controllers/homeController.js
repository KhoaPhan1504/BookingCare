import db from "../models";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    // console.log(data);
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

let getAboutPage = (req, res) => {
  return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let message = await CRUDService.createNewUser(req.body);
  // console.log(message);
  // return res.send("post crud from server");
  return res.redirect('/get-crud');
};

let displayGetCRUD = async (req, res) => {
  const users = await CRUDService.getAllUser();

  return res.render("displayCRUD.ejs", {
    dataTable: users,
  });
};

const getEditCRUD = async (req, res) => {
  const userId = req.query.id;
  if (userId) {
    const userData = await CRUDService.getUserInfoById(userId);

    return res.render("editCRUD.ejs", { userData: userData });
  } else {
    return res.send("Not found URL valid! Please re-check param id on the URL");
  }
};

const putCRUD = async (req, res) => {
  const userData = req.body;
  await CRUDService.updateUserData(userData);
  return res.redirect("/get-crud");
};

const deleteCRUD = async (req, res) => {
  const userId = req.query.id;
  if (userId) {
    await CRUDService.deleteUserById(userId);
    return res.redirect("/get-crud");
  } else {
    return res.send("Id user invalid or not found!");
  }
};

module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
