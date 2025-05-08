import { Router } from 'express';

import { TemplatesController } from '../../Controllers';

const router = Router();

router.get('/*', TemplatesController.serve);

export default router;