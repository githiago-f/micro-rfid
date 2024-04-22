import dayjs from "dayjs";
import { findByCardCode } from "../repositories/users.repository.js";
import { createRequest } from "../repositories/requests.repository.js";

/**
 * Verify if the following code is allowed to access
 * the doors.
 * @param {string} code 
 */
export async function allowByCode(code) {
    const user = await findByCardCode(code);
    if(!user) {
        await createRequest(code, true);
        return '0';
    }
    if(user.hasFullDoorPermission) return '1';
    const hasPermissionValid = !!user.projects
        .filter(i => dayjs(i.dueDate).diff(new Date()) > 0)
        .pop();
    return hasPermissionValid ? '1' : '0';
}
