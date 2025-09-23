const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const SPEED = 2
const PROJECTILE_SPEED = 3
const ROTATION = 0.05
const DECCEL = 0.99
const RADIUS = 5
const SPAWN_TIME = 3000
const MAX_SIZE = 50
const MIN_SIZE = 10

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

const projectiles = []
const astroids = []

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

        context.beginPath()
        context.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2, false)
        context.fillStyle = 'red'
        context.fill()
        context.closePath

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

class Projectile {
    constructor ({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = RADIUS
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        context.closePath()
        context.fillStyle = 'white'
        context.fill()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Astroid {
    constructor ({position, velocity, radius}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        context.closePath()
        context.strokeStyle = 'white'
        context.stroke()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

window.setInterval(() => {
    const index = Math.floor(Math.random() * 4)
    let radius = MAX_SIZE * Math.random() + MIN_SIZE
    let x, y
    let vx, vy


    switch (index) { 
        case 0: //Left side of screen
            x = 0 - radius
            y = Math.random() * canvas.height
            vx = 1
            vy = 0
            break

        case 1: //Bottom side of screen
            x = Math.random() * canvas.width
            y = canvas.height + radius
            vx = 0
            vy = 1
            break

        case 2: //Right side of screen
            x = canvas.width + radius
            y = Math.random() * canvas.height
            vx = -1
            vy = 0
            break

        case 3: //Top side of screen
            x = Math.random() * canvas.width
            y = 0 - radius
            vx = 0
            vy = 1
            break
    }

    astroids.push(
        new Astroid ({
            position: {
                x: x,
                y: y,
            },

            velocity: {
                x: vx,
                y: vy,
            },

            radius
        }))
}, SPAWN_TIME)

function animate() {
    window.requestAnimationFrame(animate)

    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height)

    player.update()

    //Projectile Management
    for (let i = projectiles.length - 1; i >= 0; i --) {
        const projectile = projectiles[i]
        projectile.update()

        if (projectile.position.x + projectile.radius < 0 || 
            projectile.position.x - projectile.radius > canvas.width ||
            projectile.position.y - projectile. radius > canvas.height ||
            projectile.position.y + projectile.radius < 0
        ) {
            projectiles.splice(i, 1)
        }
    }

    //Astroid Management
    for (let i = astroids.length - 1; i >= 0; i --) {
        const astroid = astroids[i]
        astroid.update()


        if (astroid.position.x + astroid.radius < 0 || 
            astroid.position.x - astroid.radius > canvas.width ||
            astroid.position.y - astroid. radius > canvas.height ||
            astroid.position.y + astroid.radius < 0
        ) {
            projectiles.splice(i, 1)
        }
    }
    
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
        case 'Space':
            projectiles.push(
                new Projectile ({
                    position: {
                        x: player.position.x + Math.cos(player.rotation) * 30,
                        y: player.position.y + Math.sin(player.rotation) * 30,
                    },

                    velocity: {
                        x: Math.cos(player.rotation) * PROJECTILE_SPEED,
                        y: Math.sin(player.rotation) * PROJECTILE_SPEED,
                    },
                })
            )
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