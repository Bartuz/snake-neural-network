// game settings

const GAMES = 50
const GAME_SIZE = 150
const GAME_UNIT = 5
const FRAME_RATE = 200

// game bottlenecks

const MAX_TURNS = 2000
const LOWEST_SCORE_ALLOWED = -20

// game variations

const SNAKE_STARTING_LENGTH = 5

// neural network settings

const INPUT_SIZE = 6
const OUTPUT_SIZE = 2
const PROVENANCE = Math.round(0.1 * GAMES) // empty genom in new gen.
const MUTATION_RATE = 0.5
const MUTATION_AMOUNT = 2
const ELITISM = Math.round(0.1 * GAMES)

// score settings

const POINTS_MOVED_TOWARDS_FOOD = 1
const POINTS_MOVED_AGAINST_FOOD = -3
const POINTS_ATE_FOOD = 4
