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
    AvatorImage
} from '../config/Common';

var from = 0;
var size = 20;

import cio from 'cheerio-without-node-native';

export default class NewBoardListScreenExperience extends Component {

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
        from = 0;
        
        this.getNewBoardExperience(1);
    }

    getNewBoardExperience(page) {
        NetworkManager.getNewBoardExperience(this.props.board, (result) => {
            this.$ = cio.load(result);
            this.$ = cio.load(this.$('ul[class=article-list]').html());

            var dataArray = [];
            this.$('li').each(function (i, elem) {
                this.$ = cio.load(elem);
                dataArray.push({
                    key: this.$('a[class=article-subject]').attr('href').split('/')[2],
                    avatar: this.$('a[class=article-account-avatar]').children().attr('src'),
                    name: this.$('div[class=article-account-name]').children().first().text(),
                    time: this.$('div[class=article-account-name]').children().last().text(),
                    title: this.$('a[class=article-subject]').text(),
                    content: this.$('p[class=article-brief]').text(),
                    comment: this.$('span[class*=glyphicon-comment]').parent().text(),
                    heart: this.$('span[class*=glyphicon-heart]').parent().text(),
                    picture: this.$('span[class*=glyphicon-picture]').parent().text(),
                });
            });

            this.setState({
                dataArray: dataArray,
            });

        }, (error) => {
         
        }, (errorMessage) => {
            
        });
    }

    _renderItem = ({ item }) => {
        return (
            <CellBackground
                onPress={() => {
                    this.props.navigation.navigate('newThreadDetailScreen', { id: item.key });
                }}
            >
                <View style={styles.container}>
                <Text >{item.title}</Text>

                    {/* <View style={{ flexDirection: 'row', padding: 13 }}>
                        <AvatorImage
                            style={styles.avator}
                            borderRadius={20}
                            widthAndHeight={40}
                            onPressClick={() => {
                                this.props.navigation.navigate('userScreen', { id: item.author_id });
                            }}
                            uri={NetworkManager.net_getFace(item.author_id)} />
                        <View style={{ height: 42 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: 24 }}>
                                <Text style={styles.author}>{item.author_id}</Text>
                            </View>
                            <Text style={styles.time}>
                                {DateUtil.formatTimeStamp(item.time) + '     ' + item.count + '回复'}
                            </Text>
                        </View>
                    </View>
                    <Text style={[styles.subject, {
                        color: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'red' : global.colors.fontColor,
                        fontWeight: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'bold' : 'normal'
                    }]}>{item.subject}</Text>

                    {/* <Text style={[styles.subject, {
                        color: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'red' : global.colors.fontColor,
                        fontWeight: item.flags.toUpperCase() == 'DNN D' ||
                            item.flags.toUpperCase() == 'DNY D' ||
                            item.flags.toUpperCase() == 'DNN@D' ? 'bold' : 'normal'
                    }]}>{item.subject + '(' + item.count + ')'}</Text>
                    <View style={styles.other}>
                        <Text style={styles.author}>{item.author_id}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.time}>{DateUtil.formatTimeStamp(item.time)}</Text>
                    </View> */} 

                    <SeperatorLine />
                </View>
            </CellBackground>
        )
    };

    render() {
        return (
            <View style={styles.container}>

                <FlatList
                    removeClippedSubviews={false}
                    extraData={this.state}
                    data={this.state.dataArray}
                    renderItem={this._renderItem}
                />

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
