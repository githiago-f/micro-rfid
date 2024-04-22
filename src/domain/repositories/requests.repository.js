import { Logger } from "../../app/config/logger.js";
import { 
    REQUESTS,
    connection 
} from "../../infra/knex-connection.js";
import { OpenRequest } from "../request.js";

const requests = () => connection({ req: REQUESTS });
const logger = Logger('request-repository');

export async function findLastDenied() {
    const rows = await requests().where('req.viewed', false);
    return rows.map(raw => new OpenRequest(raw));
}

/**
 * @param {number} id
 * @param {boolean} viewed
 */
export async function markAsViewed(id) {
    await requests().update({ 'req.viewed': true }).where('req.id', id);
}

export async function createRequest(rfid, denied) {
    await connection(REQUESTS).insert({
        rfid, 
        status: denied ? 'DENIED' : 'ALLOWED'
    });
}
