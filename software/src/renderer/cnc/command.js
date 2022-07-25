export default class Command {
    constructor(text) {
        this.text = text;
        this.status = "unsent";
        this.stroke = null;
        this.error = null;
    }

    markSent() {
        this.status = "sent";
    }
    markExecuting(packet) {
        this.status = "executing";

        //failed commands have no stroke interpretation
        if (packet.error) {
            this.error = packet.error;
            return;
        }

        //all strokes have a type, an origin and a destination
        this.stroke = {
            type: packet.strokeType,
            origin: {
                x: packet.originX,
                y: packet.originY,
                z: packet.originZ
            },
            destination: {
                x: packet.destinationX,
                y: packet.destinationY,
                z: packet.destinationZ
            }
        };

        //arcs have a center
        if (packet.strokeType == "arc" || packet.strokeType == "ccwArc")
            this.stroke.center = {
                x: packet.centerX,
                y: packet.centerY,
                z: packet.centerZ
            };
    }
    markExecuted() {
        this.status = "executed";
    }
}
