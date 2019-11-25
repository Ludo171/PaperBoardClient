const generateCanvasObjectBackgroundImage = function(ctx, refX, refY, refW, refH, srcURI) {
    return new Promise((resolve) => {
        const Background = {
            type: "background-image",

            ctx: ctx,
            refX: refX,
            refY: refY,
            refW: refW,
            refH: refH,

            src: null,
            srcX: 0,
            srcY: 0,
            srcW: 0,
            srcH: 0,

            refreshArea: function(x1, y1, x2, y2) {
                this.ctx.save();

                this.ctx.drawImage(
                    this.src,
                    this.srcX,
                    this.srcY,
                    this.srcW,
                    this.srcH,
                    this.refX,
                    this.refY,
                    this.refW,
                    this.refH
                );

                this.ctx.restore();
            },
        };
        const img = new Image();
        img.onload = function() {
            Background.src = this;
            const imageProp = this.height / this.width;
            const canvasProp = Background.refH / Background.refW;
            if (imageProp > canvasProp) {
                Background.srcW = this.width;
                Background.srcH = this.height * canvasProp;
                Background.srcX = 0;
                Background.srcY = (this.height - Background.srcH) / 2;
            } else {
                Background.srcH = this.height;
                Background.srcW = this.width / canvasProp;
                Background.srcX = (this.width - Background.srcW) / 2;
                Background.srcY = 0;
            }
            resolve(Background);
        };
        img.src = srcURI;
    });
};

export default generateCanvasObjectBackgroundImage;
