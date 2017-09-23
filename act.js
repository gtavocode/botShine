const Discord = require('discord.js');
const shineBot = new Discord.Client();

const config = require("./config.json");
var ut = require("./miRandom.js");
const axios = require('axios');
const keys = require('./keys');

const Discordie = require('discordie');
const Events = Discordie.Events;
const client = new Discordie();

const discordToken = keys.discordToken;
const lastfmApiKey = keys.lastfmApiKey;
const apiUrl = 'http://ws.audioscrobbler.com/2.0/?method=';

// connect to Discrd
client.connect({ token: discordToken });

client.Dispatcher
  .on(Events.GATEWAY_READY, (e) => {
    console.log('Connectado como: ' +  client.User.username);
  })
  .on(Events.MESSAGE_CREATE, (e) => {
    let input = e.message.content.split(' ');

    if (input.length === 2) {
        if ( input[0] === ".np") {
            nowPlaying(input[1], e);
        } else if ( input[0] === ".topalbums") {
            topAlbums(input[1], e);
        }
    }
  });

  // commands
  function nowPlaying(user, e) {
      let method = 'user.getRecentTracks';
      let qs = '&user=${user}&api_key=${lastfmApiKey}&limit=2&format=json';

      let reqUrl = `${apiUrl}${method}${qs}`;

      axios.get(reqUrl)
        .then((res) => {
          let latestTrack = res.data.recenttracks.track[0];
          console.log(latestTrack);
          let latestTrackName = latestTrack.name;
          let latestTrackArtist = latestTrack.artist['#text'];
          e.message.channel.sendMessage(`currently listening to: ${latestTrackArtist} - ${latestTrackName}`);
        })
        .catch((err) => {
          console.log('un error ha ocurrido:', err);
        });
  }

  function topAlbums(user, e) {
      let method = 'user.getTopAlbums';
      let qs = '&user=${user}&api_key=${lastfmApiKey}&limit=3&format=json';

      let reqUrl = `${apiUrl}${method}${qs}`;

      axios.get(reqUrl)
        .then((res) => {
          console.log(res.data);
          let topAlbums = res.data.topalbums;

          if (topAlbums) {
            if (topAlbums.album[0]) {
              let response = '${user}\§s top albums:\n';
              for (let i = 0; i < 3; i++) {
                let albumArtist = topAlbums.album[i].artist.name;
                let AlbumTitle = topAlbums.album[i].name
                response += (i + 1) + ': ${albumArtist} - ${AlbumTitle}\n';
              }
              e.message.channel.sendMessage(response);
            } else {
              e.message.channel.sendMessage('user hasn\t listened to any music in this period');
            }
          } else {
            e.message.channel.sendMessage('usuario invalido');
          }
        })
        .catch((err) => {
          console.log('un error ha ocurrido:', err);
        });
  }


/*
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}*/

/*shineBot.on("guilMemberAdd", member => {
  let guild= member.guild;
  guild.defaultChannel.sendMessage(`Bienvenido al canal de SunshineFansub.`);
});*/

shineBot.on('ready', () => {
  console.log("Estoy listo!");
});

shineBot.on('message', message => {
  if(message.author.shineBot) return;
  if(!message.content.startsWith(config.prefijo)) return;
  let comando= message.content.split(" ")[0];
  let args = message.content.split(" ").slice(1);
  comando = comando.slice(config.prefijo.length);
  console.log(comando);
  if (comando === "latigo") {
    //message.reply('pong');
      if (args[0] == null) {
        message.reply(" hay que darles! ¿Se van a poner a currar o qué? ¡Métanle ganas! (ι´Д｀)ﾉ");
        message.channel.sendFile(config.whipsNone[ut.random(0,5)]);
      }
      else {
        message.channel.sendMessage("¡¡¡Ponte a currar, "  +  message.mentions.users.first() + ", vagazo!!! (ノಠ益ಠ)ノ彡┻━┻");
        message.channel.sendFile(config.whipsOne[ut.random(0,5)]);
      }
  }
  if(comando === "slap") {
    message.reply(" slaps " + message.mentions.users.first() + " around a bit with a large trout.");
    message.channel.sendFile(config.slaps[ut.random(0,6)]);
  }
});

shineBot.login(config.token);
