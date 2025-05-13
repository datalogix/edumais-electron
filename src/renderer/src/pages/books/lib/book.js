import $ from 'jquery'
import './jquery.ui'
import './turn'
import './zoom'
import PenTool from './penTool'

const init = (PAGES, BOOK_ID, BOOK_SINGLE, BOOK_WIDTH, BOOK_HEIGHT) => {
    const $loading = $('.loading').show()
    const $bookViewport = $('.book-viewport')
    const $book = $('.book')
    const $prev = $('.prev')
    const $pageInput = $('.page-input').val(window.sessionStorage.getItem(`book-${BOOK_ID}-bookmark`) ?? 1)
    const $next = $('.next')
    const $zoomIn = $('.zoom-in').hide()
    const $zoomOut = $('.zoom-out').hide()
    const $totalPages = $('.total-pages')
    const penTool = new PenTool()

    $book.turn({
        display: BOOK_SINGLE || $bookViewport.width() < 768 ? 'single' : 'double',
        width: BOOK_WIDTH * (BOOK_SINGLE || $bookViewport.width() < 768 ? 1 : 2),
        height: BOOK_HEIGHT,
        duration: 1000,
        autoCenter: true,
        elevation: 50,
        pages: PAGES.length,
        when: {
            turning: function (event, page, view) {
                $pageInput.val(page)
                $prev.toggle(page != 1)
                $next.toggle(page != $(this).turn('pages'))

                window.sessionStorage.setItem(`book-${BOOK_ID}-bookmark`, page)
            },

            turned: function (event, page, view) {
                $prev.toggle(page != 1)
                $next.toggle(page != $(this).turn('pages'))

                $(this).turn('center')

                if (page == 1) {
                    $(this).turn('peel', 'br')
                }
            },

            missing: function (event, pages) {
                for (let i = 0; i < pages.length; i++) {
                    const element = $('<div />', {})

                    if ($(this).turn('addPage', element, pages[i])) {
                        element.html('<div class="loader"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="animate-spin iconify iconify--mdi" width="60" height="60" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z"></path></svg></div>')
                        const pageObj = PAGES[pages[i] - 1]

                        const img = $('<img />')

                        img.on('mousedown', event => event.preventDefault())

                        img.on('load', function () {
                            $(this).css({ width: '100%', height: '100%' })
                            $(this).appendTo(element)

                            $.each(pageObj.interactions || [], (key, content) => {
                                addContent(key, content, element)
                            })

                            penTool.addPage(pageObj, element)
                            element.find('.loader').remove()
                        })

                        img.attr('src', pageObj.image_url)
                    }
                }
            }
        }
    })

    $bookViewport.zoom({
        flipbook: $book,

        max: function() {
            return 2214/$book.width()
        },

        when: {
            swipeLeft: function () {
                $(this).zoom('flipbook').turn('next')
            },

            swipeRight: function () {
                $(this).zoom('flipbook').turn('previous')
            },

            resize: function (event, scale, page, pageElement) {
                $zoomIn.toggle(scale == 1)
                $zoomOut.toggle(scale != 1)
                penTool.toggle(scale == 1)
            },

            zoomIn: function () {
                $book.removeClass('animated')
                penTool.disable()
            },

            zoomOut: function() {
                $book.addClass('animated')
                $(window).trigger('resize')
                penTool.enable()
            }
        }
    })

    $bookViewport.on($.isTouch ? 'zoom.doubleTap' : 'zoom.tap', event => {
        setTimeout(() => {
            if ($bookViewport.data().contentClicked) {
                $bookViewport.data().contentClicked = false
            } else if (!penTool.active) {
                if ($bookViewport.zoom('value') == 1) {
                    $bookViewport.zoom('zoomIn', event)
                } else {
                    $bookViewport.zoom('zoomOut')
                }
            }
        }, 0)
    })

    $(window).on('orientationchange', () => $(window).trigger('resize')).on('resize', () => {
        const width = $bookViewport.width()
        const height = $bookViewport.height()
        const options = $book.turn('options')

        $book.removeClass('animated')
        //$bookViewport.css({ width, height }).zoom('resize')
        $bookViewport.zoom('resize')

        $zoomIn.toggle($book.turn('zoom') == 1)
        $zoomOut.toggle($book.turn('zoom') != 1)

        if ($book.turn('zoom') == 1) {
            const bound = calculateBound({
                width: options.width,
                height: options.height,
                boundWidth: Math.min(options.width, width),
                boundHeight: Math.min(options.height, height)
            })

            if (bound.width % 2 !== 0) {
                bound.width -= 1
            }

            if (bound.width != $book.width() || bound.height != $book.height()) {
                $book.turn('size', bound.width, bound.height)

                if ($book.turn('page') == 1) {
                    $book.turn('peel', 'br')
                }
            }

            $book.css({ top: -bound.height/2, left: -bound.width/2 })
        }

        penTool.toggle($book.turn('zoom') == 1)
        $book.addClass('animated')
        $loading.fadeOut()
    }).trigger('resize')

    $prev.on('click', () => $book.turn('previous'))

    $next.on('click', () => $book.turn('next'))

    $zoomIn.on('click', () => {
        penTool.disable()
        $bookViewport.zoom('zoomIn')
    })

    $zoomOut.on('click', () => {
        penTool.enable()
        $bookViewport.zoom('zoomOut')
    })

    $totalPages.text($book.turn('pages'))

    $pageInput
        .prop('max', $book.turn('pages'))
        .on('blur', function () {
            let page = parseInt($(this).val())
            if (page < 1) page = 1
            if (page > $book.turn('pages')) page = $book.turn('pages')

            $(this).val(page)
            $book.turn('page', page)
        })
        .on('keydown', function (event) {
            if (event.keyCode === 13) {
                $(this).trigger('blur')
            }
        }).trigger('blur')

    $(document).on('keydown', (event) => {
        switch (event.keyCode) {
            case 37:
                $book.turn('previous')
                event.preventDefault()
                break

            case 39:
                $book.turn('next')
                event.preventDefault()
                break

            case 27:
                penTool.disableDraw()
                $zoomOut.trigger('click')
                event.preventDefault()
                break
        }
    })

    $book.on($.isTouch ? 'touchstart' : 'click', (event) => {
        let content = $(event.target)

        content = content.hasClass('content') ? content : content.parents('.content')

        if (content.length) {
            $bookViewport.data().contentClicked = true

            setTimeout(() => {
                $bookViewport.data().contentClicked = false
            }, 100)

            return processContent(content.prop('data'))
        }
    })
}

const addContent = (index, content, pageElement) => {
	const options = $('.book').turn('options')
  const pageWidth = options.width / (options.display === 'single' ? 1 : 2)
	const pageHeight = options.height

    const $element = $('<div />', { 'class': `content content-${content.type}` })
        .prop('data', content)
        .css({
            top: Math.round(content.y / pageHeight * 100)+'%',
            left: Math.round(content.x / pageWidth * 100)+'%',
            width: content.width ? Math.round(content.width / pageWidth * 100) + '%' : 'auto',
            height: content.height ? Math.round(content.height / pageHeight * 100) + '%' : 'auto'
        })

    const $contentElement = $('<div />').appendTo($element)

    switch (content.type) {
        case 'text':
            $contentElement
                .addClass('content-text')
                .text(content.content)
            break

        case 'audio':
            $contentElement
                .addClass('content-icon')
                .html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path d="M3 9h4l5-5v16l-5-5H3V9zm18 3a9.003 9.003 0 0 1-7 8.777V18.71a7.003 7.003 0 0 0 0-13.42V3.223c4.008.91 7 4.494 7 8.777zm-4 0a5.001 5.001 0 0 1-3 4.584V7.416c1.766.772 3 2.534 3 4.584z" fill="currentColor"></path></svg>')
            break

        case 'video':
        case 'video-url':
            $contentElement
                .addClass('content-icon')
                .html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z"></path></svg>')
            break

        case 'image':
            $contentElement
                .addClass('content-icon')
                .html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m8.5 13.5l2.5 3l3.5-4.5l4.5 6H5m16 1V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"></path></svg>')
            break

        case 'link':
            $contentElement
                .addClass('content-icon')
                .html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0-5 5a5 5 0 0 0 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8v2m9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1c0 1.71-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 5-5a5 5 0 0 0-5-5Z"></path></svg>')
            break

        case 'file':
            $contentElement
                .addClass('content-icon')
                .html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m4 18H6V4h7v5h5v11Z"></path></svg>')
            break

        case 'textarea':
            $contentElement
                .addClass('content-icon')
                .html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21 6v2H3V6h18M3 18h9v-2H3v2m0-5h18v-2H3v2Z"></path></svg>')
            break
    }

    $element.appendTo(pageElement)
}

export const processContent = data => {
    if (!data.type) {
        return
    }

    if (data.type === 'text') {
        return
    }

    if (data.type == 'link' || data.type == 'file') {
        return window.open(data.content_url, '_blank')
    }

    const content = $('<div />', {
        'id': 'content',
        'class': 'content-display',
        'html': '<div class="content-box"><div class="content-drag"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="mx-auto iconify iconify--mdi" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6v5h5V7.75L22.25 12L18 16.25V13h-5v5h3.25L12 22.25L7.75 18H11v-5H6v3.25L1.75 12L6 7.75V11h5V6H7.75L12 1.75L16.25 6H13Z"></path></svg></div><div class="content"></div></div>',
    })

    content.on($.isTouch ? 'touchstart' : 'click', () => content.remove())

    if (data.type === 'audio') {
        if (data.content_url.split('.').pop() === 'mp4') {
            $('.content', content).addClass('max-w-lg').html('<video style="margin-left: auto;margin-right: auto;" autoplay controls preload controlsList="nodownload"><source src="'+data.content_url+'" type="video/mp4"></video>')
        } else {
            $('.content', content).addClass('max-w-lg').html('<audio style="margin-left: auto;margin-right: auto;" autoplay controls preload controlsList="nodownload"><source src="'+data.content_url+'" type="audio/mpeg"></audio>')
        }
    }

    if (data.type === 'video') {
        $('.content', content).addClass('max-w-lg').html('<video style="margin-left: auto;margin-right: auto;" autoplay controls preload controlsList="nodownload"><source src="'+data.content_url+'" type="video/mp4"></video>')
    }

    if (data.type === 'video-url') {
        content.html('<iframe width="70%" height="70%" src="'+data.content_url+'"  style="margin-left: auto;margin-right: auto;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>')
    }

    if (data.type === 'image') {
        $('.content', content).addClass('max-w-lg').html('<img style="margin-left: auto;margin-right: auto;" src="'+data.content_url+'" />')
    }

    if (data.type === 'textarea') {
        $('.content', content).addClass('max-w-lg').html('<div style="max-height: 400px;overflow-y: auto;white-space: pre-wrap;">'+data.content+'</div>')
    }

    $('>div', content).draggable({ handle: ".content-drag" })

    content.appendTo('body')
}

const calculateBound = d => {
    const bound = { width: d.width, height: d.height }

    if (bound.width > d.boundWidth || bound.height > d.boundHeight) {
        const rel = bound.width / bound.height

        if (d.boundWidth / rel > d.boundHeight && d.boundHeight * rel <= d.boundWidth) {
            bound.width = Math.round(d.boundHeight*rel)
            bound.height = d.boundHeight
        } else {
            bound.width = d.boundWidth
            bound.height = Math.round(d.boundWidth/rel)
        }
    }

    return bound
}

window.closeContent = () => {
    $('#content').trigger('click')
}

export default init
