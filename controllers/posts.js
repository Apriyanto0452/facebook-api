"use strict";

var query = require("../conn");

//CRUD posting/status content users

exports.createPosts = async function (req, res) {
  try {
    const { user_id, content } = req.body;

    const findId = await query(
      `SELECT * FROM person WHERE id = '${user_id}' AND deleted is null`
    );

    console.log(findId);

    if (findId.length === 0) {
      return res.status(400).send({
        status: false,
        message: "user_id tidak ditemukan.",
      });
    }

    await query(
      `INSERT INTO posts(user_id, content) values (${user_id}, "${content}")`
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

exports.posts = async function (req, res) {
  try {
    let posts = await query("SELECT * FROM posts where deleted is null");

    posts = posts.map((posts) => {
      delete posts.deleted;
      return posts;
    });

    res.send({
      status: true,
      message: "Semua Posts",
      data: posts,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.findPosts = async function (req, res) {
  var user_id = req.params.user_id;
  try {
    const findPostsQuery = await query(
      `SELECT * FROM posts WHERE id = '${user_id}'`
    );

    if (findPostsQuery.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }

    res.send({
      status: true,
      message: "Data Status",
      data: findPostsQuery,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.updatePosts = async function (req, res) {
  try {
    const { post_id } = req.params;
    const { content } = req.body;

    const postsInDB = await query(
      `SELECT * FROM posts WHERE id = ${post_id} AND deleted is null`
    );

    if (postsInDB.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Posts tidak ditemukan.",
      });
    }

    await query(
      `UPDATE posts SET content = '${content}' WHERE id = ${post_id}`
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

exports.deletePosts = async function (req, res) {
  try {
    const { user_id } = req.params;
    await query(
      `UPDATE posts SET deleted = '${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}'  WHERE id = ${user_id}`
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
