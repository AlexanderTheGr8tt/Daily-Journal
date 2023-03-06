//jshint esversion:6

// install express and require it in your app.js
const express = require("express");
// install bodyParser and require it in your app.js
const bodyParser = require("body-parser");
// install mongoose and require it in your app.js
const mongoose = require("mongoose");
// install ejs and require it in your app.js
const ejs = require("ejs");
// install lodash and require it in your app.js
var _ = require("lodash");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connect to a new database called blogDB
mongoose.connect(
  "mongodb+srv://aleksandermalecki1:qJUP2FRYC6su8d8@cluster0.ydoyvvv.mongodb.net/BlogDB"
);
console.log("conected");

// create a new postSchema that contains a title and content.
const postSchema = mongoose.Schema({
  title: String,
  content: String,
});

// create a new mongoose model using the schema to define your posts collection.
const Post = mongoose.model("Post", postSchema);

const posts = [];

app.get("/", function (req, res) {
  // find all the posts in the posts collection and render that in the home.ejs file.
  Post.find({})
    .then((posts) => {
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  // Inside the app.post() method for your /compose route, you’ll need to create a new post document using your mongoose model
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  // save the document to your database
  // only redirect to the home page once save is complete with no errors
  post
    .save()
    .catch((err) => {
      console.log(err);
    })
    .then(() => {
      res.redirect("/");
    });
});

// change the express route parameter to postId instead.
app.get("/posts/:postId", function (req, res) {
  // constant to store the postId parameter value
  const requestedPostId = req.params.postId;

  // method to find the post with a matching id in the posts collection
  // Once a matching post is found, you can render its title and content in the post.ejs page
  Post.findOne({ _id: requestedPostId })
    .then((post) => {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on port 3000");
});
