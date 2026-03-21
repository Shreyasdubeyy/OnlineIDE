// var express = require('express');
// var router = express.Router();
// var bcrypt = require("bcryptjs");
// var jwt = require("jsonwebtoken");
// var userModel = require("../models/userModel");
// var projectModel = require("../models/projectModel");

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// const secret = process.env.JWT_SECRET

// router.post("/signUp", async (req, res) => {
//   let { username, name, email, password } = req.body;
//   let emailCon = await userModel.findOne({ email: email });
//   if (emailCon) {
//     return res.json({ success: false, message: "Email already exists" });
//   }
//   else {

//     bcrypt.genSalt(10, function (err, salt) {
//       bcrypt.hash(password, salt, function (err, hash) {
//         let user = userModel.create({
//           username: username,
//           name: name,
//           email: email,
//           password: hash
//         });

//         return res.json({ success: true, message: "User created successfully" });
//       });
//     });

//   }
// });

// router.post("/login", async (req, res) => {
//   let { email, password } = req.body;
//   let user = await userModel.findOne({ email: email });

//   if (user) {
//     // Rename the second `res` to avoid conflict
//     bcrypt.compare(password, user.password, function (err, isMatch) {
//       if (err) {
//         return res.json({ success: false, message: "An error occurred", error: err });
//       }
//       if (isMatch) {
//         let token = jwt.sign({ email: user.email, userId: user._id }, secret);
//         return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
//       } else {
//         return res.json({ success: false, message: "Invalid email or password" });
//       }
//     });
//   } else {
//     return res.json({ success: false, message: "User not found!" });
//   }
// });

// router.post("/getUserDetails", async (req, res) => {
//   console.log("Called")
//   let { userId } = req.body;
//   let user = await userModel.findOne({ _id: userId });
//   if (user) {
//     return res.json({ success: true, message: "User details fetched successfully", user: user });
//   } else {
//     return res.json({ success: false, message: "User not found!" });
//   }
// });

// router.post("/createProject", async (req, res) => {
//   let { userId, title } = req.body;
//   let user = await userModel.findOne({ _id: userId });
//   if (user) {
//     let project = await projectModel.create({
//       title: title,
//       createdBy: userId
//     });


//     return res.json({ success: true, message: "Project created successfully", projectId: project._id });
//   }
//   else {
//     return res.json({ success: false, message: "User not found!" });
//   }
// });

// router.post("/getProjects", async (req, res) => {
//   let { userId } = req.body;
//   let user = await userModel.findOne({ _id: userId });
//   if (user) {
//     let projects = await projectModel.find({ createdBy: userId });
//     return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
//   }
//   else {
//     return res.json({ success: false, message: "User not found!" });
//   }
// });

// router.post("/deleteProject", async (req, res) => {
//   let {userId, progId} = req.body;
//   let user = await userModel.findOne({ _id: userId });
//   if (user) {
//     let project = await projectModel.findOneAndDelete({ _id: progId });
//     return res.json({ success: true, message: "Project deleted successfully" });
//   }
//   else {
//     return res.json({ success: false, message: "User not found!" });
//   }
// });

// router.post("/getProject", async (req, res) => {
//   let {userId,projId} = req.body;
//   let user = await userModel.findOne({ _id: userId });
//   if (user) {
//     let project = await projectModel.findOne({ _id: projId });
//     return res.json({ success: true, message: "Project fetched successfully", project: project });
//   }
//   else{
//     return res.json({ success: false, message: "User not found!" });
//   }
// });

// router.post("/updateProject", async (req, res) => {
//   let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
//   let user = await userModel.findOne({ _id: userId });

//   if (user) {
//     let project = await projectModel.findOneAndUpdate(
//       { _id: projId },
//       { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
//       { new: true } // This option returns the updated document
//     );

//     if (project) {
//       return res.json({ success: true, message: "Project updated successfully" });
//     } else {
//       return res.json({ success: false, message: "Project not found!" });
//     }
//   } else {
//     return res.json({ success: false, message: "User not found!" });
//   }
// });


// module.exports = router;
var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");

const secret = process.env.JWT_SECRET 
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/signUp", async (req, res) => {
  try {
    let { username, name, email, password } = req.body;

    let emailCon = await userModel.findOne({ email: email });
    if (emailCon) {
      return res.json({ success: false, message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await userModel.create({ 
      username: username,
      name: name,
      email: email,
      password: hash
    });

    return res.json({ success: true, message: "User created successfully" });
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password); // ✅ promisified
    if (isMatch) {
      let token = jwt.sign({ email: user.email, userId: user._id }, secret);
      return res.json({ success: true, message: "User logged in successfully", token: token, userId: user._id });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/getUserDetails", async (req, res) => {
  try {
    let { userId } = req.body;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    
    return res.json({
      success: true,
      message: "User details fetched successfully",
      user: {
        username: user.username,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/createProject", async (req, res) => {
  try {
    let { userId, title } = req.body;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let project = await projectModel.create({
      title: title,
      createdBy: userId
    });

    return res.json({ success: true, message: "Project created successfully", projectId: project._id });
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/getProjects", async (req, res) => {
  try {
    let { userId } = req.body;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let projects = await projectModel.find({ createdBy: userId });
    return res.json({ success: true, message: "Projects fetched successfully", projects: projects });
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/deleteProject", async (req, res) => {
  try {
    let { userId, progId } = req.body;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/getProject", async (req, res) => {
  try {
    let { userId, projId } = req.body;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let project = await projectModel.findOne({ _id: projId });
    if (!project) {
      return res.json({ success: false, message: "Project not found!" });
    }

    return res.json({ success: true, message: "Project fetched successfully", project: project });
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

router.post("/updateProject", async (req, res) => {
  try {
    let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
    let user = await userModel.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found!" });
    }

    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
      { new: true }
    );

    if (!project) {
      return res.json({ success: false, message: "Project not found!" });
    }

    return res.json({ success: true, message: "Project updated successfully" });
  } catch (err) { 
    return res.json({ success: false, message: "Server error", error: err.message });
  }
});

module.exports = router;