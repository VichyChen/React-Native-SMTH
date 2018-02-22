import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    // Picker,
    Animated,
    Dimensions,
    Modal
} from 'react-native';

import Color from '../config/Color'
import HorizontalSeperatorLine from '../component/HorizontalSeperatorLine'
import {
    Button,
    BackgroundMaskView
} from '../config/Common';

import PickerView from 'antd-mobile/lib/picker-view';

var height = 250;
var pickerHeight = 200;

export default class PickerSelectView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            translateY: new Animated.Value(0),
        }
    }

    render() {
        var array = new Array();
        for (var i = 0; i < this.props.array.length; i++) {
            array[i] = { value: this.props.array[i].toString(), label: this.props.array[i].toString() };
        }

        Animated.timing(this.state.translateY, {
            toValue: (this.props.hidden ? 0 : -height),
            duration: 250
        }).start();

        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={!this.props.hidden}
                onRequestClose={() => { console.log("Modal has been closed.") }}
            >
                <BackgroundMaskView
                    height={Dimensions.get('window').height}
                    onPress={this.props.onCancelClick}
                    hidden={this.props.hidden}
                />

                <Animated.View style={[styles.background, {
                    transform: [{ translateY: this.state.translateY }],
                    zIndex: 999,
                }]}>
                    <View style={styles.buttonRow} >
                        <Button onPress={this.props.onCancelClick} text='取消' />

                        <Button onPress={() => {
                            this.props.onCompleteClick(this.state.selectedValue == null ? this.props.selectedValue.toString() : this.state.selectedValue.toString());
                        }} text='完成' />
                    </View>

                    <HorizontalSeperatorLine />

                    <PickerView
                        data={array}
                        cols={1}
                        value={[this.props.selectedValue.toString()]}
                        onChange={(value) => {
                            this.setState({ selectedValue: value.toString() });
                            this.props.onValueChange(value.toString());
                        }}
                        visible={true} >
                    </PickerView>

                </Animated.View>
            </Modal>
        )
    }
}

var styles = {
    get modal() {
        return {
            backgroundColor: 'black',
            // alpha: 0.4,
        }
    },
    get background() {
        return {
            backgroundColor: global.colors.whiteColor,
            height: height,
            width: Dimensions.get('window').width,
            position: 'absolute',
            top: Dimensions.get('window').height,
        }
    },
    get buttonRow() {
        return {
            marginLeft: 13,
            marginRight: 13,
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        }
    },
    get picker() {
        return {
            marginTop: 0,
            height: pickerHeight,
        }
    },
}
