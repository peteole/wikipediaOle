var root; //=new NavNode(null);
var footer = document.createElement("footer");
var currentDepth = 0;
var currentOpenDepth = 0;
var ySwipe = 0;
var openPage = document.createElement("div");
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
var drawnContents = new Set([]);
var nameToNavNode = new Map();
window.onresize = function () {
    this.win.style.height = window.innerHeight + "px";
    this.winHeight = window.innerHeight;
    this.winWidth = window.innerWidth;
    this.root.resize();
};
window.onload = function () {
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
    window.onhashchange=function(){
        var urlString = window.location.href;
        var url = new this.URL(urlString);
        this.loadWiki(url.hash.substring(1)).then(loadHTMLText);
    }
    var urlString = window.location.href;
    var url = new this.URL(urlString);
    this.loadWiki(url.hash.substring(1)).then(loadHTMLText);
    this.footer.setAttribute("class", "slideFooter");
    this.footer.style.top = "100%"; //window.innerHeight-50+"px";
    //this.document.body.appendChild(this.upButton);
    this.document.body.appendChild(this.footer);
    this.document.body.appendChild(this.win);
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