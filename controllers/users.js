"use strict";

var query = require("../conn");

// TODO
// - Buat field baru di column register untuk role
// - Buat field TOKEN
// - role [user | admin]
// - Buat API untuk get all user dimana hanya yang memiliki role 'admin' yang bisa akses

// CRUD users REGISTER and LOGIN

exports.login = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const sqlQuery = `SELECT * FROM person WHERE email = '${email}' AND password = '${password}' `;
    const userInDB = await query(sqlQuery);

    if (userInDB.length === 0) {
      return res.status(404).send({
        status: false,
        message: "invalid email or password",
      });
    }

    res.send({
      status: true,
      message: "login success",
      data: userInDB[0],
    });
  } catch (error) {
    console.log("Program error");
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.users = async function (req, res) {
  try {
    let users = await query("SELECT * FROM person where deleted is null");

    users = users.map((user) => {
      delete user.deleted;
      return user;
    });

    res.send({
      status: true,
      message: "Semua Data",
      data: users,
    });
  } catch (error) {
    console.log("Program error", error);
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.findUsers = async function (req, res) {
  var user_id = req.params.user_id;
  try {
    const findUserQuery = await query(
      `SELECT * FROM person where id = '${user_id}'`
    );

    if (findUserQuery.length === 0) {
      return res.status(404).send({
        status: false,
        message: "Tidak ada data",
      });
    }

    res.send({
      status: true,
      message: "Data User",
      data: findUserQuery,
    });
  } catch (error) {}
};
exports.createUsers = async function (req, res) {
  try {
    const { first_name, last_name, email, password, role } = req.body;
    const token = (Math.random() + 1).toString(36).substring(7);
    const user = await query(`SELECT * FROM person WHERE email = '${email}';`);

    if (user.length >= 1) {
      return res.status(400).send({
        status: false,
        message: "Email Sudah Digunakan!",
      });
    }

    if (password.length < 5) {
      return res.status(400).send({
        status: false,
        message: "Password tidak boleh kurang dari 5 karakter",
      });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).send({
        status: false,
        message: "Alamat email tidak valid!",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).send({
        status: false,
        message: "Role Tidak ditemukan!",
      });
    }

    await query(
      "INSERT INTO person (first_name, last_name, email, password, role, token) values (?,?,?,?,?,?)",
      [first_name, last_name, email, password, role, token]
    );

    res.send({
      status: true,
      message: "Data berhasil ditambahkan",
    });
  } catch (error) {
    console.log("Program error");
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.updateUsers = async function (req, res) {
  try {
    const { user_id } = req.params;
    const { first_name, last_name, email, password } = req.body;

    const user = await query(`SELECT * FROM person WHERE email = '${email}';`);
    const notNull = await query(
      `SELECT * FROM person WHERE id = '${user_id}' AND deleted is null`
    );

    console.log(notNull);
    if (notNull.length === 0) {
      return res.status(400).send({
        status: false,
        message: "User tidak ditemukan.",
      });
    }

    if (user.length > 1) {
      return res.status(400).send({
        status: false,
        message: "Email Sudah Ada Dalam Data",
      });
    }

    await query(
      `UPDATE person SET first_name = '${first_name}', last_name = '${last_name}', email = '${email}', password = '${password}' WHERE id = ${user_id}`
    );

    res.send({
      status: true,
      message: "Update success",
    });
  } catch (error) {
    console.log("Program error");
    return res.status(500).send({
      status: false,
      message: error.sqlMessage || "Ada kesalahan server",
    });
  }
};

exports.deleteUsers = async function (req, res) {
  try {
    const { user_id } = req.params;
    await query(
      `UPDATE person SET deleted = '${new Date()
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

// ------------ // -------------// --------- // --------- //
