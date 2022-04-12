import React from 'react';
import Icon from './common/icon';
import colors from './../config/colors';

function CardHeader({
    chevron,
    iconColor,
    iconName,
    title,
    onClick,
    onDelete,
}) {
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
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 5,
                    paddingBottom: 5,
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                }}
            >
                {iconColor && iconName && (
                    <div style={{ paddingRight: 5 }}>
                        <Icon
                            name={iconName}
                            backgroundColor={iconColor}
                            size={28}
                        />
                    </div>
                )}
                {title}
                {onDelete && (
                    <div
                        style={{ paddingLeft: 10, cursor: 'pointer' }}
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
                <div
                    style={{
                        position: 'absolute',
                        right: 20,
                        flexDirection: 'row',
                        margin: 5,
                    }}
                >
                    {chevron === 'down' && (
                        <Icon
                            name="chevron-down"
                            iconColor={colors.medium}
                            backgroundColor={colors.light}
                            size={20}
                        />
                    )}
                    {chevron === 'up' && (
                        <Icon
                            name="chevron-up"
                            iconColor={colors.medium}
                            backgroundColor={colors.light}
                            size={20}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardHeader;
