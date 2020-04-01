/**
 * 
 * @param {string} hash - hash value from the url
 * @returns {string[]} open page names
 */
function hashToArray(hash){
    return hash.substring(1).split("%");
}
/**
 * 
 * @param {string[]} array - article names
 * @returns {string} hash value representation
 */
function arrayToHash(array){
    var toReturn="#";
    for(let name of array){
        toReturn+=name+"%";
    }
    return toReturn.substr(0,toReturn.length-1);
}
/**
 * 
 * @param {string} url -raw url to evaluate
 * @returns {string[]} -evaluation of the url hash
 */
function urlToArray(url){
    return hashToArray(new URL(url).hash);
}
/**
 * converts given array to url
 * @param {string[]} array -array of open pages
 */
function arrayToUrl(array){
    let hash=arrayToHash(array);
    var url = new URL(window.location.href);
    url.hash=hash;
    return url.href;
}