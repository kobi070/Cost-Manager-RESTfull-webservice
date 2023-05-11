// Kobi Kuzi xxxxxxxx
// Dan Kvitca xxxxxxx,

const express = require('express');
const router = express.Router();
const winston = require('winston');

const winstonLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

// GET method for /about => returns information about the developers
router.get('/', (req, res) => {
    winstonLogger.info("GET method for /about");
    // winstonLogger.info(`Session created successfully with ID: ${req.session.id}`);
    const devs = [
        {first_name: 'Kobi', last_name: 'Kuzi', id: 316063908, email: 'Kobi070@gmail.com'},
        {first_name: 'Dan', last_name: 'Kvitca', id: 205570674, email: 'Dkvitca@gmail.com'}
    ]
    res.json(devs);
});

module.exports = router;
