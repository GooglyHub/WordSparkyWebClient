import React from 'react';

function CardHeader({ title, onClick }) {
    return (
        <div
            style={{
                flexDirection: 'row',
                cursor: 'pointer',
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
        </div>
    );
}

export default CardHeader;
