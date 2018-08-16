import SMP from "./SMP";
import * as fs from "fs";
import * as readline from "readline";
import * as dotenv from "dotenv";
dotenv.config();
import {google} from "googleapis";
import {OAuth2Client} from "../../node_modules/google-auth-library";
import {Credentials} from "../../node_modules/google-auth-library/build/src/auth/credentials";
let OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
var TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

export class Youtube implements SMP {
  private authentication: OAuth2Client;
  public youtubeData: Object;

  constructor() {
    // Authorize a client with the loaded credentials, then call the YouTube API.
    this.authorize();
  }

  authorize() {
    var clientSecret = process.env.YT_CLIENT_SECRET;
    var clientId = process.env.YT_CLIENT_ID;
    var redirectUrl = process.env.YT_REDIRECT_URIS;
    let oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    let token: Buffer;
    try {
      token = fs.readFileSync(TOKEN_PATH);
      // console.log('token = '+ token);
    } catch (err) {
      this.getNewToken(oauth2Client);
      return;
    }
    oauth2Client.credentials = JSON.parse(token.toString("utf-8"));

    // Store the token for later use
    this._authentication = oauth2Client;
    // console.log('in Authorize auth = '+JSON.stringify(this._authentication));
  }

  get _authentication() {
    return this.authentication;
  }

  set _authentication(val) {
    this.authentication = val;
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   */
  getNewToken(oauth2Client) {
    var authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url: ", authUrl);
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", function(code) {
      rl.close();
      oauth2Client.getToken(code, function(err, token) {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
          return;
        }
        oauth2Client.credentials = token;

        // ----- this.storeToken(token); ------
        try {
          fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
          if (err.code != "EEXIST") {
            throw err;
          }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) throw err;
          console.log("Token stored to " + TOKEN_PATH);
        });
        console.log("Token stored to " + TOKEN_PATH);

        this.authentication = oauth2Client;
      });
    });
  }

  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code != "EEXIST") {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) throw err;
      console.log("Token stored to " + TOKEN_PATH);
    });
    console.log("Token stored to " + TOKEN_PATH);
  }

  // Our Required Functions Starts here

  normalizeResult(data: JSON) {
    throw new Error("Method not implemented.");
  }

  channelsList(auth, requestData, res) {
    var service = google.youtube("v3");
    var parameters = requestData["params"];
    parameters["auth"] = auth;
    service.channels.list(parameters, function(err, response) {
      if (err) {
        console.log("The API returned an error: " + err);
        return;
      }
      // var str = JSON.stringify(response.data.items, 0, 2);
      res.render("code_mockup", {data: response.data.items});
    });
  }

  searchByUsername(channelName) {
    var service = google.youtube("v3");
    service.channels.list(
      {
        auth: this.authentication,
        part: "snippet,contentDetails,statistics",
        forUsername: channelName, //'GoogleDevelopers'
      },
      function(err, response) {
        if (err) {
          console.log("The API returned an error: " + err);
          return;
        }
        var channels = response.data.items;
        if (channels.length == 0) {
          console.log("No channel found.");
        } else {
          console.log(
            "This channel's ID is %s. Its title is '%s', and " +
              "it has %s views.",
            channels[0].id,
            channels[0].snippet.title,
            channels[0].statistics.viewCount,
          );
        }
      },
    );
  }

  get result() {
    return this.result;
  }
  set result(val) {
    this.result = val;
  }

  //
  // search(){
  //   var service = google.youtube('v3');
  //   return service.search.list;
  // }

  /**
   * @description Function search by keyword and on basis of various criterias provided via the JSON object.
   * @param {JSON} query a json object containing the search parameters and query
   * @returns {JSON} returns a JSON object containing search results. Extract the results using obj.data
   */

  searchByKeyword(reqData, resolve, reject) {
    var params = this.checkParameters(reqData);
    var service = google.youtube("v3");

    service.search
      .list(params)
      .then(response => {
        this.youtubeData = response.data.items;
        resolve(response.data.items);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  }

  checkParameters(reqData) {
    var params = {
      auth: this.authentication,
      part: "snippet",
      q: reqData.q,
      maxResults: 5,
      order: "relevance",
      relevanceLanguage: "",
      safeSearch: "none",
    };

    if (reqData.maxResults) {
      params.maxResults = reqData.maxResults;
    }

    if (reqData.sort) {
      console.log("yaha hai asb: " + reqData.sort);
      params.order = reqData.sort;
    }
    return params;
  }

  resultCatcher(err, data) {
    if (err) console.log(err);

    console.log("in result catcher");
    this.result = data;
    return data;
  }

  /**
   * Remove parameters that do not have values.
   *
   * @param {Object} params A list of key-value pairs representing request
   *                        parameters and their values.
   * @return {Object} The params object minus parameters with no values set.
   */
  removeEmptyParameters(params) {
    for (var p in params) {
      if (!params[p] || params[p] == "undefined") {
        delete params[p];
      }
    }
    return params;
  }

  //-------------------------------------//
} //End of Class
