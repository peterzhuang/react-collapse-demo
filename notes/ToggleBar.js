import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ExpandCollapseIcon from './ExpandCollapseIcon';

const Bar = styled.span`
    height: ${({ height }) => height};
    position: absolute;
    width: 100%;
    bottom: 0;
    right: 0;
    background-image: linear-gradient(
        to right,
        rgba(0, 0, 0, 0),
        ${({ backgroundColor }) => backgroundColor} 75%
    );

    &:hover {
        cursor: pointer;
    }

    .toggle_bar__icon {
        position: absolute;
        top: 50%;
        right: 25%;
        margin: -${({ iconSize }) => parseInt(iconSize, 10) / 2}px 0 0;
    }
`;

const ToggleBar = ({
    isOpne,
    height = '24px',
    iconSize = '16px',
    iconColor = '#FFFFFF',
    backgroundColor = '#000000',
    onClick,
    togContent,
}) => (
    <Bar height={height} iconSize={iconSize} backgroundColor={backgroundColor} onClick={onClick}>
        <ExpandCollapseIcon
            isOpne={isOpne}
            size={iconSize}
            color={iconColor}
            className="toggle_bar__icon"
            togContent={togContent}
        />
    </Bar>
);

ToggleBar.propTypes = {
    isOpne: PropTypes.bool,
    height: PropTypes.string,
    iconSize: PropTypes.string,
    iconColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export default ToggleBar;
