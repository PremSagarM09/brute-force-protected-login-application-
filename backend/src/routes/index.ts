const prefix = 'api';
import authRoutes from '../auth/auth.index';

const router = (app: any) => {
    app.use(`/${prefix}/auth`, authRoutes);
}

export default router;