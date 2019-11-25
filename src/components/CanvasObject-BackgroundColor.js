const generateCanvasObjectBackgroundColor = function(ctx, refX, refY, refW, refH, color) {
    const Background = {
        type: "background-color",

        ctx: ctx,
        refX: refX,
        refY: refY,
        refW: refW,
        refH: refH,

        color: color,

        refreshArea: function(x1, y1, x2, y2) {
            this.ctx.save();
            this.ctx.fillStyle = this.color;
            this.ctx.rect(x1, y1, x2, y2);
            this.ctx.fill();
            this.ctx.restore();
        },
    };
    return Background;
};

export default generateCanvasObjectBackgroundColor;
