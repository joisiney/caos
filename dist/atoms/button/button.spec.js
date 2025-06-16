"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("@testing-library/react-native");
const button_atom_1 = require("./button.atom");
const HocButtonAtom = () => <button_atom_1.ButtonAtom testID="button-atom"/>;
describe('Atom: <ButtonAtom/>', () => {
    it('deve renderizar corretamente', () => {
        const { getByTestId } = (0, react_native_1.render)(<button_atom_1.ButtonAtom testID="button"/>);
        expect(getByTestId('button-atom')).toBeTruthy();
    });
});
