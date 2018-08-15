import {Router, Request, Response, NextFunction} from "express";
import SMP from "../controllers/SMP";
import SMPfactory from "../controllers/SMPFactory";
import {Promise} from "es6-promise";

import * as uni from "array-unique";
import { log } from "util";

const unique = uni.immutable;

enum query {
  flickr = "text",
  twitter = "q",
  youtube = "q",
  dailymotion = "query",
  vimeo = "query",
  tumblr = "query",
  googleplus = "query"
}
enum maxResults {
  youtube = "maxResults",
  twitter = "count",
  flickr = "per_page",
  dailymotion = "limit",
  vimeo = "per_page",
  tumblr = "limit",
  googleplus = "maxResults"
}

enum smp_title{
  youtube = "snippet.title",
  twitter = "user.name",
  flickr = "title",
  dailymotion = "title",
  vimeo = "name",
  tumblr = "blog_name",
  googleplus = "title"
}

enum smp_user{
  youtube = "snippet.channelTitle",
  twitter = "user.name",
  flickr = "title",
  dailymotion = "title",
  vimeo = "user.name",
  tumblr = "blog_name",
  googleplus = "actor.displayName"
}

enum smp_url{
  youtube = "snippet.thumbnails.default.url",
  twitter = "source",
  flickr =  "id",
  dailymotion = "url",
  vimeo = "link",
  tumblr = "post_url",
  googleplus = "url"
}

enum smp_desc{
  youtube = "snippet.description",
  twitter = "text",
  flickr =  "id",
  dailymotion = "description",
  vimeo = "description",
  tumblr = "summary",
  googleplus = "object.attachments"
}

enum smp_views{
  youtube = "kind",
  twitter = "retweet_count",
  flickr =  "id",
  dailymotion = "views_total",
  vimeo = "metadata.connections.likes.total",
  tumblr = "note_count",
  googleplus = "object.replies.totalItems"
}

enum smp_embed{
  youtube = "id.videoId",
  twitter = "source",
  flickr =  "owner",
  dailymotion = "embed_html",
  vimeo = "embed.html",
  tumblr = "short_url",
  googleplus = "none"
}

enum smp_time{
  youtube = "snippet.publishedAt",
  twitter = "created_at",
  flickr =  "id",
  dailymotion = "created_time",
  vimeo = "created_time",
  tumblr = "date",
  googleplus = "published"
}

enum smp_resultname{
  youtube = "",
  twitter = "statuses",
  flickr =  "",
  dailymotion = "list",
  vimeo = "",
  tumblr = "",
  googleplus = ""  //blanks mean api dosent have a specific result name
}

export class RequestHandler {
  private smp: SMP;
  constructor() {}

  // the /seearch will redirect to this page and only this method will handle the request
  public handleAllRequest = (req: Request, res: Response) => {
    // Array of results
    // let result: JSON[] = new Array();
    let smpCreator = new SMPfactory();
    let numSocialMediaAccounts: number = 9;
    let myPromises = new Array(numSocialMediaAccounts);
    let myeditList = [];
    // Cycle through all the user requested smps
    for (var _i = 0; _i < req.body.smpList.length; _i++) {
      // Generate smp
      this.smp = smpCreator.generate(req.body.smpList[_i].name);
      if (this.smp) {
        // Call that smps search and initialize the result var with its result
        //    result.push(null);  // Increase length of result array

        myPromises[_i] = new Promise((resolve, reject) => {
          this.smp.searchByKeyword(
            req.body.smpList[_i].params,
            resolve,
            reject,
          );
        });
        myeditList.push(myPromises[_i]);
      }
    }

    Promise.all(myeditList)
      .then(values => {
        res.send(values);
      })
      .catch(err => {
        console.log("Reject_Error: " + err);
        res.send(err);
      });
  };

  public handleSocialSearchRequest = (req: Request, res: Response) => {
    // Array of results
    // let result: JSON[] = new Array();

    let smpCreator = new SMPfactory();
    let numSocialMediaAccounts: number = 9;
    let myPromises = new Array(numSocialMediaAccounts);
    let myeditList = [];
    // Cycle through all the user requested smps
    for (var _i = 0; _i < req.body.smpList.length; _i++) {
      // Generate smp
      this.smp = smpCreator.generate(req.body.smpList[_i]);
      if (this.smp) {
        // Call that smps search and initialize the result var with its result
        //    result.push(null);  // Increase length of result array
        let myParams = {};
        myPromises[_i] = new Promise((resolve, reject) => {
          myParams = this.resolveEnum(
            req.body.smpList[_i],
            req.body.params,
            res,
          );
          this.smp.searchByKeyword(myParams, resolve, reject);
        });
        myeditList.push(myPromises[_i]);
      }
    }

    Promise.all(myeditList)
      .then(values => {
        console.log(this.mapResult( req.body.smpList, values, req.body.params.query, req.body.params.maxResults));
        
        res.send( values);
      })
      .catch(err => {
        console.log("Reject_Error: " + err);
        res.send(err);
      });
  };

  public resolveEnum(str: string, myParams, res): {} {
    let params = {};
    console.log(str);
    console.log(myParams);
    if (
      myParams.query !== "undefined" ||
      myParams.query != null ||
      myParams.query !== ""
    ) {
      params[query[str]] = myParams.query;
    } else {
      res.status(403).send("Invalid parameters");
      res.end();
    }

    if (
      myParams.maxResults === "undefined" ||
      myParams.maxResults == null ||
      myParams.maxResults === 0
    ) {
      myParams.maxResults = 5;
    }
    params[maxResults[str]] = myParams.maxResults;

    return params;
  }

  public mapResult(smpList:string[], data:JSON, q:string, resultCount:number):JSON
  {
    console.log('smpList = '+smpList);
    console.log('resul count = '+resultCount);
    
    let result:JSON = {};
    //{ [string:string]:any, [string:JSON]:any, [string:number]:any }
    // {[key: string]: any}
    result.query = q;

    let i=0; // to traverse each smp
    for(let smp in smpList)
    {
      // Create results array
      result.resultList.smp = smp;
      result.resultList.smp.results = new Array(resultCount);

      // To traverse the result array of each smp
      for(let j=0; j < resultCount ; j++){

        result.resultList.smp.results[j].title = data[i].smp_resultname[j].smp_title[smp];
        result.resultList.smp.results[j].url   = data[i].smp_resultname[j].smp_url[smp];
        result.resultList.smp.results[j].desc  = data[i].smp_resultname[j].smp_desc[smp];
        // result.resultList..results[j]smp.likes = data[i].smp_resultname[j].smp_likes[smp];
        result.resultList.smp.results[j].views = data[i].smp_resultname[j].smp_views[smp];
        result.resultList.smp.results[j].embed = data[i].smp_resultname[j].smp_embed[smp];
        
      }

      i++;
    }

    return result;
  }

}
