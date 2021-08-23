const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");
const packer = require("./packer.js");

// Helper function
const range = (start, end) => Array.from(Array(end + 1).keys()).slice(start);

const getChapterImages = async (mangaTitle, chapter) => {
  const getChapterInfo = async () => {
    //make sure the chapter id has 3 characters or more
    if (chapter.length < 3) {
      chapter = "0".repeat(3 - chapter.length) + chapter;
    }
    const browser = await puppeteer.launch({ headless: true });
    const url = `http://fanfox.net/manga/${mangaTitle}`;
    //chapterfun.ashx?cid=${chapterId}&page=${imagePage}
    const page = await browser.newPage();
    try {
      const req = await page.goto(url + `/c${chapter}`, {
        waitUntil: "domcontentloaded",
      });

      const [chapterId, imageCount] = await page.evaluate(() => [
        chapterid,
        imagecount,
      ]);

      await browser.close();

      return {
        title: mangaTitle,
        chapter: chapter,
        chapterId: chapterId,
        url: url,
        imageCount: imageCount,
      };
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const returns = await getChapterInfo();
  const { chapterId, url, imageCount } = returns;

  const pages = range(1, imageCount).filter((x, i) => x % 2 == 1); //minimize the requests because 1 request returns 2 images

  const imageUrl = `${url}/c${chapter}/chapterfun.ashx`;

  const responses = await axios.all(
    pages.map((imagePage) =>
      axios.get(imageUrl, {
        params: { cid: chapterId, page: imagePage },
        headers: {
          Referer: "http://fanfox.net/",
        },
      })
    )
  );
  const images = responses
    .filter((response) => response.status == 200 && response.data.length > 10)
    .flatMap((response) => {
      const code = packer.P_A_C_K_E_R.unpack(response.data);
      eval(code);
      return d;
    });

  images.pop(); //last image is an ad
  returns.imageCount -= 1;

  console.log(`Succesfully fetched images for chapter ${chapter}`);

  return {
    ...returns,
    images: images,
  };
};

const searchManga = async (title, page = 1) => {
  const url = `http://fanfox.net`;
  const response = await axios.get(url + "/search", {
    params: {
      page: page,
      title: title,
    },
  });
  const $ = cheerio.load(response.data);

  const items = $("div.line-list li")
    .map((i, el) => {
      const item = $(el);
      const name = item.children(".manga-list-4-item-title").text();
      const link = item.children("a").attr("href").split("/")[2];
      const cover = item.find("img").attr("src");
      const info = item.find(".manga-list-4-item-tip").toArray();
      const author = $(info[0]).children("a").text();
      const chapters = $(info[1]).find("a").text().split(" ");

      return {
        displayName: name,
        name: link,
        cover: cover,
        author: author,
        chapters: chapters[chapters.length - 1]
          .replace(".", "")
          .replace("Ch", ""),
      };
    })
    .toArray();

  const pages = $(".pager-list-left")
    .children("a")
    .toArray()
    .map((el) => parseInt($(el).text()));

  // console.log(pages);
  let pagesCount = 0;
  if (pages.length == 0) {
    pagesCount = 1;
  } else {
    pagesCount = pages[pages.length - 2];
  }
  const results = await Promise.all(
    //adding description
    items.map(async (items) => {
      const addInfo = await (async () => {
        // console.log(`${url}/manga/${items.name}`);
        const response = await axios.get(`${url}/manga/${items.name}`); //going on different page to get description
        if (response.status == 200) {
          const $ = cheerio.load(response.data);
          const description = $(".fullcontent").text();
          const tags = $(".detail-info-right-tag-list")
            .children("a")
            .toArray()
            .map((el) => $(el).text());
          return { description: description, tags: tags };
        }
      })();
      return { ...items, ...addInfo };
    })
  );

  const json = {
    results: results,
    itemsCount: items.length,
    pages: pagesCount,
  };
  console.log(`Succesfully fetched ${json.itemsCount} mangas`);
  return json;
};

(async () => {
  // console.log(await searchManga("jujutsu"));
  // console.log(await getChapterImages("jujutsu_kaisen", "063"));
})();

module.exports.getChapterImages = getChapterImages;
module.exports.searchManga = searchManga;
