import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

export default class LogoutModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleButton = logout => {
    this.props.handleAnswer(logout);
  };

  render() {
    return (
      <Modal isVisible={this.props.is_visible}>
        <View
          style={{
            background: 'transparent',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginHorizontal: 15,
              backgroundColor: 'white',
              borderRadius: 10,
              width: '95%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                fontSize: 16,
                paddingHorizontal: 30,
                paddingVertical: 10,
                marginTop: 10,
                fontWeight: 'bold',
                width: '90%',
              }}>
              {'Are you sure you want to log out?'}
            </Text>

            <View
              style={{
                height: 0.5,
                width: '100%',
                backgroundColor: '#d8d8d8',
                marginTop: 20,
                marginBottom: 0,
              }}></View>

            <View
              style={{
                marginBottom: 0,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  height: 50,
                  width: '49%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.handleButton(true)}>
                <Text style={[{color: '#fa3c4b', fontWeight: 'bold'}]}>
                  {'Yes'}
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  height: '80%',
                  width: 0.5,
                  backgroundColor: '#d8d8d8',
                }}></View>

              <TouchableOpacity
                style={{
                  height: 50,
                  width: '49%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.handleButton(false)}>
                <Text style={[{color: 'black'}]}>{'No'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
