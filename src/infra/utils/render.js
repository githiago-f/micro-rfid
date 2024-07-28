import { count } from "../../domain/repositories/requests.repository.js";

export function render(page, options) {
    return async (req, res) => res.render(page, {
        ...options, 
        notificationCount: await count(), 
        ...req.query
    });
}
