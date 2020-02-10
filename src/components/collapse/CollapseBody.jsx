/* eslint-env browser */

/**
 * All debug logs are removed on build
 */

import "./collapse.css";
import React, { useEffect, useRef, useCallback, useReducer } from "react";
import debugLog from "./debugLog";

let COLLAPSED = "collapsed";
let COLLAPSING = "collapsing";
let EXPANDING = "expanding";
let EXPANDED = "expanded";

let defaultClassName = "collapse-css-transition";
let defaultCollapseHeight = "60px";
let defaultCollapseLineNumber = 2;

function nextFrame(callback) {
  requestAnimationFrame(function() {
    requestAnimationFrame(callback);
  });
}

function CollapseBody({
  children,
  style,
  isOpen,
  collapseLineNumber = defaultCollapseLineNumber,
  // collapseHeight = defaultCollapseHeight,
  noAnim,
  handleInternalClick,
  ...rest
}) {
  let collapseHeight = `${collapseLineNumber * 24}px`;

  let getCollapsedVisibility = () => (collapseHeight === "0px" ? "hidden" : "");

  let [__, forceUpdate] = useReducer(_ => _ + 1, 0);

  let elementRef = useRef();

  let state = useRef({
    shouldExpand: true,
    collapse: isOpen ? EXPANDED : COLLAPSED,
    style: {
      height: isOpen ? "" : collapseHeight,
      visibility: isOpen ? "" : getCollapsedVisibility()
    }
  }).current;

  useEffect(() => {
    // shouldDataExpand();
    window.addEventListener("resize", shouldDataExpand);
    shouldDataExpand();
  }, []);

  function getClassName() {
    const { collapse } = state;

    const expandedClass =
      collapse === EXPANDED ? "react-expand-collapse--expanded" : "";

    const classes = [
      "react-expand-collapse__content",
      "collapse-css-transition",
      expandedClass
    ].join(" ");

    return classes;
  }

  function shouldDataExpand() {
    const { collapse } = state;

    const contentRect = elementRef.current.getBoundingClientRect();
    const contentBodyRect = elementRef.current
      .querySelector(".react-expand-collapse__body")
      .getBoundingClientRect();

    console.log("contentRect height", contentRect.height);
    console.log("contentBodyRect height", contentBodyRect.height);
    console.log("expanded", collapse);
    if (
      contentRect.height >= contentBodyRect.height &&
      !(collapse !== COLLAPSED)
    ) {
      console.log("setting shouldExpand FALSE");
      state.shouldExpand = false;
      forceUpdate();
    } else {
      console.log("setting shouldExpand true");
      state.shouldExpand = true;
      forceUpdate();
    }
  }

  function getButton() {
    const { collapse, shouldExpand } = state;
    console.log("shouldExpand", shouldExpand);
    if (shouldExpand) {
      const buttonText = getButtonText();

      return (
        <span
          className="react-expand-collapse__button"
          onClick={handleInternalClick}
          aria-label={buttonText}
          aria-expanded={collapse === EXPANDED}
          role="button"
        >
          {buttonText}
        </span>
      );
    }

    return "";
  }

  function getButtonText() {
    const { collapse } = state;

    // const { expandText, collapseText, ellipsis, ellipsisText } = this.props;
    const collapseText = "Collapse";
    const expandText = "Expand";
    const ellipsis = true;
    const ellipsisText = "...";

    // let text = collapse === EXPANDED ? collapseText : expandText;
    let text = "";
    if (collapse === EXPANDED) {
      text = collapseText;
    } else if (collapse === COLLAPSED) {
      text = expandText;
    }

    if (ellipsis) {
      // text = !(collapse === EXPANDED) ? `${`${ellipsisText} ${text}`}` : text;
      if (collapse === COLLAPSED) {
        text = `${`${ellipsisText} ${text}`}`;
      }
    }

    return text;
  }

  function setCollapsed() {
    if (!elementRef.current) return;

    // Update state
    state.collapse = COLLAPSED;

    debugLog("setCollapsed");

    state.style = {
      height: collapseHeight,
      visibility: getCollapsedVisibility()
    };
    forceUpdate();
  }

  function setCollapsing() {
    if (!elementRef.current) return;

    if (noAnim) {
      return setCollapsed();
    }

    // Update state
    state.collapse = COLLAPSING;

    debugLog("setCollapsing");
    console.log("init collapsing height: ", getElementHeight());
    state.style = {
      height: getElementHeight(),
      visibility: ""
    };
    forceUpdate();

    nextFrame(() => {
      if (!elementRef.current) return;
      if (state.collapse !== COLLAPSING) return;
      console.log("collapsing height: ", getElementHeight());
      state.style = {
        height: collapseHeight,
        visibility: ""
      };
      forceUpdate();
    });
  }

  function setExpanding() {
    if (!elementRef.current) return;

    if (noAnim) {
      return setExpanded();
    }

    // Updatetate
    state.collapse = EXPANDING;

    debugLog("setExpanding");
    console.log("init height: ", getElementHeight());
    nextFrame(() => {
      if (!elementRef.current) return;
      if (state.collapse !== EXPANDING) return;
      console.log("height: ", getElementHeight());
      state.style = {
        height: getElementHeight(),
        visibility: ""
      };
      forceUpdate();
    });
  }

  function setExpanded() {
    if (!elementRef.current) return;

    // Update state
    state.collapse = EXPANDED;

    debugLog("setExpanded");

    state.style = {
      height: "",
      visibility: ""
    };
    forceUpdate();
  }

  function getElementHeight() {
    // @ts-ignore
    return `${elementRef.current.scrollHeight}px`;
  }

  function onTransitionEnd({ target, propertyName }) {
    if (target === elementRef.current && propertyName === "height") {
      let styleHeight = target.style.height;

      debugLog("onTransitionEnd", state.collapse, propertyName, styleHeight);

      switch (state.collapse) {
        case EXPANDING:
          if (!(styleHeight === "" || styleHeight === collapseHeight))
            setExpanded();
          break;
        case COLLAPSING:
          if (!(styleHeight === "" || styleHeight !== collapseHeight))
            setCollapsed();
          break;
        default:
          break;
      }
    }
  }

  // getDerivedStateFromProps
  let didOpen = state.collapse === EXPANDED || state.collapse === EXPANDING;

  if (!didOpen && isOpen) setExpanding();

  if (didOpen && !isOpen) setCollapsing();
  // END getDerivedStateFromProps

  let computedStyle = {
    overflow: "hidden",
    lineHeight: "24px",
    ...style,
    ...state.style
  };

  let callbackRef = useCallback(
    node => {
      if (node) {
        elementRef.current = node;
      }
    },
    ["div"]
  );

  debugLog("Render");

  return (
    <div
      ref={callbackRef}
      style={computedStyle}
      onTransitionEnd={onTransitionEnd}
      className={getClassName()}
      {...rest}
    >
      <div className="react-expand-collapse__body">{children}</div>
      {/* {children} */}
      {getButton()}
    </div>
  );
}

export default CollapseBody;
