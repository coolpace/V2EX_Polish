import { commentCells, commentData, loginName, ownerName } from './globals'

export function nestedComments() {
  let i = 1
  while (i < commentCells.length) {
    const cellDom = commentCells[i]
    const { name, content } = commentData[i]

    if (name === ownerName) {
      cellDom.classList.add('owner')
    }

    if (name === loginName) {
      cellDom.classList.add('self')
    }

    if (content.includes('@')) {
      for (let j = i - 1; j >= 0; j--) {
        if (content.match(`@${commentData[j].name}`)) {
          cellDom.classList.add('responder')
          commentCells[j].append(cellDom)
          break
        }
      }
    }

    i++
  }
}
