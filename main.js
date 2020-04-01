/**
 * @type {NavNode}
 */
var root; //=new NavNode(null);
var footer = document.createElement("footer");
var currentDepth = 0;
var currentOpenDepth = 0;
var ySwipe = 0;
var openPage = document.createElement("div");
var settings = document.createElement("div");
var win = document.createElement("div");
var upButton = document.createElement("div");
var slideTime = 300;
var distaneWithoutScaling = 1 / 10;
var winHeight = 0;
var winWidth = 0;
var thumbnailWidth = 70;
var thumbnailHeight = 60;
var gap = 7;
var lastEl = [];
var footerY = 0;
/**
 * @type {string[]}
 */
var openPages=[];
/**
 * @type {Set<HTMLDivElement>}
 */
var drawnContents = new Set([]);
var nameToNavNode = new Map();
let articleToNode = new Map();
var thumbnailColor = "rgba(176, 232, 183, 0.3)"
window.onresize = function () {
    this.win.style.height = window.innerHeight + "px";
    this.winHeight = window.innerHeight;
    this.winWidth = window.innerWidth;
    this.root.resize();
};
function setWidth() {
    thumbnailWidth = parseFloat(document.getElementById("tWidth").value);
    localStorage.setItem("thumbnailWidth", thumbnailWidth);
    root.resize();
}
function setHeight() {
    thumbnailHeight = parseFloat(document.getElementById("tHeight").value);
    localStorage.setItem("thumbnailHeight", thumbnailHeight);
    root.resize();
}
function setColor() {
    var opacity = parseFloat(document.getElementById("opacity").value) / 100;
    var colorRaw = document.getElementById("colorPicker").value;
    var tmp = document.createElement("div");
    tmp.style.backgroundColor = colorRaw;
    var withoutTrans = tmp.style.backgroundColor;
    thumbnailColor = "rgba" + withoutTrans.substring(3, withoutTrans.length - 1) + ", " + opacity + ")";
    localStorage.setItem("thumbnailColor", thumbnailColor);
    this.root.forEach(el => {
        el.thumbnail.style.backgroundColor = thumbnailColor
    });
}
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(function (reg) {

        if (reg.installing) {
            console.log('Service worker installing');
        } else if (reg.waiting) {
            console.log('Service worker installed');
        } else if (reg.active) {
            console.log('Service worker active');
        }

    }).catch(function (error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}
window.onload = function () {
    if (this.localStorage.getItem("thumbnailColor"))
        this.thumbnailColor = localStorage.getItem("thumbnailColor");
    if (localStorage.getItem("thumbnailWidth"))
        thumbnailWidth = parseFloat(localStorage.getItem("thumbnailWidth"));
    if (localStorage.getItem("thumbnailHeight"))
        thumbnailHeight = parseFloat(localStorage.getItem("thumbnailHeight"));
    this.win.style.height = window.innerHeight + "px";
    this.win.style.width = "100%";
    this.win.style.position = "absolute";
    this.win.style.overflow = "hidden";
    this.win.style.left = 0 + "px";
    this.win.style.top = 0 + "px";
    this.winHeight = window.innerHeight;
    this.winWidth = window.innerWidth;
    this.upButton.style.position = "fixed";
    this.upButton.style.width = this.thumbnailWidth + "px";
    this.upButton.style.height = this.thumbnailHeight + "px";
    this.upButton.style.backgroundColor = "white";
    this.upButton.style.bottom = gap + "px";
    this.upButton.innerHTML = "&#709";
    this.upButton.style.textAlign = "center";
    this.upButton.style.fontSize = this.thumbnailHeight + "px";
    this.upButton.style.borderRadius = "5px";
    this.upButton.style.zIndex = 10;
    this.upButton.onclick = function (ev) {
        if (ySwipe > 0 && !this.root.childControlDiv.a.sliding) {
            this.root.childControlDiv.a.moveElementYWithoutTouch(ySwipe, false);
            this.root.childControlDiv.a.slideToPoint(
                new Point(
                    this.root.childControlDiv.a.currentX,
                    ySwipe - thumbnailHeight
                ),
                slideTime
            );
        }
    }.bind(this);
    window.onhashchange = function () {
        var newPageNames=this.urlToArray(window.location.href);
        for(var i=newPageNames.length;i<this.openPages.length;i++){
            this.root.removeChildNode(i);
            updateSliders();
        }
        for(var i=0;i<this.Math.min(newPageNames.length,this.openPages.length);i++){
            if(this.openPages[i]!=newPageNames[i]){
                this.loadWiki(newPageNames[i]).then(function(index,text){
                    var newArticle=getNavNodeFromHtml(text).children[0];
                    newArticle.thumbnail.innerHTML=newPageNames[index];
                    window.root.replaceChildNode(newArticle,index);
                    updateSliders();
                }.bind(null,i))
            }
        }
        for(var i=this.openPages.length;i<newPageNames.length;i++){
            this.loadWiki(newPageNames[i]).then(function(index,text){
                var newArticle=getNavNodeFromHtml(text).children[0];
                newArticle.thumbnail.innerHTML=newPageNames[index];
                window.root.addChildNode(newArticle,index);
                updateSliders();
            }.bind(null,i))
        }
        this.openPages=newPageNames;
    }
    var urlString = window.location.href;
    var url = new this.URL(urlString);
    root = new NavNode(null);
    let thumbnail = this.document.createElement("div");
    thumbnail.innerHTML = "+";
    thumbnail.style.textAlign = "center";
    var searchPage = new NavNode(root, createSearchPage(), thumbnail);
    window.onhashchange();
    /*var pages = url.hash.substring(1).split("%");
    for (let i in pages) {
        this.loadWiki(pages[i]).then(htmlText => {
            var newRoot = getNavNodeFromHtml(htmlText).children[0];
            newRoot.thumbnail.innerHTML = pages[i];
            window.root.addChildNode(newRoot, window.root.children.length - 1);
            updateSliders();
        })
    }*/
    //this.loadWiki(url.hash.substring(1)).then(loadHTMLText);
    this.settings.className = "settings";
    this.settings.style.height = this.winHeight - this.thumbnailHeight + "px";
    this.settings.innerHTML = "<h1>Settings</h1><p>thumbnail width:<input id=\"tWidth\" onchange=\"setWidth()\" type=\"range\" max=\"300\" min=\"50\"></p> <p> thumbnail height <input id=\"tHeight\" onchange=\"setHeight()\" type=\"range\" max=\"100\" min=\"20\"></p><p> set color<input type=color id=\"colorPicker\" onchange=\"setColor()\"></p><p> opacity <input id=\"opacity\" onchange=\"setColor()\" type=\"range\" max=\"100\" min=\"0\"></p>";
    this.footer.appendChild(settings);
    this.footer.setAttribute("class", "slideFooter");
    this.footer.style.top = "100%"; //window.innerHeight-50+"px";
    //this.document.body.appendChild(this.upButton);
    this.document.body.appendChild(this.footer);
    this.document.body.appendChild(this.win);
    updateSliders();
};
function loadHTMLText(text) {
    while (win.firstChild) {
        win.firstChild.style.display = "none";
        win.removeChild(win.firstChild);
    }
    currentOpenDepth = 0;
    ySwipe = 0;
    window.root = getNavNodeFromHtml(text);
    updateSliders();

}