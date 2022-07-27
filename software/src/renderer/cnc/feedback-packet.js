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
            return this.data.length == 7;

        //command feedback size check
        if (this.data.length != 23)
            return false;

        //finished field is a boolean
        if (this.data[2] > 1)
            return false;

        //error must be mapped
        if (ERRORS[this.data[3]] === undefined)
            return false;

        //stroke types must be mapped
        if (STROKE_TYPES[String.fromCharCode(this.data[4])] === undefined)
            return false;

        return true;
    }

    parse() {
        const rawType = String.fromCharCode(this.data[0]);
        const parseInt16 = (pos) => this.data[pos] | this.data[pos + 1] << 8;

        //arrange packet data into flat structure
        if (rawType == "p") {
            return {
                type: "position",
                machineX: parseInt16(1),
                machineY: parseInt16(3),
                machineZ: parseInt16(5)
            };
        }
        return {
            type: "command",
            bufferSpace: this.data[1],
            finished: Boolean(this.data[2]),
            error: ERRORS[this.data[3]],
            strokeType: STROKE_TYPES[String.fromCharCode(this.data[4])],
            originX: parseInt16(5),
            originY: parseInt16(7),
            originZ: parseInt16(9),
            destinationX: parseInt16(11),
            destinationY: parseInt16(13),
            destinationZ: parseInt16(15),
            centerX: parseInt16(17),
            centerY: parseInt16(19),
            centerZ: parseInt16(21)
        };
    }
}
