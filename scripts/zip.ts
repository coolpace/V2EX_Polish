import fs from 'node:fs'

import archiver from 'archiver'

function zipFolder(folderPath: string, zipPath: string) {
  const output = fs.createWriteStream(zipPath)
  const archive = archiver('zip')

  output.on('close', () => {
    // eslint-disable-next-line no-console
    console.log('文件夹已成功打包成zip文件。')
  })

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)
  archive.directory(folderPath, false)
  archive.finalize()
}

const folderPath = 'build-chrome'
const zipPath = 'build-chrome.zip'

zipFolder(folderPath, zipPath)
