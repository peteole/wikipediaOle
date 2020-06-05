/**
 * @param {Tab} toLoad
 */
async function tabToNode(toLoad) {
    if (toLoad.type == "a") {
        var text = await loadWikiTab(toLoad);
        if (toLoad.layout == "s") {
            var toReturn = getNavNodeFromHtml(text).children[0];
            toReturn.thumbnail.innerHTML = toLoad.location;
            return toReturn;
        }
        if (toLoad.layout == "p") {
            let content = document.createElement("div");
            content.innerHTML = text;
            setLinkActions(content);
            let thumbnail = document.createElement("div");
            thumbnail.innerHTML = toLoad.location;
            return new NavNode(null, content, thumbnail);
        }
    }
    if(toLoad.type=="e"){
        let content = document.createElement("div");
        let iframe=document.createElement("iframe");
        iframe.src=toLoad.location;
        content.appendChild(iframe);
        let thumbnail = document.createElement("div");
        thumbnail.innerHTML = toLoad.location;
        return new NavNode(null, content, thumbnail);
    }
    let content = document.createElement("div");
    content.innerHTML = "invalid url";
    let thumbnail = document.createElement("div");
    thumbnail.innerHTML = toLoad.location;
    return new NavNode(null, content, thumbnail);
}