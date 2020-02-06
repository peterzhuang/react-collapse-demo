import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const IconWrapper = styled.span`
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    color: ${({ color }) => color};
    font-family: fantasy;
    font-weight: 600;
    font-size: 1.4em;
    cursor: pointer;
`;
const ExpandCollapseIcon = ({
    isOpne,
    className = '',
    color = '#333333',
    togContent = ['+', '-'],
    size = '16px',
}) => (
    <IconWrapper color={color} size={size} className={className}>
        {isOpne ? togContent[1] || togContent[0] : togContent[0]}
    </IconWrapper>
);

ExpandCollapseIcon.propTypes = {
    isOpne: PropTypes.bool,
    className: PropTypes.string,
    color: PropTypes.string,
    togContent: PropTypes.array,
    size: PropTypes.string,
};

export default ExpandCollapseIcon;
