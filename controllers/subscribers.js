"use strict";

var query = require("../conn");

exports.createSubscribes = async function (req, res) {
  try {
    const { followee_id, follower_id } = req.body;

    const followee = await query(
      `SELECT * FROM person WHERE id = ${followee_id} AND deleted is null`
    );

    const follower = await query(
      `SELECT * FROM person WHERE id = ${follower_id} AND deleted is null`
    );

    if (followee.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${followee_id} tidak ditemukan!`,
      });
    }

    if (follower.length === 0) {
      return res.status(400).send({
        status: false,
        message: `${follower_id} tidak ditemukan!`,
      });
    }

    const subscribe = await query(
      `SELECT * FROM subscribers WHERE followee_id = ${followee_id} AND follower_id = ${follower_id}`
    );

    if (subscribe.length >= 1) {
      await query(
        `DELETE FROM subscribers WHERE followee_id = ${followee_id} AND follower_id = ${follower_id}`
      );
    } else
      await query(
        `INSERT INTO subscribers(followee_id, follower_id) values (${followee_id}, ${follower_id})`
      );
    res.send({
      status: true,
      message: "Berhasil mengupdate subscriber",
    });
  } catch (error) {
    console.log("Program error", error.message);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};
