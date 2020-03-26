
function updateSliders(minLevelToUpdate = 0) {
    //removeChildren(footer);
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
    var depth = 0;
    //var current=new NavNode();
    current = root;
    for (
        var i = root;
        i.children[i.childPosition] != null;
        i = i.children[i.childPosition]
    ) {
        depth++;
        current = i;
    }
    updateElementPositions()
    //currentOpenDepth+=depth-currentDepth;
    //footer.style.transitionDuration="0s";
    //footer.z.moveElementWithoutTouch(new Point(0,-currentOpenDepth*thumbnailHeight));
    //SwipeElementItem.moveElement(0,thumbnailWidth*currentOpenDepth,footer);
    currentDepth = depth;
    while (current && current.level >= minLevelToUpdate) {
        activateNode(current);
        current = current.parent;
    }
    //updateOpenElement();
}

function activateNode(current = new NavNode(), addSwiper = true) {
    var toAdd = current.childControlDiv;
    toAdd.current = current;
    if (addSwiper) {
        footer.appendChild(toAdd);
    }
    if (toAdd.a) {
        //toAdd.a.moveElementWithoutTouch(new Point(-thumbnailWidth*current.childPosition,ySwipe));
        return;
    }
    var a = new SwipeElementItem(toAdd);
    a.calledOutside = false;
    toAdd.a = a;

    a.onMoveStart = function (sw) {
        sw.lastControlYRest = ySwipe;
    };
    a.onMove = function (sw) {
        //initialize aliases
        ySwipe = sw.currentY;
        if (ySwipe < 0) {
            //ySwipe = 0;
        }
        currentOpenDepth = Math.round(ySwipe / thumbnailHeight);
        if (currentOpenDepth > currentDepth) {
            currentOpenDepth = currentDepth;
        } else if (currentOpenDepth < 0) {
            currentOpenDepth = 0;
        }
        var slider = document.createElement("div");
        var contentContainer = document.createElement("div");
        slider = sw.swipeElement;
        //var node=new NavNode();
        node = sw.swipeElement.current;
        contentContainer = node.childDiv;

        SwipeElementItem.moveElement(sw.currentX, 0, sw.swipeElement);
        SwipeElementItem.moveElement(0, ySwipe, footer);
        var selected = getOpenElement();
        lastEl.forEach(function (el) {
            el.thumbnail.style.transform = "initial";
            el.thumbnail.style.filter = "none";
        });
        if (selected.childControlDiv.a) {
            var currentX = selected.childControlDiv.a.currentX;
            lastEl = getSurroundingElements(selected, 1);
            lastEl.forEach(el => {
                var newEl = el.thumbnail;
                if (!newEl.parentNode) {
                    return;
                }
                var parentX = 0;
                if (el.parent.childControlDiv.a) {
                    parentX = el.parent.childControlDiv.a.currentX;
                }
                var d = Math.abs(el.positionFromParent * thumbnailWidth + parentX) + Math.abs((el.level - 1) * thumbnailHeight - ySwipe);
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
            updateSliders(sw.swipeElement.current.level + 1);
        }
        var l = ySwipe / thumbnailHeight;
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
        updateElementPositions();
    }.bind(this);
    a.onMoveEnd = function (sw, p) {
        if (
            distance(sw.initialTouchPos, sw.lastTouchPos) < 10 &&
            sw.getTimeMoving() < 200
        ) {
            console.log("click");
            var below = document.elementsFromPoint(
                sw.lastTouchPos.x,
                sw.lastTouchPos.y
            );
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
                swipeElController.moveElementYWithoutTouch(ySwipe, false);
                swipeElController.slideToPoint(
                    new Point(
                        -swipeNode.positionFromParent * thumbnailWidth,
                        (swipeNode.level - 1) * thumbnailHeight
                    ),
                    slideTime
                );
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
        max = currentDepth;
        if (posY < 0) {
            posY = 0;
        } else if (posY >= max) {
            posY = max - 1;
        }
        currentOpenDepth = posY;
        var oldTrans = toAdd.style.transitionDuration;
        toAdd.style.transitionDuration = "0.0s";
        //sw.moveElementWithoutTouch(new Point(-pos*thumbnailHeight,0));
        toAdd.current.childPosition = posX;
        if(sw.currentY<-winHeight/2){
            sw.breakToPoint(
                new Point(-posX * thumbnailWidth, -winHeight+thumbnailHeight),
                slideTime
            );
            return;
        }
        sw.breakToPoint(
            new Point(-posX * thumbnailWidth, currentOpenDepth * thumbnailHeight),
            slideTime
        );
        footerY = currentOpenDepth * thumbnailHeight;
        toAdd.style.transitionDuration = oldTrans;

        //setTimeout(updateSliders,slideTime);
        //updateSliders();
    }.bind(this);
    a.moveElementWithoutTouch(
        new Point(-thumbnailWidth * current.childPosition, ySwipe)
    );
}