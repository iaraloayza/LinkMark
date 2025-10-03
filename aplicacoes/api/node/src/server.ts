import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes/index.js'; 

const app = express();
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
    res.json({ success: true, data: { status: 'ok', time: new Date().toISOString() } });
});

// Minhas rotas (links + categories)
app.use('/', routes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Not Found' });
});

// Listen em todas as interfaces para funcionar no Docker
app.listen(PORT, () => {
    console.log(`Node API listening on http://localhost:${PORT}`);
});
