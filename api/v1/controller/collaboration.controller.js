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
    let collaborationsReasonArr = [];
    /* NOTE: This will give response without pagination for now*/
    const userToCollaborationMapRes = await UserToCollaborationMapModel.findAll({
        where: {
            user_id: req.query.user_id,
            status: req.query.status
        }
    });

    for (let i = 0; i < userToCollaborationMapRes.length; i++) {
        collaborationsArr.push(userToCollaborationMapRes[i].collaboration_id);
        collaborationsReasonArr.push(userToCollaborationMapRes[i].reason);
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

    for (let i = 0; i < collaborationRes.length; i++) {
        collaborationRes[i].dataValues.reason = collaborationsReasonArr[i];
    }

    let success_200 = SuccessResponse.success_200;
    success_200.message = "List of all pending collaborations!";
    success_200.data.items = collaborationRes;
    res.send(success_200);
};

controller.acceptOrRejectCollaboration = async (req, res) => {
    const user_id = req.body.user_id;
    const collaboration_id = req.body.collaboration_id;
    const status = req.body.status;
    const reason = req.body.reason;

    await UserToCollaborationMapModel.update({
        status: status,
        reason: reason
    }, {
        where: {
            user_id: user_id,
            collaboration_id: collaboration_id,
        }
    });

    const collaborationRes = await CollaborationModel.findAll({
        where: {
            id: collaboration_id,
        }
    });

    let progress;
    if (status == 1) {
        console.log('status is accept');
        progress = (collaborationRes[0].total_accepted_invites / collaborationRes[0].total_invites) * 100;
        await CollaborationModel.increment({
            total_accepted_invites: 1
        }, {
            where: {
                id: collaboration_id,
            }
        });

    } else if (status == -1) {
        console.log('status is rejected')
        await CollaborationModel.increment({
            total_rejected_invites: 1
        }, {
            where: {
                id: collaboration_id,
            }
        });
    }

    await CollaborationModel.increment({
        progress: progress
    }, {
        where: {
            id: collaboration_id,
        }
    });

    let success_200 = SuccessResponse.success_200;
    success_200.message = "Updated Status Successfully!";
    success_200.data.items = [];
    res.send(success_200);
}

controller.getMembersAgainstCollaboration = async (req, res) => {
    const { collaboration_id } = req.query;

    let usersArr = [];

    const userToCollaborationRes = await UserToCollaborationMapModel.findAll({
        where: {
            collaboration_id: collaboration_id,
            user_id: {
                [Op.ne]: null
            }
        }
    });

    for (let i = 0; i < userToCollaborationRes.length; i++) {
        let user_id = userToCollaborationRes[i].user_id;
        const userRes = await UserModel.findAll({
            where: {
                id: user_id
            }
        });
        if (userRes.length > 0 && userRes[i] != null) usersArr.push(userRes[i]);
    }

    let success_200 = SuccessResponse.success_200;
    success_200.message = "All users against collaboration!";
    success_200.data.items = usersArr;
    res.send(success_200);
}

module.exports = controller;
