const Neat = neataptic.Neat
const Config = neataptic.Config
const Methods = neataptic.Methods;

Config.warnings = false
const fitnessFunction = null
const neat = new Neat(INPUT_SIZE, OUTPUT_SIZE, fitnessFunction, {
    popsize: GAMES,
    elitism: ELITISM,
    provenance: PROVENANCE,
    mutationRate: MUTATION_RATE,
    mutationAmount: MUTATION_AMOUNT,
    mutation: [
        Methods.Mutation.ADD_NODE,
        Methods.Mutation.SUB_NODE,
        Methods.Mutation.ADD_CONN,
        Methods.Mutation.SUB_CONN,
        Methods.Mutation.MOD_WEIGHT,
        Methods.Mutation.MOD_BIAS,
        Methods.Mutation.MOD_ACTIVATION,
        Methods.Mutation.ADD_GATE,
        Methods.Mutation.SUB_GATE,
        Methods.Mutation.ADD_SELF_CONN,
        Methods.Mutation.SUB_SELF_CONN,
        Methods.Mutation.ADD_BACK_CONN,
        Methods.Mutation.SUB_BACK_CONN
    ],
  }
)

const chartData = {
  labels: [],
  datasets: [
    {
      name: 'Max',
      values: []
    },
    {
      name: 'Average',
      values: []
    },
    {
      name: 'Min',
      values: []
    }
  ]
}

const friendlyNetGraph = (netGraph) => {
  return netGraph
}

const chart = new Chart('#chart', {
  title: 'generation score history',
  type: 'line',
  height: 200,
  data: chartData
})

let highestScore = 0

const runner = new Runner({
  neat,
  games: GAMES,
  gameSize: GAME_SIZE,
  gameUnit:  GAME_UNIT,
  frameRate: FRAME_RATE,
  maxTurns: MAX_TURNS,
  lowestScoreAllowed: LOWEST_SCORE_ALLOWED,
  snakeStartingLength: SNAKE_STARTING_LENGTH,
  score: {
    movedTowardsFood: POINTS_MOVED_TOWARDS_FOOD,
    movedAgainstFood: POINTS_MOVED_AGAINST_FOOD,
    ateFood: POINTS_ATE_FOOD
  },
  onEndGeneration: ({generation, max, avg, min, netGraph}) => {
    chartData.labels.push(generation.toString())
    chartData.datasets[0].values.push(max)
    chartData.datasets[1].values.push(avg)
    chartData.datasets[2].values.push(min)

    if (chartData.labels.length > 15) {
      chartData.labels.shift()
      chartData.datasets.forEach(d => d.values.shift())
    }

    chart.update(chartData)
    if (max > highestScore) {
      highestScore = max
    }

    drawGraph(friendlyNetGraph(netGraph), '.netgraph', false)
    document.getElementById('generation').innerHTML = generation
    document.getElementById('highest-score').innerHTML = highestScore
  }
})



runner.startGeneration()

$(document).ready(() => {
    $('#pause').on('click', (e) => {
      e.preventDefault()
        runner.pause()
    })
    $('#unpause').on('click', (e) => {
        e.preventDefault()
        runner.unpause()
    })
    $('#rendering').on('click', (e) => {
        e.preventDefault()
        runner.toggleRender()
    })
})