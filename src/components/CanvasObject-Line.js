import * as color from "string-to-color";

const selectionZones = {
    OUT: "Out Of Shape",
    MOVE_SHAPE: "Moving Zone",
    MOVE_STARTPOINT: "Start Point Zone",
    MOVE_ENDPOINT: "End Point Zone"
};
const editionStates = {
    NULL: "Not Editing",
    MOVING_STARTPOINT: "Moving StartPoint",
    MOVING_ENDPOINT: "Moving EndPoint",
    MOVING_SHAPE: "Moving",
};

const generateCanvasObjectLine = function(
    ctx,
    refX,
    refY,
    refW,
    refH,
    id,
    owner,
    creationOptions = {}
) {
    const Line = {
        type: "line",
        id,
        name: `line-${id}`,
        owner,

        ctx: ctx,
        refX: refX,
        refY: refY,
        refW: refW,
        refH: refH,

        X: creationOptions.X || (refX + refW) / 2,
        Y: creationOptions.Y || (refY + refH) / 2,
        destX: creationOptions.endPointX || 100,
        destY: creationOptions.lineWidth || 80,
        lineWidth: creationOptions.lineWidth || 10,
        lineColor: creationOptions.lineColor || "red",
        lineStyle: creationOptions.lineStyle || "normal",

        isLocked: creationOptions.isLocked || false,
        lockedBy: creationOptions.lockedBy || "",
        previousState: {
            X: creationOptions.X || (refX + refW) / 2,
            Y: creationOptions.Y || (refY + refH) / 2,
            destX: creationOptions.endPointX || 100,
            destY: creationOptions.lineWidth || 80,
            lineWidth: creationOptions.lineWidth || 10,
            lineColor: creationOptions.lineColor || "red",
            lineStyle: creationOptions.lineStyle || "normal",
        },
        editionState: editionStates.NULL,
        oldDragX: null,
        oldDragY: null,

        refreshArea: function(x1, y1, x2, y2) {
            this.ctx.save();

            this.ctx.beginPath();
            this.ctx.moveTo(this.X, this.Y);
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.strokeStyle = this.lineColor;
            if (this.lineStyle === "dashed") {
                this.ctx.setLineDash([8, 8]);
            }
            this.ctx.lineTo(this.destX, this.destY);
            this.ctx.stroke();

            if (this.isLocked) {
                const margin = 15;

                // Dashed selection rectangle
                this.ctx.beginPath();
                this.ctx.strokeStyle = color(this.lockedBy);
                this.ctx.lineWidth = 5;
                this.ctx.setLineDash([8, 8]);
                this.ctx.rect(
                    Math.min(this.X, this.destX) - margin,
                    Math.min(this.Y, this.destY) - margin,
                    Math.abs(this.X - this.destX) + 2 * margin,
                    Math.abs(this.Y - this.destY) + 2 * margin
                );
                this.ctx.stroke();

                // NorthWest Corner
                this.ctx.strokeStyle = color(this.lockedBy);
                this.ctx.setLineDash([]);
                this.ctx.beginPath();
                this.ctx.arc(
                    this.X - this.radius - margin,
                    this.Y - this.radius - margin,
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
                    this.X + this.radius + margin,
                    this.Y + this.radius + margin,
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
            } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_STARTPOINT) {
                this.editionState = editionStates.MOVING_STARTPOINT;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_ENDPOINT) {
                this.editionState = editionStates.MOVING_ENDPOINT;
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
            } else if (this.lockedBy === myPseudo && (zone === selectionZones.MOVE_STARTPOINT || zone === selectionZones.MOVE_ENDPOINT)) {
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
            if (this.lockedBy === myPseudo && this.editionState === editionStates.MOVING_STARTPOINT) {
                this.X += x - this.oldDragX;
                this.Y += y - this.oldDragY;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            } else if (this.lockedBy === myPseudo && this.editionState === editionStates.MOVING_ENDPOINT) {
                this.destX += x - this.oldDragX;
                this.destY += y - this.oldDragY;
                this.oldDragX = x;
                this.oldDragY = y;
                return true;
            }
            else if (this.lockedBy === myPseudo && this.editionState === editionStates.MOVING_SHAPE) {
                this.X += x - this.oldDragX;
                this.destX += x - this.oldDragX;
                this.Y += y - this.oldDragY;
                this.destY += y - this.oldDragY;
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
            const squareDist = margin * margin;
            const squareDistStartPoint = (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y);
            if (squareDistStartPoint < squareDist) {
                return selectionZones.MOVE_STARTPOINT;
            }

            const squareDistEndPoint = (x - this.destX) * (x - this.destX) + (y - this.destY) * (y - this.destY);
            if (squareDistEndPoint < squareDist) {
                return selectionZones.MOVE_ENDPOINT;
            }

            const verticalAlign = Math.min(this.X, this.destX) < x && x < Math.max(this.X, this.destX);
            const horizontalAlign = Math.min(this.Y, this.destY) < y && y < Math.max(this.Y, this.destY);
            if (verticalAlign && horizontalAlign) {
                return selectionZones.RESIZE_SHAPE;
            }

            return selectionZones.OUT;
        },
    };
    return Line;
};

export default generateCanvasObjectLine;
