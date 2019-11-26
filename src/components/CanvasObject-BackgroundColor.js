const generateCanvasObjectBackgroundColor = function(ctx, refX, refY, refW, refH, color) {
    return new Promise((resolve) => {
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
                this.ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
                this.ctx.restore();
                return;
            },
        };
        resolve(Background);
    });
};

export default generateCanvasObjectBackgroundColor;
