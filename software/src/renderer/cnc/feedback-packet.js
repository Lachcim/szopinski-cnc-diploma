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
        //parse raw bytes into machine state object
        return {
            busy: Boolean(this.data[0]),
            commandCounter: this.data[1],
            error: errorDict[this.data[2]],
            machinePos: {
                x: this.data[3] & this.data[4] << 8,
                y: this.data[5] & this.data[6] << 8,
                z: this.data[7] & this.data[8] << 8
            },
            bufferSpace: this.data[9]
        };
    }
}
