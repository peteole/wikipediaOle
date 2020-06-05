
/**
 * @type {NavNode}
 */
/*
var root;
var footer = document.createElement("footer");
var currentDepth = 0;
var currentOpenDepth = 0;
var ySwipe = 0;
var openPage = document.createElement("div");
var win = document.createElement("div");
var upButton = document.createElement("div");
var winHeight = 0;
var winWidth = 0;*/
var thumbnailWidth = 70;
var thumbnailHeight = 60;
var gap = 7;
var slideTime = 300;
var distaneWithoutScaling = 1 / 10;
var settings = document.createElement("div");
/**
 * @type {Tab[]}
 */
var openPages = [];
/**
 * @type {Set<HTMLDivElement>}
 */
var drawnContents = new Set([]);
var nameToNavNode = new Map();
let articleToNode = new Map();
var thumbnailColor = "rgba(176, 232, 183, 0.3)";
/**@type {SlideNavigator} */
var slideNavigator;
window.onresize = function () {
	this.slideNavigator.onresize();
	/*this.win.style.height = window.innerHeight + "px";
	this.winHeight = window.innerHeight;
	this.winWidth = window.innerWidth;
	//this.root.resize();

	this.updateElementPositions();*/
};
function setWidth() {
	slideNavigator.thumbnailWidth = parseFloat(document.getElementById("tWidth").value);
	localStorage.setItem("thumbnailWidth", slideNavigator.thumbnailWidth);
	slideNavigator.onresize();
}
function setHeight() {
	slideNavigator.thumbnailHeight = parseFloat(document.getElementById("tHeight").value);
	localStorage.setItem("thumbnailHeight", thumbnailHeight);
	slideNavigator.onresize();
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
		el.thumbnail.style.backgroundColor = thumbnailColor;
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
	this.setupOfflineStorage();
	this.document.body.style.height = window.innerHeight + "px";
	/*this.win.style.height = window.innerHeight + "px";
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
	}.bind(this);*/
	window.onhashchange = function () {
		var newPageNames = this.urlToArray(window.location.href);
		for (let i = newPageNames.length; i < this.openPages.length; i++) {
			this.slideNavigator.root.removeChildNode(i);
			updateSlidersNav(this.slideNavigator);
			this.slideNavigator.onresize();
		}
		for (let i = 0; i < this.Math.min(newPageNames.length, this.openPages.length); i++) {
			if (!this.openPages[i].equals(newPageNames[i])) {
				this.tabToNode(newPageNames[i]).then(function (index, node) {
					slideNavigator.root.replaceChildNode(node, index);
					updateSlidersNav(slideNavigator);
					slideNavigator.onresize();
				}.bind(null, i));
			}
		}
		/**@type {Promise<NavNode>[]} */
		var allPromises = [];
		for (let i = this.openPages.length; i < newPageNames.length; i++) {
			allPromises.push(this.tabToNode(newPageNames[i]));
		}
		const lastTabAmount=this.openPages.length;
		Promise.all(allPromises).then(results => {
			for (let i in results) {
				i=this.parseInt(i);
				this.slideNavigator.root.addChildNode(results[i], i+lastTabAmount);
			}
			updateSlidersNav(this.slideNavigator);
			this.slideNavigator.onresize();
		})
		this.openPages = newPageNames;
		//this.updateSliders();
		this.slideNavigator.root.childControlDiv.a.slideToY(0, slideTime);
	}
	var urlString = window.location.href;
	var url = new this.URL(urlString);
	root = new NavNode(null);
	let thumbnail = this.document.createElement("div");
	thumbnail.innerHTML = "&#128269;";
	thumbnail.style.textAlign = "center";
	var searchPage = new NavNode(root, createSearchPage(), thumbnail);
	this.settings.className = "settings";
	this.settings.style.height = this.winHeight - this.thumbnailHeight + "px";
	this.fetch("settings.html").then(res =>
		res.text().then(text =>
			this.settings.innerHTML = text
		));
	this.slideNavigator = new SlideNavigator(this.document.body, this.root);
	this.slideNavigator.footer.prepend(settings);
	if (this.localStorage.getItem("thumbnailColor"))
		this.thumbnailColor = localStorage.getItem("thumbnailColor");
	if (localStorage.getItem("thumbnailWidth"))
		slideNavigator.thumbnailWidth = parseFloat(localStorage.getItem("thumbnailWidth"));
	if (localStorage.getItem("thumbnailHeight"))
		slideNavigator.thumbnailHeight = parseFloat(localStorage.getItem("thumbnailHeight"));

	this.slideNavigator.onresize();
	window.onhashchange();
};
function loadHTMLText(text) {
	while (win.firstChild) {
		win.firstChild.style.display = "none";
		win.removeChild(win.firstChild);
	}
	currentOpenDepth = 0;
	ySwipe = 0;
	window.root = getNavNodeFromHtml(text);
	updateSlidersNav(slideNavigator);

}