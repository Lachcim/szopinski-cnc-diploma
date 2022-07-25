import { ERRORS, STROKE_TYPES } from "renderer/cnc/config";

export default class FeedbackPacket {
    constructor(data) {
        this.data = data;
    }

    validate() {
        //must contain packet type
        if (this.data.length == 0)
            return false;

        //must be valid type
        const packetType = String.fromCharCode(this.data[0]);
        if (packetType != "t" && packetType != "c")
            return false;

        //timed feedback requires no validation beyond size check
        if (packetType == "t")
            return this.data.size == 8;

        //command feedback size check
        if (this.data.length != 22)
            return false;

        //finished field is a boolean
        if (this.data[1] > 1)
            return false;

        //error must be mapped
        if (ERRORS[this.data[2]] === undefined)
            return false;

        //stroke types must be mapped
        if (STROKE_TYPES[this.data[3]] === undefined)
            return false;

        return true;
    }

    parse() {
        const rawType = String.fromCharCode(this.data[0]);
        const parseInt16 = (pos) => this.data[pos] | this.data[pos + 1] << 8;

        //arrange timed feedback packet data into flat structure
        if (rawType == "t") {
            return {
                type: "timed",
                machineX: parseInt16(1),
                machineY: parseInt16(3),
                machineZ: parseInt16(5),
                bufferSpace: this.data[7]
            };
        }

        //command feedback
        return {
            type: "command",
            finished: Boolean(this.data[1]),
            error: ERRORS[this.data[2]],
            strokeType: STROKE_TYPES[this.data[3]],
            originX: parseInt16(4),
            originY: parseInt16(6),
            originZ: parseInt16(8),
            destinationX: parseInt16(10),
            destinationY: parseInt16(12),
            destinationZ: parseInt16(14),
            centerX: parseInt16(16),
            centerY: parseInt16(18),
            centerZ: parseInt16(20)
        };
    }
}
