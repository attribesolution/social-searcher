var bodyParser=require('body-parser');
const EventEmitter=require('events');
const emitter=new EventEmitter();
var fs = require('fs')
var twit = require('twitter'),

  twitter = new twit({
    consumer_key: '2i19yfXklq9XKcbbLThNvL58t',
    consumer_secret: 'Ye5ij2FnZ0BZYGH0vU9RMpwYiWhm78AX1mcV6mCDmpWaPlUwva',
    access_token_key: '1009470072056840192-9ioxr7RrTq8fnSWdmGp2H1kCGsspgh',
    access_token_secret: 'GyzAig7UL0jPxTQTOBXy6Z3mxFvybXnvfNYEEZp7wMpZC'
  });

  var fs = require('fs');
  var readline = require('readline');
  var {google} = require('googleapis');
  var OAuth2 = google.auth.OAuth2;

  // If modifying these scopes, delete your previously saved credentials
  // at ~/.credentials/youtube-nodejs-quickstart.json
  var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
  var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
      process.env.USERPROFILE) + '/.credentials/';
  var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';


//
// var searchStr ={
//   str: {
//     type: String
//   }
// };








/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
  var service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'GoogleDevelopers'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);
    }
  });
}

// function getSearch(auth) {
//   var service = google.youtube('v3');
//   service.search.list({
//     auth: auth,
//     part: 'id,snippet',
//     // forUsername: 'GoogleDevelopers'
//     q: 'Fahad Aziz Niaz'
//   }, function(err, response) {
//     if (err) {
//       console.log('*The API returned an error: ' + err);
//       return;
//     }
//     channels = response.data;
//     // youtubeInfo.push(channels.items[0].id);
//     // console.log(channels);
//     // console.log(channels.items[0].id);
//     for(var i=0; i<channels.items.length; i++) {
//       var you = {};
//       you.id = channels.items[i].id;
//       you.kind = channels.items[i].kind;
//       you.etag = channels.items[i].etag;
//       you.snippet = channels.items[i].snippet;
//       youtubeInfo.push(you);
//     }
//
//
//
//     if (channels.length == 0) {
//       console.log('No channel found.');
//     } else {
//       // console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
//       //             'it has %s views.',
//       //             channels[0].id,
//       //             channels[0].snippet.title,
//       //             channels[0].statistics.viewCount);
//     }
//   });
// }








var tweetInfo = [];
var youtubeInfo = [];
var channels;
//
// var tweetData = {
//     profile_image_url: '/assets/user.png',
//     name: 'John Den',
//     screenN_name: 'ImranKhanPTI',
//     text: 'Harvard University',
//     retweet_count: '5',
//     favorite_count: '6',
//     created_at: '30 July 2018'
// };

var urlencodedParser=bodyParser.urlencoded({extended:false});
let notUrlEncodedParser = bodyParser.urlencoded({extended: true});

module.exports=function(app){
    app.get('/socialsearch',function(req,res){
      res.render('index',{abc:tweetInfo})

  });

  app.get('/facebook',function(req,res){
    res.render('fb',{abc:tweetInfo})

});

app.post('/checkChannel',urlencodedParser,function(req,res){

  if(null !== req.body.socialmedia && req.body.socialmedia=='Twitter')
  {
      tweetInfo.length = 0;
      var searchStr = req.body.search;
      var searchCount = 0;
      var tw = twitter.get('search/tweets', {q: searchStr,  result_type: 'popular',tweet_mode: 'extended'}, tweetedFunc);
      function tweetedFunc(err, data, response) {
        if(err){
          console.log('Something went wrong');
        } else{
          searchCount = data.statuses.length;
          for(var i=0; i<searchCount; i++) {
            var tweet = {};
            tweet.created_at = data.statuses[i].created_at;
            tweet.profile_image_url = data.statuses[i].user.profile_image_url;
            tweet.name = data.statuses[i].user.name;
            tweet.screen_name = data.statuses[i].user.screen_name;
            tweet.text = data.statuses[i].full_text;
            tweet.retweet_count = data.statuses[i].retweet_count;
            tweet.favorite_count = data.statuses[i].favorite_count;
            tweetInfo.push(tweet);
          }
          res.render('index',{abc:tweetInfo});

        }
      }

  }


  if(null !== req.body.socialmedia && req.body.socialmedia=='Youtube')
  {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
      }
      // Authorize a client with the loaded credentials, then call the YouTube API.
      else{
        authorize(JSON.parse(content), (auth)=>{

          emitter.removeAllListeners();
            emitter.on(req.body.search,function(){


                res.render('youtube',{abc:channels});

            });

            var service = google.youtube('v3');
            service.search.list({
              auth: auth,
              part: 'id,snippet',
              // forUsername: 'GoogleDevelopers'
              //q: 'Fahad Aziz Niaz'
              q:req.body.search
            }, function(err, response) {
              if (err) {
                console.log('*The API returned an error: ' + err);
                return;
              }


              channels = response.data;
              
            
              // youtubeInfo.push(channels.items[0].id);
              // console.log(channels);
              // // console.log(channels.items[0].id);
              // for(var i=0; i<channels.items.length; i++) {
              //   var you = {};
              //   you.id = channels.items[i].id.videoId;
              //   you.kind = channels.items[i].kind;
              //   you.etag = channels.items[i].etag;
              //   you.snippet = channels.items[i].snippet.description;
              //   youtubeInfo.push(you);
              // }



              if (channels.length == 0) {
                console.log('No channel found.');
              } else {
                // console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                //             'it has %s views.',
                //             channels[0].id,
                //             channels[0].snippet.title,
                //             channels[0].statistics.viewCount);
                
                emitter.emit(req.body.search);
              }
            });


        });
      }

      // res.render('youtube',{abc:channels});
      //res.send(youtubeInfo);
      // console.log(youtubeInfo);
    });


   }
  // console.log('chala575');
  //
  // res.render('index',{abc:tweetInfo});

});



// app.post('/socialsearch',urlencodedParser,function(req,res){
//     tweetInfo.length = 0;
//     var searchStr = req.body.search;
//     var searchCount = 0;
//     var tw = twitter.get('search/tweets', {q: searchStr,  result_type: 'popular',tweet_mode: 'extended'}, tweetedFunc);
//     function tweetedFunc(err, data, response) {
//       if(err){
//         console.log('Something went wrong');
//       } else {
//         searchCount = data.statuses.length;
//         for(var i=0; i<searchCount; i++) {
//           var tweet = {};
//           tweet.created_at = data.statuses[i].created_at;
//           tweet.profile_image_url = data.statuses[i].user.profile_image_url;
//           tweet.name = data.statuses[i].user.name;
//           tweet.screen_name = data.statuses[i].user.screen_name;
//           tweet.text = data.statuses[i].full_text;
//           tweet.retweet_count = data.statuses[i].retweet_count;
//           tweet.favorite_count = data.statuses[i].favorite_count;
//           tweetInfo.push(tweet);
//         }
//         res.render('index',{abc:tweetInfo});
//       }
//     }
//
// });

};
