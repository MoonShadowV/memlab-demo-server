import * as stream from 'node:stream';
import { promisify } from 'node:util';
import { mkdir, createWriteStream } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import { TEMP_FILE_PATH, MEMLAB_SNAPSHOT_NAME } from './constant';

import type { snapshotUrls } from '@/app/find-leak';

const finished = promisify(stream.finished);

async function downloadFileFromInternalCDN (url: string, outputPath: string) {
  const writeStream = createWriteStream(outputPath);
  // Warning: SSRF, if use in prod, need to check url
  return await axios.get(url, { responseType: 'stream' }).then(async resp => {
    resp.data.pipe(writeStream);
    return await finished(writeStream);
  });
}

async function downloadSnapshots (snapshotUrls: snapshotUrls) {
  const dirName = uuidv4();
  const keys = Object.keys(snapshotUrls) as unknown as Array<keyof snapshotUrls>;
  try {
    await mkdir(`${TEMP_FILE_PATH}${dirName}`, { recursive: true });

    const fetchList = keys.map(async key => {
      const url = snapshotUrls[key];
      return await downloadFileFromInternalCDN(url, `${TEMP_FILE_PATH}${dirName}/${MEMLAB_SNAPSHOT_NAME[key]}`);
    });
    await Promise.all(fetchList);
  } catch (error) {
    throw new Error('downloadSnapshot failed');
  }

  return dirName;
}

async function downloadSingleSnapshot (url: string) {
  const dirName = uuidv4();
  try {
    await mkdir(`${TEMP_FILE_PATH}/${dirName}`, { recursive: true });
    await downloadFileFromInternalCDN(url, `${TEMP_FILE_PATH}${dirName}/${MEMLAB_SNAPSHOT_NAME.start}`);
  } catch (error) {
    throw new Error('downloadSnapshot failed');
  }
  return dirName;
}

export { downloadSnapshots, downloadSingleSnapshot };
