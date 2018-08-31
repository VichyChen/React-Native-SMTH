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
    Dimensions,
} from 'react-native';

import {
    NetworkManager,
    DateUtil,
    NavigatorTitleButton,
    SeperatorLine,
    SectionHeader,
    CellBackground,
    LoadingView,
    Screen,
    ToastUtil,
    AvatorImage,
    NavigationBar,
    TabPageView
} from '../config/Common';

import NewBoardListScreenExperience from './NewBoardListScreenExperience';
import NewBoardListScreenHot from './NewBoardListScreenHot';

export default class NewBoardListScreen extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            pullMoreLoading: false,
            viewLoading: true,
            screenText: null,
            isAdding: false,
            dataArray: [],
        }
    }

    render() {
        console.log('this.props.navigation.state.params.id : ' + this.props.navigation.state.params.id);
        return (
            <View style={styles.container}>

            <NavigationBar title={this.props.navigation.state.params.title} />
    
            <TabPageView
              titles={['体验', '热点']}
              pages={
                [
                (<NewBoardListScreenExperience navigation={this.props.navigation} board={this.props.navigation.state.params.id} />),
                (<NewBoardListScreenHot navigation={this.props.navigation} board={this.props.navigation.state.params.id}  />),
              ]}
            />
          </View>
        )
    }
}



var styles = {
    get container() {
        return {
            flex: 1,
            padding: 0,
            backgroundColor: global.colors.whiteColor
        }
    },
    get avator() {
        return {
            width: 40,
            height: 40,
        }
    },
    get subject() {
        return {
            paddingLeft: 13,
            paddingRight: 13,
            paddingBottom: 13,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
            backgroundColor: global.colors.whiteColor
        }
    },
    get other() {
        return {
            flexDirection: 'row',
            padding: 13,
            backgroundColor: global.colors.whiteColor
        }
    },
    get board() {
        return {
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.backgroundGrayColor,
            borderRadius: 10,
        }
    },
    get author() {
        return {
            marginLeft: 10,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
    get time() {
        return {
            marginLeft: 10,
            height: 19,
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get countView() {
        return {
            flexDirection: 'row',
            position: 'absolute',
            top: 13,
            right: 13
        }
    },
    get countImage() {
        return {
            width: 14,
            height: 14,
            marginTop: 2,
            marginRight: 3,
            tintColor: global.colors.gray2Color
        }
    },
    get count() {
        return {
            fontSize: global.configures.fontSize15,
            color: global.colors.gray2Color,
        }
    },
    get dot() {
        return {
            paddingLeft: 5,
            paddingRight: 5,
            fontSize: global.configures.fontSize14,
            color: global.colors.gray2Color,
            backgroundColor: global.colors.whiteColor
        }
    },
}
