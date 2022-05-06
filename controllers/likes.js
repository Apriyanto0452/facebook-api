"use strict";

var query = require("../conn");

exports.createLikes = async function (req, res) {
  try {
    const { user_id, target_type, target_id } = req.body;

    let targetQuery = "";

    const users = await query(
      `SELECT * FROM person WHERE id = ${user_id} AND deleted is null`
    );

    if (users.length === 0) {
      return res.status(400).send({
        status: false,
        message: "user_id tidak ditemukan.",
      });
    }

    if (target_type === "post") {
      targetQuery = `SELECT * FROM posts WHERE id = ${target_id} AND deleted is null`;
    } else if (target_type === "comment") {
      targetQuery = `SELECT * FROM comments WHERE id = ${target_id} AND deleted is null`;
    } else
      return res.status(400).send({
        status: false,
        message: "Hanya untuk post dan comment!",
      });

    const targetData = await query(targetQuery);

    if (targetData.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${target_type} tidak ditemukan!`,
      });
    }

    const likeiInDB = await query(
      `SELECT * FROM likes WHERE user_id = ${user_id} AND target_type = '${target_type}' AND target_id = ${target_id}`
    );

    if (likeiInDB.length >= 1) {
      await query(
        `DELETE FROM likes WHERE user_id = ${user_id} AND target_type = '${target_type}' AND target_id = ${target_id}`
      );
    } else
      await query(
        `INSERT INTO likes(user_id, target_type, target_id) values (${user_id}, '${target_type}', ${target_id})`
      );
    res.send({
      status: true,
      message: "Berhasil mengupdate like",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
