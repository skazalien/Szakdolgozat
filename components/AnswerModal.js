import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import MainTextField from './SubComponents/MainTextField';

export default class AnswerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {URLlink: '', URLlinkError: ''};
  }

  handleButton = answer => {
    this.props.handleAnswer(answer);
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
            <MainTextField
              ref={c => (this.urlField = c)}
              value={this.state.URLlink}
              error={this.state.URLlinkError}
              label={'URL'}
              autoCapitalize="none"
              onFocus={() => {
                this.setState({URLlinkError: ''});
              }}
            />

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
                onPress={() => this.handleButton(this.urlField.state.value)}>
                <Text style={[{color: '#fa3c4b', fontWeight: 'bold'}]}>
                  {'Upload'}
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
                <Text style={[{color: 'black'}]}>{'Back'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
