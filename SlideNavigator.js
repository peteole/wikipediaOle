
class SlideNavigator {
    /**
     * 
     * @param {HTMLDivElement} frame 
     * @param {NavNode} root 
     */
    constructor(frame, root) {
        this.frame=frame;
        this.win = document.createElement("div");
        this.win.style.width = "100%";
        this.win.style.position = "absolute";
        this.win.style.overflow = "hidden";
        this.win.style.left = 0 + "px";
        this.win.style.top = 0 + "px";

        this.root = root;
        this.root.setNavigator(this);
        this.slideTime = 300;
        this.distaneWithoutScaling = 1 / 10;
        this.winHeight = 0;
        this.winWidth = 0;
        this.thumbnailWidth = 70;
        this.thumbnailHeight = 60;
        this.gap = 7;
        this.lastEl = [];
        var thumbnailWidth = 70;
        var thumbnailHeight = 60;
        /**
         * @type {string[]}
         */
        this.openPages = [];
        /**
         * @type {Set<HTMLDivElement>}
         */
        this.drawnContents = new Set([]);
        this.footer = document.createElement("footer");
        this.footer.setAttribute("class", "slideFooter");
        this.footer.style.top = "100%";
        this.currentDepth = 0;
        this.currentOpenDepth = 0;
        this.ySwipe = 0;
        frame.appendChild(this.win);
        frame.appendChild(this.footer);
        updateSlidersNav(this);
        this.onresize();
    }
    onresize() {
        this.win.style.height = this.frame.clientHeight + "px";
        this.win.style.width = this.frame.clientWidth + "px";
        this.winHeight = this.frame.clientHeight;
        this.winWidth = this.frame.clientWidth;
        this.root.resize();
        window.updateElementPositions(this);
    };
}