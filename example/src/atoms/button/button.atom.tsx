import {FC} from 'react';
import {View} from 'react-native';
import {NButtonAtom} from './button.type';

export const ButtonAtom: FC<NButtonAtom.Props> = ({testID}) => {
    return (
        <View
            testID={`${testID}-atom`}
            className="w-10 h-10 bg-purple-400"
        />
    );
};