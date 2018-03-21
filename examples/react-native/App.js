import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Constants, ScreenOrientation } from 'expo';

import Rows from './components/Rows';

export default class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Rows />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
    },
});
