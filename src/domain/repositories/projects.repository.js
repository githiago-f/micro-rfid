import { iterate } from "iterare";
import {
    PROJECT_PERMISSION_TABLE, 
    PROJECTS_TABLE, 
    connection 
} from "../../infra/knex-connection.js";
import { Project } from "../project.js";

const projects = () => connection({ prj: PROJECTS_TABLE })
    .leftJoin({ ppm: PROJECT_PERMISSION_TABLE }, 'ppm.project_id', 'prj.id');

export async function findAll() {
    const raw = await projects()
        .select(
            'ppm.due_date as project_due_date', 
            'prj.id AS project_id', 
            'prj.name as project_name'
        );

    return iterate(raw).map(prj => new Project(prj)).toArray();
}
