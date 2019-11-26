import * as color from "string-to-color";

const selectionZones = {
    OUT: "Out Of Shape",
    WRITE: "Writing Zone",
    MOVE_SHAPE: "Moving Zone",
};
const editionStates = {
    NULL: "Not Editing",
    WRITING: "Writing",
    MOVING: "Moving",
};
const NULL_POINT = 0;

const generateCanvasObjectHandwriting = function(
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
        const ObjectHandwriting = {
            type: "handwriting",
            id,
            name: `handwriting-${id}`,
            owner,

            ctx: ctx,
            refX: refX,
            refY: refY,
            refW: refW,
            refH: refH,

            X: creationOptions.X || (refX + refW) / 2,
            Y: creationOptions.Y || (refY + refH) / 2,
            pathX: creationOptions.pathX || [],
            pathY: creationOptions.pathY || [],
            lineWidth: creationOptions.lineWidth || 10,
            lineColor: creationOptions.lineColor || "red",
            maxPathX: NULL_POINT,
            maxPathY: NULL_POINT,
            minPathX: NULL_POINT,
            minPathY: NULL_POINT,

            isLocked: creationOptions.isLocked || false,
            lockedBy: creationOptions.lockedBy || "",
            previousState: {
                X: creationOptions.X || (refX + refW) / 2,
                Y: creationOptions.Y || (refY + refH) / 2,
                pathX: creationOptions.pathX || [],
                pathY: creationOptions.pathY || [],
                lineWidth: creationOptions.lineWidth || 10,
                lineColor: creationOptions.lineColor || "red",
            },

            editionState: null, // null | "Resizing" | "Moving" | ...
            oldDragX: null,
            oldDragY: null,
            oldPathXLenght: 0,
            oldPathYLenght: 0,

            refreshArea: function(x1, y1, x2, y2) {
                this.ctx.save();

                this.ctx.lineWidth = this.lineWidth;
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.beginPath();

                this.ctx.lineJoin = "round";
                let i = 0;
                while (i < this.pathX.length - 2) {
                    if (this.pathX[i] !== NULL_POINT && this.pathY[i] !== NULL_POINT) {
                        if (this.pathX[i + 1] !== NULL_POINT && this.pathY[i + 1] !== NULL_POINT) {
                            this.ctx.moveTo(this.X + this.pathX[i], this.Y + this.pathY[i]);
                            this.ctx.lineTo(this.X + this.pathX[i + 1], this.Y + this.pathY[i + 1]);
                            this.ctx.closePath();
                        } else {
                            this.ctx.moveTo(this.X + this.pathX[i], this.Y + this.pathY[i]);
                            this.ctx.lineTo(this.X + this.pathX[i] + 1, this.Y + this.pathY[i]);
                            this.ctx.closePath();
                        }
                    }
                    i += 1;
                }
                this.ctx.stroke();

                if (this.isLocked || this.pathX.length === 0) {
                    const margin = 100;
                    const moveCircleRadius = 20;

                    // Dashed selection rectangle
                    this.ctx.beginPath();
                    this.ctx.lineJoin = "miter";
                    this.ctx.strokeStyle = this.isLocked ? color(this.lockedBy) : "grey";
                    this.ctx.lineWidth = this.isLocked ? 15 : 2;
                    this.ctx.setLineDash([8, 8]);
                    const minX = this.minPathX === Number.POSITIVE_INFINITY ? 0 : this.minPathX;
                    const minY = this.minPathY === Number.POSITIVE_INFINITY ? 0 : this.minPathY;
                    const maxX = this.maxPathX === Number.NEGATIVE_INFINITY ? 0 : this.maxPathX;
                    const maxY = this.maxPathY === Number.NEGATIVE_INFINITY ? 0 : this.maxPathY;
                    console.log(`minX:${minX} minY:${minY} maxX:${maxX} maxY:${maxY}`);
                    this.ctx.rect(
                        this.X + minX - margin,
                        this.Y + minY - margin,
                        maxX - minX + 2 * margin,
                        maxY - minY + 2 * margin
                    );
                    this.ctx.stroke();

                    if (this.isLocked) {
                        this.ctx.arc(
                            this.X + minX - margin,
                            this.Y + minY - margin,
                            moveCircleRadius,
                            0,
                            2 * Math.PI
                        );
                        this.ctx.stroke();
                    }
                }

                this.ctx.restore();
            },

            applyModifications: function(payload) {
                console.log("Apply Modif Hand Writing");
                console.log(payload);
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
                } else if (this.lockedBy === myPseudo && zone === selectionZones.WRITE) {
                    this.editionState = editionStates.WRITING;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                }
                return false;
            },

            onMouseHover: function(x, y, myPseudo) {
                const zone = this._computeCorrespondingZone(x, y);
                if (!this.isLocked && zone !== selectionZones.OUT) {
                    console.log("IN SHAPE !!");
                    const elementToChange = document.getElementsByTagName("body")[0];
                    elementToChange.style.cursor = "url('cursor url with protocol'), pointer";
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.MOVE_SHAPE) {
                    console.log(selectionZones.MOVE_SHAPE);
                    const elementToChange = document.getElementsByTagName("body")[0];
                    elementToChange.style.cursor = "url('cursor url with protocol'), move";
                    return true;
                } else if (this.lockedBy === myPseudo && zone === selectionZones.WRITE) {
                    console.log(selectionZones.WRITE);
                    const elementToChange = document.getElementsByTagName("body")[0];
                    elementToChange.style.cursor = "url('cursor url with protocol'), crosshair";
                    return true;
                }
                return false;
            },

            onMouseDrag: function(x, y, myPseudo) {
                if (this.lockedBy === myPseudo && this.editionState === editionStates.MOVING) {
                    this.X += x - this.oldDragX;
                    this.Y += y - this.oldDragY;
                    this.oldDragX = x;
                    this.oldDragY = y;
                    return true;
                } else if (
                    this.lockedBy === myPseudo &&
                    this.editionState === editionStates.WRITING
                ) {
                    this.pathX.push(x - this.X);
                    this.pathY.push(y - this.Y);
                    if (x - this.X > this.maxPathX) {
                        this.maxPathX = x - this.X;
                    } else if (x - this.X < this.minPathX) {
                        this.minPathX = x - this.X;
                    }
                    if (y - this.Y > this.maxPathY) {
                        this.maxPathY = y - this.Y;
                    } else if (y - this.Y < this.minPathY) {
                        this.minPathY = y - this.Y;
                    }
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
                if (
                    this.oldPathXLenght !== this.pathX.length ||
                    this.oldPathYLenght !== this.pathY.length
                ) {
                    result.modifications.pathX = this.pathX;
                    result.modifications.pathY = this.pathY;
                    this.oldPathXLength = this.pathX.length;
                    this.oldPathYLength = this.pathY.length;
                }
                const zone = this._computeCorrespondingZone(x, y);
                if (this.lockedBy === myPseudo && zone === selectionZones.OUT) {
                    result.shouldUnlock = true;
                } else if (this.lockedBy) {
                    this.pathX.push(NULL_POINT);
                    this.pathY.push(NULL_POINT);
                }
                return result;
            },

            _computeCorrespondingZone: function(x, y) {
                const margin = 100;
                const moveCircleRadius = 20;

                const minX = this.minPathX === Number.POSITIVE_INFINITY ? 0 : this.minPathX;
                const minY = this.minPathY === Number.POSITIVE_INFINITY ? 0 : this.minPathY;
                const maxX = this.maxPathX === Number.NEGATIVE_INFINITY ? 0 : this.maxPathX;
                const maxY = this.maxPathY === Number.NEGATIVE_INFINITY ? 0 : this.maxPathY;

                const squareDistanceToTopLeft =
                    (x - this.X - minX + margin) * (x - this.X - minX + margin) +
                    (y - this.Y - minY + margin) * (y - this.Y - minY + margin);
                if (squareDistanceToTopLeft < moveCircleRadius * moveCircleRadius) {
                    return selectionZones.MOVE_SHAPE;
                }

                const verticalAlign = this.X + minX - margin < x && x < this.X + maxX + margin;
                const horizontalAlign = this.Y + minY - margin < y && y < this.Y + maxY + margin;
                if (verticalAlign && horizontalAlign) {
                    return selectionZones.WRITE;
                }

                return selectionZones.OUT;
            },
        };

        ObjectHandwriting.minPathX =
            ObjectHandwriting.pathX.length > 0
                ? Math.min(...ObjectHandwriting.pathX)
                : Number.POSITIVE_INFINITY;
        ObjectHandwriting.minPathY =
            ObjectHandwriting.pathY.length > 0
                ? Math.min(...ObjectHandwriting.pathY)
                : Number.POSITIVE_INFINITY;
        ObjectHandwriting.maxPathX =
            ObjectHandwriting.pathX.length > 0
                ? Math.max(...ObjectHandwriting.pathX)
                : Number.NEGATIVE_INFINITY;
        ObjectHandwriting.maxPathY =
            ObjectHandwriting.pathY.length > 0
                ? Math.max(...ObjectHandwriting.pathY)
                : Number.NEGATIVE_INFINITY;
        console.log(ObjectHandwriting)
        resolve(ObjectHandwriting);
    });
};

export default generateCanvasObjectHandwriting;
