class Command {
    constructor(text) {
        this.text = text;
        this.status = "unsent";
        this.stroke = null;
        this.error = null;
    }

    markSent() {
        this.status = "sent";
    }
    markExecuting(stroke) {
        this.status = "executing";
        this.stroke = stroke;
    }
    markExecuted() {
        this.status = "executed";
    }
}
