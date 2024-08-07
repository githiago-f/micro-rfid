import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import url from 'node:url';
import path from 'node:path';
import helmet from 'helmet';
import { createServer } from 'node:https';
import { config } from 'dotenv';

config();

import './app/config/auth.js';

import { Logger } from './app/config/logger.js';
import { sessionManager, session } from './app/config/session.js';
import { render } from './infra/utils/render.js';
import users from './app/http/users/index.js';
import projects from './app/http/projects/index.js';
import authentication from './app/http/authentication/index.js';
import door from './app/http/door/index.js';
import notification from './app/http/notification/index.js';
import web from './app/http/web/index.js';
import { getKeyAndCert } from './infra/cert.js';

const PORT = Number(process.env.MRFID_PORT ?? '8445');
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();
const logger = Logger('micro-rfid');

// # CONFIG
app.use(morgan('common', { stream: logger.stream }));
app.use(cors());
app.use(helmet());
app.use(express.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sessionManager);

app.get('/', render('index', { title: 'Login' }));

app.use('/auth', authentication);
app.use('/users', session, users);
app.use('/projects', session, projects);
app.use('/dashboard', session, web);
app.use('/doors', door);
app.use('/notifications', session, notification);

app.use(function(err, _, res, __) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = err;
  
    // render the error page
    res.status(err.status || 500).write(err.msg ?? err.message ?? '500 Internal server error');
    logger.error(err);
});

async function bootstrap() {
    const server = createServer(await getKeyAndCert(), app);
    
    server.listen(PORT, () => {
        logger.info(`Application listening on port ${PORT}`);
    });
}

bootstrap();
