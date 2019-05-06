const readline = require('readline')
const fs = require('fs')
const util = require('util')

// check if passed file acutally exists
const file = fs.existsSync(process.argv[2])
if (!file) {
  console.log('Error: No listing file passed.')
  process.exit(1)
}
const writeFile = util.promisify(fs.writeFile)

const rl = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
  crlfDelay: Infinity
})

let lo = false
let l = false
let up = false
let m = false

// process arguments that were passed
if (process.argv[3]) {
  for (var i = 3; i < process.argv.length; i++) {
    switch (process.argv[i]) {
      case "lo=true":
        lo = true
        break;
      case "l=true":
        l = true
        break;
      case "up=true":
        up = true
        break;
      case "m=true":
        m = true
        break;
      default:
        console.log(`Error: Unknow option ${process.argv[i]}`)
        process.exit(1)
    }
  }
} else {
  // by default, only check if level or marginal exists
  l = true
  m = true
}

let data = ''
let flag = false

rl.on('line', (line) => {
  if (line.includes('---- EQU') || line.includes('---- VAR')) {
    flag = true
  } else if (line.includes('----')) {
    flag = false
  } else if (flag) {
    const entries = line.match(/(!\d\.|\.\d|\S)+/g)

    if (entries && entries.length >= 4) {
      const lower = entries[entries.length - 4]
      const level = entries[entries.length - 3]
      const upper = entries[entries.length - 2]
      const marginal = entries[entries.length - 1]

      const flagLo = lower === '.' || lower === '-INF' ? false : true
      const flagL = level === '.' ? false : true
      const flagUp = upper === '.' || upper === '+INF' ? false : true
      const flagM = marginal === '.' || marginal === 'EPS' ? false : true

      let keepLine = false
      if (flagLo && lo) keepLine = true
      if (flagL && l) keepLine = true
      if (flagUp && up) keepLine = true
      if (flagM && m) keepLine = true
      if (!keepLine) return
    }
  }
  data += line +'\n'
})

rl.on('close', async () => {
  try {
    await writeFile(process.argv[2], data, 'utf8')
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})
