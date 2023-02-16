import $ from 'jquery'

export default class PenTool {
    constructor () {
        this.pages = []
        this.active = false
        this.mode = null

        this.$pen = $('.pen').hide().on('click', e => this.toggleDraw('pen'))
        this.$eraser = $('.eraser').hide().on('click', e => this.toggleDraw('eraser'))
    }

    addPage (page, element, drawing_url = null) {
        if (element.has('canvas').length) return

        const $canvas = $('<canvas ignore="1" class="canvas"></canvas>').appendTo(element)
        const canvas = $canvas.get(0)
        const pageObj = {
            saving: null,
            page,
            element,
            $canvas,
            canvas,
            drawing: null
        }

        if (drawing_url) {
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => {
                pageObj.drawing = img
                this.load(pageObj)
            }
            img.src = drawing_url
        }

        this.pages.push(pageObj)

        $canvas.on('mouseup', e => {
            if (!this.active) return

            this.save(pageObj)
        })

        $canvas.on('mousedown', e => {
            if (!this.active) return

            const { x, y } = canvas.getBoundingClientRect()

            $canvas.data('lastX', e.clientX - x)
            $canvas.data('lastY', e.clientY - y)
        })

        $canvas.on('mouseenter', e => {
            if (!this.active) return

            const { x, y } = canvas.getBoundingClientRect()

            $canvas.data('lastX', e.clientX - x)
            $canvas.data('lastY', e.clientY - y)
        })

        $canvas.on('mousemove', e => {
            if (e.buttons !== 1 || !this.active) return

            const { x, y } = canvas.getBoundingClientRect()
            const newX = e.clientX - x
            const newY = e.clientY - y

            const ctx = canvas.getContext('2d')
            ctx.beginPath()

            if (this.mode === 'pen') {
                ctx.strokeStyle = 'green'
                ctx.lineWidth = 10
                ctx.globalAlpha = 0.3
                ctx.globalCompositeOperation = 'source-over'
                ctx.moveTo($canvas.data('lastX'), $canvas.data('lastY'))
                ctx.lineTo(newX, newY)
                ctx.stroke()
            }

            if (this.mode === 'eraser') {
                ctx.globalAlpha = 1
                ctx.globalCompositeOperation = 'destination-out'
                ctx.arc($canvas.data('lastX'), $canvas.data('lastY'), 30, 0, Math.PI * 2, false)
                ctx.fill()
            }

            ctx.closePath()

            $canvas.data('lastX', newX)
            $canvas.data('lastY', newY)
        })

        return this
    }

    load ({ canvas, element, drawing }) {
        canvas.width = element.width()
        canvas.height = element.height()

        if (drawing) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            canvas.getContext('2d').drawImage(drawing, 0, 0, canvas.width, canvas.height)
        }
    }

    save (pageObj) {
        clearTimeout(pageObj.saving)
        /*
        pageObj.saving = setTimeout(() => {
            const formData = new FormData()
            formData.append('drawing', pageObj.canvas.toDataURL('image/png'))

            fetch(profile.route('books.pages.drawing', [pageObj.page.book_id, pageObj.page.id]), {
              method: 'post',
              body: formData
            })
        }, 3000)
        */
    }

    resize () {
        this.pages.forEach(({ $canvas }) => $canvas.hide())

        setTimeout(() => {
            this.pages.forEach(pageObj => {
                this.load(pageObj)

                pageObj.$canvas.show()
            })
        }, 0)

        return this
    }

    disableDraw () {
        return this.toggleDraw()
    }

    toggleDraw (mode = null) {
        this.mode = this.mode === mode || mode === null ? null : mode
        this.active = !!this.mode
        this.$pen.toggleClass('bg-blue-500', this.active && this.mode === 'pen')
        this.$pen.toggleClass('bg-black', !(this.active && this.mode === 'pen'))
        this.$eraser.toggleClass('bg-blue-500', this.active && this.mode === 'eraser')
        this.$eraser.toggleClass('bg-black', !(this.active && this.mode === 'eraser'))

        return this.resize()
    }

    enable () {
        return this.toggle(true)
    }

    disable () {
        return this.disableDraw().toggle(false)
    }

    toggle (bool = null) {
        this.$pen.toggle(bool)
        this.$eraser.toggle(bool)

        return this.resize()
    }
}
