import { findUserByCardCode } from '../../../domain/repositories/users.repository.js';
import { Logger } from '../../config/logger.js';

/**
 * @param {import('express').Router} router 
 */
export function authorizeDoor(router) {
    const logger = Logger('authorize-door');
    router.get('/authorization', async (req, res) => {
        const { code } = req.query;
        logger.info(`Verifying user with card code :: ${code}`);
        const user = await findUserByCardCode(code);
        if(user) {
            return res.status(200).end('1');
        }
        return res.status(200).end('0');
    });
}