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
        if (packetType != "p" && packetType != "c")
            return false;

        //position feedback requires no validation beyond size check
        if (packetType == "p")
            return this.data.length == 13;

        //command feedback size check
        if (this.data.length != 40)
            return false;

        //finished field is a boolean
        if (this.data[1] > 1)
            return false;

        //error must be mapped
        if (ERRORS[this.data[2]] === undefined)
            return false;

        //stroke types must be mapped
        if (STROKE_TYPES[String.fromCharCode(this.data[3])] === undefined)
            return false;

        return true;
    }

    parse() {
        const rawType = String.fromCharCode(this.data[0]);
        const parseInt32 = (pos) => this.data[pos]
            | this.data[pos + 1] << 8
            | this.data[pos + 2] << 16
            | this.data[pos + 3] << 24;

        //arrange packet data into flat structure
        if (rawType == "p") {
            return {
                type: "position",
                machineX: parseInt32(1),
                machineY: parseInt32(5),
                machineZ: parseInt32(9)
            };
        }
        return {
            type: "command",
            finished: Boolean(this.data[1]),
            error: ERRORS[this.data[2]],
            strokeType: STROKE_TYPES[String.fromCharCode(this.data[3])],
            originX: parseInt32(4),
            originY: parseInt32(8),
            originZ: parseInt32(12),
            destinationX: parseInt32(16),
            destinationY: parseInt32(20),
            destinationZ: parseInt32(24),
            centerX: parseInt32(28),
            centerY: parseInt32(32),
            centerZ: parseInt32(36)
        };
    }
}
