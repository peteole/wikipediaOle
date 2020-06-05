/**
 * 
 * @param {string} hash - hash value from the url
 * @returns {Tab[]} open page names
 */
function hashToArray(hash) {
    if (hash.length <= 1) {
        return [];
    }
    const split = hash.substring(1).split("%%");
    let toReturn = [];
    for (let hash of split)
        toReturn.push(Tab.fromHash(hash));
    return toReturn;
}
/**
 * 
 * @param {Tab[]} array - article names
 * @returns {string} hash value representation
 */
function arrayToHash(array) {
    if (array.length == 0) {
        return "#";
    }
    var toReturn = "#";
    for (let tab of array) {
        toReturn += tab.toHashPart() + "%%";
    }
    return toReturn.substr(0, toReturn.length - 2);
}
/**
 * 
 * @param {string} url -raw url to evaluate
 * @returns {Tab[]} -evaluation of the url hash
 */
function urlToArray(url = window.location.href) {
    return hashToArray(new URL(url).hash);
}
/**
 * converts given array to url
 * @param {Tab[]} array -array of open pages
 */
function arrayToUrl(array) {
    let hash = arrayToHash(array);
    var url = new URL(window.location.href);
    url.hash = hash;
    return url.href;
}
class Tab {
    /**
     * @param {string} location - where to find the content of the article
     * @param {string} type -type of tab. "a"=>wikipedia article; "e"=> external website
     * @param {string} language 
     * @param {string} layout - how to show tab. "s"=> slide navigation; "p"=> plain wikipedia
     */
    constructor(location, type = "a", language = "en", layout = "s") {
        this.location = location;
        this.type = type;
        this.language = language;
        this.layout = layout;
    }
    /**@param {string} hashPart */
    static fromHash(hashPart) {
        const split = hashPart.split("%");
        const type = split[0];
        const language = split[1];
        const layout = split[2];
        let encodedLocation = split[3];
        for (let i = 4; i < split.length; i++) {
            encodedLocation += "%" + split[i];
        }
        switch (type) {
            case "a":
                return new Tab(encodedLocation, type, language, layout);
            case "e":
                let url = decodeURIComponent(encodedLocation);
                return new Tab(url, type, language, layout);
        }
    }
    toHashPart() {
        let encodedLocation = this.location;
        if (this.type == "e")
            encodedLocation = encodeURIComponent(this.location);
        return this.type + "%" + this.language + "%" + this.layout + "%" + encodedLocation;
    }
    /**@param {Tab} tab */
    equals(tab) {
        return tab.language == this.language && tab.layout == this.layout && tab.location == this.location && tab.type == this.type;
    }
}