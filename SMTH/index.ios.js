import { AppRegistry } from 'react-native';

import './init.js';
import './js/config/Board.js';
import SMTHStackNavigator from './js/page/base/SMTHStackNavigator';

AppRegistry.registerComponent('SMTH', () => SMTHStackNavigator);