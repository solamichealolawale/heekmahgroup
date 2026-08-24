;(() => {
  'use strict'

  function directItems(list) {
    return Array.from(list.children).filter((child) => child.classList.contains('heekmah-list-item'))
  }

  function renumberList(list) {
    const basePath = list.dataset.path

    directItems(list).forEach((item, index) => {
      const oldIndex = item.dataset.index
      const oldPrefix = `${basePath}[${oldIndex}]`
      const newPrefix = `${basePath}[${index}]`

      item.querySelectorAll('[name]').forEach((field) => {
        field.name = field.name.replace(oldPrefix, newPrefix)
      })

      item.dataset.index = String(index)
      const heading = item.querySelector(':scope > .heekmah-list-toolbar strong')
      if (heading) heading.textContent = `Item ${index + 1}`

      item.querySelectorAll('.heekmah-list').forEach(renumberList)
    })
  }

  function clearClone(clone) {
    clone.querySelectorAll('input, textarea, select').forEach((field) => {
      if (field.name.endsWith('[id]')) {
        field.value = `section-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
      } else if (field.dataset.preserve === 'true') {
        return
      } else if (field.type === 'checkbox' || field.type === 'radio') {
        field.checked = false
      } else if (
        field.type === 'hidden' &&
        (field.name.endsWith('[width]') || field.name.endsWith('[height]') || field.name.endsWith('[attachmentId]'))
      ) {
        field.value = '0'
      } else if (field.tagName === 'SELECT') {
        field.selectedIndex = 0
      } else {
        field.value = ''
      }
    })

    clone.querySelectorAll('.heekmah-media-preview').forEach((preview) => {
      preview.replaceChildren()
    })
  }

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof HTMLElement)) return

    const chooseMediaButton = target.closest('.heekmah-choose-media')
    if (chooseMediaButton) {
      event.preventDefault()
      const field = chooseMediaButton.closest('.heekmah-media-field')
      const frame = window.wp.media({
        title: 'Choose Heekmah website image',
        multiple: false,
        library: { type: 'image' },
      })

      frame.on('select', () => {
        const attachment = frame.state().get('selection').first().toJSON()
        field.querySelector('.heekmah-media-src').value = attachment.url || ''
        field.querySelector('.heekmah-media-alt').value = attachment.alt || ''
        field.querySelector('.heekmah-media-width').value = attachment.width || 0
        field.querySelector('.heekmah-media-height').value = attachment.height || 0
        field.querySelector('.heekmah-media-id').value = attachment.id || 0

        const preview = field.querySelector('.heekmah-media-preview')
        const image = document.createElement('img')
        image.src = attachment.sizes?.medium?.url || attachment.url
        image.alt = ''
        preview.replaceChildren(image)
      })

      frame.open()
      return
    }

    const item = target.closest('.heekmah-list-item')
    const list = item?.parentElement

    if (target.closest('.heekmah-move-up') && item?.previousElementSibling) {
      event.preventDefault()
      list.insertBefore(item, item.previousElementSibling)
      renumberList(list)
      return
    }

    if (target.closest('.heekmah-move-down') && item?.nextElementSibling) {
      event.preventDefault()
      list.insertBefore(item.nextElementSibling, item)
      renumberList(list)
      return
    }

    if (target.closest('.heekmah-remove-item') && item && list) {
      event.preventDefault()
      if (directItems(list).length === 1) return
      item.remove()
      renumberList(list)
      return
    }

    const addButton = target.closest('.heekmah-add-item')
    if (addButton) {
      event.preventDefault()
      const fieldset = addButton.closest('.heekmah-array-field')
      const targetList = fieldset.querySelector(':scope > .heekmah-list')
      const items = directItems(targetList)
      const clone = items.at(-1).cloneNode(true)
      clearClone(clone)
      targetList.append(clone)
      renumberList(targetList)
      clone.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
})()
