const Discord = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const bot = new Discord.Client();
const token = 'X72Exz5GaHttPZXD5V';
const token2 = 'Nq620-Nf0vq571';
const url = 'https://kitsu.io/api/edge/anime';

bot.on("ready", function() {
  console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
  presence();
});

bot.on("message", message => {
  if (message.content.indexOf(".aimg") === 0) {
    const name = message.content;
    const animeName = name.split('');
    removeItemFromArr(animeName);
    console.log("Searching anime: " + animeName.join(''));
    let completeName = createRoute(animeName.join(''));
    //enviar imagenes, urls o mensajes y peticion http
    /*search(url + completeName)
    .then(response => sendMessage(response.data[0].attributes.posterImage.medium, message));
    console.log("Execution complete for: " + message.author.username);*/
    //enviar embed
    search(url + completeName)
      .then(response =>
        sendMessage(createEmbed(response, animeName, message), message));
    console.log("Execution complete for embed file: " + message.author.username);
  }

});
//Example embed
function createEmbed(response = '', name = '', message) {
  let data = response.data;
  const embedDefault = new Discord.MessageEmbed()
    .setTitle("500")
    .setColor('RANDOM')
    .setDescription("ANIME DOES NOT EXISTS!")
    .setThumbnail('https://cdn.dribbble.com/users/63485/screenshots/4331748/002_maze_beautiful_errors_final.gif')
    .setImage('https://ginbits.com/wp-content/uploads/2021/08/How-to-Fix-500-Internal-Server-Error.png');
    console.log(response.data)
  if (data.length > 0) {
    let name2 = response.data[0].attributes.synopsis;
    let status = response.data[0].attributes.status;
    let date = moment(response.data[0].attributes.nextRelease).utc().format('YYYY-MM-DD');
    let abbreviatedTitles = response.data[0].attributes.abbreviatedTitles;
    const embed = new Discord.MessageEmbed()
      .setTitle(response.data[0].attributes.titles.en)
      .setColor('RANDOM')
      .setDescription(descriptionCreater(name2))
      .addField('Extra names', abbreviatedTitles.length > 0 ? abbreviatedTitles : "Does not exists" )
      .addField('Next episode', status != "current" ? "Finished" : date == "Invalid date" ? "No date" : date, true)
      .setAuthor(bot.user.username, bot.user.avatarURL())
      .setImage(response.data[0].attributes.posterImage.medium)
      .setURL(createRouteFlv(name.join('')))
      .setFooter('Requested by: ' + message.member.displayName, message.author.avatarURL());
    return embed;
  }
  return embedDefault;
}

function sendMessage(message1, message) {
  message.channel.send(message1);
}

function descriptionCreater(cadena = '') {
  let name2 = '';
  let rotation = 0;
  let cut = cadena.split('');
  for (let i = 0; i < 1000; i++) {
    name2 = name2 + cut[i];
    if (cut[i] == ".") {
      rotation = i + 1;
    }
  }
  let extraida = name2.substring(0, rotation);
  return extraida;
}

const search = async (url) => {
  try {
    const res = await fetch(url);
    if (res.status = 200) {
      const response = await res.json();
      console.log(res);
      return response;
    } else {
      console.log(res);
      throw new Error("Bad response from server");
    }
  } catch (err) {
    console.error(err);
  }
}

function presence() {
  bot.user.setPresence({
    status: 'online',
    activity: {
      name: "Pongan Wano",
      type: "PLAYING"
    }
  })
}

function removeItemFromArr(arr) {
  for (let i = 0; i < 6; i++) {
    arr.shift();
  }
}

function createRoute(animeName) {
  let name = "?filter%5Btext%5D=";
  const work = animeName.split(' ');
  for (let i = 0; i < work.length; i++) {
    if (i > 0) {
      name = name + "%20";
    }
    name = name + work[i];
  }
  return name;
}

function createRouteFlv(animeName) {
  let name = "https://www3.animeflv.net/browse?q=";
  const work = animeName.split(' ');
  for (let i = 0; i < work.length; i++) {
    if (i > 0) {
      name = name + "+";
    }
    name = name + work[i];
  }
  return name;
}


bot.login(token + token2);