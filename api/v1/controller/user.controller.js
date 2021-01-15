"use strict";

// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcrypt");

// import model
const UserModel = require("../../../models/user.model");
const ProjectModel = require("../../../models/project.model");

const _ = require("lodash");

// import response
const FailureResponse = require("../../../public/javascripts/response/response.failure.json");
const SuccessResponse = require("../../../public/javascripts/response/response.success.json");

// import Console.Log
const ConsoleLog = require("../../../public/javascripts/console.log");

// import node mailer
var nodemailer = require("nodemailer");
const UserToTeamMap = require("../../../models/user-to-team-map");

// create class object
const controller = {};

// Functions
const emailSendingFunc = async (req, res) => {
  const email = req.email;
  const collaboration_name = req.collaboration_name;
  const invited_by_name = req.invited_by_name;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "renthub715@gmail.com",
      pass: "Pakistan1234#",
    },
    // auth: {
    //   user: "muhammad.arqam@rsglowtech.com",
    //   pass: "ARMsoldier547",
    // },
  });

  var mailOptions = {
    from: "norply@gmail.com",
    to: email,
    subject: "Invitation",
    html: `<p>You have been invited by <b> ${invited_by_name} </b> to join the <b> ${collaboration_name} </b> project. <br> 
    Login with <a href="https://split-sheet.herokuapp.com/#/register"> Split Screen </a> to accept the invitation.</p>`, // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

const passwordHash = async (password) => {
  const passwordEncrypted = await bcrypt.hash(password, await bcrypt.genSalt());
  return passwordEncrypted;
};

const isPasswordMatched = async (password, password_hashed) => {
  const isMatched = await bcrypt.compare(password, password_hashed);
  return isMatched;
};

// APIs
// controller.login = async (req, res) => {
//   ConsoleLog("login Called");
//   console.log(req.body);

//   let failure_400 = FailureResponse.failure_400;
//   const email = req.body.email;
//   const password = req.body.password;
//   const userRes = await UserModel.findAll({
//     where: {
//       email: email,
//     },
//   });

//   console.log(userRes.length)

//   // Exception handling
//   if (!(userRes.length > 0)) {
//     console.log('invalid email...!');
//     failure_400.message = "Email or password invalid";
//     failure_400.data.items = [];
//     res.send(failure_400);
//     return;
//   }

//   let isValid = await isPasswordMatched(password, userRes[0].password);
//   if (!isValid) {
//     ConsoleLog('invalid password...!');
//     failure_400.message = "Email or password invalid";
//     failure_400.data.items = [];
//     res.send(failure_400);
//   }

//   let success_200 = SuccessResponse.success_200;
//   success_200.message = "Login successfully..!";
//   success_200.data.items = userRes;
//   res.send(success_200);
// };

controller.login = async (req, res) => {
  ConsoleLog("login Called");
  console.log(req.body);

  let failure_400 = FailureResponse.failure_400;
  const email = req.body.email;
  const password = req.body.password;
  const userRes = await UserModel.findAll({
    where: {
      email: email,
    },
  });

  // Exception handling
  if (!(userRes.length > 0)) {
    console.log('invalid email...!');
    failure_400.message = "Email or password invalid";
    failure_400.data.items = [];
    res.send(failure_400);
    return;
  }

  let isValid = await isPasswordMatched(password, userRes[0].password);
  if (!isValid) {
    ConsoleLog('invalid password...!');
    failure_400.message = "Email or password invalid";
    failure_400.data.items = [];
    res.send(failure_400);
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Login successfully..!";
  success_200.data.items = userRes;
  res.send(success_200);
}

// controller.register = async (req, res) => {
//   ConsoleLog('Registration called...!');
//   let failure_400 = FailureResponse.failure_400;

//   // exception handling
//   if (_.isEmpty(req.body)) {
//     console.log("Empty called");
//     failure_400.message = "Object cannot be empty";
//     failure_400.data.items = [];
//     res.send(failure_400);
//     return;
//   } else {
//     const email = req.body.email;
//     const emailRes = await UserModel.findAll({
//       where: {
//         email: email,
//       },
//     });

//     if (emailRes.length > 0) {
//       failure_400.message = "Email already exist!";
//       failure_400.data.items = [];
//       res.send(failure_400);
//       return;
//     }

//     const user_name = req.body.user_name;
//     const userNameRes = await UserModel.findAll({
//       where: {
//         user_name: user_name,
//       },
//     });

//     if (userNameRes.length > 0) {
//       failure_400.message = "User name already exist!";
//       failure_400.data.items = [];
//       res.send(failure_400);
//       return;
//     }
//   }

//   req.body.password = await passwordHash(req.body.password);
//   const userRes = await UserModel.create(req.body);

//   await UserToCollaborationMapModel.update({
//     user_id: userRes.id
//   }, {
//     where: {
//       email: userRes.email
//     }
//   });

//   let success_200 = SuccessResponse.success_200;
//   success_200.message = "Register successfully..!";
//   success_200.data.items = [userRes];
//   res.send(success_200);
// };

controller.register = async (req, res) => {

  ConsoleLog('Registration called...!');
  let failure_400 = FailureResponse.failure_400;

  // exception handling
  if (_.isEmpty(req.body)) {
    console.log("Empty called");
    failure_400.message = "Object cannot be empty";
    failure_400.data.items = [];
    res.send(failure_400);
    return;
  } else {
    const email = req.body.email;
    const emailRes = await UserModel.findAll({
      where: {
        email: email,
      },
    });

    if (emailRes.length > 0) {
      failure_400.message = "Email already exist!";
      failure_400.data.items = [];
      res.send(failure_400);
      return;
    }

    const user_name = req.body.user_name;
    const userNameRes = await UserModel.findAll({
      where: {
        user_name: user_name,
      },
    });

    if (userNameRes.length > 0) {
      failure_400.message = "User name already exist!";
      failure_400.data.items = [];
      res.send(failure_400);
      return;
    }
  }

  req.body.password = await passwordHash(req.body.password);
  const userRes = await UserModel.create(req.body);

  await UserToTeamMap.update({
    user_id: userRes.id
  }, {
    where: {
      email: userRes.email
    }
  });

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Register successfully..!";
  success_200.data.items = [userRes];
  res.send(success_200);
}

// controller.invite = async (req, res) => {
//   ConsoleLog('invitation called!');
//   const email = req.body.email;
//   const user_name = req.body.user_name;
//   const collaboration_id = req.body.collaboration_id;
//   const collaboration_name = req.body.collaboration_name;
//   const status = 0;

//   await emailSendingFunc({
//     invited_by_name: user_name, // who invited
//     email: email, // to whom we invited
//     collaboration_name: collaboration_name
//   });

//   await UserToCollaborationMapModel.create({
//     user_id: null,
//     collaboration_id: collaboration_id,
//     status: status,
//     email: email
//   });

//   await CollaborationModel.increment({
//     total_invites: 1
//   }, {
//     where: {
//       id: collaboration_id,
//     }
//   });

//   let success_200 = SuccessResponse.success_200;
//   success_200.message = "Invitation has been send successfully!";
//   success_200.data.items = [];
//   res.send(success_200);
// }

controller.invite = async (req, res) => {
  ConsoleLog('invitation called!');
  const email = req.body.email;
  const user_name = req.body.user_name;
  const team_id = req.body.team_id;
  const project_name = req.body.project_name;
  const project_id = req.body.project_id;
  const percentage = req.body.percentage;
  // const status = 0;
  var user_id;

  await emailSendingFunc({
    invited_by_name: user_name, // who invited
    email: email, // to whom we invited
    collaboration_name: project_name
  });

  // Exception here if the user already register

  const userRes = await UserModel.findAll({
    where: {
      email: email
    }
  });

  console.log("UserRes" , userRes.length);
  if (userRes.length > 0) {
    user_id = userRes[0].id;
  } else {
    user_id = null;
  }

  await UserToTeamMap.create({
    user_id: user_id,
    team_id: team_id,
    email: email,
    percentage: percentage
  });

  await ProjectModel.increment({
    total_invites: 1
  }, {
    where: {
      id: project_id,
    }
  });

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Invitation has been send successfully!";
  success_200.data.items = [];
  res.send(success_200);
}


// controller.updateProfile = async (req, res) => {
//   let failure_400 = FailureResponse.failure_400
//   console.log("Profile Update called!");
//   if (_.isEmpty(req.body)) {
//     console.log("Body Empty!");
//     failure_400.message = "Object cannot be empty!";
//     failure_400.data.items = [];
//     res.send(failure_400);
//     return;
//   }

//   if (!(_.isEmpty(req.body.password))) {
//     let encryptPassword = await passwordHash(req.body.password);
//     req.body.password = encryptPassword;
//   }

//   let obj = req.body;
//   let updateRes = await UserModel.update(
//     obj
//     , {
//       where: {
//         email: obj.email
//       }
//     });

//   if (updateRes[0] === 0) {
//     failure_400.message = "Your profile does not update!";
//     failure_400.data.items = [];
//     res.send(failure_400);
//     return;
//   }

//   let success_200 = SuccessResponse.success_200;
//   success_200.message = "Your profile has been successfully updated!";
//   success_200.data.items = obj;
//   res.send(success_200);

// };

// controller.dashboard = async (req, res) => {
//   console.log('dashboard called!');

//   const user_id = req.query.user_id;
//   let collaboration_id = req.query.collaboration_id;

//   let finalRes = [];

//   let totalCollaborationRes = 0;
//   let acceptedCollaborationRes = 0;
//   let rejectedCollaborationRes = 0;

//   totalCollaborationRes = await CollaborationModel.findAll({
//     where: {
//       user_id: user_id
//     }
//   });

//   let acceptedCollaborationsArr = [];
//   for (let i = 0; i < totalCollaborationRes.length; i++) {
//     acceptedCollaborationRes = await UserToCollaborationMapModel.findAll({
//       where: {
//         collaboration_id: totalCollaborationRes[i].id,
//         status: 1
//       }
//     });
//     if (acceptedCollaborationRes.length > 0) acceptedCollaborationsArr.push(acceptedCollaborationRes[0]);
//   }

//   let rejectedCollaborationsArr = [];
//   for (let i = 0; i < totalCollaborationRes.length; i++) {
//     rejectedCollaborationRes = await UserToCollaborationMapModel.findAll({
//       where: {
//         collaboration_id: totalCollaborationRes[i].id,
//         status: -1
//       }
//     });
//     if (rejectedCollaborationsArr.length > 0) rejectedCollaborationsArr.push(rejectedCollaborationRes[0]);
//   }

//   let totalCollaborations = totalCollaborationRes.length;

//   let success_200 = SuccessResponse.success_200;
//   success_200.message = "Dashboard Items!";
//   success_200.data.items = [{
//     totalCollaborations: totalCollaborations,
//     acceptedCollaborations: acceptedCollaborationsArr.length,
//     rejectedCollaborations: rejectedCollaborationsArr.length
//   }];
//   res.send(success_200);
// }

controller.dashboard = async (req, res) => {
  console.log('dashboard called!');

  const user_id = req.query.user_id;
  // let project_id = req.query.project_id;

  let finalRes = [];

  let totalProjectRes = 0;
  let total_invites = 0;
  let total_accepted_invites = 0;
  let total_rejected_invites = 0;

  let projectRes = await ProjectModel.findAll({
    where: {
      user_id: user_id
    }
  });

  totalProjectRes = projectRes.length;

  for(let i = 0; i < totalProjectRes; i++){
    total_invites += projectRes[i].total_invites;
    total_accepted_invites += projectRes[i].total_accepted_invites;
    total_rejected_invites += projectRes[i].total_rejected_invites;
  }
  
  let padding_invites = total_invites - (total_accepted_invites + total_rejected_invites);

  finalRes = {
    total_projects: totalProjectRes,
    total_invites: total_invites,
    total_accepted_invites: total_accepted_invites,
    total_rejected_invites: total_rejected_invites,
    padding_invites: padding_invites
  };

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Dashboard Items!";
  success_200.data.items = [finalRes];
  res.send(success_200);

  // for (let i = 0; i < totalProjectRes.length; i++) {
  //   acceptedProjectRes = await UserToTeamMap.findAll({
  //     where: {
  //       team_id: totalProjectRes[i].id,
  //       status: 1
  //     }
  //   });
  //   if (acceptedProjectRes.length > 0) acceptedProjectArr.push(acceptedProjectRes[0]);
  // }

  let rejectedProjectArr = [];
  // for (let i = 0; i < totalProjectRes.length; i++) {
  //   rejectedProjectRes = await UserToTeamMap.findAll({
  //     where: {
  //       team_id: totalProjectRes[i].id,
  //       status: -1
  //     }
  //   });
  //   if (rejectedProjectArr.length > 0) rejectedProjectArr.push(rejectedProjectRes[0]);
  // }

  // let totalCollaborations = totalCollaborationRes.length;

  // let success_200 = SuccessResponse.success_200;
  // success_200.message = "Dashboard Items!";
  // success_200.data.items = [{
  //   totalCollaborations: totalCollaborations,
  //   acceptedCollaborations: acceptedCollaborationsArr.length,
  //   rejectedCollaborations: rejectedCollaborationsArr.length
  // }];
  // success_200.data.items = totalCollaborationRes;
  // res.send(success_200);
}

module.exports = controller;
