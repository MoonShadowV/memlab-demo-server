import { downloadSnapshots } from '@/utils/download-snapshot';
import { memlabFindLeak } from '@/utils/find-leak';
import { moveSnapshot, readMemlabReport, clearTempFile, clearMemlabWorkplace } from '@/utils/file-helper';

export interface snapshotUrls {
  start: string
  action: string
  end: string
}

export interface findLeakParams {
  /**
   * CDN urls that store snapshot
   */
  snapshotUrls: snapshotUrls
}

async function findLeak ({ snapshotUrls }: findLeakParams) {
  let processId = '';
  let content = '';
  try {
    processId = await downloadSnapshots(snapshotUrls);
    await moveSnapshot(processId);
    await memlabFindLeak();
    content = await readMemlabReport();
  } catch (error) {
    console.error('error:', error);
    return {
      result: 'find-leak-sync error',
      isSuccess: false
    };
  } finally {
    await clearTempFile(processId);
    await clearMemlabWorkplace();
  }
  return {
    result: content,
    isSuccess: true
  };
}

export { findLeak };
