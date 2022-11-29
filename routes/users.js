const router = require("express").Router();
const { getUserInfo, updateUserInfo } = require("../controllers/users");
const {
  validationGetUserInfo,
  validationUpdateUserInfo,
} = require("../utils/validations");

router.get("/me", validationGetUserInfo, getUserInfo);
router.patch("/me", validationUpdateUserInfo, updateUserInfo);

module.exports = router;
