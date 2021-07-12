import React from 'react';
import Icon from './common/icon';
import colors from './../config/colors';

function CardHeader({ title, onClick, onDelete }) {
    return (
        <div
            style={{
                flexDirection: 'row',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
            }}
            onClick={onClick}
        >
            <div
                className="my-card-header"
                style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 5,
                    paddingBottom: 5,
                    flex: 1,
                }}
            >
                {title}
            </div>
            {onDelete && (
                <div
                    style={{
                        position: 'absolute',
                        right: 20,
                        flexDirection: 'row',
                        margin: 5,
                        cursor: 'pointer',
                    }}
                    onClick={onDelete}
                >
                    <Icon
                        name="trash-can"
                        size={25}
                        backgroundColor={colors.primary}
                        marginRight={5}
                    ></Icon>
                </div>
            )}
        </div>
    );
}

export default CardHeader;
