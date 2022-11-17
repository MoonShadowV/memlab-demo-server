import Koa from 'koa';
import { koaBody } from 'koa-body';

import { router } from './router';
import { initWorkDir } from '@/utils/file-helper';

async function initApp () {
  await initWorkDir();

  const app = new Koa();
  app.use(koaBody());
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.listen(3000);
  console.log('server is running at localhost:3000');
}

void initApp();
