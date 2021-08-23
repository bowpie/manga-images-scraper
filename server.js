const scraper = require("./scraper.js");
const express = require("express");
const cors = require("cors");

const app = express();
const api = express.Router();
const port = 6969;

api.use(cors());
api.use(express.json());

api.get("/", async (req, res) => {
  res.send("it works");
});

api.get("/search/:name/:page?", async (req, res, next) => {
  try {
    res.send(await scraper.searchManga(req.params.name, req.params.page || 1));
  } catch (error) {
    next(error);
  }
});

api.get("/images/:name/:chapter", async (req, res, next) => {
  try {
    res.send(
      await scraper.getChapterImages(req.params.name, req.params.chapter)
    );
  } catch (error) {
    next(error);
  }
});

api.use((error, req, res, next) => {
  console.error(error);
  if (error.type == "time-out") res.status(408).send(error);
  else res.status(500).send("Some internal error. Maybe wrong request.");
});

app.use("/manga", api);
app.get("*", function (req, res) {
  res.status(404).send("Page not found.");
});

app.listen(port, () => {
  console.log(`Manga scrape API listening on port ${port}`);
});
