"use strict";

// import model
const ProjectModel = require("../../../models/project.model");
const UserModel = require("../../../models/user.model");

const TeamModel = require("../../../models/team.modal");
const UserToTeamMap = require("../../../models/user-to-team-map");

const _ = require("lodash");
const { Op } = require("sequelize");

// import response
const FailureResponse = require("../../../public/javascripts/response/response.failure.json");
const SuccessResponse = require("../../../public/javascripts/response/response.success.json");

// import Console.Log
const ConsoleLog = require("../../../public/javascripts/console.log");

let controller = {};

// End Points
// controller.createCollaboration = async (req, res) => {
//     ConsoleLog("createCollaboration Called!");

//     let collaborationRes = await CollaborationModel.create(req.body);

//     let success_200 = SuccessResponse.success_200;
//     success_200.message = "Created Artist Successfully!";
//     success_200.data.items = [collaborationRes];
//     res.send(success_200);
// };

controller.createProject = async (req, res) => {
  ConsoleLog("createCollaboration Called!");

  let projectRes = await ProjectModel.create(req.body);

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Created Project Successfully!";
  success_200.data.items = [projectRes];
  res.send(success_200);
};

// controller.getAllCollaborations = async (req, res) => {
//     console.log("getAllCollaborations Called!");

//     /* NOTE: This will give response without pagination for now*/
//     const collaborationRes = await CollaborationModel.findAll({
//         where: {
//             user_id: req.query.user_id
//         }
//     });
//     let success_200 = SuccessResponse.success_200;
//     success_200.message = "List of all collaborations!";
//     success_200.data.items = collaborationRes;
//     res.send(success_200);
// };

controller.getAllProjects = async (req, res) => {
  console.log("get all project Called!");

  /* NOTE: This will give response without pagination for now*/
  const projectRes = await ProjectModel.findAll({
    where: {
      user_id: req.query.user_id,
    },
  });
  let success_200 = SuccessResponse.success_200;
  success_200.message = "List of all collaborations!";
  success_200.data.items = projectRes;
  res.send(success_200);
};

// controller.getAllAssignedCollaborationsWithStatus = async (req, res) => {
//     console.log("getAllAssignedCollaborationsWithStatus Called!");

//     console.log(req.query)
//     let collaborationsArr = [];
//     let collaborationsReasonArr = [];
//     /* NOTE: This will give response without pagination for now*/
//     const userToCollaborationMapRes = await UserToCollaborationMapModel.findAll({
//         where: {
//             user_id: req.query.user_id,
//             status: req.query.status
//         }
//     });

//     for (let i = 0; i < userToCollaborationMapRes.length; i++) {
//         collaborationsArr.push(userToCollaborationMapRes[i].collaboration_id);
//         collaborationsReasonArr.push(userToCollaborationMapRes[i].reason);
//     }

//     if (!collaborationsArr.length > 0) collaborationsArr.push(0);

//     console.log('collaborationsArr', collaborationsArr);
//     const collaborationRes = await CollaborationModel.findAll({
//         where: {
//             id: {
//                 [Op.in]: collaborationsArr
//             }
//         }
//     });

//     for (let i = 0; i < collaborationRes.length; i++) {
//         collaborationRes[i].dataValues.reason = collaborationsReasonArr[i];
//     }

//     let success_200 = SuccessResponse.success_200;
//     success_200.message = "List of all pending collaborations!";
//     success_200.data.items = collaborationRes;
//     res.send(success_200);
// };

controller.getAllAssignedProjectsWithStatus = async (req, res) => {
  console.log("getAllAssignedProjectsWithStatus Called!");
  const { user_id, status } = req.query;
  /* NOTE: This will give response without pagination for now*/
  const userToTeamMapRes = await UserToTeamMap.findAll({
    where: {
      user_id: user_id,
      status: status,
    },
  });
  let projectIdAgainstTeam = [];
  let projectReajectedReason = [];
  for (let i = 0; i < userToTeamMapRes.length; i++) {
    let teamRes = await TeamModel.findByPk(userToTeamMapRes[i].team_id);
    projectIdAgainstTeam.push(teamRes.project_id);
    projectReajectedReason.push(userToTeamMapRes[i].reason);
  }
  let success_200 = SuccessResponse.success_200;
  let projectRes = await ProjectModel.findAll({
    where: {
      id: projectIdAgainstTeam,
    },
  });
  for(let i = 0; i < projectRes.length; i++){
    projectRes[i].dataValues.reason =  projectReajectedReason[i]
  }
  success_200.data.items = [];
  success_200.data.items.push({
    projects: projectRes,
    // reason: projectReajectedReason
  });
  success_200.message = "List of all pending collaborations!";
  res.send(success_200);
};

// controller.acceptOrRejectCollaboration = async (req, res) => {
//     const user_id = req.body.user_id;
//     const collaboration_id = req.body.collaboration_id;
//     const status = req.body.status;
//     const reason = req.body.reason;

//     await UserToCollaborationMapModel.update({
//         status: status,
//         reason: reason
//     }, {
//         where: {
//             user_id: user_id,
//             collaboration_id: collaboration_id,
//         }
//     });

//     const collaborationRes = await CollaborationModel.findAll({
//         where: {
//             id: collaboration_id,
//         }
//     });

//     let progress;
//     if (status == 1) {
//         console.log('status is accept');
//         progress = (collaborationRes[0].total_accepted_invites / collaborationRes[0].total_invites) * 100;
//         await CollaborationModel.increment({
//             total_accepted_invites: 1
//         }, {
//             where: {
//                 id: collaboration_id,
//             }
//         });

//     } else if (status == -1) {
//         console.log('status is rejected')
//         await CollaborationModel.increment({
//             total_rejected_invites: 1
//         }, {
//             where: {
//                 id: collaboration_id,
//             }
//         });
//     }

//     await CollaborationModel.increment({
//         progress: progress
//     }, {
//         where: {
//             id: collaboration_id,
//         }
//     });

//     let success_200 = SuccessResponse.success_200;
//     success_200.message = "Updated Status Successfully!";
//     success_200.data.items = [];
//     res.send(success_200);
// }

controller.acceptOrRejectProject = async (req, res) => {
  const user_id = req.body.user_id;
  const project_id = req.body.project_id;
  const status = req.body.status;
  const reason = req.body.reason;

  const teamRes = await TeamModel.findAll({
    where: {
      project_id: project_id
    }
  });

  for (let i = 0; i < teamRes.length; i++) {
    let team_id = await teamRes[i].id;
    await UserToTeamMap.update(
      {
        status: status,
        reason: reason
      },
      {
        where: {
          team_id: team_id,
          user_id: user_id
        }
      }
    );
  }

  var progress;
  if (status == 1) {
    console.log("status is accept");
    const projectRes = await ProjectModel.findAll({
      where: {
        id: project_id
      }
    });
    progress =
      parseInt((projectRes[0].total_accepted_invites /
        projectRes[0].total_invites) *
        100);
    console.log("Progress:   ", progress);
    await ProjectModel.increment(
      {
        total_accepted_invites: 1
      },
      {
        where: {
          id: project_id,
        },
      }
    );
  } else if (status == -1) {
    console.log("status is rejected");
    await ProjectModel.increment(
      {
        total_rejected_invites: 1,
      },
      {
        where: {
          id: project_id,
        },
      }
    );
  }

  await ProjectModel.increment(
    {
      progress: progress,
    },
    {
      where: {
        id: project_id,
      },
    }
  );

  let success_200 = SuccessResponse.success_200;
  success_200.message = "Updated Status Successfully!";
  success_200.data.items = [];
  res.send(success_200);
};

// controller.getMembersAgainstCollaboration = async (req, res) => {
//     const { collaboration_id } = req.query;

//     let usersArr = [];

//     const userToCollaborationRes = await UserToCollaborationMapModel.findAll({
//         where: {
//             collaboration_id: collaboration_id,
//             user_id: {
//                 [Op.ne]: null
//             }
//         }
//     });

//     for (let i = 0; i < userToCollaborationRes.length; i++) {
//         let user_id = userToCollaborationRes[i].user_id;
//         const userRes = await UserModel.findAll({
//             where: {
//                 id: user_id
//             }
//         });
//         if (userRes.length > 0 && userRes[i] != null) usersArr.push(userRes[i]);
//     }

//     let success_200 = SuccessResponse.success_200;
//     success_200.message = "All users against collaboration!";
//     success_200.data.items = usersArr;
//     res.send(success_200);
// }

controller.getMembersAgainstProject = async (req, res) => {
  const { project_id } = req.query;

  const teamRes = await TeamModel.findAll({
    where: {
      project_id: project_id
    },
    include: {
      model: UserToTeamMap,
    }
  });

  let userIdAgainstTeam = [];

  for (let i = 0; i < teamRes.length; i++) {
    let userToTeamMaps = teamRes[i].UserToTeamMaps;
    for (let j = 0; j < userToTeamMaps.length; j++) {
      let objTemp = {};
      objTemp.team_name = teamRes[i].name;
      objTemp.user_id = userToTeamMaps[j].user_id;
      userIdAgainstTeam.push(objTemp);
    }
  }

  // let userData = [];
  for (let i = 0; i < userIdAgainstTeam.length; i++) {
    let userRes = await UserModel.findByPk(userIdAgainstTeam[i].user_id);
    // userData.push(userRes);
    userIdAgainstTeam[i].user_data = userRes;
  }

  // let usersArr = [];

  // const userToCollaborationRes = await UserToCollaborationMapModel.findAll({
  //     where: {
  //         collaboration_id: collaboration_id,
  //         user_id: {
  //             [Op.ne]: null
  //         }
  //     }
  // });

  // for (let i = 0; i < userToCollaborationRes.length; i++) {
  //     let user_id = userToCollaborationRes[i].user_id;
  //     const userRes = await UserModel.findAll({
  //         where: {
  //             id: user_id
  //         }
  //     });
  //     if (userRes.length > 0 && userRes[i] != null) usersArr.push(userRes[i]);
  // }

  let success_200 = SuccessResponse.success_200;
  success_200.message = "All users against collaboration!";
  success_200.data.items = userIdAgainstTeam;
  res.send(success_200);
};

controller.remainingPercentage = async (req, res) => {
  console.log("Remaining Percentage called!");
  const project_id = req.query.project_id;
  const teamsModel = await TeamModel.findAll({
    where: {
      project_id: project_id
    },
    include: {
      model: UserToTeamMap
    }
  });

  let teams = [];
  let total_percentage = 0;
  for (let i = 0; i < teamsModel.length; i++) {
    let tempObj = {};
    let user_percentage = 0;
    let userToTeamMaps = teamsModel[i].UserToTeamMaps;
    for (let j = 0; j < userToTeamMaps.length; j++) {
      user_percentage = user_percentage + userToTeamMaps[j].percentage;
    }
    total_percentage += user_percentage;
    tempObj.id = teamsModel[i].id;
    tempObj.name = teamsModel[i].name;
    teams.push(tempObj);
  }
  let min, max;
  let remain_per = 100 - total_percentage;
  if (remain_per <= 0 || remain_per > 100) {
    min = 0;
    max = 0;
  } else {
    min = 1;
    max = remain_per;
  }
  let success_200 = SuccessResponse.success_200;
  success_200.message = "All users against collaboration!";
  success_200.data.items = [];
  success_200.data.items.push({
    "min": min,
    "max": max,
    "teams": teams
  });
  res.send(success_200);
}

controller.markAsDone = async (req, res) => {
  const { project_id, user_id } = req.body;
  const teamsRes = await TeamModel.findAll({
    where: {
      project_id: project_id,
    },
  });
  const teamsId = [];
  for (let i = 0; i < teamsRes.length; i++) {
    teamsId.push(teamsRes[i].id);
  }
  const userToTeamMap = await UserToTeamMap.findAll({
    where:{
      team_id: teamsId,
      // team_id: {
      //   [Op.inq]: teamsId
      // },
      user_id: user_id,
      status: 1
    }
  });
  await ProjectModel.increment(
    {
      progress: userToTeamMap[0].percentage,
    },
    {
      where: {
        id: project_id,
      },
    }
  );

  await UserToTeamMap.update({
    status: 2
  },{
    where:{
      team_id: teamsId,
      // team_id: {
      //   [Op.inq]: teamsId
      // },
      user_id: user_id,
      status: 1
    }
  });

  let success_200 = SuccessResponse.success_200;
    success_200.message = "Your project successfully done";
    success_200.data.items = [];
    res.send(success_200);
};

module.exports = controller;
