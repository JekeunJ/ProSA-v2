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

// No routes yet -- I'll create these as needed

module.exports = router;
