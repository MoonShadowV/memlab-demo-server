import Router from '@koa/router';
import { findLeak } from './find-leak';

import type { findLeakParams } from './find-leak';

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'ok';
});

router.post('/find-leak', async (ctx) => {
  const params: findLeakParams = ctx.request.body;
  const { isSuccess, result } = await findLeak(params);
  ctx.body = {
    status: isSuccess ? 200 : 500,
    data: result
  };
});

export { router };
