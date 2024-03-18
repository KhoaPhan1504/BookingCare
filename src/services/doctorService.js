import db from "../models";

const getTopDoctorHome = async (limit) => {
  try {
    const users = await db.User.findAll({
      limit,
      where: { roleId: "R2" },
      order: [["createdAt", "DESC"]],
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: db.Allcode,
          as: "positionData",
          attributes: ["valueEn", "valueVi"],
        },
        {
          model: db.Allcode,
          as: "genderData",
          attributes: ["valueEn", "valueVi"],
        },
      ],
      raw: true,
      nest: true,
    });

    return {
      errCode: 0,
      data: users,
    };
  } catch (error) {
    return error;
  }
};

module.exports = { getTopDoctorHome };
