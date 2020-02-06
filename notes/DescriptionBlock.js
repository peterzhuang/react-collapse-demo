import React, { useRef, useEffect, useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'lodash/fp';
import styled, { withTheme } from 'styled-components';
import { mediaDown } from '@one/theme-utils';
import { Section, CollapseBody, BlockHeader, ToggleBar, FeatherIcon } from '@one/components';
import createDescription from './createDescription';

const lineHeight = 24;
const iconSize = 16;

const SectionWrapper = styled(Section)`
    padding: 5px 0 15px;
    overflow: hidden;
    background-color: ${({ backgroundColor }) => backgroundColor};
`;

const TextWrapper = styled.p`
    display: flex;
    margin: 0 0 ${lineHeight}px;
    line-height: ${lineHeight}px;
    color: ${({ color }) => color};
    font-size: 15px;
    font-weight: 100;
    justify-content: flex-end;

    ${mediaDown('small')`
        margin: 5px 5px ${lineHeight}px;
    `}
`;

const DescriptionBlock = ({
    content,
    options: {
        showBlockTitle = false,
        expandCollapse: { enabled = false, defaultState = 0, closedFormat = 0 } = {},
    } = {},
    styles: { color: textColor, backgroundColor } = {},
    childs: {
        expandCollapse: { styles: { color: iconColor } = {} } = {},
        blockTitle = 'About',
        headerTag,
    } = {},
    theme: {
        color: { primary, background, text: themeTextColor },
    },
}) => {
    // eslint-disable-next-line no-unused-vars
    const [__, forceUpdate] = useReducer(_ => _ + 1, 0);

    const textRef = useRef();

    const state = useRef({
        isOpne: !enabled || (enabled && defaultState !== 0),
        expandCollapse: enabled,
        collapseHeight: closedFormat !== 0 ? `${lineHeight * closedFormat}px` : '0px',
    }).current;

    const setCollapseHeight = (height = '0px', expand = false) => {
        state.collapseHeight = height;
        state.expandCollapse = expand;
        forceUpdate();
    };

    const checkLineHeight = () => {
        if (enabled && closedFormat !== 0) {
            const clientHeight = textRef.current && textRef.current.clientHeight;
            const clientLineHeight = clientHeight / closedFormat;

            if (clientLineHeight <= lineHeight) {
                setCollapseHeight(clientLineHeight, false);
            } else {
                setCollapseHeight(lineHeight * closedFormat, true);
            }
        }
    };

    const handleOnClickToggle = () => {
        if (state.expandCollapse) {
            state.isOpne = !state.isOpne;
            forceUpdate();
        }
    };

    const colorText = textColor || themeTextColor || '#333333';
    const colorBackground = backgroundColor || background || '#FFFFFF';
    const colorIcon = iconColor || primary || colorText;

    const callbackRef = useCallback(
        node => {
            if (node) {
                textRef.current = node;
            }
        },
        ['div'],
    );

    useEffect(() => {
        window.addEventListener('resize', checkLineHeight);
        checkLineHeight();
    }, ['content']);

    const { isOpne, collapseHeight, expandCollapse } = state;

    return (
        content && (
            <SectionWrapper headerTag={headerTag} backgroundColor={colorBackground}>
                {(showBlockTitle || (expandCollapse && closedFormat === 0)) && (
                    <BlockHeader
                        title={blockTitle}
                        color={colorText}
                        expandIcon={{
                            isOpne,
                            size: `${iconSize}px`,
                            color: colorIcon,
                            show: expandCollapse && closedFormat === 0,
                            togContent: [
                                <FeatherIcon
                                    icon="Plus"
                                    strokeWidth="5"
                                    size={iconSize}
                                    color={colorIcon}
                                />,
                                <FeatherIcon
                                    icon="Minus"
                                    strokeWidth="5"
                                    size={iconSize}
                                    color={colorIcon}
                                />,
                            ],
                        }}
                        {...(expandCollapse &&
                            closedFormat === 0 && { onClick: handleOnClickToggle })}
                    />
                )}
                <CollapseBody isOpen={isOpne} collapseHeight={collapseHeight}>
                    <TextWrapper color={colorText} ref={callbackRef}>
                        {content}
                        {expandCollapse && (
                            <ToggleBar
                                isOpne={isOpne}
                                height={`${lineHeight}px`}
                                iconSize={`${iconSize}px`}
                                iconColor={colorIcon}
                                backgroundColor={colorBackground}
                                onClick={handleOnClickToggle}
                                togContent={[
                                    <FeatherIcon
                                        icon="Plus"
                                        strokeWidth="5"
                                        size={iconSize}
                                        color={colorIcon}
                                    />,
                                    <FeatherIcon
                                        icon="Minus"
                                        strokeWidth="5"
                                        size={iconSize}
                                        color={colorIcon}
                                    />,
                                ]}
                            />
                        )}
                    </TextWrapper>
                </CollapseBody>
            </SectionWrapper>
        )
    );
};

DescriptionBlock.propTypes = {
    content: PropTypes.string,
    options: PropTypes.object,
    styles: PropTypes.object,
    childs: PropTypes.object,
    theme: PropTypes.object,
};

export default compose(
    withTheme,
    createDescription,
)(DescriptionBlock);
