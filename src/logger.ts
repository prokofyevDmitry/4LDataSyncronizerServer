/**
 * Logger configuration
 * When there is a log, it is also emmited vie port 8001 socket
 */
import * as http from "http";

const winston = require('winston');
const io = require('socket.io')(http);


const send_log_though_socket = (log) => {
    io.emit('log', log);
    console.log('emmited log via socket');
};

// logger configuration
const error_log_transport = new winston.transports.File({filename: 'error.log', level: 'error'});
const combined_log_transport = new winston.transports.File({filename: 'combined.log'});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        error_log_transport,
        combined_log_transport


    ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
const console_transport = new winston.transports.Console({
    format: winston.format.simple(),
    level: 'info'
})
logger.add(console_transport);
console_transport.on('logged', (log) => send_log_though_socket(log));


// starting socket for log emission
io.on('connection', function (socket) {
    console.log('a user connected for car physics');
});
io.listen(8001);


export default logger;