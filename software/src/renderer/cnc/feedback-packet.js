const errorDict = [
    null,
    "bufferOverflow",
    "blockDelete",
    "malformedInput",
    "unsupportedFeature",
    "duplicateWord",
    "conflictingModal",
    "missingArgument",
    "invalidArgument"
];
const strokeTypeDict = {
    r: "rapid",
    l: "linear",
    a: "arc"
};

export default class FeedbackPacket {
    constructor(data) {
        this.data = data;
    }

    validate() {
        //all fields take exactly 10 bytes
        if (this.data.length != 10)
            return false;

        //busy field is a boolean
        if (this.data[0] > 1)
            return false;

        //error must be mapped
        if (errorDict[this.data[2]] === undefined)
            return false;

        return true;
    }

    parse() {
        const parseInt16 = (pos) => this.data[pos] | this.data[pos + 1] << 8;

        //parse raw bytes into machine state object
        return {
            busy: Boolean(this.data[0]),
            commandCounter: this.data[1],
            error: errorDict[this.data[2]],
            machinePos: {
                x: parseInt16(3),
                y: parseInt16(5),
                z: parseInt16(7)
            },
            bufferSpace: this.data[9],
            stroke: {
                type: strokeTypeDict[String.fromCharCode(this.data[10])],
                from: {
                    x: parseInt16(11),
                    y: parseInt16(13)
                },
                to: {
                    x: parseInt16(15),
                    y: parseInt16(17)
                },
                center: {
                    x: parseInt16(19),
                    y: parseInt16(21)
                }
            }
        };
    }
}
