

const fs = require('fs');
const youtubeModule = require('./youtube-wrapper');

var youtube = new youtubeModule();

youtube.searchByKeyword({
    auth: youtube.authentication,
    part: 'id,snippet',
    q: 'Mr. Bean funny',
    order:'rating'
    // Add more parameters or modify these for custom results
  });

// The result is saved in a file called youtubeResult.json by default
var data = fs.readFileSync('youtubeResult.json');

// So I read from that file and display the result here
console.log( data.toString());

console.log('Also Check the youtubeResult.json File!');
