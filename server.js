const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");
const likesRoutes = require("./routes/likes");
const subscribesRoutes = require("./routes/subscribers");

userRoutes(app);
postRoutes(app);
commentsRoutes(app);
likesRoutes(app);
subscribesRoutes(app);

app.listen(port);
console.log("Learn Node JS With Afray, RESTful API server started on: " + port);
