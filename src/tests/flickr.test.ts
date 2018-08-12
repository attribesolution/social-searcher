import {Flickr} from "../controllers/flickrController";

describe("TESTING YOUTUBE API", () => {
  it("should pass the test if query is provided", async () => {
    let flickr = new Flickr();
    let promise = await new Promise((resolve, reject) => {
      flickr.searchByKeyword({text: "Imran Khan"}, resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
