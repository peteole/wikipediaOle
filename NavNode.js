/**
 * @typedef {HTMLDivElement & {navNode:NavNode}} ThumbnailDiv
 */
/**
 * @typedef {HTMLDivElement & {a:SwipeElementItem}} ChildControlDiv
 */
/**
 * @class
 */
class NavNode {
	resize() {
		if (!this.navigator)
			return;
		var thumbnailWidth=this.navigator.thumbnailWidth;
		var thumbnailHeight=this.navigator.thumbnailHeight;
		var gap=this.navigator.gap;
		this.content.style.width = (this.navigator ? this.navigator.winWidth : window.innerWidth) - gap + "px";
		this.content.style.height =
			(this.navigator ? this.navigator.winHeight : window.innerHeight) - gap + "px";
		this.thumbnail.style.position = "absolute";
		this.thumbnail.style.width = thumbnailWidth - gap + "px";
		this.thumbnail.style.height = thumbnailHeight - gap + "px";
		this.thumbnail.style.left =
			this.positionFromParent * thumbnailWidth + "px";
		this.childControlDiv.style.left =
			(this.navigator.winWidth + gap - thumbnailWidth) / 2 + "px";
		this.childControlDiv.style.top = -(this.level + 1) * thumbnailHeight + "px";
		this.children.forEach(child => child.resize());
	}
	/**
	 * 
	 * @param {NavNode} parent 
	 * @param {ThumbnailDiv} content 
	 * @param {ThumbnailDiv} thumbnail 
	 */
	constructor(
		parent = new NavNode(null),
		content = document.createElement("div"),
		thumbnail = document.createElement("div")
	) {
		this.level = 0;
		this.parent = parent;
		this.childPosition = 0;
		this.content = content;
		content.style.width = window.innerWidth - gap + "px";
		content.style.height = window.innerHeight - gap + "px";
		content.setAttribute("class", "content");
		content.navNode = this;
		/*content.style.backgroundColor="rgb(230,230,230)";
			content.style.overflowY="auto";
			content.style.position="absolute";
			content.style.transformOrigin="0 0";*/
		this.numOfChildren = 0;
		if (thumbnail.hasAttribute("numOfChildren")) {
			this.numOfChildren = thumbnail.getAttribute("numOfChildren");
		}
		this.childrenLoaded = false;
		this.isLoaded = false;
		content.style.display = "none";
		//win.appendChild(content);
		this.thumbnail = thumbnail;
		this.thumbnail.navNode = this;
		/**
		 * @type {NavNode[]}
		 */
		this.children = [];
		this.childDiv = document.createElement("div");
		this.childDiv.style.position = "absolute";
		/**@type {ChildControlDiv} */
		this.childControlDiv = document.createElement("div");
		this.childControlDiv.style.height = thumbnailHeight + "px";
		//this.childControlDiv.style.position="absolute";
		//this.childControlDiv=document.createElement("div");
		this.childControlMoveDiv = document.createElement("div");
		this.positionFromParent = 0;
		if (this.thumbnail.style) {
			this.thumbnail.style.position = "absolute";
			this.thumbnail.style.width = thumbnailWidth - gap + "px";
			this.thumbnail.style.height = thumbnailHeight - gap + "px";
			this.thumbnail.className = "thumbnail";
			this.thumbnail.style.backgroundColor = thumbnailColor;
		}
		/**@type {SlideNavigator} */
		this.navigator = null;
		if (parent) {
			parent.numOfChildren++;
			this.positionFromParent = parent.children.length;
			//thumbnail.current=this;
			parent.children.push(this);
			if (this.thumbnail.style) {
				this.thumbnail.style.left = this.positionFromParent * thumbnailWidth + "px";
			}
			this.parent.childControlDiv.appendChild(this.thumbnail);
			this.parent.childControlDiv.style.width =
				this.parent.children.length * thumbnailWidth + "px";
			this.level = parent.level + 1;
			/*thumbnail.style.backgroundColor = "rgba(176, 232, 183, 0.3)";
			thumbnail.style.backdropFilter = "blur(5px)";
			thumbnail.style.webkitBackdropFilter = "blur(5px)";
			thumbnail.style.userSelect = "none";*/
			var st = this.content.style;
			st.position = "absolute";
			st.left =
				window.innerWidth * (parent.children.length - 1) + gap / 2 + "px";
			//this.parent.childDiv.appendChild(this.content);
			if (parent.parent) {
				parent.parent.childControlMoveDiv.appendChild(parent.childControlDiv);
			}
			if (parent.navigator) {
				this.navigator = parent.navigator;
				this.navigator.win.appendChild(content);
			}
		}
		this.childControlDiv.setAttribute("class", "slider");
		this.childControlDiv.style.left =
			(window.innerWidth - thumbnailWidth + gap) / 2 + "px";
		this.childControlDiv.style.top = -(this.level + 1) * thumbnailHeight + "px";
		this.resize();
	}
	updateDiv() {
		this.childDiv.style.left = -window.innerWidth * this.childPosition + "px";
	}
	forEach(f = function (el = new NavNode()) { }) {
		f(this);
		this.children.forEach(child => child.forEach(f));
	}
	/**@param {SlideNavigator} navigator */
	setNavigator(navigator) {
		if (!navigator)
			return;
		this.forEach(el => {
			el.navigator = navigator;
			el.resize();
			el.navigator.win.appendChild(el.content);
		});
	}
	/**
	 * 
	 * @param {NavNode} p -potential parent
	 * @returns {boolean} whether this node has p as parent f any degree
	 */
	hasParent(p) {
		if (p == null)
			return true;
		for (var potentialP = this.parent; potentialP; potentialP = potentialP.parent) {
			if (potentialP == p)
				return true;
		}
		return false;
	}
	/**@returns {boolean} */
	isSelectedByParent() {
		if (this.parent)
			return this.parent.isSelectedByParent() && this.parent.childPosition == this.positionFromParent;
		return true;
	}
	/**
	 * @param {NavNode} newNode 
	 * @param {number=} index 
	 */
	addChildNode(newNode, index = 0) {
		newNode.parent = this;
		newNode.setNavigator(this.navigator);
		newNode.positionFromParent = index;
		newNode.forEach(node => {
			node.level = node.parent.level + 1;
			node.childControlDiv.style.top = -(node.level + 1) * thumbnailHeight + "px";
		});
		this.numOfChildren++;
		this.children.splice(index, 0, newNode);
		for (var i in this.children) {
			var c = this.children[i];
			c.positionFromParent = parseInt(i);
			c.thumbnail.style.left = c.positionFromParent * thumbnailWidth + "px";
		}
		this.childControlDiv.style.width = this.children.length * thumbnailWidth + "px";
		newNode.thumbnail.style.left = newNode.positionFromParent * thumbnailWidth + "px";
		this.childControlDiv.appendChild(newNode.thumbnail);
	}
	removeChildNode(index = 0) {
		this.numOfChildren--;
		var toRemove = this.children[index];
		toRemove.parent = null;
		this.children.splice(index, 1);
		for (let i in this.children) {
			var c = this.children[i];
			c.positionFromParent = parseInt(i);
			c.thumbnail.style.left = c.positionFromParent * thumbnailWidth + "px";
		}
		this.childControlDiv.style.width = this.children.length * thumbnailWidth + "px";
		this.childControlDiv.removeChild(toRemove.thumbnail);
		toRemove.forEach(el => el.content.parentNode.removeChild(el.content));
	}
	/**
	 * 
	 * @param {NavNode} newNode 
	 * @param {number} index 
	 */
	replaceChildNode(newNode, index) {
		var toRemove = this.children[index];
		toRemove.parent = null;
		this.children.splice(index, 1);
		this.childControlDiv.removeChild(toRemove.thumbnail);

		newNode.parent = this;
		newNode.positionFromParent = index;
		newNode.setNavigator(this.navigator);
		newNode.forEach(node => {
			node.level = node.parent.level + 1;
			node.childControlDiv.style.top = -(node.level + 1) * thumbnailHeight + "px";
		});
		this.children.splice(index, 0, newNode);
		newNode.positionFromParent = index;
		newNode.thumbnail.style.left = newNode.positionFromParent * thumbnailWidth + "px";
		this.childControlDiv.appendChild(newNode.thumbnail);
		toRemove.forEach(el => el.content.parentNode.removeChild(el.content));
	}
}

/**
 * @param {SlideNavigator} navigator
 * @returns {NavNode}
 */
function getOpenElement(navigator) {
	if (navigator) {
		el = navigator.root;
	} else {
		el = root;
	}
	while (el.level < navigator.currentOpenDepth) {
		el = el.children[el.childPosition];
	}
	return el;
}
function getSurroundingElements(el = new NavNode(), maxWay = 3) {
	if (maxWay <= 0) {
		return new Set([el]);
	}
	var newSets = [];
	if (el.parent) {
		newSets.push(getSurroundingElements(el.parent, maxWay - 1));
		if (isValidIndex(el.positionFromParent + 1, el.parent.children)) {
			var rightChild = el.parent.children[el.positionFromParent + 1];
			newSets.push(getSurroundingElements(rightChild, maxWay - 1));
		}
		if (isValidIndex(el.positionFromParent - 1, el.parent.children)) {
			var leftChild = el.parent.children[el.positionFromParent - 1];
			newSets.push(getSurroundingElements(leftChild, maxWay - 1));
		}
	}
	el.children.forEach(child => {
		newSets.push(getSurroundingElements(child, maxWay - 1));
	});
	var toReturn = new Set([el]);
	for (var set of newSets) {
		set.forEach(el => toReturn.add(el));
	}
	return toReturn;
}