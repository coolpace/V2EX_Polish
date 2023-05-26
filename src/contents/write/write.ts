import { bindImageUpload } from '../../components/image-upload'
import { hostCall } from '../helpers'

export function handlerWrite() {
  bindImageUpload({
    $el: $('#workspace'),
    insertText: (text: string) => {
      void hostCall(`editor.getDoc().replaceRange("${text}", editor.getCursor())`)
    },
    replaceText: (find: string, replace: string) => {
      if (replace) {
        // 特殊处理markdown模式下的图片插入格式
        const mode = $('input[name=syntax]:checked').val()
        if (mode === 'markdown') {
          replace = `![](${replace})`
        }
      }

      void hostCall(`
      editor.setValue(editor.getValue().replace("${find}", "${replace}"));
      editor.focus();
      const doc = editor.getDoc(); 
      const lastLine = doc.lastLine(); 
      const lastChar = doc.getLine(lastLine).length; 
      doc.setCursor({ line: doc.lastLine(), ch: lastChar });
      `)
    },
  })
}
