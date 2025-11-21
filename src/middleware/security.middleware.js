import { slidingWindow } from '@arcjet/node';
import aj from '../config/arcjet.js';   
import logger from '#config/logger.js';
import error from 'winston';
export const securityMiddleware = async (req, res, next) => {
    try{
        const role = req.user?.role || 'guest';
        let limit;
        let message;

        switch(role){
            case 'admin':
                limit = 20;
                message = 'Admin rate limit (20) exceeded';
            break;
            case 'user':
                limit = 10;
                message = 'user rate limit (10) exceeded';
            break;
            case 'guest':
                limit = 5;
                message = 'guest rate limit (5) exceeded';
            break;
            }
            const client = aj.withRule(slidingWindow({mode: 'LIVE', interval: '1m', max: limit, name: `Rate limit for ${role}`}));
            const decision = await client.protect(req);
            if(decision.isDenied && decision.reason.isBot()){
                logger.warn(`Blocked bot request`, {ip: req.ip, path: req.path});
                // return res.status(403).json({error: 'Access denied for bots', message: 'Your request has been identified as coming from a bot and has been blocked.'});
            }
            if(decision.isDenied && decision.reason.isShield()){
                logger.warn(`Blocked malicious request`, {ip: req.ip, userAgent: req.get('User-Agent'), path: req.path, method: req.method});
                return res.status(403).json({error: 'Malicious request blocked', message: 'Your request has been blocked due to security concerns.'});
            }
            if(decision.isDenied && decision.reason.isRateLimit()){
                logger.warn(`Blocked bot request`, {ip: req.ip,userAgent: req.get('User-Agent'), path: req.path});
                return res.status(403).json({error: 'Access denied for bots', message: 'Your request has been identified as coming from a bot and has been blocked.'});
            }
            next()
    }catch(e){console.error('Arcjet middleware error', e);
        res.status(500).send('Internal Server Error');
    }
}
export default securityMiddleware;