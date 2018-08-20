import {Youtube} from "../controllers/youtubeController";

describe("TESTING YOUTUBE API", () => {
  it("should pass the test if query is provided", async () => {
    let youtube = new Youtube();
    let promise = await new Promise((resolve, reject) => {
      youtube.searchByKeyword({query: "Imran Khan"}, resolve, reject);
    })
      .then(resolve => {
        expect(resolve).toBeDefined();
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
