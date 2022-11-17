import path from 'path';

const root = __dirname;

/**
 * Memlab的工作目录
 */
const MEMLAB_WORKDIR = path.join(root, '../memlab-workdir');

/**
 * 存储memlab要分析的snapshot的目录
 */
const MEMLAB_SNAPSHOT_PATH = path.join(root, '../memlab-workdir/data/cur/');

/**
 * 存储memlab分析产物的目录
 */
const MEMLAB_OUTPUT_PATH = path.join(root, '../memlab-workdir/data/out/');

/**
 * 内存泄漏分析报告的文件名
 */
const MEMLAB_OUTPU_FILENAME = 'leaks.txt';

/**
 * 用于存储需要进行分析的snapshot的临时目录
 */
const TEMP_FILE_PATH = path.join(root, '../temp-file/');

/**
 * 符合memlab规范的snapshot命名集合
 */
enum MEMLAB_SNAPSHOT_NAME {
  start = 's1.heapsnapshot',
  action = 's2.heapsnapshot',
  end = 's3.heapsnapshot',
}

export {
  MEMLAB_SNAPSHOT_NAME,
  TEMP_FILE_PATH,
  MEMLAB_OUTPUT_PATH,
  MEMLAB_OUTPU_FILENAME,
  MEMLAB_WORKDIR,
  MEMLAB_SNAPSHOT_PATH
};
