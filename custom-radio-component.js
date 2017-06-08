const w = window.innerWidth,h = window.innerHeight
class RadioComponent extends HTMLElement {
    render() {
        const canvas = document.createElement('canvas')
        const r = Math.max(w,h)/40
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,`${r}`)
        const tw = context.measureText(this.text).width
        canvas.width = 2*tw+3*r
        canvas.height = 3*r
        context = canvas.getContext('2d')
        context.strokeStyle = this.color
        context.fillStyle = this.color
    }
    constructor() {
        super()
        this.text = this.getAttribute('text')
        this.color = this.getAttribute('color')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
    }
    connectedCallback() {
        this.render()
    }
}
class RadioCircle  {
    constructor() {
        this.scale = 0
    }
    draw(context,x,y,r) {
        context.beginPath()
        context.arc(x,y,r,0,2*Math.PI)
        context.stroke()
        context.save()
        context.translate(x,y)
        context.scale(this.scale,this.scale)
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    update(dir) {
        this.scale += 0.2*dir
    }
    shouldStop() {
        return this.scale > 1 || this.scale < 0
    }
}
