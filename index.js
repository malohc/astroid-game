const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const SPEED = 2
const ROTATION = 0.05
const DECCEL = 0.99

canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity 
        this.rotation = 0
    }

    draw() {
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation)
         context.translate(-this.position.x, -this.position.y)
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
        context.fillStyle = 'red'
        context.fill()

        context.beginPath()
        context.moveTo(this.position.x + 30, this.position.y)
        context.lineTo(this.position.x - 10, this.position.y - 10)
        context.lineTo(this.position.x - 10, this.position.y + 10)
        context.closePath()

        context.strokeStyle = 'white'
        context.stroke()
        context.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

const player = new Player({
    position: { x: canvas.width / 2 , y: canvas.height / 2},
    velocity: { x: 0, y: 0}
})

const keys = {
    up: {
        pressed: false
    },

    right: {
        pressed: false
    },

    left: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)

    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    
    if (keys.up.pressed) {
        player.velocity.x = Math.cos(player.rotation) * SPEED
        player.velocity.y = Math.sin(player.rotation) * SPEED
    }
    else if (!keys.up.pressed) {
        player.velocity.x *= DECCEL
        player.velocity.y *= DECCEL
        
    }

    if (keys.right.pressed) player.rotation += ROTATION
        else if (keys.left.pressed) player.rotation -= ROTATION


}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            keys.up.pressed = true
            break
        case 'ArrowLeft':
            keys.left.pressed = true
            break
        case 'ArrowRight':
            keys.right.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.code) {
        case 'ArrowUp':
            keys.up.pressed = false
            break
        case 'ArrowLeft':
            keys.left.pressed = false
            break
        case 'ArrowRight':
            keys.right.pressed = false
    }
})