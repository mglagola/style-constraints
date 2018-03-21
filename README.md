# Style Constraints

The goal of style constraints is to mimic some of the functionality of [css media queries](https://www.w3schools.com/css/css3_mediaqueries.asp) using javascript.

## Installation

Install both `style-constraints` and `lodash` as `lodash` is a `peerDependency`.

```
npm install --save style-constraints lodash
```

## Documentation

Coming soon.

## Usage Example

![animation](https://cl.ly/1j1E2w3p2T1F/Screen%20Recording%202018-03-21%20at%2012.22%20PM.gif)

```js
import React from 'react';
import { Text, View } from 'react-native';
import styleConstraints from 'style-constraints';

// For the sake of simplicity, omitting on-resize code.
// For examples of what on-resize.js may look like for both
// react native and react web, see: https://gist.github.com/mglagola/e4d22b3acb31ccb56642b3bf02f0e814
import onResize from './on-resize';

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

// "sc" is short for "style constraints"
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
```

## Demos

* [React Native](https://github.com/mglagola/style-constraints/tree/master/examples/react-native)
* React Web - coming soon.
