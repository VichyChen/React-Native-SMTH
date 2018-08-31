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

import cio from 'cheerio-without-node-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    SeperatorLine,
    BoardItems,
    ImageButton,
    LoadingView,
    Screen,
    ToastUtil,
    NavigationBar,
    CellBackground
} from '../config/Common';

_leftDataArray = [
    { key: '7fba65e45f678eb8c605d4107de04185', title: '社区管理' },
    { key: '4fcab28694a0be93d9297d8cede052d9', title: '国内院校' },
    { key: '3497e48bb537373d0f738b41fe53a41b', title: '休闲娱乐' },
    { key: '353fdfda1dfe7a714e592bab99c762cd', title: '五湖四海' },
    { key: 'c8d614e56acb8a192ec4af8b375a5eea', title: '游戏运动' },
    { key: '5b634fdc9ecddf6042561c959176c077', title: '社会信息' },
    { key: '1c455a5dccf4242008d188f9676e3f4e', title: '知性感性' },
    { key: '12af235486fde6684e4b9e83f5d2b779', title: '文化人文' },
    { key: '4ed7f0d8b621c8ccf9e11eca9991d6dc', title: '学术科学' },
    { key: '4dda79c64b3ffb61f8048d745292ff5d', title: '电脑技术' },
];

_rightDataArray = [];

export default class NewBoardScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params == undefined ? '版块' : navigation.state.params.text}`,
        headerRight: (
            <View style={{ flexDirection: 'row' }}>
                <ImageButton
                    color={global.colors.whiteColor}
                    width={44}
                    height={44}
                    margin={22}
                    source={global.images.icon_search}
                    onPress={() => {
                        navigation.navigate('searchBoardScreen', { id: '' })
                    }} />
            </View>
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            pullLoading: false,
            viewLoading: true,
            loadingType: 'background',
            screenText: null,
            leftDataArray: _leftDataArray,
            rightDataArray: [
            ],
        }

        this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
            this.setState({});
        });

        this.getSections(_leftDataArray[0].key);
    }

    componentWillUnmount() {
        this.refreshViewNotification.remove();
    }

    getSections(section_id) {
        NetworkManager.getNewSections(section_id, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('div[class=row]').html());

            _rightDataArray = [];
            this.$('div[class=board-data-summary]').each(function (i, elem) {
                this.$ = cio.load(elem);
                this.$ = cio.load(this.$('div[class=board-data-summary-name]').html());

                _rightDataArray.push({
                    key: this.$('a').attr('href').split('/')[2],
                    title: this.$('a').text(),
                });
            });

            this.setState({
                rightDataArray: _rightDataArray,
            });

        }, (error) => {

        }, (errorMessage) => {

        });
    }

    _leftRenderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    this.getSections(item.key);
                }}
            >
                <Text>{item.title}</Text>
            </CellBackground>
        )
    };

    _rightRenderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    this.props.navigation.navigate('newBoardListScreen', { id: item.key, title: item.title });
                }}
            >
                <Text>{item.title + ' ' + item.key}</Text>
            </CellBackground>

        )
    };

    render() {
        return (
            <View style={styles.container} >

                <NavigationBar title='板块' />

                <View style={styles.view} >

                    <View style={styles.leftView} >
                        <FlatList
                            removeClippedSubviews={false}
                            extraData={this.state}
                            data={this.state.leftDataArray}
                            renderItem={this._leftRenderItem}
                        />
                    </View>

                    <View style={styles.rightView} >
                        <FlatList
                            removeClippedSubviews={false}
                            extraData={this.state}
                            data={this.state.rightDataArray}
                            renderItem={this._rightRenderItem}
                        />
                    </View>

                </View>
            </View>
        )
    }
}

var styles = {
    get container() {
        return {
            flex: 1,
            backgroundColor: global.colors.whiteColor
        }
    },
    get view() {
        return {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: global.colors.whiteColor
        }
    },
    get leftView() {
        return {
            width: 80,
            backgroundColor: global.colors.blueColor
        }
    },
    get rightView() {
        return {
            flex: 1,
            backgroundColor: 'red'
        }
    },

}
