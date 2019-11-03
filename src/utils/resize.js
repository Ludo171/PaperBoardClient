const getCanvasSize = (availableHeight, availableWidth) => {
    const newHeight = (availableWidth * 9) / 16;
    const newWidth = (availableHeight * 16) / 9;
    if (newHeight < availableHeight && newWidth < availableWidth) {
        return {canvasWidth: availableWidth, canvasHeight: newHeight};
    } else if (newHeight >= availableHeight && newWidth < availableWidth) {
        return {canvasWidth: newWidth, canvasHeight: availableHeight};
    } else if (newHeight < availableHeight && newWidth >= availableWidth) {
        return {canvasWidth: availableWidth, canvasHeight: newHeight};
    } else {
        return {canvasWidth: newWidth, canvasHeight: availableHeight};
    }
};

export {getCanvasSize};
