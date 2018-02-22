import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Modal
} from 'react-native';

import Color from '../config/Color'
import HorizontalSeperatorLine from '../component/HorizontalSeperatorLine'
import {
    Button,
    SectionBlankHeader,
    BackgroundMaskView
} from '../config/Common';

// var height = 212;
var height = 130;

export default class ThreadDetailFloorActionView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(-height),
            selectedValue: '1',
        }
    }

    render() {
        Animated.timing(this.state.translateY, {
            toValue: (this.props.hidden ? 0 : -height),
            duration: 300
        }).start();

        return (
            <Modal
                animationType={'fade'}
                transparent={true}
                visible={!this.props.hidden}
                onRequestClose={() => { console.log("Modal has been closed.") }}
            >
                <BackgroundMaskView
                    height={global.constants.SCREEN_HEIGHT}
                    onPress={this.props.onCancelClick}
                    hidden={this.props.hidden}
                />

                <Animated.View style={[styles.background, {
                    transform: [{ translateY: this.state.translateY }],
                    zIndex: 999,
                }
                ]}>
                    {/* <View style={styles.top}>
                    <Text style={styles.title}>操作</Text>
                </View> */}
                    <Button onPress={() => {
                        this.props.onReplyClick(this.props.floorItem);
                    }} text='回复' />
                    <HorizontalSeperatorLine />
                    {/* <Button onPress={() => {
                    this.props.onSeeOnlyClick(this.props.floorItem);
                }} text='只看此人' />
                <HorizontalSeperatorLine /> */}
                    <Button onPress={() => {
                        this.props.onReportClick(this.props.floorItem);
                    }} text='举报' />
                    <SectionBlankHeader height={10} />
                    <Button onPress={this.props.onCancelClick} text='取消' />
                </Animated.View >
            </Modal>
        )
    }
}

var styles = {
    get background() {
        return {
            backgroundColor: global.colors.backgroundGrayColor,
            height: height,
            position: 'absolute',
            width: global.constants.SCREEN_WIDTH,
            top: global.constants.SCREEN_HEIGHT,
            alignContent: 'center',
        }
    },
    // top: {
    //     backgroundColor: global.colors.whiteColor,
    //     height: 40,
    //     alignContent: 'center',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    get title() {
        return {
            fontSize: global.configures.fontSize16,
            color: global.colors.gray1Color,
        }
    },
}
