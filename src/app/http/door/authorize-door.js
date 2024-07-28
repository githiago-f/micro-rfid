import { allowByCode } from '../../../domain/services/door-service.js';
import { Logger } from '../../config/logger.js';

/**
 * @param {import('express').Router} router 
 */
export function authorizeDoor(router) {
    const logger = Logger('authorize-door');
    router.get('/authorization', async (req, res) => {
        const { code } = req.query;
        logger.info(`Verifying user with card code :: ${code}`);
        if(!code || code.trim() === '') {
            return res.status(400).end('Invalid code');
        }

        const allowed = await allowByCode(code);
        return res.status(200).end(allowed);
    });
}