import SMP from "./SMP";
import * as fs from "fs";
import * as readline from "readline";
import {google, appsactivity_v1, plus_v1} from "googleapis";
import { SchemaType } from "../../node_modules/googleapis/build/src/shared/src";
import { AxiosResponse } from "../../node_modules/axios";
let OAuth2 = google.auth.OAuth2;

const SCOPES = ["https://www.googleapis.com/auth/plus.me"];
const TOKEN_DIR =
  (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
  "/.credentials/";
const TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

// Don't remove this .. 
interface Param {
  query?: string;
  maxResults: string;
  language?: string;
  orderBy?: string;
  pageToken?: string;
}




export class GooglePlus implements SMP {
  private content: any;
  private authentication: any;
  private googlePlusData: plus_v1.Schema$ActivityFeed [];
  constructor() {
    this.authorize();
  }

  get contents() {
    return this.content;
  }
  set contents(val) {
    this.content = val;
  }

  public authorize() {
    var clientSecret = process.env.YT_CLIENT_SECRET;
    var clientId = process.env.YT_CLIENT_ID;
    var redirectUrl = process.env.YT_REDIRECT_URIS;
    const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    let token: any;
    try {
      token = fs.readFileSync(TOKEN_PATH);
      // console.log('token = '+ token);
    } catch (err) {
      this.getNewToken(oauth2Client);
      return;
    }
    oauth2Client.credentials = JSON.parse(token);

    // Store the token for later use
    this.authentication = oauth2Client;
    // console.log('in Authorize auth = '+JSON.stringify(this.authentication));
  }

  get _authentication() {
    return this.authentication;
  }

  set _authentication(val) {
    this.authentication = val;
  }

  /**
   * @description Function search by keyword and on basis of various criterias provided via the JSON object.
   * @param {JSON} query a json object containing the search parameters and query
   * @returns {JSON} returns a JSON object containing search results. Extract the results using obj.data
   */

  public searchByKeyword(reqData, resolve, reject) {
    const params = this.checkParameters(reqData) as any;

    const service = google.plus({
      auth: process.env.GP_AUTH, // specify your API key here
      version: "v1",
    });

    service.activities
      .search(params)
      .then(response => {
        // res.render('index', {youtube_data: response.data.items, data_type: 'youtube'});
        this.googlePlusData = response.data.items;
        resolve(response.data.items);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   */
  private getNewToken(oauth2Client) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });
    console.log("Authorize this app by visiting this url: ", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.log("Error while trying to retrieve access token", err);
          return;
        }
        oauth2Client.credentials = token;

        // ----- this.storeToken(token); ------
        try {
          fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
          if (err.code !== "EEXIST") {
            throw err;
          }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) {
            throw err;
          }
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
  private storeToken(token) {
    try {
      fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
      if (err.code !== "EEXIST") {
        throw err;
      }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
      if (err) {
        throw err;
      }
      console.log("Token stored to " + TOKEN_PATH);
    });
    console.log("Token stored to " + TOKEN_PATH);
  }

  // Our Required Functions Starts here

  normalizeResult(data: JSON) {
    throw new Error("Method not implemented.");
  }

  private checkParameters(reqData) {
    let params: Param = {
      maxResults: "10",
    };

    if (reqData.query) {
      params.query = reqData.query;
    }
    if (reqData.gp_lang) {
      params.language = reqData.gp_lang;
    }
    if (reqData.gp_maxResults) {
      params.maxResults = reqData.gp_maxResults;
    } else {
      params.maxResults = "10";
    }
    if (reqData.gp_orderBy) {
      params.orderBy = reqData.gp_orderBy;
    }
    if (reqData.gp_pageToken) {
      params.pageToken = reqData.gp_pageToken;
    }

    return params;
  }
} // End of Class
