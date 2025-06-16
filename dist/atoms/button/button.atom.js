"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonAtom = void 0;
const react_native_1 = require("react-native");
const ButtonAtom = ({ testID }) => {
    return (<react_native_1.View testID={`${testID}-atom`} className="w-10 h-10 bg-purple-400"/>);
};
exports.ButtonAtom = ButtonAtom;
