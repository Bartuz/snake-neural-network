const GAME_OVER = 'GAME_OVER'
const IDLE = 'IDLE'
const RUNNING ='RUNNING'
const PAUSED = 'PAUSED'

class Game {
  constructor ({size, unit, frameRate, maxTurns, lowestScoreAllowed, score, onGameOver, snakeStartingLength, foodsCount}) {
    this.size = size
    this.unit = unit
    this.unitsPerRow = this.size / this.unit
    this.frameRate = frameRate
    this.maxTurns = maxTurns
    this.lowestScoreAllowed = lowestScoreAllowed
    this.onGameOver = onGameOver
    this.status = IDLE
    this.grid = []
    this.snake = new Snake(snakeStartingLength, score)
    this.turns = 0
    this.rendering = true

    for (let x = 0; x < this.unitsPerRow; x++) {
      for (let y = 0; y < this.unitsPerRow; y++) {
        this.grid.push([x + 1, y + 1])
      }
    }
    
    const game = this

    new p5(p => {
      p.setup = () => {
        p.frameRate(game.frameRate)
        p.createCanvas(game.size, game.size)
      }

      p.drawFood = () => {
        p.fill('red')
        p.rect(
          // x
          game.food.position[0] * game.unit - game.unit,
          // y
          game.food.position[1] * game.unit - game.unit,
          game.unit,
          game.unit
        )
      }

      p.drawSnake = () => {
        p.fill('black')
        game.snake.segments.forEach(snakePart => {
          p.rect(
            snakePart[0] * game.unit - game.unit,
            snakePart[1] * game.unit - game.unit,
            game.unit,
            game.unit
          )
        })
      }


      p.draw = () => {
        if (game.isPaused()) {
          return
        }

        if (!game.isPlaying()) {
          p.background('#EEE')
          p.fill(0)
          p.textSize(15)
          p.text(game.snake.brain.score.toString(), 5, 20)
          return
        }

        p.background(255)

        game.snake.move(game)

        if (game.snake.isEating) {
          game.food = new Food(game)
        }

        game.updateGameStatus()

        if (game.status === GAME_OVER) {
          return game.onGameOver()
        }

        if (game.rendering) {
          p.drawSnake()
          p.drawFood()
        }

        game.turns++
      }
    }, 'wrapper')
  }

  isPlaying() {
    return this.status === RUNNING
  }

  isPaused() {
    return this.status === PAUSED
  }

  updateGameStatus () {
    const snakeHitWall = this.snake.isOutOfTheGrid(this.unitsPerRow)
    const snakeHitTail = this.snake.isHitItself()
    const noMoreRoomLeft = this.getAvailablePositions().length === 1
    const gameLastedLongEnough = this.turns > this.maxTurns
    const scoreTooLow = this.snake.brain.score <= this.lowestScoreAllowed

    if (snakeHitWall || snakeHitTail || noMoreRoomLeft || gameLastedLongEnough || scoreTooLow) {
      this.status = GAME_OVER
    }
  }

  getAvailablePositions () {
    // grid without snake segments
    return this.grid.filter(position => {
      return !this.snake.segments.some(segment => {
        return position[0] === segment[0] && position[1] === segment[1]
      })
    })
  }

  start () {
    this.turns = 0
    this.snake.reset()
    this.food = new Food(this)
    this.status = RUNNING
  }

  pause () {
    this.status = this.status === RUNNING ? PAUSED : this.status
  }

  unpause () {
    this.status = this.status === PAUSED ? RUNNING : this.status
  }

  toggleRender () {
    this.rendering = !this.rendering
  }

}
