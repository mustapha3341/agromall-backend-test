import express from 'express';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { Low, JSONFile } from 'lowdb';
import { engine } from 'express-handlebars';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
    const app = express();

    // setup file storage
    const file = path.join(__dirname, 'db.json');
    const adapter = new JSONFile(file);
    const db = new Low(adapter);

    await db.read();

    // init view engine
    app.engine(
        'hbs',
        engine({
            extname: 'hbs',
            defaultLayout: 'main',
            layoutsDir: __dirname + '/views/layouts/',
        })
    );
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, 'views'));

    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(logger('combined'));

    app.get('/', (req, res, next) => {
        return res.render('home', {
            message: 'Welcome to my server',
            title: 'Mini CRM Nodejs',
        });
    });

    app.listen(5000, () => {
        console.log('[server]: listening on http://localhost:5000');
    });
}

startServer();
