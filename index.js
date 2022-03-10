const Discord = require('discord.js')
const ethers = require('ethers')
const config = require('./config.json')
const ZKSTAKE = require('./zkStake.json')
const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'DIRECT_MESSAGES'],
})

const prefix = '!'

const provider = ethers.getDefaultProvider('kovan')
const stakecontract = new ethers.Contract(
  config.Contract_Address,
  ZKSTAKE.abi,
  provider,
)
const checkWhitelist = async (message) => {
  console.log(message)
  const decoded = new Buffer.from(message, 'hex').toString()
  const params = JSON.parse(decoded.toString())
  const r = await stakecontract.verifyIdentityChallenge(
    params.challenge,
    params.nullifierHash,
    params.entityId,
    params.proof,
  )
  return r
}

client.on('messageCreate', async function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  // client.channels.cache.get('934173497624768512').send('Hello here!')

  let guild = client.guilds.cache.get('612779960335073332'); // server id

  //console.log(client.users)
  //console.log(client.channels)

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')

  const command = args.shift().toLowerCase()
  console.log(args)

  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`)

    let role = message.guild.roles.cache.find(r => r.name === "Verified User");
    console.log(`Role: ${role}`);
    let member = message.member;
    console.log(`member: ${member}`);

    member.roles.add(role).catch(console.error);
    console.log(`added a role to ${member.user.username}`);

  } else if (command === 'sum') {
    const numArgs = args.map((x) => parseFloat(x))
    const sum = numArgs.reduce((counter, x) => (counter += x))
    message.reply(`The sum of all the arguments you provided is ${sum}!`)
  } else if (command === 'dm') {
    // let messageContent = message.content.replace("!dm", "")
    message.member.send('Hello! I am ZK-NFT-BOT 🤖 To verify yourself, run "!verify insert-your-long-string-of-numbers-here"')
  } else if (command === 'verify') {
    let valid = await checkWhitelist(args[0])
    console.log(valid)

    if (valid) {
      message.author.send('GM you are verified')

      const member = message.author.id;
      const isMember = guild.members.cache.get(member);

      if (isMember) {
        let role = guild.roles.cache.find(r => r.name === "Verified User");
        isMember.roles.add(role)
        message.reply(`Verified ${message.author.username}`)
      } else  {
        message.reply('You are not part of this guild')
      }
      
    }
  }
})

client.login(config.BOT_TOKEN)
