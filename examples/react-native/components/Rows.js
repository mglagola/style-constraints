import React from 'react';
import { Text, View } from 'react-native';
import styleConstraints from 'style-constraints';
import onResize from '../utils/on-resize';

const Rows = ({
    deviceSize = { width: 0, height: 0 },
}) => {
    const select = styleConstraints(deviceSize);
    return (
        <View style={select(sc.container)}>
            <Text style={select(sc.text)}>Row 1</Text>
            <Text style={select(sc.text)}>Row 2</Text>
            <Text style={select(sc.text)}>Row 3</Text>
            <Text style={select(sc.text)}>Row 4</Text>
            <Text style={select([sc.text, sc.moreText])}>Row 5</Text>
            <Text style={select([sc.text, sc.moreText])}>Row 6</Text>
            <Text style={select([sc.text, sc.moreText])}>Row 7</Text>
            <Text style={select([sc.text, sc.moreText])}>Row 8</Text>
        </View>
    );
};

const sc = {
  container: [{
      when: true,
      style: {
          flex: 1,
          backgroundColor: '#aaa',
          flexDirection: 'row',
      }
  }],
  text: [{
      when: true,
      style: {
          paddingLeft: 10,
          paddingRight: 10,
          fontSize: 18,
          fontWeight: 'bold',
      },
  }, {
      when: 'gte',
      width: 400,
      style: {
          color: 'red',
      },
  }],
  moreText: [{
      when: 'lte',
      width: 400,
      style: {
          display: 'none',
      },
  }],
};

export default onResize(Rows);
