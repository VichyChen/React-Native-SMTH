import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    Image,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';

import HorizontalSeperatorLine from '../component/HorizontalSeperatorLine'
import {
    Button,
    ImageButton
} from '../config/Common';

export default class ThreadDetailBottomBarView extends Component {
    render() {
        return (
            <View style={styles.background}>
                <HorizontalSeperatorLine />
                <View style={styles.container} >
                    <Button
                        onPress={this.props.onPreviousClick}
                        text='上一页'
                        disabled={this.props.currentPage == 1 ? true : false} />
                    <Button
                        style={styles.select}
                        onPress={this.props.onSelectClick}
                        text={this.props.currentPage + '/' + this.props.totalPage} />
                    <Button
                        onPress={this.props.onNextClick}
                        text='下一页'
                        disabled={this.props.currentPage == this.props.totalPage ? true : false} />
                </View>
                <ImageButton
                    style={styles.imageButton}
                    color={global.colors.themeColor}
                    width={40}
                    height={40}
                    margin={18}
                    source={global.images.icon_edit}
                    onPress={this.props.onReplyClick} />
            </View >
        )
    }
}

var styles = {
    get background() {
        return {
            backgroundColor: global.colors.whiteColor,
            height: 40 + global.constants.BottomSaveArea,
        }
    },
    get container() {
        return {
            height: 39,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }
    },
    get select() {
        return {
            marginLeft: 10,
            marginRight: 10,
            paddingLeft: 10,
            paddingRight: 10,
        }
    },
    get imageButton() {
        return {
            position: 'absolute',
            top: 0,
            right: 5,
        }
    }
}
