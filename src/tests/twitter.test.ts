import {Twitter} from "../controllers/twitterController";

describe("TESTING TWITTER API", () => {
  it("should pass the test if q is provided", async () => {
    let twitter = new Twitter();
    let promise = await new Promise((resolve, reject) => {
      twitter.searchByKeyword(JSON.parse( '{"q": "Imran Khan"}'), resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
