const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(helmet());
router.use(cors());
router.use(cookieParser());

router.use('/', require('./practice'));
router.use('/', require('./practitioner'));

module.exports = router;
