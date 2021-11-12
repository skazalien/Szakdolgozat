import React, {Component} from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const {height, width} = Dimensions.get('window');

const isIPhoneX = () =>
  Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS
    ? (width === X_WIDTH && height === X_HEIGHT) ||
      (width === XSMAX_WIDTH && height === XSMAX_HEIGHT)
    : false;
const StatusBarHeight = Platform.select({
  ios: isIPhoneX() ? 44 : 20,
  android: StatusBar.currentHeight,
  default: 0,
});

class Appbar extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  openMenu() {
    this.props.openMenu();
  }

  render() {
    let top = StatusBarHeight * -1 - 10;
    if (StatusBarHeight == 0) {
      top = -30;
    }

    return (
      <View style={{width: '100%', marginTop: 0}}>
        <LinearGradient colors={['#B0223F', '#D8294C', '#FF2F59']}>
          <View
            style={{
              height: 54,
              marginTop: 0,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: 'transparent',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            {this.props.text ? (
              <Text
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 18,
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 12,
                  fontFamily: 'Iowan Old Style',
                }}>
                {this.props.text}
              </Text>
            ) : null}

            {this.props.show_menu ? (
              <TouchableOpacity
                style={{
                  height: 54,
                  width: 90,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.openMenu()}>
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: 'white',
                    marginRight: 36,
                  }}
                  resizeMode="contain"
                  source={require('../resources/menu-options.png')}
                />
              </TouchableOpacity>
            ) : null}

            {this.props.show_back_button ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack();
                }}
                style={{
                  width: 40,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{width: 20, height: 20}}
                  resizeMode="contain"
                  source={require('../resources/back_button.png')}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Appbar;
