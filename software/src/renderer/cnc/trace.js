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
                segments.push(discoverSegment(data, index));
        }

    //extend segments to connect with their neighbors, reduce to lines
    extendSegments(data, segments);
    linearize(segments);

    //return graphic representation and generated g-code
    return {
        imageData: data,
        commands: generateCommands(data, segments)
    };
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

function getNeighborIndices(width, index) {
    //calculate index of each neighbor of a node
    const yOffset = width * 4;
    return [
        index - yOffset,
        index + 4,
        index + yOffset,
        index - 4,
        index - yOffset + 4,
        index + yOffset + 4,
        index + yOffset - 4,
        index - yOffset - 4
    ];
}

function discoverSegment({ data, width }, startIndex) {
    const segment = [];
    let index = startIndex;
    let preferredDirection = null;
    let distance = 10;

    //mark node as segment entry point
    data[index + 2] = 255;

    while (index != null) {
        //include node in current segment
        segment.push(index);

        //find next node to explore
        let nextNeighbor = null;
        let nextNeighborDirection = null;
        const neighborIndices = getNeighborIndices(width, index);

        neighborIndices.forEach((neighborIndex, direction) => {
            //skip invalid indices
            if (neighborIndex < 0 || neighborIndex >= data.length)
                return;

            //skip explored and white neighbors
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
        index = nextNeighbor;
        preferredDirection = nextNeighborDirection;

        //update distance from origin for debug purposes
        distance += 10;
        if (distance >= 255)
            distance = 254;
    }

    return segment;
}

function extendSegments({ data, width }, segments) {
    for (const segment of segments) {
        //single-point segment, no extrapolation
        if (segment.length == 1) {
            const neighborIndices = getNeighborIndices(width, segment[0]);

            //connect segment to any neighbor
            for (const index of neighborIndices)
                if (data[index] != 255) {
                    segment.push(index);

                    //mark node as extension
                    data[index] = 0;
                    data[index + 1] = 255;
                    break;
                }

            continue;
        }

        //linearly extrapolate extension points
        const extensionPoints = [
            {
                index: segment[0],
                extrapolation: segment[0] - (segment[1] - segment[0]),
                extend: point => segment.unshift(point)
            },
            {
                index: segment.at(-1),
                extrapolation: segment.at(-1) - (segment.at(-2) - segment.at(-1)),
                extend: point => segment.push(point)
            }
        ];

        //extend each end of the segment
        const segmentSet = new Set(segment);
        for (const extensionPoint of extensionPoints) {
            let newPoint = null;
            const neighborIndices = getNeighborIndices(width, extensionPoint.index);

            for (const neighborIndex of neighborIndices) {
                //skip invalid indices
                if (neighborIndex < 0 || neighborIndex >= data.length)
                    continue;

                //skip white neighbors
                if (data[neighborIndex] == 255)
                    continue;

                //skip neighbors belonging to the segment, allow loops
                if (segmentSet.has(neighborIndex) && neighborIndex != segment[0])
                    continue;

                //find black neighbor, prefer extrapolation
                if (!newPoint || neighborIndex == extensionPoint.extrapolation) {
                    newPoint = neighborIndex;

                    if (newPoint == extensionPoint.extrapolation)
                        break;
                }
            }

            //if extending neighbor found, add it to the segment
            if (newPoint != null) {
                extensionPoint.extend(newPoint);

                //mark node as extension
                data[newPoint] = 0;
                data[newPoint + 1] = 255;
            }
        }
    }
}

function linearize(segments) {
    for (const i in segments)
        segments[i] = segments[i].filter((element, index) => {
            //initial and final elements always pass
            if (index == 0 || index == segments.length - 1)
                return true;

            const prev = segments[i][index - 1];
            const next = segments[i][index + 1];

            //filter out if part of arithmetic progression
            return prev - element != element - next;
        });
}

function generateCommands({width, height}, segments) {
    const commands = [];
    const xScale = WORKSPACE_WIDTH_MM / width;
    const yScale = WORKSPACE_HEIGHT_MM / height;

    //rapid movement, raise tool
    commands.push("g0 z00");

    for (const segment of segments)
        segment.forEach((point, index) => {
            //translate data index to coordinates
            const x = ((point / 4) % width) * xScale;
            const y = Math.floor((point / 4) / width) * yScale;

            //move to segment point
            commands.push(`x${x.toFixed(3)} y${y.toFixed(3)}`);

            //lower or raise tool
            if (index == 0) commands.push("z0", "g1");
            if (index == segment.length - 1) commands.push("z00", "g0");
        });

    //move back home
    commands.push("x0 y0");
    return commands;
}
