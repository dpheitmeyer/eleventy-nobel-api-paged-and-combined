const eleventyFetch = require("@11ty/eleventy-fetch");
const cacheDuration = '1d';
const limit = 100;

module.exports = async function () {
  /* The Nobel Prize API
     https://www.nobelprize.org/about/developer-zone-2/  */

  let baseUrl = "https://api.nobelprize.org/2.1/nobelPrizes";
  /*
  sort
  limit
  nobelPrizeYear (end year)
  yearTo (start year)
  */
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
    let requestUrl = `${baseUrl}?${queryString}`;
    console.log(requestUrl);
    try {
      let responseData = await eleventyFetch(requestUrl, {
        duration: cacheDuration,
        type: "json"
      });
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
  return(nobelPrizesAll);
};


/* API requests return 
  So logic is to look at "links.next" for a value
  meta: {
    offset: 0,
    limit: 100,
    count: 664,
    terms: 'https://www.nobelprize.org/about/terms-of-use-for-api-nobelprize-org-and-data-nobelprize-org/',
    license: 'https://www.nobelprize.org/about/terms-of-use-for-api-nobelprize-org-and-data-nobelprize-org/#licence',
    disclaimer: 'https://www.nobelprize.org/about/terms-of-use-for-api-nobelprize-org-and-data-nobelprize-org/#disclaimer'
  },
  links: {
    first: 'https://masterdataapi.nobelprize.org/2.1/nobelPrizes?offset=0&limit=100',
    self: 'https://masterdataapi.nobelprize.org/2.1/nobelPrizes?offset=0&limit=100',
    next: 'https://masterdataapi.nobelprize.org/2.1/nobelPrizes?offset=100&limit=100',
    last: 'https://masterdataapi.nobelprize.org/2.1/nobelPrizes?offset=600&limit=100'
  }
  */