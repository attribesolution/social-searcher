import {Tumblr} from "../controllers/tumblrController";

describe("TESTING YOUTUBE API", () => {
  it("should pass the test if query is provided", async () => {
    let tumblr = new Tumblr();
    let promise = await new Promise((resolve, reject) => {
      tumblr.searchByKeyword({query: "Imran Khan"}, resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
