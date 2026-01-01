import { Router } from 'express';
import { login, setPasswordForUser } from './auth.controller';
const router = Router();

router.post('/login', login)
router.post('/set-password', setPasswordForUser)

export default router;
