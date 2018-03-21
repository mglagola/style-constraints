import React from 'react';
import { Dimensions } from 'react-native';

const bodySize = () => ({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
});

export default (WrappedComponent) => {
    return class Resizable extends React.Component {
        constructor(props) {
            super(props);
            this.state = { deviceSize: bodySize() };
        }

        onResize = () => {
            this.setState({ deviceSize: bodySize() });
        }

        componentDidMount () {
            this.onResize();
            Dimensions.addEventListener('change', this.onResize);
        }

        componentWillUnmount () {
            Dimensions.removeEventListener('change', this.props.onResize);
        }

        render () {
            const { deviceSize } = this.state;
            return <WrappedComponent deviceSize={deviceSize} {...this.props} />;
        }
    };
};
