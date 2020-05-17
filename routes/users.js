const express = require("express");
const router = express.Router();
const models = require("../models");
const crypto = require("crypto");

// 회원가입 GET
router.get("/signup", function (req, res, next) {
  res.render("user/signup");
});

// 회원가입 POST
router.post("/signup", async function (req, res, next) {
  let body = req.body;
  console.log(body);
  let inputPassword = body.password;
  let salt = Math.round(new Date().valueOf() * Math.random()) + "";
  let hashPassword = crypto
    .createHash("sha512")
    .update(inputPassword + salt)
    .digest("hex");
  models.user
    .create({
      user_id: body.user_id,
      password: hashPassword,
      email: body.email,
      phone: body.phone,
      username: body.username,
      birthday: body.birthday,
      sex: body.sex,
      salt: salt,
    })
    .then((result) => {
      console.log("회원 가입 성공");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(`회원가입에 실패하였습니다 : ${err}`);
      res.redirect("/user/signup");
    });
});

//메인페이지
router.get("/", function (req, res, next) {
  if (req.cookies) {
    console.log(req.cookies);
  }
  res.send("환영합니다!");
});

//로그인 POST
router.post("/login", async function (req, res, next) {
  let body = req.body;
  let session = req.session;
  console.log(session);
  console.log(body);
  let result = await models.user.findOne({
    where: {
      user_id: body.user_id,
    },
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto
    .createHash("sha512")
    .update(inputPassword + salt)
    .digest("hex");

  if (dbPassword === hashPassword) {
    console.log("비밀번호 일치");
    //세션 설정
    req.session.user_id = body.user_id;
    return req.session.save(() => {
      res.redirect("/");
    });
  } else {
    console.log("비밀번호 불일치");
    res.redirect("/");
  }
});

// 로그아웃 GET
router.get("/logout", function (req, res, next) {
  console.log("두둥");
  req.session.destroy();
  res.clearCookie("sid");

  res.redirect("/");
});

module.exports = router;
