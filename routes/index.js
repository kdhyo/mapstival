const express = require("express");
const router = express.Router();
const mysql = require("mysql"); // mysql 모듈 require
const models = require("../models");

// 커넥션 연결 test
let client = mysql.createConnection({
  user: "root",
  password: "qwe123",
  database: "mapstival",
});

//로그인 GET
router.get("/", function (req, res) {
  let session = req.session;

  res.render("index", {
    session: session,
  });
});

router.get("/board", async function (req, res, next) {
  let result = await models.post.findAll();
  if (result) {
    for (let post of result) {
      let result2 = await models.post.findOne({
        include: {
          model: models.reply,
          where: {
            postId: post.id,
          },
        },
      });
      if (result2) {
        post.replies = result2.replies;
      }
    }
  }
  res.render("show", {
    posts: result,
  });
});

router.post("/create", function (req, res, next) {
  const body = req.body;
  const setUser = async () => {
    const newUser = {
      user_id: body.user_id,
      password: body.password,
      email: body.email,
      phone: body.phone,
      username: body.username,
      birthday: body.birthday,
      body: sex,
    };
    const users = await models.User.create(newUser);
    if (users) {
      console.log("데이터 추가 완료");
      res.redirect("/create");
    }
  };
  client.query(
    "INSERT INTO users (user_id, password, email, phone, username, birthday, sex) VALUES (?, ?, ?, ?, ?, ?, ?);",
    [
      body.user_id,
      body.password,
      body.email,
      body.phone,
      body.username,
      body.birthday,
      body.sex,
    ],
    function () {
      res.redirect("/create");
    }
  );
});

router.post("/board", function (req, res, next) {
  let body = req.body;
  console.log(body);

  models.post
    .create({
      title: body.inputTitle,
      writer: body.inputWriter,
    })
    .then((result) => {
      console.log("데이터 추가 완료");
      res.redirect("/board");
    })
    .catch((err) => {
      console.log(`데이터 추가 실패${err}`);
    });
});

router.get("/board/:id", function (req, res, next) {
  let postID = req.params.id;

  models.post
    .findOne({
      where: { id: postID },
    })
    .then((result) => {
      res.render("edit", {
        post: result,
      });
    })
    .catch((err) => {
      console.log("데이터 조회 실패");
    });
});

router.put("/board/:id", function (req, res, next) {
  let postID = req.params.id;
  let body = req.body;

  models.post
    .update(
      {
        title: body.editTitle,
        writer: body.editWriter,
      },
      {
        where: { id: postID },
      }
    )
    .then((result) => {
      console.log("데이터 수정 완료");
      res.redirect("/board");
    })
    .catch((err) => {
      console.log("데이터 수정 실패");
    });
});

router.delete("/board/:id", function (req, res, next) {
  let postID = req.params.id;

  models.post
    .destroy({
      where: { id: postID },
    })
    .then((result) => {
      res.redirect("/board");
    })
    .catch((err) => {
      console.log("데이터 삭제 실패");
    });
  models.reply
    .destroy({
      where: { postId: postID },
    })
    .then((result) => {
      res.redirect("/board");
    })
    .catch((err) => {
      console.log("데이터 삭제 실패");
    });
});

// 댓글 등록
router.post("/reply/:postID", function (req, res, next) {
  let postID = req.params.postID;
  let body = req.body;

  models.reply
    .create({
      postId: postID,
      writer: body.replyWriter,
      content: body.replyContent,
    })
    .then((results) => {
      res.redirect("/board");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
