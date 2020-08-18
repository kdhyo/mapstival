const express = require("express");
const router = express.Router();
const models = require("../models");
const board = models.Board;
const sequelize = require("sequelize");
const Op = sequelize.Op;
const crypto = require("crypto");

// 게시판 데이터 받아서 쿼리에 넣어주는 라우터
router.post("/create", async (req, res) => {
  //패스워드를 sha512와 salt 랜덤변수를 활용하여 암호화
  const inputPassword = req.body.password;
  let salt = Math.round(new Date().valueOf() * Math.random()) + "";
  let hashPassword = crypto
    .createHash("sha512")
    .update(inputPassword + salt)
    .digest("hex");

  //비동기 방식으로 db에 저장
  try {
    // 받아온 데이터 저장
    const data = {
      festival_id: req.query.id,
      nickname: req.body.name,
      password: hashPassword,
      scope: req.body.scope,
      review: req.body.message,
      salt: salt,
    };

    const docs = await models.Board.create(data);
    res.json({
      code: 200,
      result: docs,
      message: "성공",
    });
  } catch (error) {
    return res.json({
      code: 500,
      result: req.body,
      message: "서버에러발생",
    });
  }
});

// 패스워드가 맞는지 확인한다.
router.post("/passwordCheck", async (req, res) => {
  const body = req.body;
  console.log(body);
  try {
    let result = await models.Board.findOne({
      where: {
        id: body.idx,
      },
    });

    //db패스워드와 입력패스워드를 가져와 비교한다.
    let dbPassword = result.dataValues.password;
    let inputPassword = body.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto
      .createHash("sha512")
      .update(inputPassword + salt)
      .digest("hex");

    if (dbPassword === hashPassword) {
      return res.redirect("/board/modify/?idx=" + req.body.idx);
    } else {
      return res.redirect(
        "/mapstival/detail/?id=" + result.dataValues.festival_id
      );
    }
  } catch (error) {
    res.send(`에러: ${error}`);
  }
});

// modify.ejs에 db정보를 전달해준다.
router.get("/modify", async (req, res) => {
  const id = req.query.idx;
  try {
    let result = await models.Board.findOne({
      where: {
        id: id,
      },
    });

    //db패스워드와 입력패스워드를 가져와 비교한다.
    let dbId = result.dataValues.festival_id;
    let dbName = result.dataValues.nickname;
    let dbPassword = result.dataValues.password;
    let dbReView = result.dataValues.review;

    return res.render("board/modify", {
      dbName: dbName,
      dbPassword: dbPassword,
      dbReView: dbReView,
      dbId: dbId,
      idx: id,
    });
  } catch (error) {
    res.send(`에러: ${error}`);
  }
});

//게시글 정보 삭제처리
//http://localhost:3000/board/delete/1
router.get("/delete", async (req, res) => {
  let idx = req.query.id;
  console.log(req.body);

  console.log(idx);
  try {
    let dbData = await models.Board.findOne({
      where: {
        id: idx,
      },
    });
    let result = await models.Board.destroy({
      where: {
        id: idx,
      },
    });

    const festival_id = dbData.dataValues.festival_id;
    console.log(result);
    return res.redirect("/mapstival/detail/?id=" + festival_id);
  } catch (error) {
    res.send(`에러: ${error}`);
  }
});

router.post("/update", async (req, res) => {
  console.log(req.body);
  let idx = req.body.index;
  let festival_id = req.body.fastivalId;
  let nickname = req.body.nickname;
  let review = req.body.review;
  let scope = req.body.scope;

  //패스워드를 sha512와 salt 랜덤변수를 활용하여 암호화
  let inputPassword = req.body.password;
  let salt = Math.round(new Date().valueOf() * Math.random()) + "";
  let hashPassword = crypto
    .createHash("sha512")
    .update(inputPassword + salt)
    .digest("hex");

  try {
    const updateData = await models.board.update(
      {
        nickname: nickname,
        password: hashPassword,
        review: review,
        scope: scope,
        salt: salt,
      },
      { where: { id: idx } }
    );

    console.log(updateData);

    return res.redirect("/mapstival/detail/?id=" + festival_id);
  } catch (error) {
    return res.send("왜 또 시발 에러야", error);
  }
});

router.post("/search", (req, res) => {
  const id = req.body.id;

  board
    .findAll({
      where: {
        festival_id: {
          [Op.like]: id,
        },
      },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
