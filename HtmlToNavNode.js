let headlineTagNames = ["h1", "h2", "h3", "h4", "h5", "h6"];
/**
 * 
 * @param {string} html - html text to parse
 * @returns {NavNode} parsed root node
 */
function getNavNodeFromHtml(html = "") {
    let parse = document.createElement("div");
    parse.innerHTML = html;
    if (parse.firstElementChild && parse.firstElementChild.tagName != "H1") {
        parse.firstElementChild.prepend(document.createElement("h1"));
    }
    var root = new NavNode(null);
    var h = parse.querySelectorAll("h1, h2, h3, h4, h5, h6");
    setLinkActions(parse);
    var lastNode = root;
    for (var headline of h) {
        var level = parseInt(headline.tagName.charAt(1));
        let thumbnail = document.createElement("div");
        thumbnail.innerHTML = headline.textContent;
        let content = document.createElement("div");
        var start = headline;
        while (start.parentNode && start.parentNode.querySelectorAll("h1, h2, h3, h4, h5, h6").length == 1) {
            start = start.parentNode;
        }
        if (start != headline) {
            content.appendChild(start);
        }
        for (var c = start.nextElementSibling; c && !headlineTagNames.includes(c.tagName) && c.querySelector("h1, h2, h3, h4, h5, h6") == null; c = headline.nextElementSibling) {
            content.appendChild(c);
        }
        if (start == headline) {
            content.prepend(headline);
        }
        var dif = level - lastNode.level;
        var parent = lastNode;
        if (dif <= 1) {
            for (let i = 0; i < 1 - dif; i++) {
                parent = parent.parent;
            }
        } else {
            for (let i = 0; i < dif - 1; i++) {
                parent = new NavNode(parent);
            }
        }
        lastNode = new NavNode(parent, content, thumbnail);
        /*switch (level - lastNode.level) {
            case 1:
                lastNode = new NavNode(lastNode, content, thumbnail);
                break;
            case 0:
                lastNode = new NavNode(lastNode.parent, content, thumbnail);
                break;
            case -1:
                lastNode = new NavNode(lastNode.parent.parent, content, thumbnail);
                break;
            default:
                console.log("fehler");
        }*/
    }
    return root;
}
/**
 * 
 * @param {HTMLElement} parse 
 */
function setLinkActions(parse) {
    var links = parse.querySelectorAll("a");
    for (var link of links) {
        link.onclick = (ev) => {
            ev.preventDefault();
            /**@type {NavNode} */
            var node;
            for (let potentialTarget of ev.composedPath()) {
                if (potentialTarget.navNode) {
                    node = potentialTarget.navNode;
                    break;
                }
            }
            while (node.level > 1) {
                node = node.parent;
            }
            let nameSplit = ev.target.pathname.split("/");
            if (nameSplit[1] == "wiki") {
                let newOpenTabs = urlToArray(window.location.href);
                newOpenTabs[node.positionFromParent].location = nameSplit[nameSplit.length - 1];
                window.location.href = arrayToUrl(newOpenTabs);
            }
            else {
                let newOpenTabs = urlToArray(window.location.href);
                newOpenTabs[node.positionFromParent] = new Tab(ev.target.href, "e", "en", "p");
                window.location.href = arrayToUrl(newOpenTabs);
            }
        };
    }
}
