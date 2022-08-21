import { WORKSPACE_WIDTH_MM, WORKSPACE_HEIGHT_MM } from "renderer/cnc/config";

export async function traceBitmap(file) {
    //construct image from file
    const fileUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = fileUrl;
    await image.decode();
    URL.revokeObjectURL(fileUrl);

    //calculate dimensions of processing canvas
    const aspectRatio = WORKSPACE_WIDTH_MM / WORKSPACE_HEIGHT_MM;
    const width = Math.max(image.width, aspectRatio * image.height);
    const height = Math.max(image.height, image.width / aspectRatio);

    //construct canvas and populate it with image data
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    context.drawImage(image,
        (width - image.width) / 2,
        (height - image.height) / 2);

    //obtain ImageData object for processing
    const data = context.getImageData(0, 0, width, height);

    //quantize image to black and white pixels
    quantize(data);

    //generate a list of continuous segments
    const segments = [];
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            const index = y * (width * 4) + x * 4;

            if (data.data[index] == 0)
                tracePath(data, index, segments);
        }

    context.putImageData(data, 0, 0);
    return canvas;
}

function quantize({ data }) {
    for (let i = 0; i < data.length; i += 4) {
        const black = data[i] < 128 && data[i + 1] < 128 && data[i + 2] < 128;
        const quantized = black ? 0 : 255;

        data[i] = quantized;
        data[i + 1] = quantized;
        data[i + 2] = quantized;
        data[i + 3] = 255; //remove transparency
    }
}

function tracePath({ data, width }, startIndex, segments) {
    const segment = [];
    let index = startIndex;
    let preferredDirection = null;
    let distance = 10;

    //mark pixel as segment entry point
    data[index + 2] = 255;

    while (index != null) {
        //include node in current segment
        segment.push(index);

        //calculate index of each neighbor
        const yOffset = width * 4;
        const neighborIndices = [
            index - yOffset,
            index + 4,
            index + yOffset,
            index - 4,
            index - yOffset + 4,
            index + yOffset + 4,
            index + yOffset - 4,
            index - yOffset - 4
        ];

        //find next node to explore
        let nextNeighbor = null;
        let nextNeighborDirection = null;
        neighborIndices.forEach((neighborIndex, direction) => {
            //skip invalid indices
            if (neighborIndex < 0 || neighborIndex >= data.length)
                return;

            //skip explored neighbors
            if (data[neighborIndex] != 0)
                return;

            //choose neighbor with the preferred direction, if present
            if (nextNeighbor == null || direction == preferredDirection) {
                nextNeighbor = neighborIndex;
                nextNeighborDirection = direction;
            }
        });

        //mark node as explored and move to next neighbor
        data[index] = distance;
        distance += 10; if (distance > 255) distance = 255;
        index = nextNeighbor;
        preferredDirection = nextNeighborDirection;
    }

    segments.push(segment);
}
