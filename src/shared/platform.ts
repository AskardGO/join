import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('screen');
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';

const GLOBAL = {
  screenWidth: width,
  screenHeight: height,
  isAndroid,
  isIOS,
};
export default GLOBAL;
