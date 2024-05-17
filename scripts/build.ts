import fs from 'node:fs'
import path from 'node:path'

function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file)

      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })

    fs.rmdirSync(folderPath)
  }
}

interface BuildParams {
  /** 存放需要构建的源码的文件夹名称。 */
  source: string
  /** 构建输出的文件夹名称。 */
  target: string
  /** 不需要包含的文件。 */
  excludeFile?: string
}

function build({ source, target, excludeFile: exclude }: BuildParams) {
  if (!fs.existsSync(source)) {
    throw new Error('源文件夹不存在。')
  }

  if (fs.existsSync(target)) {
    deleteFolderRecursive(target)
  }

  fs.mkdirSync(target)

  const files = fs.readdirSync(source)

  files.forEach((file) => {
    const sourcePath = path.join(source, file)
    const targetPath = path.join(target, file)

    if (file !== exclude) {
      if (fs.statSync(sourcePath).isDirectory()) {
        build({ source: sourcePath, target: targetPath })
      } else {
        fs.copyFileSync(sourcePath, targetPath)
      }
    }
  })

  // 删除空的文件夹。
  if (fs.readdirSync(target).length === 0) {
    fs.rmdirSync(target)
  }

  if (target === 'build-firefox') {
    const oldFileName = path.join(target, 'manifest-firefox.json')
    const newFileName = path.join(target, 'manifest.json')

    if (fs.existsSync(oldFileName)) {
      fs.renameSync(oldFileName, newFileName)
    }
  }
}

build({
  source: 'extension',
  target: 'build-chrome',
  excludeFile: 'manifest-firefox.json',
})

build({
  source: 'extension',
  target: 'build-firefox',
  excludeFile: 'manifest.json',
})
