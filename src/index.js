import express from 'express';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { Low, JSONFile } from 'lowdb';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
    const app = express();

    // setup file storage
    const file = path.join(__dirname, 'db.json');
    const adapter = new JSONFile(file);
    const db = new Low(adapter);

    await db.read();

    app.use(express.static(path.resolve(__dirname, 'public')));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(logger('combined'));

    app.get('/', (req, res, next) => {
        return res.send('Welcome to my server...');
    });

    app.listen(8080, 'localhost', 8080, () => {
        console.log('[server]: listening on http://localhost:8080');
    });
}

startServer();
