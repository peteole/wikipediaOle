
function updateSliders(minLevelToUpdate = 0) {
    //removeChildren(footer);
    if (footer.firstChild) {
        var c = footer.firstChild.nextSibling;
        while (c) {
            if (c.current.level >= minLevelToUpdate) {
                var next = c.nextSibling;
                footer.removeChild(c);
                c = next;
            } else {
                c = c.nextSibling;
            }
        }
    }
    var depth = 0;
    var current = root;
    for (
        var i = root;
        i.children[i.childPosition] != null;
        i = i.children[i.childPosition]
    ) {
        depth++;
        current = i;
    }
    updateElementPositions();
    currentDepth = depth;
    while (current && current.level >= minLevelToUpdate) {
        activateNode(current);
        current = current.parent;
    }
}
/**
 * 
 * @param {SlideNavigator} navigator 
 * @param {number} minLevelToUpdate 
 */
function updateSlidersNav(navigator, minLevelToUpdate = 0) {
    if (navigator.footer.firstChild) {
        var c = navigator.footer.firstChild.nextSibling;
        while (c) {
            if (c.current.level >= minLevelToUpdate) {
                var next = c.nextSibling;
                navigator.footer.removeChild(c);
                c = next;
            } else {
                c = c.nextSibling;
            }
        }
    }
    var depth = 0;
    var current = navigator.root;
    for (
        var i = root;
        i.children[i.childPosition] != null;
        i = i.children[i.childPosition]
    ) {
        depth++;
        current = i;
    }
    updateElementPositions(navigator);
    navigator.currentDepth = depth;
    while (current && current.level >= minLevelToUpdate) {
        activateNode(current, true, navigator);
        current = current.parent;
    }
}

/**
 * 
 * @param {NavNode} current 
 * @param {boolean} addSwiper 
 * @param {SlideNavigator} slideNavigator 
 */
function activateNode(current = new NavNode(), addSwiper = true, slideNavigator = null) {
    var toAdd = current.childControlDiv;
    toAdd.current = current;
    if (addSwiper) {
        if (slideNavigator) {
            slideNavigator.footer.appendChild(toAdd);
        } else {
            footer.appendChild(toAdd);
        }
    }
    if (toAdd.a) {
        //toAdd.a.moveElementWithoutTouch(new Point(-thumbnailWidth*current.childPosition,ySwipe));
        return;
    }
    var a = new SwipeElementItem(toAdd);
    a.calledOutside = false;
    toAdd.a = a;

    a.onMoveStart = function (sw) {
        /**@type {SlideNavigator} */
        var slideNavigator = sw.swipeElement.current.navigator;
        sw.lastControlYRest = slideNavigator.ySwipe;
        if (sw.swipeElement.current.level == 0) {
            sw.checkTime = window.setTimeout(handler => {
                if (sw.moveLengthSinceLastTouch < 10) {
                    sw.abortMove();
                    sw.onMoveEnd(sw);
                    //popup menu
                    let targets = document.elementsFromPoint(sw.lastEvent.clientX, sw.lastEvent.clientY);
                    /**@type {ThumbnailDiv} */
                    var target;
                    for (let t of targets) {
                        if (t.className == "thumbnail") {
                            target = t;
                        }
                    }
                    if (target && target.navNode.positionFromParent != root.numOfChildren - 1) {
                        document.body.appendChild(getPopupMenu(target.navNode));
                    } else {
                        alert("Problem!!!");
                    }
                }
            }, 500);
        }
    };
    a.onMove = (sw) => {
        //initialize aliases
        /**@type {SlideNavigator} */
        var slideNavigator = sw.swipeElement.current.navigator;
        var thumbnailWidth = slideNavigator.thumbnailWidth;
        var thumbnailHeight = slideNavigator.thumbnailHeight;
        var gap = slideNavigator.gap;
        slideNavigator.ySwipe = sw.currentY;
        var currentOpenDepth = Math.round(slideNavigator.ySwipe / thumbnailHeight);
        if (currentOpenDepth > slideNavigator.currentDepth) {
            currentOpenDepth = slideNavigator.currentDepth;
        } else if (currentOpenDepth < 0) {
            currentOpenDepth = 0;
        }
        slideNavigator.currentOpenDepth = currentOpenDepth;
        //var contentContainer = document.createElement("div");
        slider = sw.swipeElement;
        //var node=new NavNode();
        node = sw.swipeElement.current;
        contentContainer = node.childDiv;

        SwipeElementItem.moveElement(sw.currentX, 0, sw.swipeElement);
        SwipeElementItem.moveElement(0, slideNavigator.ySwipe, slideNavigator.footer);
        var selected = getOpenElement(slideNavigator);
        slideNavigator.lastEl.forEach(function (el) {
            el.thumbnail.style.transform = "initial";
            el.thumbnail.style.filter = "none";
        });
        if (selected.childControlDiv.a) {
            var currentX = selected.childControlDiv.a.currentX;
            slideNavigator.lastEl = getSurroundingElements(selected, 1);
            slideNavigator.lastEl.forEach(el => {
                var newEl = el.thumbnail;
                if (!newEl.parentNode) {
                    return;
                }
                var parentX = 0;
                if (el.parent.childControlDiv.a) {
                    parentX = el.parent.childControlDiv.a.currentX;
                }
                var d = Math.abs(el.positionFromParent * thumbnailWidth + parentX) + Math.abs((el.level - 1) * thumbnailHeight - slideNavigator.ySwipe);
                newEl.style.transform = "scale(" + (1.0 + 1.0 / (5 + d)) + ")";
                newEl.style.filter =
                    "saturate(" + 20 / (1 + (8 * d) / thumbnailWidth) + ")";
            });
        }
        var oldChildPos = node.childPosition;
        var newPos = -Math.round(sw.currentX / thumbnailWidth);
        if (newPos < 0) {
            newPos = 0;
        } else if (newPos >= sw.swipeElement.current.children.length) {
            newPos = sw.swipeElement.current.children.length - 1;
        }
        node.childPosition = newPos;
        if (oldChildPos != sw.swipeElement.current.childPosition) {
            //draw new children
            if (slideNavigator) {
                updateSlidersNav(slideNavigator, sw.swipeElement.current.level + 1);
            } else {
                console.log("Achtung!!!");
                //updateSliders(sw.swipeElement.current.level + 1);
            }
        }
        var l = slideNavigator.ySwipe / thumbnailHeight;
        /*if(l>node.level+distaneWithoutScaling&&l<=node.level+1){
                if(node.children.length>0){
                    //var dist=(sw.currentX+node.children[node.childPosition].childControlDiv.a.currentX)/thumbnailWidth+newPos;
                    var dist=(sw.currentX)/thumbnailWidth+newPos;
                    var limit=(node.level+1-ySwipe/thumbnailHeight);
                    if(dist>limit){
                        sw.moveElementWithoutTouch(new Point(-thumbnailWidth*(newPos-limit),sw.currentY),false);
                    }else if(-dist>limit){
                        sw.moveElementWithoutTouch(new Point(-thumbnailWidth*(newPos+limit),sw.currentY),false);
                    }
                }
            }*/

        /*
            if(node.level<=ySwipe/thumbnailHeight+1&&node.level>=ySwipe/thumbnailHeight){
                var parentControler=node.parent.swipeElement.current;
                parentControler.moveElementWithoutTouch(new Point())
            }*/
        updateElementPositions(slideNavigator);
    };
    a.onMoveEnd = function (sw) {
        /**@type {SlideNavigator} */
        var slideNavigator = sw.swipeElement.current.navigator;
        var thumbnailWidth = slideNavigator.thumbnailWidth;
        var thumbnailHeight = slideNavigator.thumbnailHeight;
        var gap = slideNavigator.gap;
        window.clearTimeout(sw.checkTime);
        if (
            distance(sw.initialTouchPos, sw.lastTouchPos) < 10 &&
            sw.getTimeMoving() < 200
        ) {
            console.log("click");
            var below = document.elementsFromPoint(
                sw.lastTouchPos.x,
                sw.lastTouchPos.y
            );
            /**
             * @type {SwipeElementItem}
             */
            var swipeElController;
            var swipeNode;
            for (var el of below) {
                if (el.navNode) {
                    swipeElController = el.parentElement.a;
                    swipeNode = el.navNode;
                    break;
                }
            }
            if (swipeElController) {
                swipeElController.moveElementYWithoutTouch(slideNavigator.ySwipe, false);
                swipeElController.slideToPoint(
                    new Point(
                        -swipeNode.positionFromParent * thumbnailWidth,
                        (swipeNode.level - 1) * thumbnailHeight
                    ),
                    slideTime
                ).then(() => navigator.vibrate(10));
                return;
            }
        }
        var posX = Math.round(
            -(sw.currentX + (sw.currentVX * slideTime) / 4) / thumbnailWidth
        );
        var toAdd = sw.swipeElement;
        var max = toAdd.current.children.length;
        if (posX < 0) {
            posX = 0;
        } else if (posX >= max) {
            posX = max - 1;
        }
        var posY = Math.round(sw.currentY / thumbnailHeight);
        max = slideNavigator.currentDepth;
        if (posY < 0) {
            posY = 0;
        } else if (posY >= max) {
            posY = max - 1;
        }
        slideNavigator.currentOpenDepth = posY;
        var oldTrans = toAdd.style.transitionDuration;
        toAdd.style.transitionDuration = "0.0s";
        //sw.moveElementWithoutTouch(new Point(-pos*thumbnailHeight,0));
        toAdd.current.childPosition = posX;
        if (sw.currentY < -slideNavigator.winHeight / 2) {
            sw.breakToPoint(
                new Point(-posX * thumbnailWidth, -slideNavigator.winHeight + thumbnailHeight),
                slideTime
            );
            return;
        }
        sw.breakToPoint(
            new Point(-posX * thumbnailWidth, slideNavigator.currentOpenDepth * thumbnailHeight),
            slideTime
        );
        slideNavigator.footerY = slideNavigator.currentOpenDepth * thumbnailHeight;
        toAdd.style.transitionDuration = oldTrans;

        //setTimeout(updateSliders,slideTime);
        //updateSliders();
    }.bind(this);
    a.moveElementWithoutTouch(
        new Point(-thumbnailWidth * current.childPosition, slideNavigator ? slideNavigator.ySwipe : ySwipe)
    );
}

var depthToLoad = 0;
/**
 * 
 * @param {NavNode} node - Node of concern
 * @returns {HTMLDivElement} popup
 */
function getPopupMenu(node) {
    let popup = document.createElement("div");
    popup.className = "popup";
    let headline = document.createElement("h1");
    headline.innerHTML = "Options for article \"" + node.thumbnail.innerText + "\"";
    popup.appendChild(headline);
    popup.appendChild(document.createElement("hr"));
    let closeButton = document.createElement("button");
    closeButton.innerHTML = "&#10006;";
    closeButton.className = "closeButton";
    closeButton.onclick = function (ev) {
        this.parentElement.removeChild(this);
    }.bind(popup);
    popup.appendChild(closeButton);
    let closeArticleButton = document.createElement("button");
    closeArticleButton.className = "controlButton";
    closeArticleButton.innerHTML = "close article";
    closeArticleButton.node = node;
    closeArticleButton.onclick = function (evt) {
        openPages.splice(this.node.positionFromParent, 1);
        this.node.parent.removeChildNode(this.node.positionFromParent);
        this.parentElement.parentElement.removeChild(this.parentElement);
        updateSlidersNav(slideNavigator);
        slideNavigator.onresize();
        window.history.pushState(null, "Wikipedia Ole", arrayToUrl(openPages));
    }.bind(closeArticleButton);
    popup.appendChild(closeArticleButton);
    const downloadOutput = document.createElement("progress");
    downloadOutput.value = 0;
    const depthSlider = createRangeLabeledSlider(0, 5, 1, (val) => "max url clicks: " + val, (val) => depthToLoad = val);
    const articleLimiter = createRangeLabeledSlider(1, 1000, 100, (val) => "max #downloads: " + val, (val) => {
        maxArticlesToDownload = val;
        downloadOutput.max = val;
    });
    depthSlider.className = "downloadSlider";
    articleLimiter.className = "downloadSlider";
    const downloadOptions = document.createElement("div");
    downloadOptions.appendChild(depthSlider);
    downloadOptions.appendChild(articleLimiter);
    downloadOptions.appendChild(downloadOutput);
    popup.appendChild(downloadOptions);

    let startDownloadButton = document.createElement("button");
    startDownloadButton.className = "controlButton";
    startDownloadButton.innerHTML = "start download";
    startDownloadButton.node = node;
    startDownloadButton.articleLimiter = articleLimiter;
    startDownloadButton.depthSlider = depthSlider;
    startDownloadButton.downloadOutput = downloadOutput;
    startDownloadButton.onclick = function (evt) {
        if (this.wasClicked) {
            return;
        }
        this.wasClicked = true;
        this.innerHTML = "downloading...";
        const articleName = this.node.thumbnail.innerText;
        articlesDownloaded = 0;
        articlesStartedDownloading = 0;
        this.downloadOutput.value = 0;
        downloadArticleAndLinks(articleName, depthToLoad, function (d) {
            this.downloadOutput.value = d;
        }.bind(this)).then(function () {
            this.wasClicked = false;
            this.innerHTML = "start download";
        }.bind(this)
        );
    }.bind(startDownloadButton);
    popup.appendChild(startDownloadButton);
    const selectType = document.createElement("input");
    selectType.onchange = ev => {
        var url = new URL(window.location.href);
        let openPagesCopy = urlToArray();
        openPagesCopy[node.positionFromParent].layout = selectType.value;
        url.hash = arrayToHash(openPagesCopy);
        window.location = url;
    };
    popup.appendChild(selectType);
    return popup;
}