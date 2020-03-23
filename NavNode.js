class NavNode {
  resize() {
    this.content.style.width = window.innerWidth - gap + "px";
    this.content.style.height =
      window.innerHeight - gap + "px";
    this.childControlDiv.style.left =
      (gap + (window.innerWidth - thumbnailWidth) / 2) + "px";
    this.children.forEach(child => child.resize());
  }
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
    win.appendChild(content);
    this.thumbnail = thumbnail;
    this.thumbnail.navNode = this;
    this.children = [];
    this.childDiv = document.createElement("div");
    this.childDiv.style.position = "absolute";
    this.childControlDiv = document.createElement("div");
    this.childControlDiv.style.height = thumbnailHeight + "px";
    //this.childControlDiv.style.position="absolute";
    //this.childControlDiv=document.createElement("div");
    this.childControlMoveDiv = document.createElement("div");
    this.positionFromParent = 0;
    if (parent) {
      this.positionFromParent = parent.children.length;
      //thumbnail.current=this;
      parent.children.push(this);
      this.childControlDiv.style.left =
        this.parent.positionFromParent * window.innerWidth + "px";
      if (this.thumbnail.style) {
        this.thumbnail.style.position = "absolute";
        this.thumbnail.style.width = thumbnailWidth - gap + "px";
        this.thumbnail.style.height = thumbnailHeight - gap + "px";
        this.thumbnail.style.left =
          this.positionFromParent * thumbnailWidth + "px";
      }
      this.parent.childControlDiv.appendChild(this.thumbnail);
      this.parent.childControlDiv.style.width =
        this.parent.children.length * thumbnailWidth + "px";
      this.level = parent.level + 1;
      thumbnail.style.backgroundColor = "rgba(176, 232, 183, 0.3)";
      thumbnail.style.backdropFilter = "blur(5px)";
      thumbnail.style.userSelect = "none";
      var st = this.content.style;
      st.position = "absolute";
      st.left =
        window.innerWidth * (parent.children.length - 1) + gap / 2 + "px";
      //this.parent.childDiv.appendChild(this.content);
      if (parent.parent) {
        parent.parent.childControlMoveDiv.appendChild(parent.childControlDiv);
      }
    }
    this.childControlDiv.setAttribute("class", "slider");
    this.childControlDiv.style.left =
      (window.innerWidth - thumbnailWidth) / 2 + "px";
    this.childControlDiv.style.top = -(this.level + 1) * thumbnailHeight + "px";
    //this.childControlDiv.style.width=this.children.length*thumbnailHeight+"px";
  }
  updateDiv() {
    this.childDiv.style.left = -window.innerWidth * this.childPosition + "px";
  }
}

function getOpenElement() {
  el = root;
  while (el.level < currentOpenDepth) {
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