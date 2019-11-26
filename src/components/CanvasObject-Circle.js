import * as color from "string-to-color";

const selectionZones = {
    OUT: "Out Of Shape",
    MOVE_SHAPE: "Moving Zone",
    RESIZE_SHAPE: "Resizing Zone",
};
const editionStates = {
    NULL: "Not Editing",
    RESIZING: "Resizing Radius",
    MOVING: "Moving",
};

const generateCanvasObjectCircle = function(
    ctx,
    refX,
    refY,
    refW,
    refH,
    id,
    owner,
    creationOptions = {}
) {
    return new Promise( (resolve) => {
        const Circle = {
            type: "circle",
            id,
            name: `circle-${id}`,
            owner,
    
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
            lineStyle: creationOptions.lineStyle || "normal",
            fillColor: creationOptions.fillColor || "transparent",
    
            isLocked: creationOptions.isLocked || false,
            lockedBy: creationOptions.lockedBy || "",
            previousState: {
                X: creationOptions.X || (refX + refW) / 2,
                Y: creationOptions.Y || (refY + refH) / 2,
                radius: creationOptions.radius || 50,
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
    
                this.ctx.beginPath();
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.strokeStyle = this.lineColor;
                this.ctx.arc(this.X, this.Y, this.radius, 0, 2 * Math.PI, true);
                if (this.lineStyle === "dashed") {
                    this.ctx.setLineDash([8, 8]);
                }
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
                        this.X - this.radius - margin,
                        this.Y - this.radius - margin,
                        2 * (this.radius + margin),
                        2 * (this.radius + margin)
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
                const squareDistance = (x - this.X) * (x - this.X) + (y - this.Y) * (y - this.Y);
                const movingSquareRadius = this.radius * this.radius;
                if (squareDistance < movingSquareRadius) {
                    return selectionZones.MOVE_SHAPE;
                }
    
                const margin = 10;
                const resizingSquareRadius =
                    (this.radius + this.lineWidth + margin) * (this.radius + this.lineWidth + margin);
                if (squareDistance < resizingSquareRadius) {
                    return selectionZones.RESIZE_SHAPE;
                }
    
                return selectionZones.OUT;
            },
        };
        resolve(Circle);
    });
};

export default generateCanvasObjectCircle;
