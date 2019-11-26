import * as color from "string-to-color";

const selectionZones = {
    OUT: "Out Of Shape",
    MOVE_LEFT: "Move Left",
    MOVE_RIGHT: "Move Right",
    MOVE_TOP: "Move Top",
    MOVE_BOTTOM: "Move Bottom",
    MOVE_SHAPE: "Move Shape",
};
const editionStates = {
    NULL: "Not Editing",
    MOVING_LEFT: "Moving Left",
    MOVING_RIGHT: "Moving Right",
    MOVING_TOP: "Moving Top",
    MOVING_BOTTOM: "Moving Bottom",
    MOVING_SHAPE: "Moving Shape",
};

const generateCanvasObjectRectangle = function(
    ctx,
    refX,
    refY,
    refW,
    refH,
    id,
    owner,
    creationOptions = {}
) {
    return new Promise((resolve) => {
        const Rectangle = {
            type: "rectangle",
            id,
            name: `rectangle-${id}`,
            owner,

            ctx: ctx,
            refX: refX,
            refY: refY,
            refW: refW,
            refH: refH,

            X: creationOptions.X || (refX + refW) / 2,
            Y: creationOptions.Y || (refY + refH) / 2,
            width: creationOptions.width || 300,
            height: creationOptions.height || 500,
            lineWidth: creationOptions.lineWidth || 10,
            lineColor: creationOptions.lineColor || "red",
            lineStyle: creationOptions.lineStyle || "normal",
            fillColor: creationOptions.fillColor || "transparent",

            isLocked: creationOptions.isLocked || false,
            lockedBy: creationOptions.lockedBy || "",
            previousState: {
                X: creationOptions.X || (refX + refW) / 2,
                Y: creationOptions.Y || (refY + refH) / 2,
                width: creationOptions.width || 300,
                height: creationOptions.height || 500,
                lineWidth: creationOptions.lineWidth || 10,
                lineColor: creationOptions.lineColor || "red",
                lineStyle: creationOptions.lineStyle || "normal",
                fillColor: creationOptions.fillColor || "transparent",
            },
            editionState: editionStates.NULL,
            oldDragX: null,
            oldDragY: null,

            refreshArea: function(x1, y1, x2, y2) {
                this.ctx.save();

                this.ctx.lineWidth = this.lineWidth;
                this.ctx.strokeStyle = this.lineColor;
                if (this.lineStyle === "dashed") {
                    this.ctx.setLineDash([8, 8]);
                }
                this.ctx.rect(this.X, this.Y, this.width, this.height);
                this.ctx.stroke();

                if (this.fillColor !== "transparent") {
                    this.ctx.fillStyle = this.fillColor;
                    this.ctx.fill();
                }

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
                        this.width + 2 * margin,
                        this.height + 2 * margin
                    );
                    this.ctx.stroke();

                    // NorthWest Corner
                    this.ctx.strokeStyle = color(this.lockedBy);
                    this.ctx.setLineDash([]);
                    this.ctx.beginPath();
                    this.ctx.arc(this.X - margin, this.Y - margin, 10, 0, 2 * Math.PI);
                    this.ctx.stroke();
                    this.ctx.fillStyle = color(this.lockedBy);
                    this.ctx.fill();

                    // SouthEast Corner
                    this.ctx.beginPath();
                    this.ctx.arc(
                        this.X + this.width + margin,
                        this.Y + this.height + margin,
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
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_TOP) {
                    this.editionState = editionStates.MOVING_TOP;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_BOTTOM) {
                    this.editionState = editionStates.MOVING_BOTTOM;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_LEFT) {
                    this.editionState = editionStates.MOVING_LEFT;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_RIGHT) {
                    this.editionState = editionStates.MOVING_RIGHT;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_SHAPE) {
                    this.editionState = editionStates.MOVING_SHAPE;
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
                } else if (
                    this.lockedBy === myPseudo &&
                    (zone === selectionZones.MOVE_TOP ||
                        zone === selectionZones.MOVE_BOTTOM ||
                        zone === selectionZones.MOVE_LEFT ||
                        zone === selectionZones.MOVE_RIGHT)
                ) {
                    const elementToChange = document.getElementsByTagName("body")[0];
                    elementToChange.style.cursor = "url('cursor url with protocol'), grab";
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_SHAPE) {
                    const elementToChange = document.getElementsByTagName("body")[0];
                    elementToChange.style.cursor = "url('cursor url with protocol'), move";
                    return true;
                }
                return false;
            },

            onMouseDrag: function(x, y, myPseudo) {
                if (this.lockedBy === myPseudo && this.editionState === editionStates.MOVING_TOP) {
                    this.height -= y - this.oldDragY;
                    this.Y += y - this.oldDragY;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (
                    this.lockedBy === myPseudo &&
                    this.editionState === editionStates.MOVING_BOTTOM
                ) {
                    this.height += y - this.oldDragY;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (
                    this.lockedBy === myPseudo &&
                    this.editionState === editionStates.MOVING_LEFT
                ) {
                    this.width -= x - this.oldDragX;
                    this.X += x - this.oldDragX;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (
                    this.lockedBy === myPseudo &&
                    this.editionState === editionStates.MOVING_RIGHT
                ) {
                    this.width += x - this.oldDragX;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (
                    this.lockedBy === myPseudo &&
                    this.editionState === editionStates.MOVING_SHAPE
                ) {
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
                const margin = 15;

                const verticalAlignLeft = this.X - margin < x && x < this.X + margin;
                const horizontalAlignLeft = this.Y - margin < y && y < this.Y + this.width + margin;
                if (verticalAlignLeft && horizontalAlignLeft) {
                    return selectionZones.MOVE_LEFT;
                }

                const verticalAlignRight =
                    this.X + this.width - margin < x && x < this.X + this.width + margin;
                const horizontalAlignRight =
                    this.Y - margin < y && y < this.Y + this.height + margin;
                if (verticalAlignRight && horizontalAlignRight) {
                    return selectionZones.MOVE_RIGHT;
                }

                const verticalAlignTop = this.X - margin < x && x < this.X + this.width + margin;
                const horizontalAlignTop = this.Y - margin < y && y < this.Y + margin;
                if (verticalAlignTop && horizontalAlignTop) {
                    return selectionZones.MOVE_TOP;
                }

                const verticalAlignBottom = this.X - margin < x && x < this.X + this.width + margin;
                const horizontalAlignBottom =
                    this.Y + this.height - margin < y && y < this.Y + this.height + margin;
                if (verticalAlignBottom && horizontalAlignBottom) {
                    return selectionZones.MOVE_BOTTOM;
                }

                const verticalAlign = this.X < x && x < this.X + this.width;
                const horizontalAlign = this.Y < y && y < this.Y + this.height;
                if (verticalAlign && horizontalAlign) {
                    return selectionZones.MOVE_SHAPE;
                }

                return selectionZones.OUT;
            },
        };
        resolve(Rectangle);
    });
};

export default generateCanvasObjectRectangle;
