import { Router } from 'express';
import { render } from '../../../infra/utils/render.js';
import { createProject, findById, updateProject } from '../../../domain/repositories/projects.repository.js';
import { Logger } from '../../config/logger.js';

const logger = Logger('project-controller');
const router = Router();

router.get('/', render('create-project'));

router.get('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const project = await findById(parseInt(projectId));
    logger.info(`Project::${JSON.stringify(project)}`);
    if(project===null) {
        return res.status(404).end();
    }
    return render('view-project', { project, title: project.name })(req, res);
});

router.post('/', async (req, res) => {
    const { callback } = req.query;
    const { project_name } = req.body;
    await createProject(project_name);
    if(callback) {
        return res.redirect(callback);
    }
    res.redirect('/dashboard');
});

router.post('/:projectId', async (req, res) => {
    const { projectId } = req.params;
    const { project_name } = req.body;
    await updateProject(projectId, project_name);
    res.redirect('/projects/' + projectId);
});

export default router;
