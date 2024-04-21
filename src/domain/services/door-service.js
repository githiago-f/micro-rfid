import dayjs from "dayjs";
import { findByCardCode } from "../repositories/users.repository.js";

/**
 * Verify if the following code is allowed to access
 * the doors.
 * @param {string} code 
 */
export async function allowByCode(code) {
    const user = await findByCardCode(code);
    if(!user) {
        makeTryalNotificationForCode(code);
        return '0';
    }
    if(user.hasFullDoorPermission) return '1';
    const hasPermissionValid = !!user.projects
        .filter(i => dayjs(i.dueDate).diff(new Date()) > 0)
        .pop();
    return hasPermissionValid ? '1' : '0';
}

export async function makeTryalNotificationForCode(code) {
    // TODO when user try to access but has no access
    // the administrator should receive a "notification"
    // informing the card code and the time so he can
    // persist a new user with a new project
    
}
