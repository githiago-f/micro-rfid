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
    const raw = await projects().limit(size).offset(page * size).orderBy(sortBy, order);
    return iterate(raw).map(prj => new Project(prj)).toArray();
}
