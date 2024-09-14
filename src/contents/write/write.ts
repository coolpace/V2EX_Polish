import { bindImageUpload } from '../../components/image-upload'
import { postTask } from '../helpers'

export function handleWrite() {
  bindImageUpload({
    $wrapper: $('#workspace'),
    insertText: (text: string) => {
      postTask(`editor.getDoc().replaceRange("${text}", editor.getCursor())`)
    },
    replaceText: (find: string, replace: string) => {
      if (replace) {
        const mode = $('input[name=syntax]:checked').val()

        // 特殊处理markdown模式下的图片插入格式。
        if (mode === 'markdown') {
          replace = `![](${replace})`
        }
      }

      postTask(`
      editor.setValue(editor.getValue().replace("${find}", "${replace}"));
      const doc = editor.getDoc(); 
      const lastLine = doc.lastLine(); 
      const lastChar = doc.getLine(lastLine).length; 
      doc.setCursor({ line: doc.lastLine(), ch: lastChar });
      `)
    },
  })
}
