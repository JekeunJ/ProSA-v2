const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const useragent = require('express-useragent');
const helmet = require('helmet');
const requestIp = require('request-ip');

const router = express.Router();

// Set up router
router.use(express.json({ extended: true, limit: '50mb' }));
router.use(express.urlencoded({ extended: true, limit: '50mb' }));
router.use(helmet());
router.use(cors());
router.use(cookieParser());
router.use(requestIp.mw());
router.use(useragent.express());

// Set up routes
router.use('/v1', require('./v1'));

module.exports = router;
