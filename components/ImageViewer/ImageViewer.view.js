import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';

class ImageViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%'}}>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}></Text>
        <Text style={{fontSize: 15, fontWeight: 'bold'}}></Text>
        <Image
          style={{width: '100%', height: '100%'}}
          source={{uri: this.props.navigation.state.params.url}}
          resizeMode="contain"
        />
      </View>
    );
  }
}

export default ImageViewer;
