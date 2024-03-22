import { iterate } from "iterare";
import { User } from './../user.js';
import { Card } from "../card.js";
import { CARDS_TABLE, USER_TABLE, connection } from "../../infra/knex-connection.js";
import { Logger } from "../../app/config/logger.js";

const users = () => connection({ usr: USER_TABLE });
const logger = Logger('users-repository');

const makeUser = raw => {
    logger.info(`User::${JSON.stringify(raw)}`);
    const user = new User(raw);
    if(raw.rfid) {
        user.setCard(new Card(raw));
    }
    return user;
}

export const findUserByCardCode = async (cardCode) => {
    if(cardCode === null || cardCode === undefined) {
        throw new Error('Invalid request.');
    }
    logger.debug('Select user by card code');
    const rows = await users()
        .leftJoin({ crd: CARDS_TABLE }, 'crd.id', 'usr.card_id')
        .where('crd.rfid', cardCode);
    
    return iterate(rows).map(makeUser).toArray().pop();
};
