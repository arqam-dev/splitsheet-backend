var express = require('express');
var router = express.Router();

// import middleware 
const auth = require('../../../server/middleware/auth');

// import controller
const ProjectController = require('../controller/project.controller');

/* APIs listing. */
router.get('/', ProjectController.getAllProjects);
router.post('/', ProjectController.createProject);
router.get('/assigned-projects', ProjectController.getAllAssignedProjectsWithStatus);
router.post('/accept-reject-project', ProjectController.acceptOrRejectProject);
router.get('/users-against-project', ProjectController.getMembersAgainstProject);
router.get('/remaining-percentage', ProjectController.remainingPercentage);
router.post('/mark-as-done', ProjectController.markAsDone);

module.exports = router;