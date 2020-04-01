function createSearchPage() {
    var content = document.createElement("div");
    let header = document.createElement("div");
    header.className = "searchHeader";
    var searchBar = document.createElement("input");
    header.appendChild(searchBar);
    searchBar.className = "searchBar";
    var output = document.createElement("p");
    var submitButton = document.createElement("button");
    submitButton.innerHTML = "&#128269;";
    submitButton.onclick = function (ev) {
        loadSearch(searchBar, output)
        while (output.firstElementChild) {
            output.removeChild(output.firstElementChild);
        }
    }
    header.appendChild(submitButton);
    searchBar.onchange = function (ev) {
        loadSearch(searchBar, output)
        while (output.firstElementChild) {
            output.removeChild(output.firstElementChild);
        }
    }
    content.appendChild(header);
    content.appendChild(output);
    return content;
}
async function loadSearch(searchBar, output = document.createElement("p")) {
    var searchText = searchBar.value;
    const url = "https://en.wikipedia.org/w/api.php?" +
        new URLSearchParams({
            origin: "*",
            action: "opensearch",
            search: searchText,
            format: "json",
        });
    /*const url = "https://en.wikipedia.org/w/api.php?" +
        new URLSearchParams({
            origin: "*",
            action: "query",
            list: "search",
            srnamespace: "0",
            srsearch: searchText,
            format: "json",
        });*/
    try {
        const req = await fetch(url);
        const json = await req.json();
        /*for(let result of json.query.search){
            let displayer=document.createElement("div");
            displayer.innerHTML=result.snippet;
            output.appendChild(displayer);
        }*/
        for (var i in json[1]) {
            var result = document.createElement("p");
            result.innerHTML = json[1][i];
            var link = new URL(json[3][i]);
            var split = link.pathname.split("/");
            var name = split[split.length - 1];
            result.name = name;
            result.title = json[1][i];
            result.onclick = function (ev) {
                var url = new URL(window.location.href);
                var title = ev.target.name;
                openPages.push(title);
                url.hash = arrayToHash(openPages);
                window.history.pushState(null, "Wikipipedia: " + title, url.href);
                loadWiki(title).then(htmlText => {
                    var newRoot = getNavNodeFromHtml(htmlText).children[0];
                    newRoot.thumbnail.innerHTML = ev.target.title;
                    window.root.addChildNode(newRoot, window.root.children.length - 1);
                    updateSliders();
                });
            }
            output.appendChild(result);
        }
    } catch (e) {
        console.error(e);
    }
}