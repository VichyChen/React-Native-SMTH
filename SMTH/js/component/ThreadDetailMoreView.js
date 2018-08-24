import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Modal
} from 'react-native';

import HorizontalSeperatorLine from '../component/HorizontalSeperatorLine'
import {
    Button,
    SectionBlankHeader,
    BackgroundMaskView
} from '../config/Common';

// var height = 212;
var height = 204;

export default class ThreadDetailMoreView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            translateY: new Animated.Value(-height),
            selectedValue: '1',
        }
    }

    render() {
        Animated.timing(this.state.translateY, {
            toValue: (this.props.hidden ? -height : 0),
            duration: 200
        }).start();

        return (
            <Animated.View style={[styles.background, {
                transform: [{ translateY: this.state.translateY }],
                zIndex: 999,
            }
            ]}>
                {/* <SectionBlankHeader height={10} /> */}

                <Button onPress={() => {
                    this.props.onShareClick();
                }} text='分享' />

                <HorizontalSeperatorLine />

                <Button onPress={() => {
                    this.props.onCopyClick();
                }} text='复制链接' />

                <HorizontalSeperatorLine />

                <Button onPress={() => {
                    this.props.onSafariClick();
                }} text='从浏览器打开' />

                <HorizontalSeperatorLine />

                <Button onPress={() => {
                    this.props.onHistoryClick();
                }} text='查看快照' />

                <HorizontalSeperatorLine />

                <Button onPress={() => {
                    this.props.onReportClick();
                }} text='举报' />
                <HorizontalSeperatorLine />

            </Animated.View >
        )
    }
}

var styles = {
    get background() {
        return {
            backgroundColor: global.colors.backgroundGrayColor,
            height: height,
            width: global.constants.ScreenWidth,
            position: 'absolute',
            top: 0,
            alignContent: 'center',
        }
    },
    get top() {
        return {
            backgroundColor: global.colors.whiteColor,
            height: 40,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
        }
    },
    get title() {
        return {
            fontSize: global.configures.fontSize16,
            color: global.colors.gray1Color,
        }
    },
    get picker() {
        return {
            marginTop: 0,
            height: 160,
        }
    },
}
