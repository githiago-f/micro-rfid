import { findUserByCardId } from '../../../domain/repositories/users.repository';
import { Logger } from '../../config/logger';

/**
 * @param {import('express').Router} router 
 */
export function validateCardId(router) {
    const logger = Logger('validate-card-id');
    router.get('/', (req, res) => {
        const { card_code } = req.body;
        logger.info(`Verifying user with card code :: ${card_code}`);
        findUserByCardId(card_code);
    });
}