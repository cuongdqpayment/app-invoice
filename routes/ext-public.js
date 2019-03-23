const router = require('express').Router();

const postHandler = require('../utils/post-handler');
const publicHandler = require('../handlers/public-handler');
const tokenHandler = require('../utils/token-handler');

//cap key khi co token xac thuc bang isdn
router.get('/your-device', publicHandler.getYourDevice, publicHandler.returnDevice);

module.exports = router;