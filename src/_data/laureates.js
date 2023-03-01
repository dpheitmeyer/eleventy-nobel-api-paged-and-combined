const eleventyFetch = require("@11ty/eleventy-fetch");
const cacheDuration = "1d";
const limit = 100;

module.exports = async function () {
  /* The Nobel Prize API
     https://www.nobelprize.org/about/developer-zone-2/  */

  let baseUrl = "https://api.nobelprize.org/2.1/laureates";
  /*
  sort
  limit
  nobelPrizeYear (end year)
  yearTo (start year)
  */
  let requestParams = {
    limit: limit,
    offset: 0,
  };

  let laureatesAll = { laureates: [], byId: {} };
  let nextLink = "";
  do {
    let params = new URLSearchParams(requestParams);
    let queryString = params.toString();
    let requestUrl = `${baseUrl}?${queryString}`;
    console.log(requestUrl);
    try {
      let responseData = await eleventyFetch(requestUrl, {
        duration: cacheDuration,
        type: "json",
      });
      laureatesAll.meta = responseData.meta;
      laureatesAll.laureates.push(...responseData.laureates);
      nextLink = responseData.links.next;
      requestParams.offset += limit;
      console.log(requestParams.offset);
    } catch (err) {
      console.error("Something went wrong with request\n" + requestUrl);
      console.log(err);
    }
  } while (nextLink != undefined);
  /* restructure data to allow for easy lookups in templates */
  laureatesAll.laureates.forEach(
    (l) => (laureatesAll.byId[l.id] = l));
  return laureatesAll;
};
