/**
 *
 *
 * @export
 * @class SMPfactory
 * @description class to generate objects of different APIs
 */

// ----------------- Import all the wrappers here as well --------------

import {Youtube} from "./youtubeController";
import {Twitter} from "./twitterController";
import {GooglePlus} from "./googleplusController";
import {Flickr} from "./flickrController";
import {Tumblr} from "./tumblrController";
import {VimeoModule} from "./vimeoController";
import {DailyMotion} from "./dailymotionController";

class SMPfactory {
  constructor() {
    //none
  }

  generate(name: string) {
    // Rough implemenatation to give idea
    switch (name) {
      case "youtube": {
        return new Youtube();
      }
      case "twitter": {
        return new Twitter();
      }
      case "googleplus": {
        return new GooglePlus();
      }
      case "flickr": {
        return new Flickr();
      }
      case "tumblr": {
        return new Tumblr();
      }
      case "vimeo": {
        return new VimeoModule();
      }
      case "dailymotion": {
        return new DailyMotion();
      }
      default:
        return null;
    }
  }
}

export default SMPfactory;
