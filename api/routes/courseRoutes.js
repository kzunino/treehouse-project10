const express = require('express');
const db = require("../db");
const router = express.Router();
const { Course, User } = db.models;
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

//Middware to handle async/await
function asyncHandler(cb){
  return async (req, res, next)=>{
    try {
      await cb(req,res, next);
    } catch(err){
      next(err);
    }
  };
}

// authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

    // If the user's credentials are available...
    if (credentials) {
      const user = await User.findOne({
            where: {
              emailAddress: credentials.name
            }
          });
      // If a user was successfully retrieved from the data store...
      if (user) {
        const authenticated = bcryptjs
          .compareSync(credentials.pass, user.password);

          // If the passwords match...
           if (authenticated) {
             req.currentUser = user;
           } else {
             message = `Authentication failure for username: ${user.emailAddress}`;
           }
         } else {
           message = `User not found for username: ${credentials.emailAddress}`;
         }
       } else {
         message = 'Auth header not found';
       }
   // If user authentication failed...
   if (message) {
     console.warn(message);
     // Return a response with a 401 Unauthorized HTTP status code.
     res.status(401).json({ message: 'Access Denied' });
   } else {
     next();
   }
 } catch (error){
   next(error);
 }
};

//Route to find all courses
// router.get("/courses", async (req, res, next) => {
//   try {
//     // const course = await Course.sequelize.query(
//     //   "SELECT id, userId, title, description, materialsNeeded, estimatedTime FROM Courses"
//     // );
//     const course = await Course.findAll({
//       attributes: [
//         'id', 'userId', 'title', 'description', 'materialsNeeded', 'estimatedTime'
//       ]
//     });
//     res.json(course);
//   } catch (error) {
//     return next(error);
//   }
// });

router.get("/courses", asyncHandler(async(req,res) =>{
  // const course = await Course.sequelize.query(
  //   "SELECT id, userId, title, description, materialsNeeded, estimatedTime FROM Courses"
  // );
  const course = await Course.findAll({
    attributes: [
      'id', 'userId', 'title', 'description', 'materialsNeeded', 'estimatedTime'
    ]
  });
    res.json(course);
}));

//returns a specific course and user details
router.get("/courses/:id", asyncHandler(async (req,res) =>{
  const course = await Course.findByPk(req.params.id, {
    attributes: [
      'id', 'userId', 'title', 'description', 'materialsNeeded', 'estimatedTime'
    ],
    include: [{
      model: User, // load all users
      attributes:['id', 'firstName', 'lastName', 'emailAddress']
      }]
  });
  if (course){
    res.json(course).status(200).end();
  } else {
    res.status(404).json({
      message: 'Course Not Found',
      });
  }
}));


// //returns a specific course and user details
// router.get("/courses/:id", async (req, res, next) => {
//   try {
//     const course = await Course.findByPk(req.params.id, {
//       attributes: [
//         'id', 'userId', 'title', 'description', 'materialsNeeded', 'estimatedTime'
//       ],
//       include: [{
//         model: User, // load all users
//         attributes:['id', 'firstName', 'lastName', 'emailAddress']
//      }
//   ]
//     });
//     if (course){
//       res.json(course).status(200).end();
//     } else {
//       res.status(404).json({
//         message: 'Course Not Found',
//         });
//     }
//   } catch (error) {
//     return next(error);
//   }
// });

//Protected route to post a new course linked to authenitcated userId.
router.post('/courses', authenticateUser, [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    // If there are validation errors...
    if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);

      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    }

    // Get the user info from the request body--destructuring.
    let { title, description, estimatedTime, materialsNeeded } = req.body;
    let userId = req.currentUser.id;

    const newCourse = await Course.create({
      title,
      description,
      userId,
      estimatedTime,
      materialsNeeded
    })

    // Set the status to 201 Created and end the response.
    res.status(201).location('/api/courses/' + newCourse.id).end();
}));

//Protected route that updates the course information.
router.put("/courses/:id", authenticateUser, [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "title"'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a value for "description"'),
], asyncHandler(async (req, res)=> {
    const errors = validationResult(req);
    // If there are validation errors...
    if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
      const errorMessages = errors.array().map(error => error.msg);
      // Return the validation errors to the client.
      return res.status(400).json({ errors: errorMessages });
    }
    const course = await Course.findByPk(req.params.id);
    if (course) {
      let { title, description, estimatedTime, materialsNeeded } = req.body;
      let userId = req.currentUser.id;
      if(userId === course.userId){
        await Course.update(
          { title, description, userId, estimatedTime, materialsNeeded },
          {
            where: {
              userId: userId
              }
          }
         );
        res.status(204).end();
      } else {
        res.status(403).json({
          errors: ["Course not associated with user"]
        })
      }
    } else {
      res.status(400).json({
        errors: ['Course Not Found'],
        });
    }
}));

//Protected route that deletes a course
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      let userId = req.currentUser.id;
      if(userId === course.userId){
        await course.destroy()
        res.status(204).end();
      } else {
        res.status(403).json({
          error: "Course not associated with user"
        })
      }
    } else {
      res.status(404).json({
        message: 'Course Not Found',
        });
    }
}));



module.exports = router;
