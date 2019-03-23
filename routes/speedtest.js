const router = require('express').Router();

const postHandler = require('../utils/post-handler');
const tokenHandler = require('../utils/token-handler');
const speedtestHandler = require('../handlers/speedtest-handler');

//cap key khi co token xac thuc bang isdn
router.get('/get-results', speedtestHandler.getResults);
router.post('/post-result', postHandler.jsonProcess,speedtestHandler.postResult);

module.exports = router;