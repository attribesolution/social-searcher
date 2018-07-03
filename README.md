# SOCIAL SEARCHER - TWEETS

## app.js

This program will search popular tweets based on provided keyword on seach bar and display them in a web page. Twitter limits the amount of tweeets that can be downloaded (i.e 100+ tweets per query but as I filter those tweets and extract only the most popular ones' so the API provides the max-limit of 15 tweets per query).

### Dependencies
To access the Tweeter API I used Twitter REST API 3.0. I also imported the libraries of body-parser and ejs.

### Running the app
1. Download/clone the repository to your local machine.
2. Open the terminal line to the file location and enter the following commands one by one to download all the dependencies:
```
npm install express
```
```
npm install body-parser
```
```
npm install ejs
```
3. Enter the final command on terminal of same file location to run the app
```
node app
```
Note: On a successful run a message **listening to port 3000** will be printed on command prompt.

4. Now open your browser and go to <http://localhost:3000/socialsearch>

5. Search for tweets based on your interest in a search bar and it will print the most popular ones on web page

---

### License and copyright
**© Owais Ibrahim**

