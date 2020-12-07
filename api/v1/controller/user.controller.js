"use strict";

// const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const bcrypt = require("bcrypt");

// import model
const UserModel = require("../../../models/user.model");
const UserToCollaborationMapModel = require("../../../models/user-to-collaboration-map.model");

const _ = require("lodash");

// import response
const FailureResponse = require("../../../public/javascripts/response/response.failure.json");
const SuccessResponse = require("../../../public/javascripts/response/response.success.json");

// import Console.Log
const ConsoleLog = require("../../../public/javascripts/console.log");

// import node mailer
var nodemailer = require("nodemailer");

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
  });

  var mailOptions = {
    from: "norply@gmail.com",
    to: email,
    subject: "Invitation",
    html: `<p>You have been invited by <b> ${invited_by_name} </b> to join the <b> ${collaboration_name} </b> project. <br> 
    Login with <a href="http://localhost:4200/#/register"> Split Screen </a> to accept the invitation.</p>`, // html body
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

  console.log(userRes.length)

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
};

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

  await UserToCollaborationMapModel.update({
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
};

controller.invite = async (req, res) => {
  ConsoleLog('invitation called!');
  const email = req.body.email;
  const user_name = req.body.user_name;
  const collaboration_id = req.body.collaboration_id;
  const collaboration_name = req.body.collaboration_name;
  const status = 0;

  await emailSendingFunc({
    invited_by_name: user_name, // who invited
    email: email, // to whom we invited
    collaboration_name: collaboration_name
  });

  await UserToCollaborationMapModel.create({
    user_id: null,
    collaboration_id: collaboration_id,
    status: status,
    email: email
  });

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Invitation has been send successfully!";
  success_200.data.items = [];
  res.send(success_200);
}

controller.forgetPassword = async (req, res) => {
  console.log("forgetPassword called...!");
  let failure_400 = FailureResponse.failure_400;

  const email = req.body.email;
  const userRes = await UserModel.findAll({
    where: {
      email: email,
    },
  });

  if (userRes.length > 0) {
    let code = Math.floor(Math.random() * (9999 - 1000) + 1000);
    const updatedRes = await UserModel.update(
      {
        forget_code: code,
      },
      {
        where: {
          email: email,
        },
      }
    );
    const emailSendingObj = {
      email: email,
      code: code,
    };

    console.log("Code: " + code);
    if (updatedRes[0] === 1) {
      const emailRes = await emailSendingFunc(emailSendingObj);
      if (!emailRes) {
        failure_400.message = "Email does not sent";
        failure_400.data.items = [];
        res.send(failure_400);
      }
    }
  } else {
    failure_400.message = "Email does not exist";
    failure_400.data.items = [];
    res.send(failure_400);
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message =
    "Code has been sent to your registeres email successfully!";
  success_200.data.items = [];
  success_200.data.isExist = true;
  res.send(success_200);
};

controller.codeVerification = async (req, res) => {
  console.log("update password called");
  let failure_400 = FailureResponse.failure_400;

  const email = req.body.email;
  const code = req.body.forget_code;

  const userRes = await UserModel.findAll({
    where: {
      email: email,
      forget_code: code,
    },
  });

  if (!(userRes.length > 0)) {
    failure_400.message = "Code does not match!";
    failure_400.data.items = [];
    res.send(failure_400);
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Code matched!";
  success_200.data.items = [];
  success_200.data.isMatched = true;
  res.send(success_200);
};

controller.resetPassword = async (req, res) => {
  ConsoleLog("reset password called");
  let failure_400 = FailureResponse.failure_400;

  let isLoggedIn = req.body.isLoggedIn;
  isLoggedIn = isLoggedIn.toLowerCase();
  const email = req.body.email;
  const newPassword = await passwordHash(req.body.newPassword);

  if (isLoggedIn === "true") {
    const oldPassword = req.body.oldPassword;
    const userRes = await UserModel.findAll({
      where: {
        email: email,
      },
    });

    if (!(userRes.length > 0)) {
      failure_400.message = "Email invalid!";
      failure_400.data.items = [];
      res.send(failure_400);
    } else {
      let isValid = await isPasswordMatched(oldPassword, userRes[0].password);
      if (isValid) {
        const updatedRes = await UserModel.update(
          {
            password: newPassword,
            forget_code: null,
          },
          {
            where: {
              email: email,
            },
          }
        );

        if (updatedRes[0] === 0) {
          failure_400.message = "Your password not updated!";
          failure_400.data.items = [];
          res.send(failure_400);
        }
      } else {
        failure_400.message = "Your old password does not matched!";
        failure_400.data.items = [];
        res.send(failure_400);
      }
    }
  } else {
    const updatedRes = await UserModel.update(
      {
        password: newPassword,
        forget_code: null,
      },
      {
        where: {
          email: email,
        },
      }
    );
    if (updatedRes[0] === 0) {
      failure_400.message = "Your password does not update!";
      failure_400.data.items = [];
      res.send(failure_400);
    }
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Your password has been updated successfully!";
  success_200.data.items = [];
  success_200.isPasswordReset = true;
  res.send(success_200);
};

controller.updateProfile = async (req, res) => {
  let failure_400 = FailureResponse.failure_400
  console.log("Profile Update called!");
  if (_.isEmpty(req.body)) {
    console.log("Body Empty!");
    failure_400.message = "Object cannot be empty!";
    failure_400.data.items = [];
    res.send(failure_400);
    return;
  }

  if (!(_.isEmpty(req.body.password))) {
    let encryptPassword = await passwordHash(req.body.password);
    req.body.password = encryptPassword;
  }

  let obj = req.body;
  let updateRes = await UserModel.update(
    obj
    , {
      where: {
        email: obj.email
      }
    });

  if (updateRes[0] === 0) {
    failure_400.message = "Your profile does not update!";
    failure_400.data.items = [];
    res.send(failure_400);
    return;
  }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Your profile has been successfully updated!";
  success_200.data.items = obj;
  res.send(success_200);

};

module.exports = controller;
