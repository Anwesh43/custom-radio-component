const w = window.innerWidth,h = window.innerHeight
class RadioComponent extends HTMLElement {
    render(dir) {
        const canvas = document.createElement('canvas')
        const r = Math.max(w,h)/40
        var context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,`${r}`)
        const tw = context.measureText(this.text).width
        canvas.width = 2*tw+3*r
        canvas.height = 3*r
        context = canvas.getContext('2d')
        context.font = context.font.replace(/\d{2}/,`${r}`)
        context.lineWidth = r/5
        context.strokeStyle = this.color
        context.fillStyle = this.color
        this.radioCircle.draw(context,r,canvas.height/2,r/2)
        this.textLine.draw(context,this.text,canvas.width/2-tw/2,3*r/2,2*r,2*r)
        this.textLine.update(canvas.width-2*r,dir)
        this.radioCircle.update(dir)
        this.img.src = canvas.toDataURL()
    }
    stopped() {
        return this.radioCircle.shouldStop()
    }
    constructor() {
        super()
        this.text = this.getAttribute('text')
        this.color = this.getAttribute('color')
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.textLine = new TextLine()
        this.radioCircle = new RadioCircle()
        this.animationHandler = new AnimationHandler(this)
    }
    connectedCallback() {
        this.render(0)
        this.img.onmousedown = (event) => {
            const x = event.offsetX,y = event.offsetY
            if(this.radioCircle.insideBounds(x,y) == true) {
                this.animationHandler.start()
            }
        }
    }
}
class RadioCircle  {
    constructor() {
        this.scale = 0
        this.stopped = true
    }
    draw(context,x,y,r) {
        if(!this.insideBounds) {
            this.insideBounds = (mx,my) =>{
                const condition =  mx>=x-r && mx<=x+r && my>=y-r && my<=y+r && this.stopped
                if(condition) {
                  this.stopped = false
                }
                return condition
            }
        }
        context.beginPath()
        context.arc(x,y,r,0,2*Math.PI)
        context.stroke()
        context.save()
        context.translate(x,y)
        context.scale(this.scale,this.scale)
        context.beginPath()
        context.arc(0,0,r,0,2*Math.PI)
        context.fill()
        context.restore()
    }
    update(dir) {
        this.scale += 0.2*dir
        if(this.scale > 1) {
            this.scale = 1
            this.stopped = true
        }
        if(this.scale < 0) {
            this.scale = 0
            this.stopped = true
        }
    }
    shouldStop() {
        return this.stopped
    }
}
class TextLine {
    constructor() {
        this.lx = 0
    }
    draw(context,text,tx,ty,x,y) {
        context.beginPath()
        context.moveTo(x,y)
        context.lineTo(x+this.lx,y)
        context.stroke()
        context.fillStyle = 'black'
        context.fillText(text,tx,ty)
    }
    update(maxw,dir) {
        this.lx += (maxw/5)*dir
    }
}
class AnimationHandler {
    constructor(component) {
        this.dir = 0
        this.prevDir = -1
        this.component = component
    }
    start() {
        this.dir = -1*this.prevDir
        const interval = setInterval(()=>{
            this.component.render(this.dir)
            if(this.component.stopped()) {
                this.prevDir = this.dir
                this.dir = 0
                clearInterval(interval)
                this.component.render(this.dir)
            }
        },100)
    }
}
customElements.define('custom-radio',RadioComponent)
