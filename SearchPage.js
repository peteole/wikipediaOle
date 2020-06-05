function createSearchPage() {
    var content = document.createElement("div");
    let header = document.createElement("div");
    header.className = "searchHeader";
    var searchBar = document.createElement("input");
    header.appendChild(searchBar);
    searchBar.className = "searchBar";
    var languageInput = document.createElement("input");
    header.appendChild(languageInput);
    languageInput.className = "languageInput";
    languageInput.value = "en";
    var output = document.createElement("p");
    var submitButton = document.createElement("button");
    submitButton.innerHTML = "&#128269;";
    submitButton.onclick = function (ev) {
        loadSearch(searchBar, languageInput, output);
        while (output.firstElementChild) {
            output.removeChild(output.firstElementChild);
        }
    };
    header.appendChild(submitButton);
    searchBar.onchange = function (ev) {
        loadSearch(searchBar, languageInput, output);
        while (output.firstElementChild) {
            output.removeChild(output.firstElementChild);
        }
    };
    content.appendChild(header);
    content.appendChild(output);
    return content;
}
async function loadSearch(searchBar, languageInput, output = document.createElement("p")) {
    var searchText = searchBar.value;
    var language = languageInput.value;
    const url = "https://" + language + ".wikipedia.org/w/api.php?" +
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
            result.oncontextmenu = function (ev) {
                ev.preventDefault();
                const title = ev.target.name;
                document.body.appendChild(createArticleOpenMenu(title));
            };
            result.onclick = function (ev) {
                var url = new URL(window.location.href);
                var title = ev.target.name;
                let openPagesCopy = Array.from(openPages);
                openPagesCopy.push(new Tab(title, "a", language, "s"));
                url.hash = arrayToHash(openPagesCopy);
                window.location = url;
                /*window.history.pushState(null, "Wikipipedia: " + title, url.href);
                loadWiki(title).then(htmlText => {
                    var newRoot = getNavNodeFromHtml(htmlText).children[0];
                    newRoot.thumbnail.innerHTML = ev.target.title;
                    window.root.addChildNode(newRoot, window.root.children.length - 1);
                    updateSlidersNav(slideNavigator);
                    slideNavigator.onresize();
                });*/
            };
            output.appendChild(result);
        }
    } catch (e) {
        console.error(e);
    }
}
function createArticleOpenMenu(title = "") {
    let popup = document.createElement("div");
    popup.className = "popup";
    let headline = document.createElement("h1")
    headline.innerHTML = "Options for article \"" + title + "\"";
    popup.appendChild(headline);
    popup.appendChild(document.createElement("hr"));
    let closeButton = document.createElement("button");
    closeButton.innerHTML = "&#10006;";
    closeButton.className = "closeButton";
    closeButton.onclick = function (ev) {
        this.parentElement.removeChild(this);
    }.bind(popup);
    popup.appendChild(closeButton);
    const openNormallyButton = document.createElement("button");
    openNormallyButton.innerHTML = "open page in new tab";
    openNormallyButton.className = "controlButton";
    openNormallyButton.onclick = (ev) => {
        var url = new URL(window.location.href);
        let openPagesCopy = Array.from(openPages);
        openPagesCopy.push(new Tab(title, "a", "en", "s"));
        url.hash = arrayToHash(openPagesCopy);
        window.location = url;
        popup.parentElement.removeChild(popup);
    }
    popup.appendChild(openNormallyButton);

    const openPlainButton = document.createElement("button");
    openPlainButton.innerHTML = "open page in new tab in plain view";
    openPlainButton.className = "controlButton";
    openPlainButton.onclick = (ev) => {
        var url = new URL(window.location.href);
        let openPagesCopy = Array.from(openPages);
        openPagesCopy.push(new Tab(title, "a", "en", "p"));
        url.hash = arrayToHash(openPagesCopy);
        window.location = url;
        popup.parentElement.removeChild(popup);
    }
    popup.appendChild(openPlainButton);
    return popup;
}