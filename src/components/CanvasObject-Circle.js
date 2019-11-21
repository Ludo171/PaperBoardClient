const generateCanvasObjectCircle = function(ctx, refX, refY, refW, refH, id, creationOptions = {}) {
    const Circle = {
        type: "circle",
        id: id,
        name: `circle-${id}`,

        ctx: ctx,
        refX: refX,
        refY: refY,
        refW: refW,
        refH: refH,

        X: creationOptions.X || (refX + refW) / 2,
        Y: creationOptions.Y || (refY + refH) / 2,
        radius: creationOptions.radius || 50,
        lineWidth: creationOptions.lineWidth || 10,
        lineColor: creationOptions.lineColor || "red",

        isLocked: true,
        editionState: null, // null | "Resizing radius" | "Moving" | ...
        oldDragX: null,
        oldDragY: null,

        refreshArea: function(x1, y1, x2, y2) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeStyle = this.lineColor;
            this.ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI, true);
            this.ctx.stroke();
            this.ctx.restore();
        },

        resize: function(newX, newY, newRadius) {},

        onMouseDown: function(x, y) {
            const movingSquareRadius = this.radius * this.radius;
            const resizingSquareRadius =
                (this.radius + this.lineWidth + 10) * (this.radius + this.lineWidth + 10);
            const squareDistance = (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y);
            if (squareDistance < movingSquareRadius) {
                if (this.isLocked) {
                    this.editionState = "Moving";
                    this.oldDragX = x;
                    this.oldDragY = y;
                }
                return true;
            } else if (squareDistance < resizingSquareRadius) {
                if (this.isLocked) {
                    this.editionState = "Resizing radius";
                    this.oldDragX = x;
                    this.oldDragY = y;
                }
                return true;
            } else {
                return false;
            }
        },

        onMouseHover: function(x, y) {
            const movingSquareRadius = this.radius * this.radius;
            const resizingSquareRadius =
                (this.radius + this.lineWidth + 10) * (this.radius + this.lineWidth + 10);
            const squareDistance = (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y);
            if (squareDistance < movingSquareRadius) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), move";
                return true;
            } else if (squareDistance < resizingSquareRadius) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), grab";
                return true;
            } else {
                return false;
            }
        },

        onMouseDrag: function(x, y) {
            if (this.editionState === "Resizing radius") {
                const oldDist = Math.sqrt(
                    (this.oldDragX - this.X) * (this.oldDragX - this.X) +
                        (this.oldDragY - this.Y) * (this.oldDragY - this.Y)
                );
                const newDist = Math.sqrt(
                    (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y)
                );
                this.radius += newDist - oldDist;
                console.log("Resize radius !");
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            } else if (this.editionState === "Moving") {
                console.log("Move it !");
                this.X += x - this.oldDragX;
                this.Y += y - this.oldDragY;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            }
            return false;
        },

        onMouseUp: function(x, y) {
            this.editionState = null;
            this.oldDragX = null;
            this.oldDragY = null;
        },
    };
    return Circle;
};

export default generateCanvasObjectCircle;
