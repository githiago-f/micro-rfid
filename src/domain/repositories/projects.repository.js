import { iterate } from "iterare";
import {
    PROJECT_PERMISSION_TABLE, 
    PROJECTS_TABLE, 
    connection 
} from "../../infra/knex-connection.js";
import { Project } from "../project.js";

const projects = () => connection({ prj: PROJECTS_TABLE })
    .select(
        'ppm.due_date as project_due_date', 
        'prj.id AS project_id', 
        'prj.name as project_name'
    )
    .leftJoin({ ppm: PROJECT_PERMISSION_TABLE }, 'ppm.project_id', 'prj.id');

export async function findAll() {
    const raw = await projects();

    return iterate(raw).map(prj => new Project(prj)).toArray();
}

export async function findAllPaged(page = 0, sortBy = 'project_name', order = 'desc') {
    const size = 25;
    const offset = page * size;
    const raw = await projects().limit(size)
        .offset(isNaN(offset) ? 0 : offset)
        .orderBy(sortBy, order);
    return iterate(raw).map(prj => new Project(prj)).toArray();
}

export async function findById(id) {
    const project = (await projects().where({ id })).pop();
    if(!project) {
        return null;
    }
    return new Project(project);
}

export async function updateProject(id, name) {
    const project = await connection(PROJECTS_TABLE)
        .update({ name }).where({ id });
    return new Project(project);
}

export async function createProject(name) {
    const project = await connection(PROJECTS_TABLE)
        .insert({ name });
    return new Project(project);
}

export async function allowUserByProject(userId, projectId, dueDate) {
    await connection(PROJECT_PERMISSION_TABLE)
        .insert({
            user_id: userId,
            project_id: projectId,
            due_date: dueDate
        });
}
