import { iterate } from "iterare";
import { User } from './../user.js';
import { Card } from "../card.js";
import { 
    CARDS_TABLE, 
    USER_TABLE, 
    PROJECT_PERMISSION_TABLE, 
    PROJECTS_TABLE, 
    connection 
} from "../../infra/knex-connection.js";
import { Logger } from "../../app/config/logger.js";
import { enc } from "../../infra/utils/encript.js";
import { Project } from "../project.js";
import { markAsViewed } from "./requests.repository.js";

const users = () => connection({ usr: USER_TABLE });
const usersWithRelations = () => users()
    .select(
        'ppm.due_date as project_due_date',
        'pj.id as project_id',
        'pj.name as project_name',
        'crd.id as card_id',
        'crd.rfid as card_rfid',
        'usr.*'
    )
    .leftJoin({ crd: CARDS_TABLE }, 'crd.id', 'usr.card_id')
    .leftJoin({ ppm: PROJECT_PERMISSION_TABLE }, 'ppm.user_id', 'usr.id')
    .leftJoin({ pj: PROJECTS_TABLE }, 'pj.id', 'ppm.project_id');
const logger = Logger('users-repository');

/**
 * @param {any[]} raw
 * @returns {User}
 */
function makeUsersWithProjects(raw) {
    logger.info(`User with projects :: ${JSON.stringify(raw)}`);
    const lastRow = raw.at(-1);
    const user = new User(lastRow);
    const projects = iterate(raw).filter(r => r.project_id !== undefined)
        .map(r => new Project(r))
        .toArray();
    user.setProjects(projects);
    if(lastRow.card_id) {
        user.setCard(new Card(lastRow));
    }
    return user;
}

/**
 * @param {any[]} raw
 * @returns {User}
 */
function makeUsersWithRelations(raw) {
    logger.info(`User with projects :: ${JSON.stringify(raw)}`);
    const groups = {};
    for (const row of raw) {
        groups[row.id] = groups[row.id] || [];
        groups[row.id].push(row);
    }

    return iterate(Object.keys(groups)).map(i => makeUsersWithProjects(groups[i])).toArray();
}

/**
 * 
 * @param {User} user 
 * @param {Number} requestId
 */
export async function create(user, requestId) {
    if(user.card) {
        user.card.id = await connection(CARDS_TABLE).insert({
            rfid: user.card.rfid
        }, 'id');
    }
    const userId = await connection(USER_TABLE).insert({
        permissions: user.permissions.toString(),
        name: user.name,
        card_id: user.card?.id ?? undefined,
        default_password: true,
        email: user.email,
        password: await enc(process.env.DEFAULT_PASSWORD ?? 'pass123')
    }, 'id');
    await markAsViewed(requestId);
    return userId;
}

/**
 * @param {string} cardCode 
 * @returns {Promise<User>}
 */
export async function findByCardCode(cardCode) {
    if(cardCode === null || cardCode === undefined) {
        throw new Error('Invalid request.');
    }
    logger.debug('Select user by card code');
    const rows = await usersWithRelations().where('crd.rfid', cardCode);
    if(rows.length < 1) {
        return undefined;
    }
    return makeUsersWithProjects(rows);
};

/**
 * @param {string} email 
 * @returns {Promise<User>}
 */
export async function findByEmail(email) {
    const rows = await usersWithRelations().where('usr.email', email);
    if(rows.length < 1) {
        return undefined;
    }
    return makeUsersWithProjects(rows);
};

/**
 * @param {number} id
 * @returns {Promise<User>}
 */
export async function findById(id) {
    const rows = await usersWithRelations().where('usr.id', id);
    if(rows.length < 1) {
        return undefined;
    }
    return makeUsersWithProjects(rows);
}

export async function findAllPaged(page = 0, size = 25, sortBy = 'name', order = 'desc') {
    const raw = await usersWithRelations().limit(size).offset(page * size).orderBy(sortBy, order);
    if(raw.length < 1) {
        return [];
    }
    console.log(raw);
    return makeUsersWithRelations(raw);
}

/**
 * @param {number} id 
 * @param {Partial<User>} newData 
 * @returns {Promise<User>}
 */
export async function updateById(id, newData) {
    const password = (newData.password === undefined) ? 
        undefined : (await enc(newData.password));
    await users().where('id', id).update({
        permissions: newData.permissions.toString(),
        name: newData.name,
        card_id: newData.card?.id ?? undefined,
        default_password: false,
        email: newData.email,
        password
    });

    return findById(id);
}
