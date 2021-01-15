"use strict";
// import model
const ProjectModel = require("../../../models/project.model");
const UserModel = require("../../../models/user.model");
const TeamModel = require("../../../models/team.modal");
const UserToTeamMap = require("../../../models/user-to-team-map");
const _ = require("lodash");
// import response
const FailureResponse = require("../../../public/javascripts/response/response.failure.json");
const SuccessResponse = require("../../../public/javascripts/response/response.success.json");
// import Console.Log
const ConsoleLog = require("../../../public/javascripts/console.log");
let controller = {};
// Create Team against a project
controller.createTeam = async (req, res) => {
    ConsoleLog("createTeam Called!");
    let teamRes = await TeamModel.create(req.body);
    let success_200 = SuccessResponse.success_200;
    success_200.message = "Created Project Successfully!";
    success_200.data.items = [teamRes];
    res.send(success_200);
  }

  controller.teamsAgainstProject = async (req, res) => {
    const {project_id} = req.query;
    const teamsRes = await TeamModel.findAll({
      where: {
        project_id: project_id
      }
    });
    let success_200 = SuccessResponse.success_200;
    success_200.message = "Teams pgainst projects!";
    success_200.data.items = teamsRes;
    res.send(success_200);
  }

  controller.getMemebersAgainstTeam = async (req, res) => {
    const {team_id} = req.query;
    const userToTeamMapRes = await UserToTeamMap.findAll({
      where: {
        team_id: team_id
      }
    });
    let success_200 = SuccessResponse.success_200;
    success_200.message = "User against to team";
    success_200.data.items = userToTeamMapRes;
    res.send(success_200);
  }
  
  module.exports = controller;