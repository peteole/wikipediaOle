/**
 * 
 * @param {SlideNavigator} navigator 
 */
function updateElementPositions(navigator=null) {
    var newElements = getSurroundingElements(getOpenElement(navigator), 2);
    drawnContents.forEach(el => {
        if (!newElements.has(el)) {
            el.childDiv.style.display = "none";
        }
    });
    //newElements.forEach((el)=>{drawnContents.add(el)});
    newElements.forEach(el => updateElementPosition(el,navigator));
    drawnContents = newElements;
}

/**
 * 
 * @param {NavNode} el 
 * @param {SlideNavigator} navigator 
 */
function updateElementPosition(el = new NavNode(),navigator=null) {
    var thumbnailWidth=navigator.thumbnailWidth;
    var thumbnailHeight=navigator.thumbnailHeight;
    var gap=navigator.gap;
    if (el.parent&&!el.parent.isSelectedByParent()){
        el.children.forEach(a => a.content.style.display = "none");
        return;
    }
    var winWidth=navigator.winWidth;
    var winHeight=navigator.winHeight;
    if (!el.childControlDiv.a) {
        activateNode(el, false,navigator);
    }
    var swipeX = el.childControlDiv.a.currentX / thumbnailWidth;
    var swipeY = navigator.ySwipe / thumbnailHeight;
    var elYPos = el.level;
    var yDif = swipeY - elYPos;
    if (Math.abs(yDif) > 1) {
        el.children.forEach(el => (el.content.style.display = "none"));
        return;
    }
    //el.children.forEach((el)=>{if(!el.content.parent){win.appendChild(el.content)}});
    var leftestPoint = 0;
    if (yDif <= -1 + distaneWithoutScaling) {
        var scalingFactor = 1 / el.children.length;
        if (el.parent && el.parent.childControlDiv.a) {
            leftestPoint =
                el.parent.childControlDiv.a.currentX / thumbnailWidth +
                el.positionFromParent;
        }
        el.children.forEach(function (a) {
            var left = leftestPoint + a.positionFromParent * scalingFactor;
            if (left <= 1 && left >= -1) {
                a.content.style.display = "initial";
                a.content.style.left =
                    (gap * scalingFactor) / 2 + left * winWidth + "px";
                a.content.style.transform = "scale(" + scalingFactor + ")";
                a.content.style.top =
                    (gap * scalingFactor) / 2 +
                    (yDif + 1 - scalingFactor) * winHeight +
                    "px";
            } else {
                a.content.style.display = "none";
            }
        });
    } else if (yDif <= 0) {
        //elements getting smaller
        if (el.children.length == 0) {
            return;
        }
        var zoomFactor = 1 / el.children.length;
        var partAtTarget = yDif / (1 - distaneWithoutScaling);
        let scalingFactor = 1 - (1 - zoomFactor) * -partAtTarget;
        var xScalingFactor = scalingFactor;
        var selected = false;
        //el.childDiv.style.top=zoomFactor*yDif*win.clientHeight+"px";
        if (el.parent && el.parent.childControlDiv.a) {
            //if not root
            //el.childDiv.style.left=win.clientWidth*(swipeX*(1-1*(-yDif))+(el.positionFromParent+el.parent.childControlDiv.a.currentX/thumbnailWidth))+"px";
            var parZoomFactor = 0;
            if (isValidIndex(el.parent.childPosition, el.parent.children)) {
                parZoomFactor =
                    el.parent.children[el.parent.childPosition].children.length;
            }
            if (parZoomFactor == 0) {
                parZoomFactor = 1;
            }
            var parentZoom =
                1 +
                ((parZoomFactor - 1) * (yDif + 1 - distaneWithoutScaling)) /
                (1 - distaneWithoutScaling);
            var parentLeft =
                (el.parent.childControlDiv.a.currentX / thumbnailWidth +
                    el.positionFromParent) *
                parentZoom;
            if (el.parent.childPosition == el.positionFromParent) {
                selected = true;
                leftestPoint = swipeX * (1 + partAtTarget) + parentLeft;
            } else {
                leftestPoint = parentLeft;
                xScalingFactor = parentZoom / el.children.length;
            }
            //el.childDiv.style.left=win.clientWidth*(swipeX*(1+yDif)+parentLeft)+"px";
        } else {
            leftestPoint = swipeX * (1 - 1 * -partAtTarget);
            //el.childDiv.style.left=win.clientWidth*swipeX*(1-1*(-yDif))+"px";
        }
        if (
            leftestPoint > 1 ||
            leftestPoint < -el.children.length * scalingFactor
        ) {
            el.children.forEach(a => (a.content.style.display = "none"));
        } else {
            el.children.forEach(function (a) {
                var left = leftestPoint + a.positionFromParent * xScalingFactor;
                if (left <= 1 && left >= -xScalingFactor) {
                    a.content.style.display = "initial";
                    a.content.style.left =
                        (gap * xScalingFactor) / 2 + left * navigator.winWidth + "px";
                    a.content.style.transform = "scale(" + xScalingFactor + ")";
                    if (selected) {
                        a.content.style.top =
                            (gap * scalingFactor) / 2 +
                            (distaneWithoutScaling - 1 / el.children.length) *
                            -partAtTarget *
                            winHeight +
                            "px";
                    } else {
                        a.content.style.top =
                            (gap * scalingFactor) / 2 +
                            (distaneWithoutScaling - xScalingFactor) *
                            -partAtTarget *
                            winHeight +
                            "px";
                    }
                } else {
                    a.content.style.display = "none";
                }
            });
        }
        //el.childDiv.style.transform="scale("+scalingFactor+")";// translateY("+zoomFactor*yDif*win.clientHeight+"px)";
    } else if (yDif <= distaneWithoutScaling) {
        var leftest = swipeX;
        if (el.parent && el.parent.children[el.parent.childPosition] != el) {
            leftest = 2; //return
        }
        el.children.forEach(function (a) {
            var left = leftest + a.positionFromParent;
            if (left <= 1 && left >= -1) {
                a.content.style.display = "initial";
                a.content.style.left = gap / 2 + left * winWidth + "px";
                a.content.style.transform = "scale(" + 1 + ")";
                a.content.style.top = gap / 2 + yDif * winHeight + "px";
            } else {
                a.content.style.display = "none";
            }
        });
    } else {
        //elements getting bigger
        let zoomFactor = 0;
        let partAtTarget =
            (yDif - distaneWithoutScaling) / (1 - distaneWithoutScaling);
        if (isValidIndex(el.childPosition, el.children)) {
            zoomFactor = el.children[el.childPosition].children.length;
        }
        if (zoomFactor == 0) {
            zoomFactor = 1;
        }
        let scalingFactor = 1 + (zoomFactor - 1) * partAtTarget;
        //el.childDiv.style.top=yDif*win.clientHeight+"px";
        if (
            el.children[el.childPosition] &&
            el.children[el.childPosition].childControlDiv.a
        ) {
            var childrenSwipeControler =
                el.children[el.childPosition].childControlDiv.a;
            //var childLeft=childrenSwipeControler.currentX/thumbnailWidth*(1+yDif-1)/(1-distaneWithoutScaling);
            var childLeft =
                (childrenSwipeControler.currentX / thumbnailWidth) *
                (1 - 1 * (-(yDif - 1) / (1 - distaneWithoutScaling)));
            //el.childDiv.style.left=winWidth*(swipeX*(1+(zoomFactor-1)*yDif))+"px";
            //el.childDiv.style.left=winWidth*(swipeX*scalingFactor+childLeft)+"px";
            leftestPoint = swipeX * scalingFactor + childLeft;
        } else {
            //el.childDiv.style.left=win.clientWidth*swipeX*scalingFactor+"px";
            leftestPoint = swipeX * scalingFactor;
        }
        //el.childDiv.style.transform="scale("+scalingFactor+")";
        if (el.parent && el.parent.children[el.parent.childPosition] != el) {
            leftestPoint = 2; //return
        }

        if (
            leftestPoint > 1 ||
            leftestPoint < -el.children.length * scalingFactor
        ) {
            el.children.forEach(a => (a.content.style.display = "none"));
        } else {
            el.children.forEach(function (a) {
                var left = leftestPoint + a.positionFromParent * scalingFactor;
                if (left <= 1 && left >= -scalingFactor) {
                    a.content.style.top =
                        (gap * scalingFactor) / 2 + yDif * winHeight + "px";
                    a.content.style.display = "initial";
                    a.content.style.left =
                        (gap * scalingFactor) / 2 + left * winWidth + "px";
                    a.content.style.transform = "scale(" + scalingFactor + ")";
                } else {
                    a.content.style.display = "none";
                }
            });
        }
    }
}
