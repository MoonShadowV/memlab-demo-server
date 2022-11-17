import { move, remove, readFile, mkdir, pathExists, writeFile } from 'fs-extra';

import {
  MEMLAB_SNAPSHOT_PATH,
  MEMLAB_SNAPSHOT_NAME,
  TEMP_FILE_PATH,
  MEMLAB_OUTPUT_PATH,
  MEMLAB_OUTPU_FILENAME
} from './constant';

async function initWorkDir () {
  const isInited = await pathExists(MEMLAB_SNAPSHOT_PATH);
  if (isInited) {
    return true;
  }

  // Memlab need meta data, we just mock it
  const initSnapshot = async () => {
    await mkdir(MEMLAB_SNAPSHOT_PATH, { recursive: true });
    const snapSeqTemplate = `[
      {
        "name": "page-load",
        "interactions": [],
        "snapshot": true,
        "type": "baseline",
        "idx": 1,
        "metrics": {}
      },
      {
        "name": "action-on-page",
        "interactions": [
          null
        ],
        "snapshot": true,
        "type": "target",
        "idx": 2,
        "metrics": {}
      },
      {
        "name": "revert",
        "interactions": [
          null
        ],
        "snapshot": true,
        "type": "final",
        "idx": 3,
        "metrics": {}
      }
    ]`;
    return await Promise.all([
      writeFile(`${MEMLAB_SNAPSHOT_PATH}run-meta.json`, '{}', { encoding: 'utf-8' }),
      writeFile(`${MEMLAB_SNAPSHOT_PATH}snap-seq.json`, snapSeqTemplate, { encoding: 'utf-8' })
    ]);
  };

  const dirList = [initSnapshot(), mkdir(TEMP_FILE_PATH)];
  await Promise.all(dirList).then(async () => await mkdir(MEMLAB_OUTPUT_PATH));
}

async function moveSnapshot (dirName: string) {
  await clearMemlabWorkplace();

  const fileDir = `${TEMP_FILE_PATH}${dirName}/`;
  const taskList = [
    move(`${fileDir}${MEMLAB_SNAPSHOT_NAME.start}`, `${MEMLAB_SNAPSHOT_PATH}${MEMLAB_SNAPSHOT_NAME.start}`),
    move(`${fileDir}${MEMLAB_SNAPSHOT_NAME.action}`, `${MEMLAB_SNAPSHOT_PATH}${MEMLAB_SNAPSHOT_NAME.action}`),
    move(`${fileDir}${MEMLAB_SNAPSHOT_NAME.end}`, `${MEMLAB_SNAPSHOT_PATH}${MEMLAB_SNAPSHOT_NAME.end}`)
  ];

  try {
    await Promise.all(taskList);
    return true;
  } catch (error) {
    throw new Error(`moveSnapshot failed! dir:${dirName}`);
  }
}

async function readMemlabReport () {
  const content = await readFile(`${MEMLAB_OUTPUT_PATH}${MEMLAB_OUTPU_FILENAME}`, 'utf-8');
  return content;
}

async function clearMemlabWorkplace () {
  const taskList = [
    remove(`${MEMLAB_SNAPSHOT_PATH}${MEMLAB_SNAPSHOT_NAME.start}`),
    remove(`${MEMLAB_SNAPSHOT_PATH}${MEMLAB_SNAPSHOT_NAME.action}`),
    remove(`${MEMLAB_SNAPSHOT_PATH}${MEMLAB_SNAPSHOT_NAME.end}`),
    remove(`${MEMLAB_SNAPSHOT_PATH}console-log.txt`),
    remove(`${MEMLAB_OUTPUT_PATH}${MEMLAB_OUTPU_FILENAME}`)
  ];
  return await Promise.all(taskList);
}

async function clearTempFile (dirName: string) {
  if (dirName === null) {
    return;
  }

  await remove(`${TEMP_FILE_PATH}${dirName}`);
}

export { initWorkDir, moveSnapshot, readMemlabReport, clearTempFile, clearMemlabWorkplace };
