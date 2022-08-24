export const WORKSPACE_WIDTH_MM = 206;
export const WORKSPACE_HEIGHT_MM = 230;

export const UNITS_PER_MM = 201.20724;
export const UNITS_PER_MM_Z = 1587.30158;

export const ERRORS = [
    null,
    "malformedInput",
    "unsupportedFeature",
    "duplicateWord",
    "conflictingModal",
    "missingArgument",
    "invalidArgument",
    "radiusMismatch"
];

export const ERROR_MESSAGES = {
    malformedInput: "Malformed input",
    unsupportedFeature: "Unsupported G-code",
    duplicateWord: "Duplicate word",
    conflictingModal: "Conflicting words",
    missingArgument: "Missing argument",
    invalidArgument: "Invalid argument",
    radiusMismatch: "Radius mismatch"
};

export const STROKE_TYPES = {
    x: null,
    r: "rapid",
    l: "linear",
    a: "arc",
    c: "ccwArc"
};
