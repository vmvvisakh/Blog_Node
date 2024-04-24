const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = ('../views/layouts/admin')

const jwtSecret = process.env.JWT_SECRET;
/**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Unauthorized'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Unauthorized'} );
    }
  }
  



/**
 * GET /
 * Admin - login
 */

router.get('/admin', async (req, res) => {
    
  try {
    const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
    //   req.session.local=locals.title
    //   console.log("log",req.session.local);
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});


/**
 * POST /
 * Admin - check login
 */

router.post('/admin', async (req, res) => {
 
    try {
        const { username, password } = req.body;
        const user = await User.findOne( { username } );

        if(!user) {
          return res.status(401).json( { message: 'Invalid credentials' } );
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if(!isPasswordValid) {
          return res.status(401).json( { message: 'Invalid credentials' } );
        }
    
        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });
        console.log("cookie",token);
        // res.send("logged in")
        res.redirect('/dashboard');
        
    } catch (error) {
      console.log(error);
    }
  });

   /**
 * GET /
 * Admin - Dashboard
 */

   router.get('/dashboard', authMiddleware, async (req,res)=>{
    // const local = req.session.local
    //   console.log("session dash",local);
    try {
        const data = await Post.find();
        res.render('admin/dashboard',{
            data,
            layout:adminLayout
        })

    } catch (error) {
        
    }
   })


  /**
 * POST /
 * Admin - check login
 */

router.post('/register', async (req, res) => {
 
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
          const user = await User.create({ username, password:hashedPassword });
          res.status(201).json({ message: 'User Created', user });
        } catch (error) {
          if(error.code === 11000) {
            res.status(409).json({ message: 'User already in use'});
          }
          res.status(500).json({ message: 'Internal server error'})
        }
    
      } catch (error) {
        console.log(error);
      }
  });


  /**
 * GET /
 * Admin - Create New Post
*/

router.get('/add-post', authMiddleware, async (req,res)=>{
    try {
        const data = await Post.find();
        res.render('admin/add-post',
        {
        data,
        layout:adminLayout
        })

    } catch (error) {
        
    }
   })

     /**
 * POST /
 * Admin - Create New Post
*/

router.post('/add-post', authMiddleware, async (req,res)=>{
    try {
        // console.log(req.body);
        try {
            const newPost = new Post({
                title:req.body.title,
                body:req.body.body,
            })
            await Post.create(newPost)
        } catch (error) {
            console.log(error);
        }

        res.redirect('/dashboard')

    } catch (error) {
        
    }
   })
   

   /**
 * GET /
 * Admin - Create New Post
*/
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
   
    try {
        
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };
    //   const local = req.session.local
    //   console.log("session edit",local);
      const data = await Post.findOne({ _id: req.params.id });
    //   console.log("data",data);
      res.render('admin/edit-post', {
        locals,
        data,
        // local,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });
  

 /**
 * PUT /
 * Admin - Edit Post
*/

router.put('/edit-post/:id', authMiddleware, async (req,res)=>{
    try {
        await Post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updatedAt:Date.now()
        })
        // res.redirect(`/edit-post/${req.params.id}`)
        res.redirect('/dashboard')

    } catch (error) {
        
    }
   })


   
 /**
 * DELETE /
 * Admin - DELETE Post
*/

   router.delete('/delete-post/:id', authMiddleware, async (req,res)=>{
    try {
        await Post.deleteOne({_id:req.params.id})
        // res.redirect(`/edit-post/${req.params.id}`)
        res.redirect('/dashboard')

    } catch (error) {
        
    }
   })

   router.get('/logout', authMiddleware, async (req,res)=>{
   
        res.clearCookie('token')
        res.redirect('/')
   })


module.exports = router