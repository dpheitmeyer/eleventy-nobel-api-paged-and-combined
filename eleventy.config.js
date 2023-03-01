// https://nodejs.org/api/util.html#util_util_inspect_object_options
const inspect = require("util").inspect;

module.exports = function(eleventyConfig) {
	eleventyConfig.addPassthroughCopy("src/assets/**");
	eleventyConfig.addFilter("inspect", function(content) {  return `<pre>${inspect(content)}</pre>` });
 	eleventyConfig.addShortcode("laureateDisplayName", 
	async function(laureate) {
		let displayName = '';
		if (("knownName" in laureate)
		     && ("en" in laureate.knownName)) {
			displayName = laureate.knownName.en;
		} else if (("orgName" in laureate)
		     && ("en" in laureate.orgName)) {
			displayName = laureate.orgName.en;
		}
		return displayName;
	});
	return {
    	"dir" : {
        	"input": "src",
        	"output": "dist"
    	}
	};
};
