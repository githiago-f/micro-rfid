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

export async function count() {
    const rows = await requests().count().where('req.viewed', false);
    const count = rows[0]['count(*)'];
    logger.info(`Counted ${count} notification rows`);
    return count;
}

/**
 * @param {number} id
 * @param {boolean} viewed
 */
export async function markAsViewed(id) {
    logger.info(`Marking Request::${id} as viewed`);
    const updated = await requests().update({ 'req.viewed': true })
        .where('req.id', id);
    logger.info(`Updated request::${updated}`);
}

export async function createRequest(rfid, denied) {
    const statusLabel = denied ? 'DENIED' : 'ALLOWED';
    logger.info(`Persisting new access request::${rfid} ${statusLabel}`);
    const rows = await connection(REQUESTS).insert({
        rfid, 
        status: statusLabel
    });
    logger.info(`Persisted ${rows}`);
}
