var express = require('express');
var router = express.Router();

// import middleware 
const auth = require('../../../server/middleware/auth');

// import controller
const CollaborationController = require('../controller/collaboration.controller');

/* APIs listing. */
router.get('/', CollaborationController.getAllCollaborations);
router.post('/', CollaborationController.createCollaboration);
router.get('/assigned-collaborations', CollaborationController.getAllAssignedCollaborationsWithStatus);
router.post('/accept-reject-collaboration', CollaborationController.acceptOrRejectCollaboration);

module.exports = router;