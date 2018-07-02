var bodyParser=require('body-parser');
var fs = require('fs')
var twit = require('twitter'),
  twitter = new twit({
    consumer_key: '2i19yfXklq9XKcbbLThNvL58t',
    consumer_secret: 'Ye5ij2FnZ0BZYGH0vU9RMpwYiWhm78AX1mcV6mCDmpWaPlUwva',
    access_token_key: '1009470072056840192-9ioxr7RrTq8fnSWdmGp2H1kCGsspgh',
    access_token_secret: 'GyzAig7UL0jPxTQTOBXy6Z3mxFvybXnvfNYEEZp7wMpZC'
  });

var searchStr ={
  str: {
    type: String
  }
};

var tweetInfo = [];

var tweetData = {
    profile_image_url: '/assets/user.png',
    name: 'John Den',
    screenN_name: 'ImranKhanPTI',
    text: 'Harvard University',
    retweet_count: '5',
    favorite_count: '6',
    created_at: '30 July 2018'
};

var urlencodedParser=bodyParser.urlencoded({extended:false});
let notUrlEncodedParser = bodyParser.urlencoded({extended: true});

module.exports=function(app){
    app.get('/socialsearch',function(req,res){
      res.render('index',{abc:tweetInfo})

  });

app.post('/socialsearch',urlencodedParser,function(req,res){
    tweetInfo.length = 0;
    var searchStr = req.body.str;
    var searchCount = 0;
    var tw = twitter.get('search/tweets', {q: searchStr,  result_type: 'popular',tweet_mode: 'extended'}, tweetedFunc);
    function tweetedFunc(err, data, response) {
      if(err){
        console.log('Something went wrong');
      } else {
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
        res.json(tweetInfo);
      }
    }

});

};
