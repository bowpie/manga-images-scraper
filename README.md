# MangaFox Scraper API - Unofficial New 2021

> This API provides basic functionality for searching and getting manga images from [MangaFox](http://fanfox.net) using `Nodejs` with `Puppeteer, Cheerio and ExpressJs`.

## Description/Usage

### **Requests**

---

It has 2 valid endpoints:

1. **GET** `/manga/search/{name}/{page}` where page is defaulted to 1
2. **GET** `/manga/images/{name}/{chapter}`

{name} refers to mangafox name for the respective manga, which is contained in the response from the first endpoint (`/search`) : see _responses_

{chapter} is a chapter provided by the user which can range from 1 - last chapter ( see /search response for chapters) otherwise an error will be thrown

---

### **Responses**

---

> ### All responses are in `json` format except `404 not found` and `internal error` messages

1. ### **First endpoint (/search)**

```
{
    results : list[{}],
    itemsCount: int,    //per page
    pages : int
};
```

> **Each item in results is structured as follows**:

```
{
    displayName : str.
    name : str,             //necesary for getting the images
    cover : str,            //image link
    author: str,
    chapters : str,         //last chapter
    description : str,
    tags : list[str],
}
```

> **Example**

### `/manga/search/jujutsu`

```
{
  "results": [
    {
      "displayName": "Jujutsu Kaisen",
      "name": "jujutsu_kaisen",
      "cover": "http://fmcdn.mfcdn.net/store/manga/27861/cover.jpg?token=1ee0cf49b33259e9b720070bfc0e40bc925e1cf6&ttl=1629756000&v=1628565964",
      "author": "AKUTAMI Gege",
      "chapters": "154",
      "description": "Yuuji is a genius at track and field. But he has zero interest running around in circles, he’s happy as a clam in the Occult Research Club. Although he’s only in the club for kicks, things get serious when a real spirit shows up at school! Life’s about to get really strange in Sugisawa Town #3 High School!",
      "tags": [
        "Action",
        "Comedy",
        "Fantasy",
        "Shounen",
        "Supernatural",
        "School Life"
      ]
    },
    {
      "displayName": "Tokyo Metropolitan Magic Technical School",
      "name": "tokyo_metropolitan_magic_technical_school",
      "cover": "http://fmcdn.mfcdn.net/store/manga/28725/cover.jpg?token=cd46e18e3c1f6972bb69de4ba22a06f64b8467b5&ttl=1629756000&v=1547645682",
      "author": "Akutami Gege",
      "chapters": "004",
      "description": "Its the prologue of Jujutsu Kaisen.",
      "tags": ["Action", "Fantasy", "Shounen"]
    }
  ],
  "itemsCount": 2,
  "pages": 1
}
```

2. ### **Second endpoint (/images)**
   > _It is responsible for getting the images for a chapter provided by the user_

```
 {
     title : str,
     chapter : str,
     chapterId : int,       //mangafox chapter id
     url : str,             //mangafox page url for the manga
     imageCount : int,      //how many images are in that chapter
     images: list[str]      //the links of the images
 }
```

> **Example**

### `/manga/images/jujutsu_kaisen/50`

```
{
  "title": "jujutsu_kaisen",
  "chapter": "050",
  "chapterId": 585539,
  "url": "http://fanfox.net/manga/jujutsu_kaisen",
  "imageCount": 19,
  "images": [
    "//zjcdn.mangafox.me/store/manga/27861/050.0/compressed/t000.jpg?token=d8abb244122ac71da51781b6457dc92400508422&ttl=1629734400",
    "//zjcdn.mangafox.me/store/manga/27861/050.0/compressed/t001.jpg?
    .
    .
    .
    "//zjcdn.mangafox.me/store/manga/27861/050.0/compressed/t018.jpg?token=457fac338ffe3e86decb518ed96128cd24e742a7&ttl=1629734400"
  ]
}
```

## Getting Started

---

### Dependencies

- nodejs, expressjs, puppeteer, cheerio, axios, \*nodemon
- tested only on windows but should work on linux too

### Executing program

- Preferably you should run it using `nodemon` so any changes you make to the api update instantly
- In package.json the default npm start is using nodemon, you can change it if you want
- Start the server by using (by default it starts on `localhost:6969`):

```
npm run start
```

## License

---

This project is licensed under the MIT License - see the LICENSE.md file for details
