const Discord = require('discord.js')
const config = require('./config.json')
const ethers = require('ethers')
const JSON = require('./zkStake.json')
const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES'],
})

const prefix = '!'
const address = ''
//const provider = ethers.providers.getNetwork('rinkeby')
//const stakecontract = new ethers.Contract(JSON.abi, config.Contract_Address,provider)
const checkWhitelist = async (message) => {
  const decoded = new Buffer(message, 'hex').toString()
  const params = JSON.parse(decoded)
  console.log(params)
  const r = await stakecontract.verifyIdentityChallenge(
    params.challenge,
    params.nullifierHash,
    params.entityId,
    params.proof,
  )
  return r
}
client.on('messageCreate', async function (message) {
  console.log(message)
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return
  //console.log(client.users)
  //console.log(client.channels)
  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')

  const command = args.shift().toLowerCase()
  console.log(args)
  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`)
  } else if (command === 'sum') {
    const numArgs = args.map((x) => parseFloat(x))
    const sum = numArgs.reduce((counter, x) => (counter += x))
    message.reply(`The sum of all the arguments you provided is ${sum}!`)
  } else if (command === 'verify') {
    console.log('DM!!!')
    let valid = await checkWhitelist(args[0])
    console.log(valid)
    if (valid) {
      message.author.send('GM you are being verified')
    }
  }
})

client.login(config.BOT_TOKEN)
