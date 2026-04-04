import { PendingOptionsMenuStorageKey } from '../constants'
import { createButton } from './button'
import { createModal } from './modal'

interface OpenTagInputModalProps {
  root?: JQuery
  title: string
  memberName: string
  hint: string
  placeholder: string
  initialValue?: string
  confirmText?: string
  rows?: number
}

/**
 * 打开标签输入框，并在输入法组合输入期间忽略 Enter 确认。
 */
export function openTagInputModal(props: OpenTagInputModalProps): Promise<string | null> {
  const {
    root,
    title,
    memberName,
    hint,
    placeholder,
    initialValue,
    confirmText = '确认',
    rows = 4,
  } = props

  return new Promise((resolve) => {
    let $input: JQuery
    let isComposing = false
    let settled = false

    const optionsUrl = new URL(chrome.runtime.getURL('pages/options.html'))
    optionsUrl.searchParams.set('menu', 'tags')

    const settle = (value: string | null) => {
      if (settled) {
        return
      }

      settled = true
      resolve(value)
    }

    const modal = createModal({
      root,
      title,
      footer: true,
      onMount: ({ $mask, $main, $content, $footer, $actions }) => {
        $mask.css({
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        })

        $main.css({
          height: 'auto',
        })

        const $inputWrapper = $('<div class="v2p-tag-input-wrapper">').css({
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        })

        const $hint = $(`<div class="v2p-tag-hint">对 <b>@${memberName}</b> ${hint}</div>`).css({
          fontSize: '14px',
          color: 'var(--v2p-color-font-secondary)',
        })

        $input = $('<textarea type="text" class="sl" name="tags" />')
          .attr({
            placeholder,
            rows: String(rows),
          })
          .val(initialValue ?? '')
          .css({
            width: '100%',
          })

        $inputWrapper.append($hint, $input)
        $content.append($inputWrapper)

        const $confirmBtn = createButton({
          children: confirmText,
          className: 'special',
        })
        const $viewAllTagsBtn = createButton({
          children: '查看全部标签',
        })
        const $closeBtn = $actions.find('.v2p-modal-close-btn').clone(true)
        const $leftActions = $('<div>').css({
          display: 'flex',
          alignItems: 'center',
        })
        const $rightActions = $('<div>').css({
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        })

        $footer.css({
          justifyContent: 'space-between',
        })

        $leftActions.append($viewAllTagsBtn)
        $rightActions.append($closeBtn, $confirmBtn)
        $footer.append($leftActions, $rightActions)
        $actions.remove()

        const handleConfirm = () => {
          settle(($input.val() as string) ?? '')
          modal.close()
        }

        const handleOpenAllTags = async () => {
          if (window.location.href.startsWith(chrome.runtime.getURL('pages/options.html'))) {
            settle(null)
            modal.destroy()
            window.location.assign(optionsUrl.toString())

            return
          }

          await chrome.storage.local.set({
            [PendingOptionsMenuStorageKey]: 'tags',
          })
          await chrome.runtime.openOptionsPage()
          modal.close()
        }

        $confirmBtn.on('click', handleConfirm)
        $viewAllTagsBtn.on('click', () => {
          void handleOpenAllTags()
        })

        $input
          .on('compositionstart', () => {
            isComposing = true
          })
          .on('compositionend', () => {
            isComposing = false
          })
          .on('keydown', (ev) => {
            if (ev.key !== 'Enter') {
              return
            }

            const nativeEvent = ev.originalEvent
            const isImeSelecting = nativeEvent instanceof KeyboardEvent
              && (nativeEvent.isComposing || nativeEvent.keyCode === 229)

            if (isComposing || isImeSelecting) {
              return
            }

            ev.preventDefault()
            handleConfirm()
          })
      },
      onOpen: () => {
        setTimeout(() => {
          $input?.trigger('focus')

          const inputElement = $input?.get(0)

          if (
            inputElement instanceof HTMLInputElement
            || inputElement instanceof HTMLTextAreaElement
          ) {
            const length = (inputElement.value || '').length
            inputElement.setSelectionRange(length, length)
          }
        }, 100)
      },
      onClose: () => {
        settle(null)
        modal.destroy()
      },
    })

    modal.open()
  })
}
