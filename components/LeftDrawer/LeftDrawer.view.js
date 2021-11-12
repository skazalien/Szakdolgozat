import React, {Component} from 'react';
import {Platform, Dimensions, Text, TouchableOpacity} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const IOS_APPBAR_PADDING = screenHeight / screenWidth >= 2 ? 40 : 20;
const IOS_BOTTOM_PADDING = screenHeight / screenWidth >= 2 ? 40 : 10;

class LeftDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: 'red',
          height: '100%',
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'baseline',
            height: 400,
            backgroundColor: 'red',
            paddingTop: Platform.OS === 'ios' ? IOS_APPBAR_PADDING : 0,
          }}>
          <TouchableOpacity>
            <Text>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default LeftDrawer;
