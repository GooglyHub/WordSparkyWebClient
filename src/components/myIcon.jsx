import React, { Component } from 'react';
import Icon from '@mdi/react';
import { mdiChessBishop } from '@mdi/js';

class MyIcon extends Component {
    render() {
        const {
            name,
            size = 1,
            backgroundColor = '#000',
            scaleFactor = 1,
        } = this.props;
        return (
            <Icon
                path={mdiChessBishop}
                title={name}
                size={size * scaleFactor}
                color={backgroundColor}
            />
        );
    }
}

export default MyIcon;
