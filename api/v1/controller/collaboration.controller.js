"use strict";

// import model
const CollaborationModel = require("../../../models/collaboration.model");
const UserToCollaborationMapModel = require("../../../models/user-to-collaboration-map.model");
const UserModel = require("../../../models/user.model");

const _ = require("lodash");
const { Op } = require("sequelize");

// import response
const FailureResponse = require("../../../public/javascripts/response/response.failure.json");
const SuccessResponse = require("../../../public/javascripts/response/response.success.json");

// import Console.Log
const ConsoleLog = require("../../../public/javascripts/console.log");

let controller = {};

// End Points
controller.createCollaboration = async (req, res) => {
    ConsoleLog("createCollaboration Called!");

    let collaborationRes = await CollaborationModel.create(req.body);

    let success_200 = SuccessResponse.success_200;
    success_200.message = "Created Artist Successfully!";
    success_200.data.items = [collaborationRes];
    res.send(success_200);
};

controller.getAllCollaborations = async (req, res) => {
    console.log("getAllCollaborations Called!");

    /* NOTE: This will give response without pagination for now*/
    const collaborationRes = await CollaborationModel.findAll({
        where: {
            user_id: req.query.user_id
        }
    });
    let success_200 = SuccessResponse.success_200;
    success_200.message = "List of all collaborations!";
    success_200.data.items = collaborationRes;
    res.send(success_200);
};

controller.getAllAssignedCollaborationsWithStatus = async (req, res) => {
    console.log("getAllAssignedCollaborationsWithStatus Called!");

    console.log(req.query)
    let collaborationsArr = [];
    /* NOTE: This will give response without pagination for now*/
    const userToCollaborationMapRes = await UserToCollaborationMapModel.findAll({
        where: {
            user_id: req.query.user_id,
            status: req.query.status
        }
    });

    for (let i = 0; i < userToCollaborationMapRes.length; i++) {
        collaborationsArr.push(userToCollaborationMapRes[i].collaboration_id);
    }

    if (!collaborationsArr.length > 0) collaborationsArr.push(0);

    console.log('collaborationsArr', collaborationsArr);
    const collaborationRes = await CollaborationModel.findAll({
        where: {
            id: {
                [Op.in]: collaborationsArr
            }
        }
    });

    let success_200 = SuccessResponse.success_200;
    success_200.message = "List of all pending collaborations!";
    success_200.data.items = collaborationRes;
    res.send(success_200);
};

controller.acceptOrRejectCollaboration = async (req, res) => {
    const user_id = req.body.user_id;
    const collaboration_id = req.body.collaboration_id;
    const status = req.body.status;

    await UserToCollaborationMapModel.update({
        status: status
    }, {
        where: {
            user_id: user_id,
            collaboration_id: collaboration_id
        }
    });

    let success_200 = SuccessResponse.success_200;
    success_200.message = "Updated Status Successfully!";
    success_200.data.items = [];
    res.send(success_200);
}

module.exports = controller;
