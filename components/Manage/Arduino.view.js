import React, {Component} from 'react';
import {View} from 'react-native';
import Appbar from '../Appbar';


class ArduinoView extends Component {
    static navigationOptions = {
        header: null,
    };
    constructor(props) {
        super(props);
        this.state = {
        loading: false,
        };
    }

    componentDidMount() {

    }

    render() {
        return (
        <View
            style={{
            backgroundColor: 'white',
            height: '100%',
            }}>

            <Appbar show_back_button={true} text={"Arduino Management"} navigation={this.props.navigation}/>

            <View>

            </View>

        </View>
        );
    }
}

export default ArduinoView;
