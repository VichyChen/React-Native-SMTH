import {
    Toast
  } from '../config/Common';  

export default class ToastUtil {
    static info(message) {
        Toast.info(message, 2, null, false);        
    }

    static error(message) {
        Toast.info(message, 2, null, false);        
    }
}
