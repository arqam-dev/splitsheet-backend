var express = require('express');
var router = express.Router();
// import middleware 
const auth = require('../../../server/middleware/auth');
// import controller
const ProjectController = require('../controller/team.controller');
/* APIs listing. */
router.post('/', ProjectController.createTeam);
router.get('/teams-against-project', ProjectController.teamsAgainstProject);
router.get('/members-against-team', ProjectController.getMemebersAgainstTeam);

module.exports = router;