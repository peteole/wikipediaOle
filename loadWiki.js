/**
 * 
 * @param {string} article -name of article to load
 * @param {boolean} store -whether to save the article offline or not
 * @param {boolean} preferNetwork - whether to download the latest version of the article if possible
 * @returns {Promise<string>} -article html text as string
 */
async function loadWiki(article, store = true, preferNetwork = false) {
    /*var storedArticle=localStorage.getItem(article);
    if(storedArticle){
        return storedArticle;
    }*/
    if (!(navigator.onLine && preferNetwork)) {
        await offlineStorage.getReadyPromise();
        var storedArticle = await offlineStorage.loadArticle(article, "en");
        if (storedArticle) {
            return storedArticle;
        }
    }
    if (navigator.onLine) {


        const url = "https://en.wikipedia.org/w/api.php?" +
            new URLSearchParams({
                origin: "*",
                action: "parse",
                page: article,
                format: "json",
            });

        try {
            const req = await fetch(url);
            const json = await req.json();
            var text = json.parse.text["*"];
            //localStorage.setItem(article,text);
            offlineStorage.storeArticle(article, "en", text).then(
                () => console.log("finished")
            )
                .catch((reason) =>
                    console.log(reason)
                )
            return text;
        } catch (e) {
            console.error(e);
            return "<h1> Inhalt nicht verfügbar...</h1>";
        }
    } else {
        return "<h1> Inhalt nicht verfügbar...</h1>";
    }
}
var articlesDownloaded = 0;
var articlesStartedDownloading = 0;
var maxArticlesToDownload = 0;
/**
 * 
 * @param {string} article 
 * @param {number} maxDepth - maximum depth to download from current article
 * @param {(number)=>void} onDownloadnumberChange - callback when a download finished
 */
async function downloadArticleAndLinks(article, maxDepth, onDownloadnumberChange = (n) => console.log(n)) {
    if (!offlineStorage.isReady()) {
        await offlineStorage.getReadyPromise();
    }
    var text = await offlineStorage.loadArticle(article, "en");
    if (!text) {
        if (articlesDownloaded > maxArticlesToDownload) {
            console.log("zu viele Artikel herunterzuladen");
            return;
        }
        const url = "https://en.wikipedia.org/w/api.php?" +
            new URLSearchParams({
                origin: "*",
                action: "parse",
                page: article,
                format: "json",
            });

        try {
            const req = await fetch(url);
            const json = await req.json();
            if (!(json.parse && json.parse.text)) {
                articlesStartedDownloading--;
                return;
            }
            text = json.parse.text["*"];
            if (!text) {
                articlesStartedDownloading--;
                return;
            }
            articlesDownloaded++;
            onDownloadnumberChange(articlesDownloaded);
            if (maxDepth == 0) {
                offlineStorage.storeArticle(article, "en", text);
            }

        } catch (e) {
            console.log(e);
            return;
        }
    }
    if (maxDepth <= 0) {
        return;
    }
    if (text.startsWith("<!--links already downloaded-->") && maxDepth == 1) {
        return;
    }

    offlineStorage.storeArticle(article, "en", "<!--links already downloaded-->\n" + text)
    const tmp = document.createElement("div");
    tmp.innerHTML = text;
    let links = tmp.querySelectorAll("a");
    var allPromises = [];
    for (let link of links) {
        if (link.title.length != 0) {
            if(articlesStartedDownloading>maxArticlesToDownload){
                await Promise.all(allPromises);
                allPromises=[];
            }
            if(articlesDownloaded>maxArticlesToDownload){
                return;
            }
            let nameSplit = link.pathname.split("/");
            allPromises.push(downloadArticleAndLinks(nameSplit[nameSplit.length - 1], maxDepth - 1, onDownloadnumberChange));
            articlesStartedDownloading++;
        }
    }
    await Promise.all(allPromises);
    return;
}