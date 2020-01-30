/* eslint-env browser */

/**
 * All debug logs are removed on build
 */

import "./collapse.css";
import React, { useRef, useCallback, useReducer } from "react";
import debugLog from "./debugLog";

let COLLAPSED = "collapsed";
let COLLAPSING = "collapsing";
let EXPANDING = "expanding";
let EXPANDED = "expanded";

let defaultClassName = "collapse-css-transition";
let defaultCollapseHeight = "58px";

function nextFrame(callback) {
  requestAnimationFrame(function() {
    requestAnimationFrame(callback);
  });
}

function CollapseBody({
  children,
  style,
  isOpen,
  collapseHeight = defaultCollapseHeight,
  noAnim,
  ...rest
}) {
  let getCollapsedVisibility = () => (collapseHeight === "0px" ? "hidden" : "");

  let [__, forceUpdate] = useReducer(_ => _ + 1, 0);

  let elementRef = useRef();

  let state = useRef({
    collapse: isOpen ? EXPANDED : COLLAPSED,
    style: {
      height: isOpen ? "" : collapseHeight,
      visibility: isOpen ? "" : getCollapsedVisibility()
    }
  }).current;

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
      className={defaultClassName}
      {...rest}
    >
      {children}
    </div>
  );
}

export default CollapseBody;
