const eleventyFetch = require("@11ty/eleventy-fetch");
const allEqual = arr => arr.every(val => val === arr[0]);
const cacheDuration = '1d';
const limit = 100;

/* The Nobel Prize API
     https://www.nobelprize.org/about/developer-zone-2/  */
const baseUrlPrizes = "https://api.nobelprize.org/2.1/nobelPrizes";

     
module.exports = async function () {
  let requestParams = {
    sort: "desc",
    limit: limit,
    offset: 0
  }



  let nobelPrizesAll = {nobelPrizes:[]}
  let nextLink = '';
  do {
    let params = new URLSearchParams(requestParams);
    let queryString = params.toString();
    let requestUrl = `${baseUrlPrizes}?${queryString}`;
    console.log(requestUrl);
    try {
      let responseData = await eleventyFetch(requestUrl, {
        duration: cacheDuration,
        type: "json"
      });
      /* iterate through prizes and laureates and get details */
      responseData.nobelPrizes.forEach(p => {
        if ("laureates" in p ){

          /* logic to see whether all laureate "motivations"
             are the same */
          let motivations = p.laureates.map(l => l.motivation.en);
          console.log(motivations);
          let motivationsSame = allEqual(motivations); /* allEqual defined 'at top' */
          p._motivationsSame = motivationsSame;
          p._motivation = motivations[0];
          console.log(motivationsSame);

          /* request detailed laureate data 
             and add to (_detail) data in prizes */
          p.laureates.forEach(
            (l) => { 
              if ("id" in l) { 
                l._detail = getLaureateInfo(l.id);
              }
            });
        } 

      })
    
      nobelPrizesAll.meta = responseData.meta;
      nobelPrizesAll.nobelPrizes.push(...responseData.nobelPrizes);
      nextLink = responseData.links.next;
      requestParams.offset += limit;
      console.log(requestParams.offset);
    } catch (err) {
      console.error("Something went wrong with request\n" + requestUrl);
      console.log(err);
    }
  } while ( nextLink != undefined )
  console.log(nobelPrizesAll.nobelPrizes[0]);
  return(nobelPrizesAll);
};

async function getLaureateInfo(id) {
  let url = `https://api.nobelprize.org/2.1/laureate/${id}`;
  console.log(url);
  try {
    let responseData = await eleventyFetch(url, {
      duration: "1d",
      type: "json"
    });
    return(responseData[0]);
  } catch(err) {
    console.error("something is wrong with request for\n" + url);
    console.log(err);
  }
}