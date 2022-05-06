"use strict";

var query = require("../conn");

//CRUD posting/status content users

exports.createComments = async function (req, res) {
  try {
    const { user_id, post_id, comment } = req.body;

    const findUserId = await query(
      `SELECT * FROM person WHERE id = ${user_id} AND deleted is null`
    );

    const findPostId = await query(
      `SELECT * FROM posts WHERE id = ${post_id} AND deleted is null`
    );

    if (findUserId.length === 0 || findPostId.length === 0) {
      return res.status(400).send({
        status: false,
        message: "user_id atau post_id tidak ditemukan.",
      });
    }

    await query(
      `INSERT INTO comments(user_id, post_id, comment) values (${user_id}, ${post_id}, "${comment}")`
    );
    res.send({
      status: true,
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.comments = async function (req, res) {
  try {
    const comments = await query(
      "SELECT * FROM comments where deleted is null"
    );

    comments.map((comment) => {
      delete comment.deleted;
      return comment;
    });

    res.send({
      status: true,
      message: "Semua comments",
      data: comments,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.findComments = async function (req, res) {
  const { comment_id } = req.params;
  try {
    const findCommentsId = await query(
      `SELECT * FROM comments WHERE id = ${comment_id} AND deleted is null`
    );

    if (findCommentsId.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }
    delete findCommentsId[0].deleted;

    res.send({
      status: true,
      message: "Data Status",
      data: findCommentsId[0],
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.updateComments = async function (req, res) {
  try {
    const { comment_id } = req.params;
    const { comment } = req.body;

    const commentsInDB = await query(
      `SELECT * FROM comments WHERE id = ${comment_id} AND deleted is null`
    );

    if (commentsInDB.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Comment tidak ditemukan.",
      });
    }

    await query(
      `UPDATE comments SET comment = '${comment}' WHERE id = ${comment_id}`
    );

    res.send({
      status: true,
      message: "Update success",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.deleteComments = async function (req, res) {
  try {
    const { comment_id } = req.params;
    console.log("params", req.params);
    await query(
      `UPDATE comments SET deleted = '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}'  WHERE id = ${comment_id}`
    );

    res.send({
      status: true,
      message: "Data berhasil dihapus!",
    });
  } catch (error) {
    console.log("Program error");
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
