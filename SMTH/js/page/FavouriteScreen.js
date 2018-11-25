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
  Dimensions,
  TouchableWithoutFeedback,
  DeviceEventEmitter
} from 'react-native';

import {
  NetworkManager,
  SeperatorLine,
  CellBackground,
  NavigatorTitleButton,
  ImageButton,
  LoadingView,
  Screen,
  ToastUtil
} from '../config/Common';

var _dataArray;

export default class FavouriteScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: '收藏',
    headerRight: navigation.state.params ? navigation.state.params.headerRight : null
  });

  constructor(props) {
    super(props);
    this.state = {
      pullLoading: false,
      viewLoading: true,
      loadingType: 'background',
      screenText: null,
      isDeleting: false,
      editing: false,
      dataArray: [],
      title: '编辑',
    }

    this.refreshViewNotification = DeviceEventEmitter.addListener('RefreshViewNotification', () => {
      this.setState({});
    });

    this.net_LoadFavorites();
  }

  componentDidMount() {
    this.setBarItemButton('编辑');
  }

  componentWillUnmount() {
    this.refreshViewNotification.remove();
  }

  setBarItemButton(title) {
    this.props.navigation.setParams({
      headerRight: (
        <NavigatorTitleButton
          color={global.colors.whiteColor}
          fontSize={16}
          title={title}
          onPressClick={() => {
            if (title == '编辑') {
              this.setBarItemButton('完成');

              this.setState({
                dataArray: _dataArray,
                editing: true
              });

            } else {
              this.setBarItemButton('编辑');

              this.setState({
                dataArray: _dataArray,
                editing: false
              });
            }
          }}
        />
      )
    })
  }

  net_LoadFavorites() {
    NetworkManager.net_LoadFavorites(0, (result) => {
      for (var i = 0; i < result['favorites'].length; i++) {
        result['favorites'][i].key = i;
      }
      _dataArray = result['favorites'];
      this.setState({
        dataArray: _dataArray,
        pullLoading: false,
        viewLoading: false,
        screenText: null
      });
    }, (error) => {
      if (this.state.viewLoading == true) {
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: error
        });
      }
      else {
        ToastUtil.info(error.message);
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }
    }, (errorMessage) => {
      if (this.state.viewLoading == true) {
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: errorMessage + '，请点击重试'
        });
      }
      else {
        ToastUtil.info(errorMessage);
        this.setState({
          pullLoading: false,
          viewLoading: false,
          screenText: null
        });
      }
    });
  }

  net_DelFav(item) {
    this.setState({
      isDeleting: true,
      loadingType: 'clear',
    });
    NetworkManager.net_DelFav(item.id, (result) => {
      _dataArray.splice(item.key, 1);
      this.setState({
        dataArray: _dataArray,
        isDeleting: false,
      });
    }, (error) => {
      ToastUtil.info(error.message);
      this.setState({
        isDeleting: false,
      });
    }, (errorMessage) => {
      ToastUtil.info(errorMessage);
      this.setState({
        isDeleting: false,
      });
    });
  }

  _renderItem = ({ item }) => {
    return (
      <CellBackground
        onPress={() => {
          if (this.state.editing == true) {

          }
          else {
            this.props.navigation.navigate('boardListScreen', { id: item.id, text: item.name })
          }
        }}
      >
        <View style={styles.container}>
          <View style={styles.content}>
            {this.state.editing == true ?
              <ImageButton
                style={styles.deleteButton}
                width={44}
                height={44}
                margin={24}
                onPress={() => {
                  this.net_DelFav(item);
                }}
                source={global.images.icon_minus} /> : null}
            <Text style={styles.board}>{item.name}</Text>
          </View>
          {this.state.editing == true ? null : <Image style={styles.arrow} source={global.images.icon_forward_arrow} />}
          <SeperatorLine />
        </View>
      </CellBackground>
    )
  };

  render() {
    return (
      <Screen
        showLoading={this.state.viewLoading || this.state.isDeleting}
        loadingType={this.state.loadingType}
        text={this.state.screenText}
        onPress={() => {
          this.setState({
            viewLoading: true,
            loadingType: 'background',
            screenText: null
          });
          this.net_LoadFavorites();
        }}
      >
        <FlatList
          data={this.state.dataArray}
          renderItem={this._renderItem}
          removeClippedSubviews={false}
          extraData={this.state}
          style={{
            backgroundColor: global.colors.backgroundGrayColor,
            height: global.constants.ScreenHeight - 64 - 48
          }}
          onRefresh={() => {
            this.setState({
              pullLoading: true
            });
            this.net_LoadFavorites();
          }
          }
          refreshing={this.state.pullLoading}
        />
      </Screen >
    )
  }
}

var styles = {
  get container() {
    return {
      flexDirection: 'column',
      backgroundColor: global.colors.clearColor
    }
  },
  get content() {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      backgroundColor: global.colors.whiteColor
    }
  },
  get deleteButton() {
    return {
      marginLeft: 0,
      marginRight: -13
    }
  },
  get board() {
    return {
      marginLeft: 13,
      fontSize: global.configures.fontSize17,
      color: global.colors.fontColor,
      backgroundColor: global.colors.whiteColor,
    }
  },
  get arrow() {
    return {
      position: 'absolute',
      top: 13,
      right: 13,
      width: 10,
      height: 17,
    }
  },
}
