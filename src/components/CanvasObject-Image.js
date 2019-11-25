import * as color from "string-to-color";

const selectionZones = {
    OUT: "Out Of Shape",
    MOVE_SHAPE: "Moving Zone",
    RESIZE_SHAPE: "Resizing Zone",
};
const editionStates = {
    NULL: "Not Editing",
    RESIZING_TOP_LEFT: "Resizing Image Corner Top Left",
    RESIZING_TOP_RIGHT: "Resizing Image Corner Top Left",
    RESIZING_BOTTOM_LEFT: "Resizing Image Corner Top Left",
    RESIZING_BOTTOM_RIGHT: "Resizing Image Corner Top Left",
    MOVING: "Moving",
};

const generateCanvasObjectImage = function(
    ctx,
    refX,
    refY,
    refW,
    refH,
    srcURI,
    id,
    owner,
    creationOptions = {}
) {
    const ObjectImage = {
        type: "image",
        id,
        name: `image-${id}`,
        owner,

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

        X: creationOptions.X || (refX + refW) / 2,
        Y: creationOptions.Y || (refY + refH) / 2,
        W: creationOptions.W || 300,
        H: creationOptions.H || 300,

        isLocked: creationOptions.isLocked || false,
        lockedBy: creationOptions.lockedBy || "",
        previousState: {
            X: creationOptions.X || (refX + refW) / 2,
            Y: creationOptions.Y || (refY + refH) / 2,
            W: creationOptions.W || 50,
            H: creationOptions.H || 50,
        },
        editionState: null, // null | "Resizing" | "Moving" | ...
        oldDragX: null,
        oldDragY: null,

        refreshArea: function(x1, y1, x2, y2) {
            this.ctx.save();

            this.ctx.drawImage(
                this.src,
                0,
                0,
                this.srcW,
                this.srcH,
                this.X,
                this.Y,
                this.W,
                this.H
            );

            if (this.isLocked) {
                const margin = 15;

                // Dashed selection rectangle
                this.ctx.beginPath();
                this.ctx.strokeStyle = color(this.lockedBy);
                this.ctx.lineWidth = 5;
                this.ctx.setLineDash([8, 8]);
                this.ctx.rect(
                    this.X - margin,
                    this.Y - margin,
                    this.W + 2 * margin,
                    this.H + 2 * margin
                );
                this.ctx.stroke();

                // NorthWest Corner
                this.ctx.strokeStyle = color(this.lockedBy);
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.arc(
                    this.X - margin,
                    this.Y - margin,
                    10,
                    0,
                    2 * Math.PI
                );
                this.ctx.stroke();
                this.ctx.fillStyle = color(this.lockedBy);
                this.ctx.fill();

                // SouthEast Corner
                this.ctx.beginPath();
                this.ctx.arc(
                    this.X + this.W + margin,
                    this.Y + this.H + margin,
                    10,
                    0,
                    2 * Math.PI
                );
                this.ctx.stroke();
                this.ctx.fillStyle = color(this.lockedBy);
                this.ctx.fill();
            }

            this.ctx.restore();
        },

        applyModifications: function(payload) {
            const keys = Object.keys(this.previousState);
            for (let i = 0; i < keys.length; i++) {
                if (payload.hasOwnProperty(keys[i])) {
                    const newValue = isNaN(this.previousState[keys[i]])
                        ? payload[keys[i]]
                        : Number(payload[keys[i]]);
                    this[keys[i]] = newValue;
                    this.previousState[keys[i]] = newValue;
                }
            }
        },

        onMouseDown: function(x, y, myPseudo) {
            const zone = this._computeCorrespondingZone(x, y);
            if (!this.isLocked && zone !== selectionZones.OUT) {
                return true;
            } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_SHAPE) {
                this.editionState = editionStates.MOVING;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            } else if (this.lockedBy === myPseudo && zone === selectionZones.RESIZE_SHAPE) {
                this.editionState = editionStates.RESIZING;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            }
            return false;
        },

        onMouseHover: function(x, y, myPseudo) {
            const zone = this._computeCorrespondingZone(x, y);
            if (!this.isLocked && zone !== selectionZones.OUT) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), pointer";
                return true;
            } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_SHAPE) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), move";
                return true;
            } else if (this.lockedBy === myPseudo && zone === selectionZones.RESIZE_SHAPE) {
                const elementToChange = document.getElementsByTagName("body")[0];
                elementToChange.style.cursor = "url('cursor url with protocol'), grab";
                return true;
            }
            return false;
        },

        onMouseDrag: function(x, y, myPseudo) {
            if (this.lockedBy === myPseudo && this.editionState === editionStates.RESIZING) {
                const oldDist = Math.sqrt(
                    (this.oldDragX - this.X) * (this.oldDragX - this.X) +
                        (this.oldDragY - this.Y) * (this.oldDragY - this.Y)
                );
                const newDist = Math.sqrt(
                    (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y)
                );
                this.radius += newDist - oldDist;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            } else if (this.lockedBy === myPseudo && this.editionState === editionStates.MOVING) {
                this.X += x - this.oldDragX;
                this.Y += y - this.oldDragY;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            }
            return false;
        },

        onMouseUp: function(x, y, myPseudo) {
            this.editionState = editionStates.NULL;
            this.oldDragX = null;
            this.oldDragY = null;
            const result = {modifications: {}, shouldUnlock: false};
            const keys = Object.keys(this.previousState);
            for (let i = 0; i < keys.length; i++) {
                if (this.previousState[keys[i]] !== this[keys[i]]) {
                    result.modifications[keys[i]] = this[keys[i]].toString();
                    this.previousState[keys[i]] = this[keys[i]];
                }
            }

            const zone = this._computeCorrespondingZone(x, y);
            if (this.lockedBy === myPseudo && zone === selectionZones.OUT) {
                result.shouldUnlock = true;
            }
            return result;
        },

        _computeCorrespondingZone: function(x, y) {
            const marginSquareCorners = 10 * 10;
            const minSquareDistanceToCorner = Math.min(
                (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y),
                (x - this.X - this.W) * (x - this.X - this.W) + (y - this.Y) * (y - this.Y),
                (x - this.X) * (x - this.X) + (y - this.Y - this.H) * (y - this.Y - this.H),
                (x - this.X - this.W) * (x - this.X - this.W) +
                    (y - this.Y - this.H) * (y - this.Y - this.H)
            );
            if (minSquareDistanceToCorner < marginSquareCorners) {
                return selectionZones.RESIZE_SHAPE;
            }

            const margin = 10;
            const verticalAlign = this.X - margin < x && x < this.X + this.W + margin;
            const horizontalAlign = this.Y - margin < y && y < this.Y + this.H + margin;
            if (verticalAlign && horizontalAlign) {
                return selectionZones.MOVE_SHAPE;
            }

            return selectionZones.OUT;
        },
    };

    const img = new Image();
    img.onload = function() {
        ObjectImage.src = this;
        ObjectImage.srcW = this.width;
        ObjectImage.srcH = this.height;
        if (this.width > this.height) {
            ObjectImage.W = ObjectImage.H / (this.height / this.width);
        } else {
            ObjectImage.H = ObjectImage.W * (this.height / this.width);
        }
        ObjectImage.refreshArea(
            ObjectImage.X,
            ObjectImage.Y,
            ObjectImage.X + ObjectImage.W,
            ObjectImage.Y + ObjectImage.H
        );
    };
    img.src = srcURI;
    return ObjectImage;
};

export default generateCanvasObjectImage;
