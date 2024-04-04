import { iterate } from "iterare";
import { User } from './../user.js';
import { Card } from "../card.js";
import { CARDS_TABLE, USER_TABLE, connection } from "../../infra/knex-connection.js";
import { Logger } from "../../app/config/logger.js";
import { enc } from "../../infra/utils/encript.js";

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

export const findUserByEmail = async (email) => {
    const rows = await users().where('usr.email', email).limit(1);
    const user = rows.pop();
    if(user === undefined) {
        throw new Error('User with e-mail ' + email + ' not found.');
    }
    return makeUser(user);
};

export const findUserById = async (id) => {
    const rows = await users().where('usr.id', id).limit(1);
    const user = rows.pop();
    if(user === undefined) {
        return undefined;
    }
    return makeUser(user);
}

export const save = async (id, newData) => {
    const password = newData.passoword ? await enc(newData.password) : undefined;
    await users().where('id', id).update({
        permissions: newData.permissions.toString(),
        name: newData.name,
        card_id: newData.card.id,
        default_password: false,
        email: newData.email,
        password
    });

    return findUserById(id);
}
