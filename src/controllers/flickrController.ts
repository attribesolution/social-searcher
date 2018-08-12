import * as flickrapi from "flickrapi";
import * as dotenv from "dotenv";
dotenv.config();
import SMP from "./SMP";

const flickrOptions = {
  api_key: process.env.FK_API_KEY,
  secret: process.env.FK_SECRET,
};

export class Flickr implements SMP {
  private flickrData: any;

  constructor() {
    this.flickrData = "nothing";
  }

  public searchByKeyword(reqData, resolve, reject) {
    // let myParams = this.checkParameters(reqData);
    flickrapi.tokenOnly(flickrOptions, (error, flickr) => {
      // we can now use "flickr" as our API object
      flickr.photos.search(reqData, (err, result) => {
        if (err) {
          console.log("API returned error: " + JSON.stringify(err));

          reject(err);
        } else {
          this.flickrData = result.photos.photo;
          resolve(result.photos.photo);
        }
      });
    });
  }

  public normalizeResult(data: JSON) {
    throw new Error("Method not implemented.");
  }

  // public checkParameters(reqData) {
  //   let params = {};

  //   if (reqData.query) {
  //     params.text = reqData.query;
  //   }
  //   if (reqData.flickr_per_page) {
  //     params.per_page = reqData.flickr_per_page;
  //   }
  //   if (reqData.flickr_tags) {
  //     params.tags = reqData.flickr_tags;
  //   } else {
  //     params.tags = '';
  //   }
  //   if (reqData.flickr_license) {
  //     params.license = reqData.flickr_license;
  //   } else {
  //     params.license = '';
  //   }
  //   if (reqData.accuracy) {
  //     params.accuracy = reqData.flickr_accuracy;
  //   } else {
  //     params.accuracy = 16;
  //   }
  //   if (reqData.min_up) {
  //     params.min_up = reqData.flickr_min_up;
  //   } else {
  //     params.min_up = '';
  //   }

  //   return params;
  // }
}
