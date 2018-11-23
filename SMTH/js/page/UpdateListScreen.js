import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    Image,
    TextInput,
    ScrollView,
    ListView,
    View,
    Navigator,
    FlatList,
    SectionList,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';

import {
} from '../config/Common';
import Swiper from 'react-native-swiper';

import AsyncStorageManger from '../storage/AsyncStorageManger';

export default class UpdateListScreen extends Component {
    static navigationOptions = {
        title: '更新内容',
    };

    constructor(props) {
        super(props);
        this.state = {

        }
    }



    render() {
        return (
            <ScrollView style={styles.scrollView}>
                <Text style={styles.text}>- 1.0.0上线啦！！！</Text>
            </ScrollView>
            // <Swiper
            //     style={styles.wrapper}
            //     showsButtons={false}
            //     loop={false}>
            //     <View style={styles.slide1}>
            //         <Text style={styles.text}>Hello Swiper</Text>
            //     </View>
            //     <View style={styles.slide2}>
            //         <Text style={styles.text}>Beautiful</Text>
            //     </View>
            //     <View style={styles.slide3}>
            //         <Text style={styles.text}>And simple</Text>
            //     </View>
            // </Swiper>
        );
    }
}

var styles = {
    get scrollView() {
        return {
            padding: 13,
            backgroundColor: global.colors.whiteColor
        }
    },
    get text() {
        return {
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
}


// var styles = StyleSheet.create({
//     wrapper: {
//     },
//     slide1: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#9DD6EB',
//     },
//     slide2: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#97CAE5',
//     },
//     slide3: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#92BBD9',
//     },
//     text: {
//         color: '#fff',
//         fontSize: 30,
//         fontWeight: '600',
//     }
// })
