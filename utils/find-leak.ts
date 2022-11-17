import { findLeaks, BrowserInteractionResultReader } from '@memlab/api';
import { MEMLAB_WORKDIR } from './constant';

async function memlabFindLeak () {
  try {
    const reader = BrowserInteractionResultReader.from(MEMLAB_WORKDIR);
    const leaks = await findLeaks(reader);
    return Boolean(leaks);
  } catch (error) {
    throw new Error('memlab analyse failed');
  }
}

export { memlabFindLeak };
