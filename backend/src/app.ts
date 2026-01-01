import express from 'express';
import routes from "./routes/index";
import cors from 'cors';
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
}));
app.get('/health', (_req, res) => res.json({ status: true, message: 'Server is healthy' }));
routes(app);

export default app;
