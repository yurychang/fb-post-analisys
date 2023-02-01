var express = require('express');
const Bank104Service = require('../services/Bank104Service');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/104', async function (req, res, next) {
    const jobList = await Bank104Service.getJobList(req.query);
    res.json(jobList);
});

module.exports = router;
