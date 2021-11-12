import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {TabRouter} from 'react-navigation';
import Appbar from '../Appbar';
import MainTextField from '../SubComponents/MainTextField';

var configjson = require('../../config.json');

let token = '';
class ManageView extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      infos: [],
      rfid: '',
      arduino: '',
      rfidError: '',
      arduinoError: '',
      isEditable: true,
    };
  }

  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    try {
      token = await AsyncStorage.getItem('token');
      this.getInfos();
    } catch (e) {
      console.log('ERROR:', e);
      this.setState({loading: false});
    }
  };

  getInfos() {
    const url = configjson.base_url + 'arduino_postman/rfid_manage.php';

    this.setState({loading: true});
    console.log('TOKEN: ', token);
    const headers = {
      token: token,
    };

    fetch(url, {
      method: 'GET',
      headers: headers,
    }).then(response => {
      console.log('RES GETINFOS: ', response);
      if (response.status >= 300) {
        Alert.alert('NO INFOS');
        this.setState({loading: false});

        return;
      }

      response.json().then(res => {
        console.log('RES: ', res);
        let obj = {infos: res, loading: false};
        if (res.length > 0) {
          obj.isEditable = false;
          obj.rfid = res[0].rfid_id;
        }

        this.setState(obj);
      });
    });
  }

  modifyItem(item) {
    this.postData(item.rfid_id, item.arduino_id, item.id, item.access_state);
  }

  postData(rfid_id, arduino, id, access_state) {
    //this.rfidField.state.value == '' || this.arduinoField.state.value == '';
    if (
      !id &&
      (this.rfidField.state.value == '' || this.arduinoField.state.value == '')
    ) {
      let obj = {};
      if (this.rfidField.state.value == '')
        obj.rfidError = 'This Area is Required!';
      if (this.arduinoField.state.value == '')
        obj.arduinoError = 'This Area is Required!';

      this.setState(obj);
      return;
    }

    let formData = new FormData();
    formData.append('rfid_id', rfid_id);
    formData.append('arduino_id', arduino);

    if (id) {
      formData.append('id', id); //STRING
      formData.append('access_state', access_state ? '0' : '1'); //BOOL
    }

    const url = configjson.base_url + 'arduino_postman/rfid_manage.php';

    this.setState({loading: true});

    const headers = {
      token: token,
    };

    console.log('formData: ', formData);
    console.log('headers: ', headers);

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: headers,
    }).then(response => {
      console.log('RES POST: ', response);
      this.getInfos();
      if (response.status >= 300) {
        switch (response.status) {
          case 409:
            Alert.alert('ERROR:', 'The given Arduino ID is already present!');
            break;
        }
        return;
      }
    });
  }

  postRequestRFID(rfid_id) {
    let formData = new FormData();
    formData.append('rfid_id', rfid_id);

    const url = configjson.base_url + 'arduino_postman/rfid_change.php';

    this.setState({loading: true});

    const headers = {
      token: token,
    };

    console.log('formData: ', formData);
    console.log('headers: ', headers);

    fetch(url, {
      method: 'POST',
      body: formData,
      headers: headers,
    }).then(response => {
      console.log('RES POST: ', response);
      Alert.alert('RFID', 'Changed');
      /*
      if (response.status >= 300) {
        switch (response.status) {
          case 409:
            Alert.alert('ERROR:', 'The given Arduino ID is already present!');
            break;
        }
        
        return;
      }
      */
    });
  }
  render() {
    return (
      <View
        style={{
          backgroundColor: 'white',
          height: '100%',
        }}>
        <Appbar
          show_back_button={true}
          text={'Manage'}
          navigation={this.props.navigation}
          addButton
        />
        <ScrollView>
          {this.state.infos.length > 0 && (
            <View
              style={{
                width: '90%',
                marginLeft: 15,
                marginTop: 15,
                marginBottom: 50,
                borderBottomWidth: 2,
                borderColor: '#e2e2e2',
                paddingBottom: 10,
              }}>
              <Text
                style={{
                  paddingLeft: 10,
                  fontSize: 15,
                  fontWeight: 'bold',
                  borderBottomWidth: 1,
                  borderColor: '#e2e2e2',
                  borderRadius: 15,
                }}>
                My RFID ID: {this.state.infos[0].rfid_id}
              </Text>
              {this.state.infos[0].admin_user == 0 ? (
                <TouchableOpacity
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    alignSelf: 'flex-start',
                  }}
                  onPress={() =>
                    this.postRequestRFID(this.state.infos[0].rfid_id)
                  }>
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingTop: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: '#3E8DF6',
                    }}>
                    Send request to change RFID
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => this.props.navigation.navigate('RFID')}>
                  <Text
                    style={{
                      paddingLeft: 10,
                      paddingTop: 5,
                      fontSize: 13,
                      fontWeight: 'bold',
                      color: '#3E8DF6',
                    }}>
                    Manage all Users
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View
            style={{
              borderWidth: 2,
              borderRadius: 20,
              margin: 10,
              paddingTop: 20,
              borderColor: '#CDF1EB',
              borderStyle: 'dashed',
              marginBottom: 50,
            }}>
            {this.state.infos.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    alignItems: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    width: '90%',
                    height: 50,
                    marginBottom: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderWidth: 2,
                    borderColor: '#f2f2f2',
                    borderEndColor: '#black',
                    borderRadius: 15,
                    backgroundColor: '#FFFDFC',
                  }}
                  onPress={() => {
                    this.props.navigation.navigate('Home');
                  }}>
                  <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {index + 1}. ARDUINO ID: {item.arduino_id}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      this.modifyItem(item);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      style={{
                        width: 40,
                        height: 40,
                        marginRight: 15,
                      }}
                      resizeMode="contain"
                      source={
                        item.access_state
                          ? require('../../resources/toggle_on.png')
                          : require('../../resources/toggle_off.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
          <View
            style={{
              alignSelf: 'center',
              width: '95%',
              borderTopWidth: 2,
              borderColor: '#e2e2e2',
            }}>
            <MainTextField
              ref={c => (this.rfidField = c)}
              value={this.state.rfid}
              error={this.state.rfidError}
              label={'RFID'}
              autoCapitalize="none"
              onFocus={() => {
                this.setState({rfidError: ''});
              }}
              editable={this.state.isEditable}
            />
            <MainTextField
              ref={c => (this.arduinoField = c)}
              value={this.state.arduino}
              error={this.state.arduinoError}
              label={'Arduino ID'}
              autoCapitalize="none"
              onFocus={() => {
                this.setState({arduinoError: ''});
              }}
            />
            <TouchableOpacity
              style={{
                borderRadius: 20,
                width: '90%',
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() =>
                this.postData(
                  this.rfidField.state.value,
                  this.arduinoField.state.value,
                )
              }>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  color: 'black',
                  fontWeight: 'bold',
                  color: '#19A6EC',
                }}>
                ADD NEW
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default ManageView;
