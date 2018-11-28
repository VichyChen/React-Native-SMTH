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
    Dimensions
} from 'react-native';

import {
    NetworkManager,
    NavigatorTitleButton,
    BoardItems,
    ToastUtil,
    Screen,
    ReactNavigation
} from '../config/Common';

import { NewSearchArticleScreen } from './NewSearchArticleScreen';
import { NewSearchBoardScreen } from './NewSearchBoardScreen';
import { NewSearchAccountScreen } from './NewSearchAccountScreen';

export default class NewSearchScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerLeft: null,
        header: navigation.state.params.header ? navigation.state.params.header : (
            <View style={styles.header} >
                <View style={styles.headerContainer} >
                    <TextInput
                        style={styles.textInput}
                        placeholder={'输入关键字'}
                        clearButtonMode={'while-editing'}
                        returnKeyType={'search'}
                    />
                </View>
                <NavigatorTitleButton
                    color={global.colors.whiteColor}
                    fontSize={16}
                    onPressClick={() => {
                        navigation.goBack();
                    }}
                    title='取消' />
            </View>
        ),
    });

    constructor(props) {
        super(props);
        this.state = {
            viewLoading: false,
            loadingType: 'background',
            screenText: null
        }
    }

    componentDidMount() {
        this.setHeader();
    }

    setHeader() {
        this.props.navigation.setParams({
            header: (
                <View style={styles.header}>
                    <View style={styles.headerContainer} >
                        <TextInput
                            style={styles.textInput}
                            placeholder={'输入关键字'}
                            clearButtonMode={'while-editing'}
                            onChangeText={(text) => { this.setState({ keyword: text }); }}
                            value={this.state.keyword}
                            returnKeyType={'search'}
                            autoCapitalize={'none'}
                            onSubmitEditing={(event) => {
                                this.setState({
                                    viewLoading: true,
                                    loadingType: 'background',
                                    screenText: null
                                });
                                this.net_QueryBoard(event.nativeEvent.text);
                            }}
                        />
                    </View>
                    <NavigatorTitleButton
                        color={global.colors.whiteColor}
                        fontSize={16}
                        onPressClick={() => {
                            this.props.navigation.goBack();
                        }}
                        title='取消' />
                </View>
            ),
        })
    }

    net_QueryBoard(query) {
        NetworkManager.net_QueryBoard(query, (result) => {
            for (var i = 0; i < result['boards'].length; i++) {
                result['boards'][i].key = i;
            }
            this.setState({
                dataArray: result['boards'],
                viewLoading: false,
                screenText: result['boards'].length == 0 ? '没有找到任何板块' : null
            });
            this.refs.flatList.scrollToOffset({ offset: 0, animated: true })
        }, (error) => {
            this.setState({
                viewLoading: false,
                screenText: error
            });
        }, (errorMessage) => {
            this.setState({
                viewLoading: false,
                screenText: errorMessage + '，请点击重试'
            });
        });
    }

    _renderItem = ({ item }) => {
        return (
            <BoardItems
                text={item.name + ' / ' + item.id}
                type={item.type == 'board' ? '版面' : '目录'}
                onPress={() => {
                    if (item.type == 'board') {
                        ReactNavigation.navigate(this.props.navigation, 'boardListScreen', { id: item.id, text: item.name })
                    } else {
                        ReactNavigation.navigate(this.props.navigation, 'boardScreen', { id: item.id, text: item.name })
                    }
                }}
            />
        )
    };

    render() {
        return (
            <View style={styles.container}>

                <NavigationBar />

                <TabPageView
                    titles={['文章', '版面', '用户']}
                    pages={[
                        (<NewSearchArticleScreen navigation={this.props.navigation} />),
                        (<NewSearchBoardScreen navigation={this.props.navigation} />),
                        (<NewSearchAccountScreen navigation={this.props.navigation} />),
                    ]}
                />
            </View>
        )
    }
}

var styles = {
    get flatList() {
        return {
            height: Dimensions.get('window').height - 64,
        }
    },

    get container() {
        return {
            backgroundColor: 'red'
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
    get header() {
        return {
            backgroundColor: global.colors.themeColor,
            height: 64,
            flexDirection: 'row',
            paddingTop: 20,
        }
    },
    get headerContainer() {
        return {
            backgroundColor: global.colors.whiteColor,
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 13,
            marginRight: 5,
            paddingLeft: 10,
            height: 28,
            width: Dimensions.get('window').width - 26 - 44,
            borderRadius: 3,
        }
    },
    get textInput() {
        return {
            backgroundColor: global.colors.clearColor,
            width: Dimensions.get('window').width - 26 - 44 - 10,
            height: 28,
            fontSize: global.configures.fontSize17,
            color: global.colors.fontColor,
        }
    },
}
