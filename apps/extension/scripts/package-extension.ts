import { spawnSync } from 'node:child_process'

import {
  extensionAppRoot,
  extensionDistRoot,
  getExtensionArchiveFilename,
  getExtensionBuildRoot,
  resolveExtensionTarget,
} from './config'

const target = resolveExtensionTarget(process.argv[2])
const archiveFilename = getExtensionArchiveFilename(target)

const result = spawnSync(
  'web-ext',
  [
    'build',
    '-s',
    getExtensionBuildRoot(target),
    '-a',
    extensionDistRoot,
    '-o',
    '-n',
    archiveFilename,
  ],
  {
    cwd: extensionAppRoot,
    env: process.env,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  },
)

if (result.error) {
  throw result.error
}

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
