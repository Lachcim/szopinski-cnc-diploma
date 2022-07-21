import { ERRORS, STROKE_TYPES } from "renderer/cnc/config";

export default class FeedbackPacket {
    constructor(data) {
        this.data = data;
    }

    validate() {
        //all fields take exactly 22 bytes
        if (this.data.length != 22)
            return false;

        //busy field is a boolean
        if (this.data[0] > 1)
            return false;

        //error must be mapped
        if (ERRORS[this.data[2]] === undefined)
            return false;

        //stroke types must be mapped
        if (STROKE_TYPES[this.data[10]] === undefined)
            return false;

        return true;
    }

    parse() {
        const parseInt16 = (pos) => this.data[pos] | this.data[pos + 1] << 8;

        //parse raw bytes into machine state object
        const machineState = {
            busy: Boolean(this.data[0]),
            commandParity: Boolean(this.data[1]),
            error: ERRORS[this.data[2]],
            position: {
                x: parseInt16(3),
                y: parseInt16(5),
                z: parseInt16(7)
            },
            bufferSpace: this.data[9]
        };

        //parse stroke interpretation
        const getStrokeData = () => {
            const strokeType = STROKE_TYPES[String.fromCharCode(this.data[10])];

            //command doesn't trigger stroke
            if (!strokeType)
                return null;

            //parse start and end points
            const stroke = {
                type: strokeType,
                from: {
                    x: parseInt16(11),
                    y: parseInt16(13)
                },
                to: {
                    x: parseInt16(15),
                    y: parseInt16(17)
                }
            };

            //for arcs, parse center point
            if (strokeType == "arc") {
                stroke.center = {
                    x: parseInt16(19),
                    y: parseInt16(21)
                };
            }

            return stroke;
        };

        return {
            ...machineState,
            stroke: getStrokeData()
        };
    }
}
