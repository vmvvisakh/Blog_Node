var express = require("express");
var router = express.Router();
const Post = require("../models/Post");

/**
 * GET /
 * HOME
 */
router.get("/", async (req, res) => {
  const locals = {
    title: "NodeJs ",
    description: " Simple Blog created with NodeJs",
  };

  try {
    const data = await Post.find();
    res.render("index", {
      locals,
      data,

      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Post :id
 */

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    // console.log("slug",slug);
    const data = await Post.findById({ _id: slug });
    res.render("post", {
      data,
    });
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Post: searchterm
 */

router.post('/search', async (req, res) => {
 
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });
    
    res.render('search', { data });
  } catch (error) {
    console.log(error);
  }
});


// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
