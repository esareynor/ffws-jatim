import { r as reactExports, a as reactDomExports, R as React, P as Provider_default } from './react-vendor-CILUtiK9.js';
import { g as get, c as clsx, S as Symbol$1, s as symbolWye, a as symbolTriangle, b as symbolStar, d as symbolSquare, e as symbolDiamond, f as symbolCross, h as symbolCircle, u as uniqBy, w as withSelectorExports, i as createSelector, j as sortBy, k as createSlice, l as shapeStack, m as stackOrderNone, n as stackOffsetWiggle, o as stackOffsetSilhouette, p as stackOffsetNone, q as stackOffsetExpand, r as current, t as castDraft, v as shapeArea, x as shapeLine, y as stepBefore, z as stepAfter, A as curveStep, B as curveNatural, C as monotoneY, D as monotoneX, E as curveLinear, F as curveLinearClosed, G as bumpY, H as bumpX, I as curveBasis, J as curveBasisOpen, K as curveBasisClosed, L as noop$3, M as Decimal, N as d3Scales, O as range$1, P as EventEmitter, Q as throttle, R as last, T as createAction, U as createListenerMiddleware, V as configureStore, W as combineReducers } from './vendor-HC16imTC.js';

var mathSign = value => {
  if (value === 0) {
    return 0;
  }
  if (value > 0) {
    return 1;
  }
  return -1;
};
var isNan = value => {
  // eslint-disable-next-line eqeqeq
  return typeof value == 'number' && value != +value;
};
var isPercent = value => typeof value === 'string' && value.indexOf('%') === value.length - 1;
var isNumber = value => (typeof value === 'number' || value instanceof Number) && !isNan(value);
var isNumOrStr = value => isNumber(value) || typeof value === 'string';
var idCounter = 0;
var uniqueId = prefix => {
  var id = ++idCounter;
  return "".concat(prefix || '').concat(id);
};

/**
 * Get percent value of a total value
 * @param {number|string} percent A percent
 * @param {number} totalValue     Total value
 * @param {number} defaultValue   The value returned when percent is undefined or invalid
 * @param {boolean} validate      If set to be true, the result will be validated
 * @return {number} value
 */
var getPercentValue = function getPercentValue(percent, totalValue) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var validate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (!isNumber(percent) && typeof percent !== 'string') {
    return defaultValue;
  }
  var value;
  if (isPercent(percent)) {
    if (totalValue == null) {
      return defaultValue;
    }
    var index = percent.indexOf('%');
    value = totalValue * parseFloat(percent.slice(0, index)) / 100;
  } else {
    value = +percent;
  }
  if (isNan(value)) {
    value = defaultValue;
  }
  if (validate && totalValue != null && value > totalValue) {
    value = totalValue;
  }
  return value;
};
var hasDuplicate = ary => {
  if (!Array.isArray(ary)) {
    return false;
  }
  var len = ary.length;
  var cache = {};
  for (var i = 0; i < len; i++) {
    if (!cache[ary[i]]) {
      cache[ary[i]] = true;
    } else {
      return true;
    }
  }
  return false;
};
function interpolate(start, end, t) {
  if (isNumber(start) && isNumber(end)) {
    return start + t * (end - start);
  }
  return end;
}
function findEntryInArray(ary, specifiedKey, specifiedValue) {
  if (!ary || !ary.length) {
    return undefined;
  }
  return ary.find(entry => entry && (typeof specifiedKey === 'function' ? specifiedKey(entry) : get(entry, specifiedKey)) === specifiedValue);
}
/**
 * Checks if the value is null or undefined
 * @param value The value to check
 * @returns true if the value is null or undefined
 */
var isNullish = value => {
  return value === null || typeof value === 'undefined';
};

/**
 *Uppercase the first letter of a string
 * @param {string} value The string to uppercase
 * @returns {string} The uppercased string
 */
var upperFirst = value => {
  if (isNullish(value)) {
    return value;
  }
  return "".concat(value.charAt(0).toUpperCase()).concat(value.slice(1));
};

var EventKeys = ['dangerouslySetInnerHTML', 'onCopy', 'onCopyCapture', 'onCut', 'onCutCapture', 'onPaste', 'onPasteCapture', 'onCompositionEnd', 'onCompositionEndCapture', 'onCompositionStart', 'onCompositionStartCapture', 'onCompositionUpdate', 'onCompositionUpdateCapture', 'onFocus', 'onFocusCapture', 'onBlur', 'onBlurCapture', 'onChange', 'onChangeCapture', 'onBeforeInput', 'onBeforeInputCapture', 'onInput', 'onInputCapture', 'onReset', 'onResetCapture', 'onSubmit', 'onSubmitCapture', 'onInvalid', 'onInvalidCapture', 'onLoad', 'onLoadCapture', 'onError', 'onErrorCapture', 'onKeyDown', 'onKeyDownCapture', 'onKeyPress', 'onKeyPressCapture', 'onKeyUp', 'onKeyUpCapture', 'onAbort', 'onAbortCapture', 'onCanPlay', 'onCanPlayCapture', 'onCanPlayThrough', 'onCanPlayThroughCapture', 'onDurationChange', 'onDurationChangeCapture', 'onEmptied', 'onEmptiedCapture', 'onEncrypted', 'onEncryptedCapture', 'onEnded', 'onEndedCapture', 'onLoadedData', 'onLoadedDataCapture', 'onLoadedMetadata', 'onLoadedMetadataCapture', 'onLoadStart', 'onLoadStartCapture', 'onPause', 'onPauseCapture', 'onPlay', 'onPlayCapture', 'onPlaying', 'onPlayingCapture', 'onProgress', 'onProgressCapture', 'onRateChange', 'onRateChangeCapture', 'onSeeked', 'onSeekedCapture', 'onSeeking', 'onSeekingCapture', 'onStalled', 'onStalledCapture', 'onSuspend', 'onSuspendCapture', 'onTimeUpdate', 'onTimeUpdateCapture', 'onVolumeChange', 'onVolumeChangeCapture', 'onWaiting', 'onWaitingCapture', 'onAuxClick', 'onAuxClickCapture', 'onClick', 'onClickCapture', 'onContextMenu', 'onContextMenuCapture', 'onDoubleClick', 'onDoubleClickCapture', 'onDrag', 'onDragCapture', 'onDragEnd', 'onDragEndCapture', 'onDragEnter', 'onDragEnterCapture', 'onDragExit', 'onDragExitCapture', 'onDragLeave', 'onDragLeaveCapture', 'onDragOver', 'onDragOverCapture', 'onDragStart', 'onDragStartCapture', 'onDrop', 'onDropCapture', 'onMouseDown', 'onMouseDownCapture', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseMoveCapture', 'onMouseOut', 'onMouseOutCapture', 'onMouseOver', 'onMouseOverCapture', 'onMouseUp', 'onMouseUpCapture', 'onSelect', 'onSelectCapture', 'onTouchCancel', 'onTouchCancelCapture', 'onTouchEnd', 'onTouchEndCapture', 'onTouchMove', 'onTouchMoveCapture', 'onTouchStart', 'onTouchStartCapture', 'onPointerDown', 'onPointerDownCapture', 'onPointerMove', 'onPointerMoveCapture', 'onPointerUp', 'onPointerUpCapture', 'onPointerCancel', 'onPointerCancelCapture', 'onPointerEnter', 'onPointerEnterCapture', 'onPointerLeave', 'onPointerLeaveCapture', 'onPointerOver', 'onPointerOverCapture', 'onPointerOut', 'onPointerOutCapture', 'onGotPointerCapture', 'onGotPointerCaptureCapture', 'onLostPointerCapture', 'onLostPointerCaptureCapture', 'onScroll', 'onScrollCapture', 'onWheel', 'onWheelCapture', 'onAnimationStart', 'onAnimationStartCapture', 'onAnimationEnd', 'onAnimationEndCapture', 'onAnimationIteration', 'onAnimationIterationCapture', 'onTransitionEnd', 'onTransitionEndCapture'];
function isEventKey(key) {
  if (typeof key !== 'string') {
    return false;
  }
  var allowedEventKeys = EventKeys;
  return allowedEventKeys.includes(key);
}

/**
 * Determines how values are stacked:
 *
 * - `none` is the default, it adds values on top of each other. No smarts. Negative values will overlap.
 * - `expand` make it so that the values always add up to 1 - so the chart will look like a rectangle.
 * - `wiggle` and `silhouette` tries to keep the chart centered.
 * - `sign` stacks positive values above zero and negative values below zero. Similar to `none` but handles negatives.
 * - `positive` ignores all negative values, and then behaves like \`none\`.
 *
 * Also see https://d3js.org/d3-shape/stack#stack-offsets
 * (note that the `diverging` offset in d3 is named `sign` in recharts)
 */

/**
 * @deprecated use either `CartesianLayout` or `PolarLayout` instead.
 * Mixing both charts families leads to ambiguity in the type system.
 * These two layouts share very few properties, so it is best to keep them separate.
 */

/**
 * @deprecated do not use: too many properties, mixing too many concepts, cartesian and polar together, everything optional.
 */

//
// Event Handler Types -- Copied from @types/react/index.d.ts and adapted for Props.
//

var SVGContainerPropKeys = ['viewBox', 'children'];
var PolyElementKeys = ['points', 'pathLength'];

/** svg element types that have specific attribute filtration requirements */

/** map of svg element types to unique svg attributes that belong to that element */
var FilteredElementKeyMap = {
  svg: SVGContainerPropKeys,
  polygon: PolyElementKeys,
  polyline: PolyElementKeys
};

/** The type of easing function to use for animations */

/** Specifies the duration of animation, the unit of this option is ms. */

/**
 * This object defines the offset of the chart area and width and height and brush and ... it's a bit too much information all in one.
 * We use it internally but let's not expose it to the outside world.
 * If you are looking for this information, instead import `ChartOffset` or `PlotArea` from `recharts`.
 */

/**
 * The domain of axis.
 * This is the definition
 *
 * Numeric domain is always defined by an array of exactly two values, for the min and the max of the axis.
 * Categorical domain is defined as array of all possible values.
 *
 * Can be specified in many ways:
 * - array of numbers
 * - with special strings like 'dataMin' and 'dataMax'
 * - with special string math like 'dataMin - 100'
 * - with keyword 'auto'
 * - or a function
 * - array of functions
 * - or a combination of the above
 */

/**
 * NumberDomain is an evaluated {@link AxisDomain}.
 * Unlike {@link AxisDomain}, it has no variety - it's a tuple of two number.
 * This is after all the keywords and functions were evaluated and what is left is [min, max].
 *
 * Know that the min, max values are not guaranteed to be nice numbers - values like -Infinity or NaN are possible.
 *
 * There are also `category` axes that have different things than numbers in their domain.
 */

/** The props definition of base axis */

/** Defines how ticks are placed and whether / how tick collisions are handled.
 * 'preserveStart' keeps the left tick on collision and ensures that the first tick is always shown.
 * 'preserveEnd' keeps the right tick on collision and ensures that the last tick is always shown.
 * 'preserveStartEnd' keeps the left tick on collision and ensures that the first and last ticks always show.
 * 'equidistantPreserveStart' selects a number N such that every nTh tick will be shown without collision.
 */

/**
 * Ticks can be any type when the axis is the type of category.
 *
 * Ticks must be numbers when the axis is the type of number.
 */

var adaptEventHandlers = (props, newHandler) => {
  if (!props || typeof props === 'function' || typeof props === 'boolean') {
    return null;
  }
  var inputProps = props;
  if (/*#__PURE__*/reactExports.isValidElement(props)) {
    inputProps = props.props;
  }
  if (typeof inputProps !== 'object' && typeof inputProps !== 'function') {
    return null;
  }
  var out = {};
  Object.keys(inputProps).forEach(key => {
    if (isEventKey(key)) {
      out[key] = (e => inputProps[key](inputProps, e));
    }
  });
  return out;
};
var getEventHandlerOfChild = (originalHandler, data, index) => e => {
  originalHandler(data, index, e);
  return null;
};
var adaptEventsOfChild = (props, data, index) => {
  if (props === null || typeof props !== 'object' && typeof props !== 'function') {
    return null;
  }
  var out = null;
  Object.keys(props).forEach(key => {
    var item = props[key];
    if (isEventKey(key) && typeof item === 'function') {
      if (!out) out = {};
      out[key] = getEventHandlerOfChild(item, data, index);
    }
  });
  return out;
};

/**
 * 'axis' means that all graphical items belonging to this axis tick will be highlighted,
 * and all will be present in the tooltip.
 * Tooltip with 'axis' will display when hovering on the chart background.
 *
 * 'item' means only the one graphical item being hovered will show in the tooltip.
 * Tooltip with 'item' will display when hovering over individual graphical items.
 *
 * This is calculated internally;
 * charts have a `defaultTooltipEventType` and `validateTooltipEventTypes` options.
 *
 * Users then use <Tooltip shared={true} /> or <Tooltip shared={false} /> to control their preference,
 * and charts will then see what is allowed and what is not.
 */

/**
 * These are the props we are going to pass to an `activeDot` if it is a function or a custom Component
 */

/**
 * This is the type of `activeDot` prop on:
 * - Area
 * - Line
 * - Radar
 */

// TODO we need two different range objects, one for polar and another for cartesian layouts

/**
 * Simplified version of the MouseEvent so that we don't have to mock the whole thing in tests.
 *
 * This is meant to represent the React.MouseEvent
 * which is a wrapper on top of https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
 */

/**
 * Coordinates relative to the top-left corner of the chart.
 * Also include scale which means that a chart that's scaled will return the same coordinates as a chart that's not scaled.
 */

var SVGElementPropKeys = ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-details', 'aria-disabled', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-modal', 'aria-multiline', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext', 'className', 'color', 'height', 'id', 'lang', 'max', 'media', 'method', 'min', 'name', 'style',
/*
 * removed 'type' SVGElementPropKey because we do not currently use any SVG elements
 * that can use it, and it conflicts with the recharts prop 'type'
 * https://github.com/recharts/recharts/pull/3327
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/type
 */
// 'type',
'target', 'width', 'role', 'tabIndex', 'accentHeight', 'accumulate', 'additive', 'alignmentBaseline', 'allowReorder', 'alphabetic', 'amplitude', 'arabicForm', 'ascent', 'attributeName', 'attributeType', 'autoReverse', 'azimuth', 'baseFrequency', 'baselineShift', 'baseProfile', 'bbox', 'begin', 'bias', 'by', 'calcMode', 'capHeight', 'clip', 'clipPath', 'clipPathUnits', 'clipRule', 'colorInterpolation', 'colorInterpolationFilters', 'colorProfile', 'colorRendering', 'contentScriptType', 'contentStyleType', 'cursor', 'cx', 'cy', 'd', 'decelerate', 'descent', 'diffuseConstant', 'direction', 'display', 'divisor', 'dominantBaseline', 'dur', 'dx', 'dy', 'edgeMode', 'elevation', 'enableBackground', 'end', 'exponent', 'externalResourcesRequired', 'fill', 'fillOpacity', 'fillRule', 'filter', 'filterRes', 'filterUnits', 'floodColor', 'floodOpacity', 'focusable', 'fontFamily', 'fontSize', 'fontSizeAdjust', 'fontStretch', 'fontStyle', 'fontVariant', 'fontWeight', 'format', 'from', 'fx', 'fy', 'g1', 'g2', 'glyphName', 'glyphOrientationHorizontal', 'glyphOrientationVertical', 'glyphRef', 'gradientTransform', 'gradientUnits', 'hanging', 'horizAdvX', 'horizOriginX', 'href', 'ideographic', 'imageRendering', 'in2', 'in', 'intercept', 'k1', 'k2', 'k3', 'k4', 'k', 'kernelMatrix', 'kernelUnitLength', 'kerning', 'keyPoints', 'keySplines', 'keyTimes', 'lengthAdjust', 'letterSpacing', 'lightingColor', 'limitingConeAngle', 'local', 'markerEnd', 'markerHeight', 'markerMid', 'markerStart', 'markerUnits', 'markerWidth', 'mask', 'maskContentUnits', 'maskUnits', 'mathematical', 'mode', 'numOctaves', 'offset', 'opacity', 'operator', 'order', 'orient', 'orientation', 'origin', 'overflow', 'overlinePosition', 'overlineThickness', 'paintOrder', 'panose1', 'pathLength', 'patternContentUnits', 'patternTransform', 'patternUnits', 'pointerEvents', 'pointsAtX', 'pointsAtY', 'pointsAtZ', 'preserveAlpha', 'preserveAspectRatio', 'primitiveUnits', 'r', 'radius', 'refX', 'refY', 'renderingIntent', 'repeatCount', 'repeatDur', 'requiredExtensions', 'requiredFeatures', 'restart', 'result', 'rotate', 'rx', 'ry', 'seed', 'shapeRendering', 'slope', 'spacing', 'specularConstant', 'specularExponent', 'speed', 'spreadMethod', 'startOffset', 'stdDeviation', 'stemh', 'stemv', 'stitchTiles', 'stopColor', 'stopOpacity', 'strikethroughPosition', 'strikethroughThickness', 'string', 'stroke', 'strokeDasharray', 'strokeDashoffset', 'strokeLinecap', 'strokeLinejoin', 'strokeMiterlimit', 'strokeOpacity', 'strokeWidth', 'surfaceScale', 'systemLanguage', 'tableValues', 'targetX', 'targetY', 'textAnchor', 'textDecoration', 'textLength', 'textRendering', 'to', 'transform', 'u1', 'u2', 'underlinePosition', 'underlineThickness', 'unicode', 'unicodeBidi', 'unicodeRange', 'unitsPerEm', 'vAlphabetic', 'values', 'vectorEffect', 'version', 'vertAdvY', 'vertOriginX', 'vertOriginY', 'vHanging', 'vIdeographic', 'viewTarget', 'visibility', 'vMathematical', 'widths', 'wordSpacing', 'writingMode', 'x1', 'x2', 'x', 'xChannelSelector', 'xHeight', 'xlinkActuate', 'xlinkArcrole', 'xlinkHref', 'xlinkRole', 'xlinkShow', 'xlinkTitle', 'xlinkType', 'xmlBase', 'xmlLang', 'xmlns', 'xmlnsXlink', 'xmlSpace', 'y1', 'y2', 'y', 'yChannelSelector', 'z', 'zoomAndPan', 'ref', 'key', 'angle'];
function isSvgElementPropKey(key) {
  if (typeof key !== 'string') {
    return false;
  }
  var allowedSvgKeys = SVGElementPropKeys;
  return allowedSvgKeys.includes(key);
}
/**
 * Filters an object to only include SVG properties. Removes all event handlers too.
 * @param obj - The object to filter
 * @returns A new object containing only valid SVG properties, excluding event handlers.
 */
function svgPropertiesNoEvents(obj) {
  var filteredEntries = Object.entries(obj).filter(_ref => {
    var [key] = _ref;
    return isSvgElementPropKey(key);
  });
  return Object.fromEntries(filteredEntries);
}

var isClipDot = dot => {
  if (dot && typeof dot === 'object' && 'clipDot' in dot) {
    return Boolean(dot.clipDot);
  }
  return true;
};

/**
 * Checks if the property is valid to spread onto an SVG element or onto a specific component
 * @param {unknown} property property value currently being compared
 * @param {string} key property key currently being compared
 * @param {boolean} includeEvents if events are included in spreadable props
 * @param {boolean} svgElementType checks against map of SVG element types to attributes
 * @returns {boolean} is prop valid
 */
var isValidSpreadableProp = (property, key, includeEvents, svgElementType) => {
  var _ref;
  if (typeof key === 'symbol' || typeof key === 'number') {
    // Allow symbols and numbers as valid keys
    return true;
  }
  /**
   * If the svg element type is explicitly included, check against the filtered element key map
   * to determine if there are attributes that should only exist on that element type.
   * @todo Add an internal cjs version of https://github.com/wooorm/svg-element-attributes for full coverage.
   */
  var matchingElementTypeKeys = (_ref = svgElementType && (FilteredElementKeyMap === null || FilteredElementKeyMap === void 0 ? void 0 : FilteredElementKeyMap[svgElementType])) !== null && _ref !== void 0 ? _ref : [];
  var isDataAttribute = key.startsWith('data-');
  var isSpecificSvgAttribute = typeof property !== 'function' && (Boolean(svgElementType) && matchingElementTypeKeys.includes(key) || isSvgElementPropKey(key));
  var isEventAttribute = Boolean(includeEvents) && isEventKey(key);
  return isDataAttribute || isSpecificSvgAttribute || isEventAttribute;
};

/**
 * Filters the props object to only include valid SVG attributes or event handlers.
 * @deprecated do not use this function, as it is not type-safe and may lead to unexpected behavior. Returns `any`.
 * Instead, use:
 * - `excludeEventProps` to exclude event handlers
 * - `svgPropertiesNoEvents` to exclude non-SVG attributes, and exclude event handlers too
 * @param props - The props object to filter, which can be a Record, Component, FunctionComponent, boolean, or unknown.
 * @param includeEvents - A boolean indicating whether to include event handlers in the filtered props.
 * @param svgElementType - An optional parameter specifying the type of SVG element to filter attributes for.
 * @returns A new object containing only valid SVG attributes or event handlers, or null if the input is not valid.
 */
var filterProps = (props, includeEvents, svgElementType) => {
  if (!props || typeof props === 'function' || typeof props === 'boolean') {
    return null;
  }
  var inputProps = props;
  if (/*#__PURE__*/reactExports.isValidElement(props)) {
    inputProps = props.props;
  }
  if (typeof inputProps !== 'object' && typeof inputProps !== 'function') {
    return null;
  }
  var out = {};

  /**
   * Props are blindly spread onto SVG elements. This loop filters out properties that we don't want to spread.
   * Items filtered out are as follows:
   *   - functions in properties that are SVG attributes (functions are included when includeEvents is true)
   *   - props that are SVG attributes but don't matched the passed svgElementType
   *   - any prop that is not in SVGElementPropKeys (or in EventKeys if includeEvents is true)
   */
  Object.keys(inputProps).forEach(key => {
    var _inputProps;
    if (isValidSpreadableProp((_inputProps = inputProps) === null || _inputProps === void 0 ? void 0 : _inputProps[key], key, includeEvents, svgElementType)) {
      out[key] = inputProps[key];
    }
  });
  return out;
};

var _excluded$i = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];
function _extends$m() { return _extends$m = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$m.apply(null, arguments); }
function _objectWithoutProperties$i(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$i(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$i(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var Surface = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  var {
      children,
      width,
      height,
      viewBox,
      className,
      style,
      title,
      desc
    } = props,
    others = _objectWithoutProperties$i(props, _excluded$i);
  var svgView = viewBox || {
    width,
    height,
    x: 0,
    y: 0
  };
  var layerClass = clsx('recharts-surface', className);
  return /*#__PURE__*/reactExports.createElement("svg", _extends$m({}, filterProps(others, true, 'svg'), {
    className: layerClass,
    width: width,
    height: height,
    style: style,
    viewBox: "".concat(svgView.x, " ").concat(svgView.y, " ").concat(svgView.width, " ").concat(svgView.height),
    ref: ref
  }), /*#__PURE__*/reactExports.createElement("title", null, title), /*#__PURE__*/reactExports.createElement("desc", null, desc), children);
});

var _excluded$h = ["children", "className"];
function _extends$l() { return _extends$l = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$l.apply(null, arguments); }
function _objectWithoutProperties$h(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$h(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$h(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var Layer = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  var {
      children,
      className
    } = props,
    others = _objectWithoutProperties$h(props, _excluded$h);
  var layerClass = clsx('recharts-layer', className);
  return /*#__PURE__*/reactExports.createElement("g", _extends$l({
    className: layerClass
  }, filterProps(others, true), {
    ref: ref
  }), children);
});

var LegendPortalContext = /*#__PURE__*/reactExports.createContext(null);
var useLegendPortal = () => reactExports.useContext(LegendPortalContext);

var _excluded$g = ["type", "size", "sizeType"];
function _extends$k() { return _extends$k = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$k.apply(null, arguments); }
function ownKeys$v(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$v(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$v(Object(t), true).forEach(function (r) { _defineProperty$x(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$v(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$x(e, r, t) { return (r = _toPropertyKey$x(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$x(t) { var i = _toPrimitive$x(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$x(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties$g(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$g(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$g(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var symbolFactories = {
  symbolCircle,
  symbolCross,
  symbolDiamond,
  symbolSquare,
  symbolStar,
  symbolTriangle,
  symbolWye
};
var RADIAN$1 = Math.PI / 180;
var getSymbolFactory = type => {
  var name = "symbol".concat(upperFirst(type));
  return symbolFactories[name] || symbolCircle;
};
var calculateAreaSize = (size, sizeType, type) => {
  if (sizeType === 'area') {
    return size;
  }
  switch (type) {
    case 'cross':
      return 5 * size * size / 9;
    case 'diamond':
      return 0.5 * size * size / Math.sqrt(3);
    case 'square':
      return size * size;
    case 'star':
      {
        var angle = 18 * RADIAN$1;
        return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.tan(angle) ** 2);
      }
    case 'triangle':
      return Math.sqrt(3) * size * size / 4;
    case 'wye':
      return (21 - 10 * Math.sqrt(3)) * size * size / 8;
    default:
      return Math.PI * size * size / 4;
  }
};
var registerSymbol = (key, factory) => {
  symbolFactories["symbol".concat(upperFirst(key))] = factory;
};
var Symbols = _ref => {
  var {
      type = 'circle',
      size = 64,
      sizeType = 'area'
    } = _ref,
    rest = _objectWithoutProperties$g(_ref, _excluded$g);
  var props = _objectSpread$v(_objectSpread$v({}, rest), {}, {
    type,
    size,
    sizeType
  });
  var realType = 'circle';
  if (typeof type === 'string') {
    /*
     * Our type guard is not as strong as it could be (i.e. non-existent),
     * and so despite the typescript type saying that `type` is a `SymbolType`,
     * we can get numbers or really anything, so let's have a runtime check here to fix the exception.
     *
     * https://github.com/recharts/recharts/issues/6197
     */
    realType = type;
  }

  /**
   * Calculate the path of curve
   * @return {String} path
   */
  var getPath = () => {
    var symbolFactory = getSymbolFactory(realType);
    var symbol = Symbol$1().type(symbolFactory).size(calculateAreaSize(size, sizeType, realType));
    return symbol();
  };
  var {
    className,
    cx,
    cy
  } = props;
  var filteredProps = filterProps(props, true);
  if (cx === +cx && cy === +cy && size === +size) {
    return /*#__PURE__*/reactExports.createElement("path", _extends$k({}, filteredProps, {
      className: clsx('recharts-symbols', className),
      transform: "translate(".concat(cx, ", ").concat(cy, ")"),
      d: getPath()
    }));
  }
  return null;
};
Symbols.registerSymbol = registerSymbol;

function _extends$j() { return _extends$j = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$j.apply(null, arguments); }
function ownKeys$u(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$u(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$u(Object(t), true).forEach(function (r) { _defineProperty$w(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$u(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$w(e, r, t) { return (r = _toPropertyKey$w(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$w(t) { var i = _toPrimitive$w(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$w(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SIZE = 32;
class DefaultLegendContent extends reactExports.PureComponent {
  /**
   * Render the path of icon
   * @param data Data of each legend item
   * @param iconType if defined, it will always render this icon. If undefined then it uses icon from data.type
   * @return Path element
   */
  renderIcon(data, iconType) {
    var {
      inactiveColor
    } = this.props;
    var halfSize = SIZE / 2;
    var sixthSize = SIZE / 6;
    var thirdSize = SIZE / 3;
    var color = data.inactive ? inactiveColor : data.color;
    var preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
    if (preferredIcon === 'none') {
      return null;
    }
    if (preferredIcon === 'plainline') {
      return /*#__PURE__*/reactExports.createElement("line", {
        strokeWidth: 4,
        fill: "none",
        stroke: color,
        strokeDasharray: data.payload.strokeDasharray,
        x1: 0,
        y1: halfSize,
        x2: SIZE,
        y2: halfSize,
        className: "recharts-legend-icon"
      });
    }
    if (preferredIcon === 'line') {
      return /*#__PURE__*/reactExports.createElement("path", {
        strokeWidth: 4,
        fill: "none",
        stroke: color,
        d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
        className: "recharts-legend-icon"
      });
    }
    if (preferredIcon === 'rect') {
      return /*#__PURE__*/reactExports.createElement("path", {
        stroke: "none",
        fill: color,
        d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
        className: "recharts-legend-icon"
      });
    }
    if (/*#__PURE__*/reactExports.isValidElement(data.legendIcon)) {
      var iconProps = _objectSpread$u({}, data);
      delete iconProps.legendIcon;
      return /*#__PURE__*/reactExports.cloneElement(data.legendIcon, iconProps);
    }
    return /*#__PURE__*/reactExports.createElement(Symbols, {
      fill: color,
      cx: halfSize,
      cy: halfSize,
      size: SIZE,
      sizeType: "diameter",
      type: preferredIcon
    });
  }

  /**
   * Draw items of legend
   * @return Items
   */
  renderItems() {
    var {
      payload,
      iconSize,
      layout,
      formatter,
      inactiveColor,
      iconType
    } = this.props;
    var viewBox = {
      x: 0,
      y: 0,
      width: SIZE,
      height: SIZE
    };
    var itemStyle = {
      display: layout === 'horizontal' ? 'inline-block' : 'block',
      marginRight: 10
    };
    var svgStyle = {
      display: 'inline-block',
      verticalAlign: 'middle',
      marginRight: 4
    };
    return payload.map((entry, i) => {
      var finalFormatter = entry.formatter || formatter;
      var className = clsx({
        'recharts-legend-item': true,
        ["legend-item-".concat(i)]: true,
        inactive: entry.inactive
      });
      if (entry.type === 'none') {
        return null;
      }
      var color = entry.inactive ? inactiveColor : entry.color;
      var finalValue = finalFormatter ? finalFormatter(entry.value, entry, i) : entry.value;
      return /*#__PURE__*/reactExports.createElement("li", _extends$j({
        className: className,
        style: itemStyle
        // eslint-disable-next-line react/no-array-index-key
        ,
        key: "legend-item-".concat(i)
      }, adaptEventsOfChild(this.props, entry, i)), /*#__PURE__*/reactExports.createElement(Surface, {
        width: iconSize,
        height: iconSize,
        viewBox: viewBox,
        style: svgStyle,
        "aria-label": "".concat(finalValue, " legend icon")
      }, this.renderIcon(entry, iconType)), /*#__PURE__*/reactExports.createElement("span", {
        className: "recharts-legend-item-text",
        style: {
          color
        }
      }, finalValue));
    });
  }
  render() {
    var {
      payload,
      layout,
      align
    } = this.props;
    if (!payload || !payload.length) {
      return null;
    }
    var finalStyle = {
      padding: 0,
      margin: 0,
      textAlign: layout === 'horizontal' ? align : 'left'
    };
    return /*#__PURE__*/reactExports.createElement("ul", {
      className: "recharts-default-legend",
      style: finalStyle
    }, this.renderItems());
  }
}
_defineProperty$w(DefaultLegendContent, "displayName", 'Legend');
_defineProperty$w(DefaultLegendContent, "defaultProps", {
  align: 'center',
  iconSize: 14,
  inactiveColor: '#ccc',
  layout: 'horizontal',
  verticalAlign: 'middle'
});

/**
 * This is configuration option that decides how to filter for unique values only:
 *
 * - `false` means "no filter"
 * - `true` means "use recharts default filter"
 * - function means "use return of this function as the default key"
 */

function getUniqPayload(payload, option, defaultUniqBy) {
  if (option === true) {
    return uniqBy(payload, defaultUniqBy);
  }
  if (typeof option === 'function') {
    return uniqBy(payload, option);
  }
  return payload;
}

/*
 * This is a copy of the React-Redux context type, but with our own store type.
 * We could import directly from react-redux like this:
 * import { ReactReduxContextValue } from 'react-redux/src/components/Context';
 * but that makes typescript angry with some errors I am not sure how to resolve
 * so copy it is.
 */

/**
 * We need to use our own independent Redux context because we need to avoid interfering with other people's Redux stores
 * in case they decide to install and use Recharts in another Redux app which is likely to happen.
 *
 * https://react-redux.js.org/using-react-redux/accessing-store#providing-custom-context
 */
var RechartsReduxContext = /*#__PURE__*/reactExports.createContext(null);

var noopDispatch = a => a;
var useAppDispatch = () => {
  var context = reactExports.useContext(RechartsReduxContext);
  if (context) {
    return context.store.dispatch;
  }
  return noopDispatch;
};
var noop$2 = () => {};
var addNestedSubNoop = () => noop$2;
var refEquality = (a, b) => a === b;

/**
 * This is a recharts variant of `useSelector` from 'react-redux' package.
 *
 * The difference is that react-redux version will throw an Error when used outside of Redux context.
 *
 * This, recharts version, will return undefined instead.
 *
 * This is because we want to allow using our components outside the Chart wrapper,
 * and have people provide all props explicitly.
 *
 * If however they use the component inside a chart wrapper then those props become optional,
 * and we read them from Redux state instead.
 *
 * @param selector for pulling things out of Redux store; will not be called if the store is not accessible
 * @return whatever the selector returned; or undefined when outside of Redux store
 */
function useAppSelector(selector) {
  var context = reactExports.useContext(RechartsReduxContext);
  return withSelectorExports.useSyncExternalStoreWithSelector(context ? context.subscription.addNestedSub : addNestedSubNoop, context ? context.store.getState : noop$2, context ? context.store.getState : noop$2, context ? selector : noop$2, refEquality);
}

var selectLegendSettings = state => state.legend.settings;
var selectLegendSize = state => state.legend.size;
var selectAllLegendPayload2DArray = state => state.legend.payload;
var selectLegendPayload = createSelector([selectAllLegendPayload2DArray, selectLegendSettings], (payloads, _ref) => {
  var {
    itemSorter
  } = _ref;
  var flat = payloads.flat(1);
  return itemSorter ? sortBy(flat, itemSorter) : flat;
});

/**
 * Use this hook in Legend, or anywhere else where you want to read the current Legend items.
 * @return all Legend items ready to be rendered
 */
function useLegendPayload() {
  return useAppSelector(selectLegendPayload);
}

var EPS$1 = 1;

/**
 * TODO this documentation does not reflect what this hook is doing, update it.
 * Stores the `offsetHeight`, `offsetLeft`, `offsetTop`, and `offsetWidth` of a DOM element.
 */

/**
 * Use this to listen to element layout changes.
 *
 * Very useful for reading actual sizes of DOM elements relative to the viewport.
 *
 * @param extraDependencies use this to trigger new DOM dimensions read when any of these change. Good for things like payload and label, that will re-render something down in the children array, but you want to read the layout box of a parent.
 * @returns [lastElementOffset, updateElementOffset] most recent value, and setter. Pass the setter to a DOM element ref like this: `<div ref={updateElementOffset}>`
 */
function useElementOffset() {
  var extraDependencies = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var [lastBoundingBox, setLastBoundingBox] = reactExports.useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0
  });
  var updateBoundingBox = reactExports.useCallback(node => {
    if (node != null) {
      var rect = node.getBoundingClientRect();
      var box = {
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width
      };
      if (Math.abs(box.height - lastBoundingBox.height) > EPS$1 || Math.abs(box.left - lastBoundingBox.left) > EPS$1 || Math.abs(box.top - lastBoundingBox.top) > EPS$1 || Math.abs(box.width - lastBoundingBox.width) > EPS$1) {
        setLastBoundingBox({
          height: box.height,
          left: box.left,
          top: box.top,
          width: box.width
        });
      }
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [lastBoundingBox.width, lastBoundingBox.height, lastBoundingBox.top, lastBoundingBox.left, ...extraDependencies]);
  return [lastBoundingBox, updateBoundingBox];
}

var initialState$a = {
  layoutType: 'horizontal',
  width: 0,
  height: 0,
  margin: {
    top: 5,
    right: 5,
    bottom: 5,
    left: 5
  },
  scale: 1
};
var chartLayoutSlice = createSlice({
  name: 'chartLayout',
  initialState: initialState$a,
  reducers: {
    setLayout(state, action) {
      state.layoutType = action.payload;
    },
    setChartSize(state, action) {
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    setMargin(state, action) {
      var _action$payload$top, _action$payload$right, _action$payload$botto, _action$payload$left;
      state.margin.top = (_action$payload$top = action.payload.top) !== null && _action$payload$top !== void 0 ? _action$payload$top : 0;
      state.margin.right = (_action$payload$right = action.payload.right) !== null && _action$payload$right !== void 0 ? _action$payload$right : 0;
      state.margin.bottom = (_action$payload$botto = action.payload.bottom) !== null && _action$payload$botto !== void 0 ? _action$payload$botto : 0;
      state.margin.left = (_action$payload$left = action.payload.left) !== null && _action$payload$left !== void 0 ? _action$payload$left : 0;
    },
    setScale(state, action) {
      state.scale = action.payload;
    }
  }
});
var {
  setMargin,
  setLayout,
  setChartSize,
  setScale
} = chartLayoutSlice.actions;
var chartLayoutReducer = chartLayoutSlice.reducer;

function ownKeys$t(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$t(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$t(Object(t), true).forEach(function (r) { _defineProperty$v(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$t(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$v(e, r, t) { return (r = _toPropertyKey$v(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$v(t) { var i = _toPrimitive$v(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$v(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RADIAN = Math.PI / 180;
var radianToDegree = angleInRadian => angleInRadian * 180 / Math.PI;
var polarToCartesian = (cx, cy, radius, angle) => ({
  x: cx + Math.cos(-RADIAN * angle) * radius,
  y: cy + Math.sin(-RADIAN * angle) * radius
});
var getMaxRadius = function getMaxRadius(width, height) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0};
  return Math.min(Math.abs(width - (offset.left || 0) - (offset.right || 0)), Math.abs(height - (offset.top || 0) - (offset.bottom || 0))) / 2;
};
var distanceBetweenPoints = (point, anotherPoint) => {
  var {
    x: x1,
    y: y1
  } = point;
  var {
    x: x2,
    y: y2
  } = anotherPoint;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
};
var getAngleOfPoint = (_ref, _ref2) => {
  var {
    x,
    y
  } = _ref;
  var {
    cx,
    cy
  } = _ref2;
  var radius = distanceBetweenPoints({
    x,
    y
  }, {
    x: cx,
    y: cy
  });
  if (radius <= 0) {
    return {
      radius,
      angle: 0
    };
  }
  var cos = (x - cx) / radius;
  var angleInRadian = Math.acos(cos);
  if (y > cy) {
    angleInRadian = 2 * Math.PI - angleInRadian;
  }
  return {
    radius,
    angle: radianToDegree(angleInRadian),
    angleInRadian
  };
};
var formatAngleOfSector = _ref3 => {
  var {
    startAngle,
    endAngle
  } = _ref3;
  var startCnt = Math.floor(startAngle / 360);
  var endCnt = Math.floor(endAngle / 360);
  var min = Math.min(startCnt, endCnt);
  return {
    startAngle: startAngle - min * 360,
    endAngle: endAngle - min * 360
  };
};
var reverseFormatAngleOfSector = (angle, _ref4) => {
  var {
    startAngle,
    endAngle
  } = _ref4;
  var startCnt = Math.floor(startAngle / 360);
  var endCnt = Math.floor(endAngle / 360);
  var min = Math.min(startCnt, endCnt);
  return angle + min * 360;
};
var inRangeOfSector = (_ref5, viewBox) => {
  var {
    x,
    y
  } = _ref5;
  var {
    radius,
    angle
  } = getAngleOfPoint({
    x,
    y
  }, viewBox);
  var {
    innerRadius,
    outerRadius
  } = viewBox;
  if (radius < innerRadius || radius > outerRadius) {
    return null;
  }
  if (radius === 0) {
    return null;
  }
  var {
    startAngle,
    endAngle
  } = formatAngleOfSector(viewBox);
  var formatAngle = angle;
  var inRange;
  if (startAngle <= endAngle) {
    while (formatAngle > endAngle) {
      formatAngle -= 360;
    }
    while (formatAngle < startAngle) {
      formatAngle += 360;
    }
    inRange = formatAngle >= startAngle && formatAngle <= endAngle;
  } else {
    while (formatAngle > startAngle) {
      formatAngle -= 360;
    }
    while (formatAngle < endAngle) {
      formatAngle += 360;
    }
    inRange = formatAngle >= endAngle && formatAngle <= startAngle;
  }
  if (inRange) {
    return _objectSpread$t(_objectSpread$t({}, viewBox), {}, {
      radius,
      angle: reverseFormatAngleOfSector(formatAngle, viewBox)
    });
  }
  return null;
};

function getSliced(arr, startIndex, endIndex) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  if (arr && startIndex + endIndex !== 0) {
    return arr.slice(startIndex, endIndex + 1);
  }
  return arr;
}

function ownKeys$s(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$s(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$s(Object(t), true).forEach(function (r) { _defineProperty$u(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$s(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$u(e, r, t) { return (r = _toPropertyKey$u(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$u(t) { var i = _toPrimitive$u(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$u(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function getValueByDataKey(obj, dataKey, defaultValue) {
  if (isNullish(obj) || isNullish(dataKey)) {
    return defaultValue;
  }
  if (isNumOrStr(dataKey)) {
    return get(obj, dataKey, defaultValue);
  }
  if (typeof dataKey === 'function') {
    return dataKey(obj);
  }
  return defaultValue;
}
var calculateActiveTickIndex = (coordinate, ticks, unsortedTicks, axisType, range) => {
  var _ticks$length;
  var index = -1;
  var len = (_ticks$length = ticks === null || ticks === void 0 ? void 0 : ticks.length) !== null && _ticks$length !== void 0 ? _ticks$length : 0;

  // if there are 1 or fewer ticks or if there is no coordinate then the active tick is at index 0
  if (len <= 1 || coordinate == null) {
    return 0;
  }
  if (axisType === 'angleAxis' && range != null && Math.abs(Math.abs(range[1] - range[0]) - 360) <= 1e-6) {
    // ticks are distributed in a circle
    for (var i = 0; i < len; i++) {
      var before = i > 0 ? unsortedTicks[i - 1].coordinate : unsortedTicks[len - 1].coordinate;
      var cur = unsortedTicks[i].coordinate;
      var after = i >= len - 1 ? unsortedTicks[0].coordinate : unsortedTicks[i + 1].coordinate;
      var sameDirectionCoord = void 0;
      if (mathSign(cur - before) !== mathSign(after - cur)) {
        var diffInterval = [];
        if (mathSign(after - cur) === mathSign(range[1] - range[0])) {
          sameDirectionCoord = after;
          var curInRange = cur + range[1] - range[0];
          diffInterval[0] = Math.min(curInRange, (curInRange + before) / 2);
          diffInterval[1] = Math.max(curInRange, (curInRange + before) / 2);
        } else {
          sameDirectionCoord = before;
          var afterInRange = after + range[1] - range[0];
          diffInterval[0] = Math.min(cur, (afterInRange + cur) / 2);
          diffInterval[1] = Math.max(cur, (afterInRange + cur) / 2);
        }
        var sameInterval = [Math.min(cur, (sameDirectionCoord + cur) / 2), Math.max(cur, (sameDirectionCoord + cur) / 2)];
        if (coordinate > sameInterval[0] && coordinate <= sameInterval[1] || coordinate >= diffInterval[0] && coordinate <= diffInterval[1]) {
          ({
            index
          } = unsortedTicks[i]);
          break;
        }
      } else {
        var minValue = Math.min(before, after);
        var maxValue = Math.max(before, after);
        if (coordinate > (minValue + cur) / 2 && coordinate <= (maxValue + cur) / 2) {
          ({
            index
          } = unsortedTicks[i]);
          break;
        }
      }
    }
  } else if (ticks) {
    // ticks are distributed in a single direction
    for (var _i = 0; _i < len; _i++) {
      if (_i === 0 && coordinate <= (ticks[_i].coordinate + ticks[_i + 1].coordinate) / 2 || _i > 0 && _i < len - 1 && coordinate > (ticks[_i].coordinate + ticks[_i - 1].coordinate) / 2 && coordinate <= (ticks[_i].coordinate + ticks[_i + 1].coordinate) / 2 || _i === len - 1 && coordinate > (ticks[_i].coordinate + ticks[_i - 1].coordinate) / 2) {
        ({
          index
        } = ticks[_i]);
        break;
      }
    }
  }
  return index;
};
var appendOffsetOfLegend = (offset, legendSettings, legendSize) => {
  if (legendSettings && legendSize) {
    var {
      width: boxWidth,
      height: boxHeight
    } = legendSize;
    var {
      align,
      verticalAlign,
      layout
    } = legendSettings;
    if ((layout === 'vertical' || layout === 'horizontal' && verticalAlign === 'middle') && align !== 'center' && isNumber(offset[align])) {
      return _objectSpread$s(_objectSpread$s({}, offset), {}, {
        [align]: offset[align] + (boxWidth || 0)
      });
    }
    if ((layout === 'horizontal' || layout === 'vertical' && align === 'center') && verticalAlign !== 'middle' && isNumber(offset[verticalAlign])) {
      return _objectSpread$s(_objectSpread$s({}, offset), {}, {
        [verticalAlign]: offset[verticalAlign] + (boxHeight || 0)
      });
    }
  }
  return offset;
};
var isCategoricalAxis = (layout, axisType) => layout === 'horizontal' && axisType === 'xAxis' || layout === 'vertical' && axisType === 'yAxis' || layout === 'centric' && axisType === 'angleAxis' || layout === 'radial' && axisType === 'radiusAxis';

/**
 * Calculate the Coordinates of grid
 * @param  {Array} ticks           The ticks in axis
 * @param {Number} minValue        The minimum value of axis
 * @param {Number} maxValue        The maximum value of axis
 * @param {boolean} syncWithTicks  Synchronize grid lines with ticks or not
 * @return {Array}                 Coordinates
 */
var getCoordinatesOfGrid = (ticks, minValue, maxValue, syncWithTicks) => {
  if (syncWithTicks) {
    return ticks.map(entry => entry.coordinate);
  }
  var hasMin, hasMax;
  var values = ticks.map(entry => {
    if (entry.coordinate === minValue) {
      hasMin = true;
    }
    if (entry.coordinate === maxValue) {
      hasMax = true;
    }
    return entry.coordinate;
  });
  if (!hasMin) {
    values.push(minValue);
  }
  if (!hasMax) {
    values.push(maxValue);
  }
  return values;
};

/**
 * A subset of d3-scale that Recharts is using
 */

/**
 * Get the ticks of an axis
 * @param  {Object}  axis The configuration of an axis
 * @param {Boolean} isGrid Whether or not are the ticks in grid
 * @param {Boolean} isAll Return the ticks of all the points or not
 * @return {Array}  Ticks
 */
var getTicksOfAxis = (axis, isGrid, isAll) => {
  if (!axis) {
    return null;
  }
  var {
    duplicateDomain,
    type,
    range,
    scale,
    realScaleType,
    isCategorical,
    categoricalDomain,
    tickCount,
    ticks,
    niceTicks,
    axisType
  } = axis;
  if (!scale) {
    return null;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range && range.length >= 2 ? mathSign(range[0] - range[1]) * 2 * offset : offset;

  // The ticks set by user should only affect the ticks adjacent to axis line
  if ((ticks || niceTicks)) {
    var result = (ticks || niceTicks || []).map((entry, index) => {
      var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
      return {
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: scale(scaleContent) + offset,
        value: entry,
        offset,
        index
      };
    });
    return result.filter(row => !isNan(row.coordinate));
  }

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }
  if (scale.ticks && true && tickCount != null) {
    return scale.ticks(tickCount).map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      offset,
      index
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
var EPS = 1e-4;
var checkDomainOfScale = scale => {
  var domain = scale.domain();
  if (!domain || domain.length <= 2) {
    return;
  }
  var len = domain.length;
  var range = scale.range();
  var minValue = Math.min(range[0], range[1]) - EPS;
  var maxValue = Math.max(range[0], range[1]) + EPS;
  var first = scale(domain[0]);
  var last = scale(domain[len - 1]);
  if (first < minValue || first > maxValue || last < minValue || last > maxValue) {
    scale.domain([domain[0], domain[len - 1]]);
  }
};

/**
 * Stacks all positive numbers above zero and all negative numbers below zero.
 *
 * If all values in the series are positive then this behaves the same as 'none' stacker.
 *
 * @param {Array} series from d3-shape Stack
 * @return {Array} series with applied offset
 */
var offsetSign = series => {
  var n = series.length;
  if (n <= 0) {
    return;
  }
  for (var j = 0, m = series[0].length; j < m; ++j) {
    var positive = 0;
    var negative = 0;
    for (var i = 0; i < n; ++i) {
      var value = isNan(series[i][j][1]) ? series[i][j][0] : series[i][j][1];

      /* eslint-disable prefer-destructuring, no-param-reassign */
      if (value >= 0) {
        series[i][j][0] = positive;
        series[i][j][1] = positive + value;
        positive = series[i][j][1];
      } else {
        series[i][j][0] = negative;
        series[i][j][1] = negative + value;
        negative = series[i][j][1];
      }
      /* eslint-enable prefer-destructuring, no-param-reassign */
    }
  }
};

/**
 * Replaces all negative values with zero when stacking data.
 *
 * If all values in the series are positive then this behaves the same as 'none' stacker.
 *
 * @param {Array} series from d3-shape Stack
 * @return {Array} series with applied offset
 */
var offsetPositive = series => {
  var n = series.length;
  if (n <= 0) {
    return;
  }
  for (var j = 0, m = series[0].length; j < m; ++j) {
    var positive = 0;
    for (var i = 0; i < n; ++i) {
      var value = isNan(series[i][j][1]) ? series[i][j][0] : series[i][j][1];

      /* eslint-disable prefer-destructuring, no-param-reassign */
      if (value >= 0) {
        series[i][j][0] = positive;
        series[i][j][1] = positive + value;
        positive = series[i][j][1];
      } else {
        series[i][j][0] = 0;
        series[i][j][1] = 0;
      }
      /* eslint-enable prefer-destructuring, no-param-reassign */
    }
  }
};

/**
 * Function type to compute offset for stacked data.
 *
 * d3-shape has something fishy going on with its types.
 * In @definitelytyped/d3-shape, this function (the offset accessor) is typed as Series<> => void.
 * However! When I actually open the storybook I can see that the offset accessor actually receives Array<Series<>>.
 * The same I can see in the source code itself:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/66042
 * That one unfortunately has no types but we can tell it passes three-dimensional array.
 *
 * Which leads me to believe that definitelytyped is wrong on this one.
 * There's open discussion on this topic without much attention:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/66042
 */

var STACK_OFFSET_MAP = {
  sign: offsetSign,
  // @ts-expect-error definitelytyped types are incorrect
  expand: stackOffsetExpand,
  // @ts-expect-error definitelytyped types are incorrect
  none: stackOffsetNone,
  // @ts-expect-error definitelytyped types are incorrect
  silhouette: stackOffsetSilhouette,
  // @ts-expect-error definitelytyped types are incorrect
  wiggle: stackOffsetWiggle,
  positive: offsetPositive
};
var getStackedData = (data, dataKeys, offsetType) => {
  var offsetAccessor = STACK_OFFSET_MAP[offsetType];
  var stack = shapeStack().keys(dataKeys).value((d, key) => +getValueByDataKey(d, key, 0)).order(stackOrderNone)
  // @ts-expect-error definitelytyped types are incorrect
  .offset(offsetAccessor);
  return stack(data);
};

/**
 * Stack IDs in the external props allow numbers; but internally we use it as an object key
 * and object keys are always strings. Also, it would be kinda confusing if stackId=8 and stackId='8' were different stacks
 * so let's just force a string.
 */

function getNormalizedStackId(publicStackId) {
  return publicStackId == null ? undefined : String(publicStackId);
}
function getCateCoordinateOfLine(_ref) {
  var {
    axis,
    ticks,
    bandSize,
    entry,
    index,
    dataKey
  } = _ref;
  if (axis.type === 'category') {
    // find coordinate of category axis by the value of category
    // @ts-expect-error why does this use direct object access instead of getValueByDataKey?
    if (!axis.allowDuplicatedCategory && axis.dataKey && !isNullish(entry[axis.dataKey])) {
      // @ts-expect-error why does this use direct object access instead of getValueByDataKey?
      var matchedTick = findEntryInArray(ticks, 'value', entry[axis.dataKey]);
      if (matchedTick) {
        return matchedTick.coordinate + bandSize / 2;
      }
    }
    return ticks[index] ? ticks[index].coordinate + bandSize / 2 : null;
  }
  var value = getValueByDataKey(entry, !isNullish(dataKey) ? dataKey : axis.dataKey);

  // @ts-expect-error getValueByDataKey does not validate the output type
  return !isNullish(value) ? axis.scale(value) : null;
}
var getDomainOfSingle = data => {
  var flat = data.flat(2).filter(isNumber);
  return [Math.min(...flat), Math.max(...flat)];
};
var makeDomainFinite = domain => {
  return [domain[0] === Infinity ? 0 : domain[0], domain[1] === -Infinity ? 0 : domain[1]];
};
var getDomainOfStackGroups = (stackGroups, startIndex, endIndex) => {
  if (stackGroups == null) {
    return undefined;
  }
  return makeDomainFinite(Object.keys(stackGroups).reduce((result, stackId) => {
    var group = stackGroups[stackId];
    var {
      stackedData
    } = group;
    var domain = stackedData.reduce((res, entry) => {
      var sliced = getSliced(entry, startIndex, endIndex);
      var s = getDomainOfSingle(sliced);
      return [Math.min(res[0], s[0]), Math.max(res[1], s[1])];
    }, [Infinity, -Infinity]);
    return [Math.min(domain[0], result[0]), Math.max(domain[1], result[1])];
  }, [Infinity, -Infinity]));
};
var MIN_VALUE_REG = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;
var MAX_VALUE_REG = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/;

/**
 * Calculate the size between two category
 * @param  {Object} axis  The options of axis
 * @param  {Array}  ticks The ticks of axis
 * @param  {Boolean} isBar if items in axis are bars
 * @return {Number} Size
 */
var getBandSizeOfAxis = (axis, ticks, isBar) => {
  if (axis && axis.scale && axis.scale.bandwidth) {
    var bandWidth = axis.scale.bandwidth();
    if (!isBar || bandWidth > 0) {
      return bandWidth;
    }
  }
  if (axis && ticks && ticks.length >= 2) {
    var orderedTicks = sortBy(ticks, o => o.coordinate);
    var bandSize = Infinity;
    for (var i = 1, len = orderedTicks.length; i < len; i++) {
      var cur = orderedTicks[i];
      var prev = orderedTicks[i - 1];
      bandSize = Math.min((cur.coordinate || 0) - (prev.coordinate || 0), bandSize);
    }
    return bandSize === Infinity ? 0 : bandSize;
  }
  return isBar ? undefined : 0;
};
function getTooltipEntry(_ref4) {
  var {
    tooltipEntrySettings,
    dataKey,
    payload,
    value,
    name
  } = _ref4;
  return _objectSpread$s(_objectSpread$s({}, tooltipEntrySettings), {}, {
    dataKey,
    payload,
    value,
    name
  });
}
function getTooltipNameProp(nameFromItem, dataKey) {
  if (nameFromItem) {
    return String(nameFromItem);
  }
  if (typeof dataKey === 'string') {
    return dataKey;
  }
  return undefined;
}
function inRange(x, y, layout, polarViewBox, offset) {
  if (layout === 'horizontal' || layout === 'vertical') {
    var isInRange = x >= offset.left && x <= offset.left + offset.width && y >= offset.top && y <= offset.top + offset.height;
    return isInRange ? {
      x,
      y
    } : null;
  }
  if (polarViewBox) {
    return inRangeOfSector({
      x,
      y
    }, polarViewBox);
  }
  return null;
}
var getActiveCoordinate = (layout, tooltipTicks, activeIndex, rangeObj) => {
  var entry = tooltipTicks.find(tick => tick && tick.index === activeIndex);
  if (entry) {
    if (layout === 'horizontal') {
      return {
        x: entry.coordinate,
        y: rangeObj.y
      };
    }
    if (layout === 'vertical') {
      return {
        x: rangeObj.x,
        y: entry.coordinate
      };
    }
    if (layout === 'centric') {
      var _angle = entry.coordinate;
      var {
        radius: _radius
      } = rangeObj;
      return _objectSpread$s(_objectSpread$s(_objectSpread$s({}, rangeObj), polarToCartesian(rangeObj.cx, rangeObj.cy, _radius, _angle)), {}, {
        angle: _angle,
        radius: _radius
      });
    }
    var radius = entry.coordinate;
    var {
      angle
    } = rangeObj;
    return _objectSpread$s(_objectSpread$s(_objectSpread$s({}, rangeObj), polarToCartesian(rangeObj.cx, rangeObj.cy, radius, angle)), {}, {
      angle,
      radius
    });
  }
  return {
    x: 0,
    y: 0
  };
};
var calculateTooltipPos = (rangeObj, layout) => {
  if (layout === 'horizontal') {
    return rangeObj.x;
  }
  if (layout === 'vertical') {
    return rangeObj.y;
  }
  if (layout === 'centric') {
    return rangeObj.angle;
  }
  return rangeObj.radius;
};

var selectChartWidth = state => state.layout.width;
var selectChartHeight = state => state.layout.height;
var selectContainerScale = state => state.layout.scale;
var selectMargin = state => state.layout.margin;

var selectAllXAxes = createSelector(state => state.cartesianAxis.xAxis, xAxisMap => {
  return Object.values(xAxisMap);
});
var selectAllYAxes = createSelector(state => state.cartesianAxis.yAxis, yAxisMap => {
  return Object.values(yAxisMap);
});

/**
 * We use this attribute to identify which element is the one that the user is touching.
 * The index is the position of the element in the data array.
 * This can be either a number (for array-based charts) or a string (for the charts that have a matrix-shaped data).
 */
var DATA_ITEM_INDEX_ATTRIBUTE_NAME = 'data-recharts-item-index';
/**
 * We use this attribute to identify which element is the one that the user is touching.
 * DataKey works here as a kind of identifier for the element. It's not a perfect identifier for ~two~ three reasons:
 *
 * 1. There can be two different elements with the same dataKey; we won't know which is it
 * 2. DataKey can be a function, and that serialized will be a `[Function: anonymous]` string
 * which means we will be able to identify that it was a function but can't tell which one.
 * This will lead to some weird bugs. A proper fix would be to either:
 * a) use a unique identifier for each element (passed from props, or generated)
 * b) figure out how to compare the dataKey or graphical item by object reference
 *
 * a) is a fuss because we don't have the unique identifier in props,
 * and b) is possible most of the time except for touchMove events which work differently from mouseEnter/mouseLeave:
 * - while mouseEnter is fired for the element that the mouse is over,
 * touchMove is fired for the element where user has started touching. As the finger moves,
 * we can identify the element that the user is touching by using the elementFromPoint method,
 * but it keeps calling the handler on the element where touchStart was fired.
 *
 * Okay and now I discovered a third reason: the dataKey can be undefined and that's still fine
 * because if dataKey is undefined then graphical elements assume the dataKey of the axes.
 * Which makes it a convenient way of using recharts to render a chart but horrible identifier.
 */
var DATA_ITEM_DATAKEY_ATTRIBUTE_NAME = 'data-recharts-item-data-key';
var DEFAULT_Y_AXIS_WIDTH = 60;

function ownKeys$r(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$r(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$r(Object(t), true).forEach(function (r) { _defineProperty$t(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$r(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$t(e, r, t) { return (r = _toPropertyKey$t(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$t(t) { var i = _toPrimitive$t(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$t(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var selectBrushHeight = state => state.brush.height;
function selectLeftAxesOffset(state) {
  var yAxes = selectAllYAxes(state);
  return yAxes.reduce((result, entry) => {
    if (entry.orientation === 'left' && !entry.mirror && !entry.hide) {
      var width = typeof entry.width === 'number' ? entry.width : DEFAULT_Y_AXIS_WIDTH;
      return result + width;
    }
    return result;
  }, 0);
}
function selectRightAxesOffset(state) {
  var yAxes = selectAllYAxes(state);
  return yAxes.reduce((result, entry) => {
    if (entry.orientation === 'right' && !entry.mirror && !entry.hide) {
      var width = typeof entry.width === 'number' ? entry.width : DEFAULT_Y_AXIS_WIDTH;
      return result + width;
    }
    return result;
  }, 0);
}
function selectTopAxesOffset(state) {
  var xAxes = selectAllXAxes(state);
  return xAxes.reduce((result, entry) => {
    if (entry.orientation === 'top' && !entry.mirror && !entry.hide) {
      return result + entry.height;
    }
    return result;
  }, 0);
}
function selectBottomAxesOffset(state) {
  var xAxes = selectAllXAxes(state);
  return xAxes.reduce((result, entry) => {
    if (entry.orientation === 'bottom' && !entry.mirror && !entry.hide) {
      return result + entry.height;
    }
    return result;
  }, 0);
}

/**
 * For internal use only.
 *
 * @param root state
 * @return ChartOffsetInternal
 */
var selectChartOffsetInternal = createSelector([selectChartWidth, selectChartHeight, selectMargin, selectBrushHeight, selectLeftAxesOffset, selectRightAxesOffset, selectTopAxesOffset, selectBottomAxesOffset, selectLegendSettings, selectLegendSize], (chartWidth, chartHeight, margin, brushHeight, leftAxesOffset, rightAxesOffset, topAxesOffset, bottomAxesOffset, legendSettings, legendSize) => {
  var offsetH = {
    left: (margin.left || 0) + leftAxesOffset,
    right: (margin.right || 0) + rightAxesOffset
  };
  var offsetV = {
    top: (margin.top || 0) + topAxesOffset,
    bottom: (margin.bottom || 0) + bottomAxesOffset
  };
  var offset = _objectSpread$r(_objectSpread$r({}, offsetV), offsetH);
  var brushBottom = offset.bottom;
  offset.bottom += brushHeight;
  offset = appendOffsetOfLegend(offset, legendSettings, legendSize);
  var offsetWidth = chartWidth - offset.left - offset.right;
  var offsetHeight = chartHeight - offset.top - offset.bottom;
  return _objectSpread$r(_objectSpread$r({
    brushBottom
  }, offset), {}, {
    // never return negative values for height and width
    width: Math.max(offsetWidth, 0),
    height: Math.max(offsetHeight, 0)
  });
});
var selectChartViewBox = createSelector(selectChartOffsetInternal, offset => ({
  x: offset.left,
  y: offset.top,
  width: offset.width,
  height: offset.height
}));
var selectAxisViewBox = createSelector(selectChartWidth, selectChartHeight, (width, height) => ({
  x: 0,
  y: 0,
  width,
  height
}));

var PanoramaContext = /*#__PURE__*/reactExports.createContext(null);
var useIsPanorama = () => reactExports.useContext(PanoramaContext) != null;

var selectBrushSettings = state => state.brush;
var selectBrushDimensions = createSelector([selectBrushSettings, selectChartOffsetInternal, selectMargin], (brushSettings, offset, margin) => ({
  height: brushSettings.height,
  x: isNumber(brushSettings.x) ? brushSettings.x : offset.left,
  y: isNumber(brushSettings.y) ? brushSettings.y : offset.top + offset.height + offset.brushBottom - ((margin === null || margin === void 0 ? void 0 : margin.bottom) || 0),
  width: isNumber(brushSettings.width) ? brushSettings.width : offset.width
}));

var useViewBox = () => {
  var _useAppSelector;
  var panorama = useIsPanorama();
  var rootViewBox = useAppSelector(selectChartViewBox);
  var brushDimensions = useAppSelector(selectBrushDimensions);
  var brushPadding = (_useAppSelector = useAppSelector(selectBrushSettings)) === null || _useAppSelector === void 0 ? void 0 : _useAppSelector.padding;
  if (!panorama || !brushDimensions || !brushPadding) {
    return rootViewBox;
  }
  return {
    width: brushDimensions.width - brushPadding.left - brushPadding.right,
    height: brushDimensions.height - brushPadding.top - brushPadding.bottom,
    x: brushPadding.left,
    y: brushPadding.top
  };
};
var manyComponentsThrowErrorsIfOffsetIsUndefined = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0
};
/**
 * For internal use only. If you want this information, `import { useOffset } from 'recharts'` instead.
 *
 * Returns the offset of the chart in pixels.
 *
 * @returns {ChartOffsetInternal} The offset of the chart in pixels, or a default value if not in a chart context.
 */
var useOffsetInternal = () => {
  var _useAppSelector2;
  return (_useAppSelector2 = useAppSelector(selectChartOffsetInternal)) !== null && _useAppSelector2 !== void 0 ? _useAppSelector2 : manyComponentsThrowErrorsIfOffsetIsUndefined;
};

/**
 * Returns the width of the chart in pixels.
 *
 * If you are using chart with hardcoded `width` prop, then the width returned will be the same
 * as the `width` prop on the main chart element.
 *
 * If you are using a chart with a `ResponsiveContainer`, the width will be the size of the chart
 * as the ResponsiveContainer has decided it would be.
 *
 * If the chart has any axes or legend, the `width` will be the size of the chart
 * including the axes and legend. Meaning: adding axes and legend will not change the width.
 *
 * The dimensions do not scale, meaning as user zoom in and out, the width number will not change
 * as the chart gets visually larger or smaller.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {number | undefined} The width of the chart in pixels, or `undefined` if not in a chart context.
 */
var useChartWidth = () => {
  return useAppSelector(selectChartWidth);
};

/**
 * Returns the height of the chart in pixels.
 *
 * If you are using chart with hardcoded `height` props, then the height returned will be the same
 * as the `height` prop on the main chart element.
 *
 * If you are using a chart with a `ResponsiveContainer`, the height will be the size of the chart
 * as the ResponsiveContainer has decided it would be.
 *
 * If the chart has any axes or legend, the `height` will be the size of the chart
 * including the axes and legend. Meaning: adding axes and legend will not change the height.
 *
 * The dimensions do not scale, meaning as user zoom in and out, the height number will not change
 * as the chart gets visually larger or smaller.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {number | undefined} The height of the chart in pixels, or `undefined` if not in a chart context.
 */
var useChartHeight = () => {
  return useAppSelector(selectChartHeight);
};

/**
 * Margin is the empty space around the chart. Excludes axes and legend and brushes and the like.
 * This is declared by the user in the chart props.
 * If you are interested in the space occupied by axes, legend, or brushes,
 * use `useOffset` instead.
 *
 * Returns `undefined` if used outside a chart context.
 *
 * @returns {Margin | undefined} The margin of the chart in pixels, or `undefined` if not in a chart context.
 */
var useMargin = () => {
  return useAppSelector(state => state.layout.margin);
};
var selectChartLayout = state => state.layout.layoutType;
var useChartLayout = () => useAppSelector(selectChartLayout);

/**
 * The properties inside this state update independently of each other and quite often.
 * When selecting, never select the whole state because you are going to get
 * unnecessary re-renders. Select only the properties you need.
 *
 * This is why this state type is not exported - don't use it directly.
 */

var initialState$9 = {
  settings: {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'middle',
    itemSorter: 'value'
  },
  size: {
    width: 0,
    height: 0
  },
  payload: []
};
var legendSlice = createSlice({
  name: 'legend',
  initialState: initialState$9,
  reducers: {
    setLegendSize(state, action) {
      state.size.width = action.payload.width;
      state.size.height = action.payload.height;
    },
    setLegendSettings(state, action) {
      state.settings.align = action.payload.align;
      state.settings.layout = action.payload.layout;
      state.settings.verticalAlign = action.payload.verticalAlign;
      state.settings.itemSorter = action.payload.itemSorter;
    },
    addLegendPayload(state, action) {
      state.payload.push(castDraft(action.payload));
    },
    removeLegendPayload(state, action) {
      var index = current(state).payload.indexOf(castDraft(action.payload));
      if (index > -1) {
        state.payload.splice(index, 1);
      }
    }
  }
});
var {
  setLegendSize,
  setLegendSettings,
  addLegendPayload,
  removeLegendPayload
} = legendSlice.actions;
var legendReducer = legendSlice.reducer;

var _excluded$f = ["contextPayload"];
function _extends$i() { return _extends$i = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$i.apply(null, arguments); }
function ownKeys$q(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$q(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$q(Object(t), true).forEach(function (r) { _defineProperty$s(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$q(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$s(e, r, t) { return (r = _toPropertyKey$s(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$s(t) { var i = _toPrimitive$s(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$s(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties$f(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$f(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$f(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function defaultUniqBy$1(entry) {
  return entry.value;
}
function LegendContent(props) {
  var {
      contextPayload
    } = props,
    otherProps = _objectWithoutProperties$f(props, _excluded$f);
  var finalPayload = getUniqPayload(contextPayload, props.payloadUniqBy, defaultUniqBy$1);
  var contentProps = _objectSpread$q(_objectSpread$q({}, otherProps), {}, {
    payload: finalPayload
  });
  if (/*#__PURE__*/reactExports.isValidElement(props.content)) {
    return /*#__PURE__*/reactExports.cloneElement(props.content, contentProps);
  }
  if (typeof props.content === 'function') {
    return /*#__PURE__*/reactExports.createElement(props.content, contentProps);
  }
  return /*#__PURE__*/reactExports.createElement(DefaultLegendContent, contentProps);
}
function getDefaultPosition(style, props, margin, chartWidth, chartHeight, box) {
  var {
    layout,
    align,
    verticalAlign
  } = props;
  var hPos, vPos;
  if (!style || (style.left === undefined || style.left === null) && (style.right === undefined || style.right === null)) {
    if (align === 'center' && layout === 'vertical') {
      hPos = {
        left: ((chartWidth || 0) - box.width) / 2
      };
    } else {
      hPos = align === 'right' ? {
        right: margin && margin.right || 0
      } : {
        left: margin && margin.left || 0
      };
    }
  }
  if (!style || (style.top === undefined || style.top === null) && (style.bottom === undefined || style.bottom === null)) {
    if (verticalAlign === 'middle') {
      vPos = {
        top: ((chartHeight || 0) - box.height) / 2
      };
    } else {
      vPos = verticalAlign === 'bottom' ? {
        bottom: margin && margin.bottom || 0
      } : {
        top: margin && margin.top || 0
      };
    }
  }
  return _objectSpread$q(_objectSpread$q({}, hPos), vPos);
}
function LegendSettingsDispatcher(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(setLegendSettings(props));
  }, [dispatch, props]);
  return null;
}
function LegendSizeDispatcher(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(setLegendSize(props));
    return () => {
      dispatch(setLegendSize({
        width: 0,
        height: 0
      }));
    };
  }, [dispatch, props]);
  return null;
}
function LegendWrapper(props) {
  var contextPayload = useLegendPayload();
  var legendPortalFromContext = useLegendPortal();
  var margin = useMargin();
  var {
    width: widthFromProps,
    height: heightFromProps,
    wrapperStyle,
    portal: portalFromProps
  } = props;
  // The contextPayload is not used directly inside the hook, but we need the onBBoxUpdate call
  // when the payload changes, therefore it's here as a dependency.
  var [lastBoundingBox, updateBoundingBox] = useElementOffset([contextPayload]);
  var chartWidth = useChartWidth();
  var chartHeight = useChartHeight();
  if (chartWidth == null || chartHeight == null) {
    return null;
  }
  var maxWidth = chartWidth - (margin.left || 0) - (margin.right || 0);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  var widthOrHeight = Legend.getWidthOrHeight(props.layout, heightFromProps, widthFromProps, maxWidth);
  // if the user supplies their own portal, only use their defined wrapper styles
  var outerStyle = portalFromProps ? wrapperStyle : _objectSpread$q(_objectSpread$q({
    position: 'absolute',
    width: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.width) || widthFromProps || 'auto',
    height: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.height) || heightFromProps || 'auto'
  }, getDefaultPosition(wrapperStyle, props, margin, chartWidth, chartHeight, lastBoundingBox)), wrapperStyle);
  var legendPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : legendPortalFromContext;
  if (legendPortal == null) {
    return null;
  }
  var legendElement = /*#__PURE__*/reactExports.createElement("div", {
    className: "recharts-legend-wrapper",
    style: outerStyle,
    ref: updateBoundingBox
  }, /*#__PURE__*/reactExports.createElement(LegendSettingsDispatcher, {
    layout: props.layout,
    align: props.align,
    verticalAlign: props.verticalAlign,
    itemSorter: props.itemSorter
  }), /*#__PURE__*/reactExports.createElement(LegendSizeDispatcher, {
    width: lastBoundingBox.width,
    height: lastBoundingBox.height
  }), /*#__PURE__*/reactExports.createElement(LegendContent, _extends$i({}, props, widthOrHeight, {
    margin: margin,
    chartWidth: chartWidth,
    chartHeight: chartHeight,
    contextPayload: contextPayload
  })));
  return /*#__PURE__*/reactDomExports.createPortal(legendElement, legendPortal);
}
class Legend extends reactExports.PureComponent {
  static getWidthOrHeight(layout, height, width, maxWidth) {
    if (layout === 'vertical' && isNumber(height)) {
      return {
        height
      };
    }
    if (layout === 'horizontal') {
      return {
        width: width || maxWidth
      };
    }
    return null;
  }
  render() {
    return /*#__PURE__*/reactExports.createElement(LegendWrapper, this.props);
  }
}
_defineProperty$s(Legend, "displayName", 'Legend');
_defineProperty$s(Legend, "defaultProps", {
  align: 'center',
  iconSize: 14,
  itemSorter: 'value',
  layout: 'horizontal',
  verticalAlign: 'bottom'
});

function _extends$h() { return _extends$h = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$h.apply(null, arguments); }
function ownKeys$p(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$p(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$p(Object(t), true).forEach(function (r) { _defineProperty$r(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$p(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$r(e, r, t) { return (r = _toPropertyKey$r(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$r(t) { var i = _toPrimitive$r(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$r(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function defaultFormatter(value) {
  return Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1]) ? value.join(' ~ ') : value;
}
var DefaultTooltipContent = props => {
  var {
    separator = ' : ',
    contentStyle = {},
    itemStyle = {},
    labelStyle = {},
    payload,
    formatter,
    itemSorter,
    wrapperClassName,
    labelClassName,
    label,
    labelFormatter,
    accessibilityLayer = false
  } = props;
  var renderContent = () => {
    if (payload && payload.length) {
      var listStyle = {
        padding: 0,
        margin: 0
      };
      var items = (itemSorter ? sortBy(payload, itemSorter) : payload).map((entry, i) => {
        if (entry.type === 'none') {
          return null;
        }
        var finalFormatter = entry.formatter || formatter || defaultFormatter;
        var {
          value,
          name
        } = entry;
        var finalValue = value;
        var finalName = name;
        if (finalFormatter) {
          var formatted = finalFormatter(value, name, entry, i, payload);
          if (Array.isArray(formatted)) {
            [finalValue, finalName] = formatted;
          } else if (formatted != null) {
            finalValue = formatted;
          } else {
            return null;
          }
        }
        var finalItemStyle = _objectSpread$p({
          display: 'block',
          paddingTop: 4,
          paddingBottom: 4,
          color: entry.color || '#000'
        }, itemStyle);
        return (
          /*#__PURE__*/
          // eslint-disable-next-line react/no-array-index-key
          reactExports.createElement("li", {
            className: "recharts-tooltip-item",
            key: "tooltip-item-".concat(i),
            style: finalItemStyle
          }, isNumOrStr(finalName) ? /*#__PURE__*/reactExports.createElement("span", {
            className: "recharts-tooltip-item-name"
          }, finalName) : null, isNumOrStr(finalName) ? /*#__PURE__*/reactExports.createElement("span", {
            className: "recharts-tooltip-item-separator"
          }, separator) : null, /*#__PURE__*/reactExports.createElement("span", {
            className: "recharts-tooltip-item-value"
          }, finalValue), /*#__PURE__*/reactExports.createElement("span", {
            className: "recharts-tooltip-item-unit"
          }, entry.unit || ''))
        );
      });
      return /*#__PURE__*/reactExports.createElement("ul", {
        className: "recharts-tooltip-item-list",
        style: listStyle
      }, items);
    }
    return null;
  };
  var finalStyle = _objectSpread$p({
    margin: 0,
    padding: 10,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    whiteSpace: 'nowrap'
  }, contentStyle);
  var finalLabelStyle = _objectSpread$p({
    margin: 0
  }, labelStyle);
  var hasLabel = !isNullish(label);
  var finalLabel = hasLabel ? label : '';
  var wrapperCN = clsx('recharts-default-tooltip', wrapperClassName);
  var labelCN = clsx('recharts-tooltip-label', labelClassName);
  if (hasLabel && labelFormatter && payload !== undefined && payload !== null) {
    finalLabel = labelFormatter(label, payload);
  }
  var accessibilityAttributes = accessibilityLayer ? {
    role: 'status',
    'aria-live': 'assertive'
  } : {};
  return /*#__PURE__*/reactExports.createElement("div", _extends$h({
    className: wrapperCN,
    style: finalStyle
  }, accessibilityAttributes), /*#__PURE__*/reactExports.createElement("p", {
    className: labelCN,
    style: finalLabelStyle
  }, /*#__PURE__*/reactExports.isValidElement(finalLabel) ? finalLabel : "".concat(finalLabel)), renderContent());
};

var CSS_CLASS_PREFIX = 'recharts-tooltip-wrapper';
var TOOLTIP_HIDDEN = {
  visibility: 'hidden'
};
function getTooltipCSSClassName(_ref) {
  var {
    coordinate,
    translateX,
    translateY
  } = _ref;
  return clsx(CSS_CLASS_PREFIX, {
    ["".concat(CSS_CLASS_PREFIX, "-right")]: isNumber(translateX) && coordinate && isNumber(coordinate.x) && translateX >= coordinate.x,
    ["".concat(CSS_CLASS_PREFIX, "-left")]: isNumber(translateX) && coordinate && isNumber(coordinate.x) && translateX < coordinate.x,
    ["".concat(CSS_CLASS_PREFIX, "-bottom")]: isNumber(translateY) && coordinate && isNumber(coordinate.y) && translateY >= coordinate.y,
    ["".concat(CSS_CLASS_PREFIX, "-top")]: isNumber(translateY) && coordinate && isNumber(coordinate.y) && translateY < coordinate.y
  });
}
function getTooltipTranslateXY(_ref2) {
  var {
    allowEscapeViewBox,
    coordinate,
    key,
    offsetTopLeft,
    position,
    reverseDirection,
    tooltipDimension,
    viewBox,
    viewBoxDimension
  } = _ref2;
  if (position && isNumber(position[key])) {
    return position[key];
  }
  var negative = coordinate[key] - tooltipDimension - (offsetTopLeft > 0 ? offsetTopLeft : 0);
  var positive = coordinate[key] + offsetTopLeft;
  if (allowEscapeViewBox[key]) {
    return reverseDirection[key] ? negative : positive;
  }
  var viewBoxKey = viewBox[key];
  if (viewBoxKey == null) {
    return 0;
  }
  if (reverseDirection[key]) {
    var _tooltipBoundary = negative;
    var _viewBoxBoundary = viewBoxKey;
    if (_tooltipBoundary < _viewBoxBoundary) {
      return Math.max(positive, viewBoxKey);
    }
    return Math.max(negative, viewBoxKey);
  }
  if (viewBoxDimension == null) {
    return 0;
  }
  var tooltipBoundary = positive + tooltipDimension;
  var viewBoxBoundary = viewBoxKey + viewBoxDimension;
  if (tooltipBoundary > viewBoxBoundary) {
    return Math.max(negative, viewBoxKey);
  }
  return Math.max(positive, viewBoxKey);
}
function getTransformStyle(_ref3) {
  var {
    translateX,
    translateY,
    useTranslate3d
  } = _ref3;
  return {
    transform: useTranslate3d ? "translate3d(".concat(translateX, "px, ").concat(translateY, "px, 0)") : "translate(".concat(translateX, "px, ").concat(translateY, "px)")
  };
}
function getTooltipTranslate(_ref4) {
  var {
    allowEscapeViewBox,
    coordinate,
    offsetTopLeft,
    position,
    reverseDirection,
    tooltipBox,
    useTranslate3d,
    viewBox
  } = _ref4;
  var cssProperties, translateX, translateY;
  if (tooltipBox.height > 0 && tooltipBox.width > 0 && coordinate) {
    translateX = getTooltipTranslateXY({
      allowEscapeViewBox,
      coordinate,
      key: 'x',
      offsetTopLeft,
      position,
      reverseDirection,
      tooltipDimension: tooltipBox.width,
      viewBox,
      viewBoxDimension: viewBox.width
    });
    translateY = getTooltipTranslateXY({
      allowEscapeViewBox,
      coordinate,
      key: 'y',
      offsetTopLeft,
      position,
      reverseDirection,
      tooltipDimension: tooltipBox.height,
      viewBox,
      viewBoxDimension: viewBox.height
    });
    cssProperties = getTransformStyle({
      translateX,
      translateY,
      useTranslate3d
    });
  } else {
    cssProperties = TOOLTIP_HIDDEN;
  }
  return {
    cssProperties,
    cssClasses: getTooltipCSSClassName({
      translateX,
      translateY,
      coordinate
    })
  };
}

function ownKeys$o(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$o(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$o(Object(t), true).forEach(function (r) { _defineProperty$q(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$o(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$q(e, r, t) { return (r = _toPropertyKey$q(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$q(t) { var i = _toPrimitive$q(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$q(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class TooltipBoundingBox extends reactExports.PureComponent {
  constructor() {
    super(...arguments);
    _defineProperty$q(this, "state", {
      dismissed: false,
      dismissedAtCoordinate: {
        x: 0,
        y: 0
      }
    });
    _defineProperty$q(this, "handleKeyDown", event => {
      if (event.key === 'Escape') {
        var _this$props$coordinat, _this$props$coordinat2, _this$props$coordinat3, _this$props$coordinat4;
        this.setState({
          dismissed: true,
          dismissedAtCoordinate: {
            x: (_this$props$coordinat = (_this$props$coordinat2 = this.props.coordinate) === null || _this$props$coordinat2 === void 0 ? void 0 : _this$props$coordinat2.x) !== null && _this$props$coordinat !== void 0 ? _this$props$coordinat : 0,
            y: (_this$props$coordinat3 = (_this$props$coordinat4 = this.props.coordinate) === null || _this$props$coordinat4 === void 0 ? void 0 : _this$props$coordinat4.y) !== null && _this$props$coordinat3 !== void 0 ? _this$props$coordinat3 : 0
          }
        });
      }
    });
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }
  componentDidUpdate() {
    var _this$props$coordinat5, _this$props$coordinat6;
    if (!this.state.dismissed) {
      return;
    }
    if (((_this$props$coordinat5 = this.props.coordinate) === null || _this$props$coordinat5 === void 0 ? void 0 : _this$props$coordinat5.x) !== this.state.dismissedAtCoordinate.x || ((_this$props$coordinat6 = this.props.coordinate) === null || _this$props$coordinat6 === void 0 ? void 0 : _this$props$coordinat6.y) !== this.state.dismissedAtCoordinate.y) {
      this.state.dismissed = false;
    }
  }
  render() {
    var {
      active,
      allowEscapeViewBox,
      animationDuration,
      animationEasing,
      children,
      coordinate,
      hasPayload,
      isAnimationActive,
      offset,
      position,
      reverseDirection,
      useTranslate3d,
      viewBox,
      wrapperStyle,
      lastBoundingBox,
      innerRef,
      hasPortalFromProps
    } = this.props;
    var {
      cssClasses,
      cssProperties
    } = getTooltipTranslate({
      allowEscapeViewBox,
      coordinate,
      offsetTopLeft: offset,
      position,
      reverseDirection,
      tooltipBox: {
        height: lastBoundingBox.height,
        width: lastBoundingBox.width
      },
      useTranslate3d,
      viewBox
    });

    // do not use absolute styles if the user has passed a custom portal prop
    var positionStyles = hasPortalFromProps ? {} : _objectSpread$o(_objectSpread$o({
      transition: isAnimationActive && active ? "transform ".concat(animationDuration, "ms ").concat(animationEasing) : undefined
    }, cssProperties), {}, {
      pointerEvents: 'none',
      visibility: !this.state.dismissed && active && hasPayload ? 'visible' : 'hidden',
      position: 'absolute',
      top: 0,
      left: 0
    });
    var outerStyle = _objectSpread$o(_objectSpread$o({}, positionStyles), {}, {
      visibility: !this.state.dismissed && active && hasPayload ? 'visible' : 'hidden'
    }, wrapperStyle);
    return (
      /*#__PURE__*/
      // This element allow listening to the `Escape` key. See https://github.com/recharts/recharts/pull/2925
      reactExports.createElement("div", {
        // @ts-expect-error typescript library does not recognize xmlns attribute, but it's required for an HTML chunk inside SVG.
        xmlns: "http://www.w3.org/1999/xhtml",
        tabIndex: -1,
        className: cssClasses,
        style: outerStyle,
        ref: innerRef
      }, children)
    );
  }
}

var parseIsSsrByDefault = () => !(typeof window !== 'undefined' && window.document && Boolean(window.document.createElement) && window.setTimeout);
var Global = {
  devToolsEnabled: false,
  isSsr: parseIsSsrByDefault()
};

var useAccessibilityLayer = () => useAppSelector(state => state.rootProps.accessibilityLayer);

function isWellBehavedNumber(n) {
  return Number.isFinite(n);
}
function isPositiveNumber(n) {
  return typeof n === 'number' && n > 0 && Number.isFinite(n);
}

function _extends$g() { return _extends$g = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$g.apply(null, arguments); }
function ownKeys$n(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$n(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$n(Object(t), true).forEach(function (r) { _defineProperty$p(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$n(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$p(e, r, t) { return (r = _toPropertyKey$p(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$p(t) { var i = _toPrimitive$p(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$p(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CURVE_FACTORIES = {
  curveBasisClosed,
  curveBasisOpen,
  curveBasis,
  curveBumpX: bumpX,
  curveBumpY: bumpY,
  curveLinearClosed,
  curveLinear,
  curveMonotoneX: monotoneX,
  curveMonotoneY: monotoneY,
  curveNatural,
  curveStep,
  curveStepAfter: stepAfter,
  curveStepBefore: stepBefore
};

/**
 * @deprecated use {@link Coordinate} instead
 * Duplicated with `Coordinate` in `util/types.ts`
 */

/**
 * @deprecated use {@link NullableCoordinate} instead
 * Duplicated with `NullableCoordinate` in `util/types.ts`
 */

var defined = p => isWellBehavedNumber(p.x) && isWellBehavedNumber(p.y);
var getX = p => p.x;
var getY = p => p.y;
var getCurveFactory = (type, layout) => {
  if (typeof type === 'function') {
    return type;
  }
  var name = "curve".concat(upperFirst(type));
  if ((name === 'curveMonotone' || name === 'curveBump') && layout) {
    return CURVE_FACTORIES["".concat(name).concat(layout === 'vertical' ? 'Y' : 'X')];
  }
  return CURVE_FACTORIES[name] || curveLinear;
};
/**
 * Calculate the path of curve. Returns null if points is an empty array.
 * @return path or null
 */
var getPath$1 = _ref => {
  var {
    type = 'linear',
    points = [],
    baseLine,
    layout,
    connectNulls = false
  } = _ref;
  var curveFactory = getCurveFactory(type, layout);
  var formatPoints = connectNulls ? points.filter(defined) : points;
  var lineFunction;
  if (Array.isArray(baseLine)) {
    var formatBaseLine = connectNulls ? baseLine.filter(base => defined(base)) : baseLine;
    var areaPoints = formatPoints.map((entry, index) => _objectSpread$n(_objectSpread$n({}, entry), {}, {
      base: formatBaseLine[index]
    }));
    if (layout === 'vertical') {
      lineFunction = shapeArea().y(getY).x1(getX).x0(d => d.base.x);
    } else {
      lineFunction = shapeArea().x(getX).y1(getY).y0(d => d.base.y);
    }
    lineFunction.defined(defined).curve(curveFactory);
    return lineFunction(areaPoints);
  }
  if (layout === 'vertical' && isNumber(baseLine)) {
    lineFunction = shapeArea().y(getY).x1(getX).x0(baseLine);
  } else if (isNumber(baseLine)) {
    lineFunction = shapeArea().x(getX).y1(getY).y0(baseLine);
  } else {
    lineFunction = shapeLine().x(getX).y(getY);
  }
  lineFunction.defined(defined).curve(curveFactory);
  return lineFunction(formatPoints);
};
var Curve = props => {
  var {
    className,
    points,
    path,
    pathRef
  } = props;
  if ((!points || !points.length) && !path) {
    return null;
  }
  var realPath = points && points.length ? getPath$1(props) : path;
  return /*#__PURE__*/reactExports.createElement("path", _extends$g({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
    className: clsx('recharts-curve', className),
    d: realPath === null ? undefined : realPath,
    ref: pathRef
  }));
};

var _excluded$e = ["x", "y", "top", "left", "width", "height", "className"];
function _extends$f() { return _extends$f = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$f.apply(null, arguments); }
function ownKeys$m(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$m(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$m(Object(t), true).forEach(function (r) { _defineProperty$o(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$m(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$o(e, r, t) { return (r = _toPropertyKey$o(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$o(t) { var i = _toPrimitive$o(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$o(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties$e(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$e(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$e(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var getPath = (x, y, width, height, top, left) => {
  return "M".concat(x, ",").concat(top, "v").concat(height, "M").concat(left, ",").concat(y, "h").concat(width);
};
var Cross = _ref => {
  var {
      x = 0,
      y = 0,
      top = 0,
      left = 0,
      width = 0,
      height = 0,
      className
    } = _ref,
    rest = _objectWithoutProperties$e(_ref, _excluded$e);
  var props = _objectSpread$m({
    x,
    y,
    top,
    left,
    width,
    height
  }, rest);
  if (!isNumber(x) || !isNumber(y) || !isNumber(width) || !isNumber(height) || !isNumber(top) || !isNumber(left)) {
    return null;
  }
  return /*#__PURE__*/reactExports.createElement("path", _extends$f({}, filterProps(props, true), {
    className: clsx('recharts-cross', className),
    d: getPath(x, y, width, height, top, left)
  }));
};

function getCursorRectangle(layout, activeCoordinate, offset, tooltipAxisBandSize) {
  var halfSize = tooltipAxisBandSize / 2;
  return {
    stroke: 'none',
    fill: '#ccc',
    x: layout === 'horizontal' ? activeCoordinate.x - halfSize : offset.left + 0.5,
    y: layout === 'horizontal' ? offset.top + 0.5 : activeCoordinate.y - halfSize,
    width: layout === 'horizontal' ? tooltipAxisBandSize : offset.width - 1,
    height: layout === 'horizontal' ? offset.height - 1 : tooltipAxisBandSize
  };
}

function ownKeys$l(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$l(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$l(Object(t), true).forEach(function (r) { _defineProperty$n(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$l(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$n(e, r, t) { return (r = _toPropertyKey$n(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$n(t) { var i = _toPrimitive$n(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$n(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * This function mimics the behavior of the `defaultProps` static property in React.
 * Functional components do not have a defaultProps property, so this function is useful to resolve default props.
 *
 * The common recommendation is to use ES6 destructuring with default values in the function signature,
 * but you need to be careful there and make sure you destructure all the individual properties
 * and not the whole object. See the test file for example.
 *
 * And because destructuring all properties one by one is a faff, and it's easy to miss one property,
 * this function exists.
 *
 * @param realProps - the props object passed to the component by the user
 * @param defaultProps - the default props object defined in the component by Recharts
 * @returns - the props object with all the default props resolved. All `undefined` values are replaced with the default value.
 */
function resolveDefaultProps(realProps, defaultProps) {
  /*
   * To avoid mutating the original `realProps` object passed to the function, create a shallow copy of it.
   * `resolvedProps` will be modified directly with the defaults.
   */
  var resolvedProps = _objectSpread$l({}, realProps);
  /*
   * Since the function guarantees `D extends Partial<T>`, this assignment is safe.
   * It allows TypeScript to work with the well-defined `Partial<T>` type inside the loop,
   * making subsequent type inference (especially for `dp[key]`) much more straightforward for the compiler.
   * This is a key step to improve type safety *without* value assertions later.
   */
  var dp = defaultProps;
  /*
   * `Object.keys` doesn't preserve strong key types - it always returns Array<string>.
   * However, due to the `D extends Partial<T>` constraint,
   * we know these keys *must* also be valid keys of `T`.
   * This assertion informs TypeScript of this relationship, avoiding type errors when using `key` to index `acc` (type T).
   *
   * Type assertions are not sound but in this case it's necessary
   * as `Object.keys` does not do what we want it to do.
   */
  var keys = Object.keys(defaultProps);
  var withDefaults = keys.reduce((acc, key) => {
    if (acc[key] === undefined && dp[key] !== undefined) {
      acc[key] = dp[key];
    }
    return acc;
  }, resolvedProps);
  /*
   * And again type assertions are not safe but here we have done the runtime work
   * so let's bypass the lack of static type safety and tell the compiler what happened.
   */
  return withDefaults;
}

/**
 * Helper type to extract the keys of T that are required.
 * It iterates through each key K in T. If Pick<T, K> cannot be assigned an empty object {},
 * it means K is required, so we keep K; otherwise, we discard it (never).
 * [keyof T] at the end creates a union of the kept keys.
 */

/**
 * Helper type to extract the keys of T that are optional.
 * It iterates through each key K in T. If Pick<T, K> can be assigned an empty object {},
 * it means K is optional (or potentially missing), so we keep K; otherwise, we discard it (never).
 * [keyof T] at the end creates a union of the kept keys.
 */

/**
 * Helper type to ensure keys of D exist in T.
 * For each key K in D, if K is also a key of T, keep the type D[K].
 * If K is NOT a key of T, map it to type `never`.
 * An object cannot have a property of type `never`, effectively disallowing extra keys.
 */

/**
 * This type will take a source type `Props` and a default type `Defaults` and will return a new type
 * where all properties that are optional in `Props` but required in `Defaults` are made required in the result.
 * Properties that are required in `Props` and optional in `Defaults` will remain required.
 * Properties that are optional in both `Props` and `Defaults` will remain optional.
 *
 * This is useful for creating a type that represents the resolved props of a component with default props.
 */

function ownKeys$k(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$k(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$k(Object(t), true).forEach(function (r) { _defineProperty$m(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$k(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$m(e, r, t) { return (r = _toPropertyKey$m(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$m(t) { var i = _toPrimitive$m(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$m(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/*
 * @description: convert camel case to dash case
 * string => string
 */
var getDashCase = name => name.replace(/([A-Z])/g, v => "-".concat(v.toLowerCase()));
var getTransitionVal = (props, duration, easing) => props.map(prop => "".concat(getDashCase(prop), " ").concat(duration, "ms ").concat(easing)).join(',');

/**
 * Finds the intersection of keys between two objects
 * @param {object} preObj previous object
 * @param {object} nextObj next object
 * @returns an array of keys that exist in both objects
 */
var getIntersectionKeys = (preObj, nextObj) => [Object.keys(preObj), Object.keys(nextObj)].reduce((a, b) => a.filter(c => b.includes(c)));

/**
 * Maps an object to another object
 * @param {function} fn function to map
 * @param {object} obj object to map
 * @returns mapped object
 */
var mapObject = (fn, obj) => Object.keys(obj).reduce((res, key) => _objectSpread$k(_objectSpread$k({}, res), {}, {
  [key]: fn(key, obj[key])
}), {});

function ownKeys$j(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$j(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$j(Object(t), true).forEach(function (r) { _defineProperty$l(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$j(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$l(e, r, t) { return (r = _toPropertyKey$l(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$l(t) { var i = _toPrimitive$l(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$l(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var alpha = (begin, end, k) => begin + (end - begin) * k;
var needContinue = _ref => {
  var {
    from,
    to
  } = _ref;
  return from !== to;
};
/*
 * @description: cal new from value and velocity in each stepper
 * @return: { [styleProperty]: { from, to, velocity } }
 */
var calStepperVals = (easing, preVals, steps) => {
  var nextStepVals = mapObject((key, val) => {
    if (needContinue(val)) {
      var [newX, newV] = easing(val.from, val.to, val.velocity);
      return _objectSpread$j(_objectSpread$j({}, val), {}, {
        from: newX,
        velocity: newV
      });
    }
    return val;
  }, preVals);
  if (steps < 1) {
    return mapObject((key, val) => {
      if (needContinue(val)) {
        return _objectSpread$j(_objectSpread$j({}, val), {}, {
          velocity: alpha(val.velocity, nextStepVals[key].velocity, steps),
          from: alpha(val.from, nextStepVals[key].from, steps)
        });
      }
      return val;
    }, preVals);
  }
  return calStepperVals(easing, nextStepVals, steps - 1);
};
function createStepperUpdate(from, to, easing, interKeys, render, timeoutController) {
  var preTime;
  var stepperStyle = interKeys.reduce((res, key) => _objectSpread$j(_objectSpread$j({}, res), {}, {
    [key]: {
      from: from[key],
      velocity: 0,
      to: to[key]
    }
  }), {});
  var getCurrStyle = () => mapObject((key, val) => val.from, stepperStyle);
  var shouldStopAnimation = () => !Object.values(stepperStyle).filter(needContinue).length;
  var stopAnimation = null;
  var stepperUpdate = now => {
    if (!preTime) {
      preTime = now;
    }
    var deltaTime = now - preTime;
    var steps = deltaTime / easing.dt;
    stepperStyle = calStepperVals(easing, stepperStyle, steps);
    // get union set and add compatible prefix
    render(_objectSpread$j(_objectSpread$j(_objectSpread$j({}, from), to), getCurrStyle()));
    preTime = now;
    if (!shouldStopAnimation()) {
      stopAnimation = timeoutController.setTimeout(stepperUpdate);
    }
  };

  // return start animation method
  return () => {
    stopAnimation = timeoutController.setTimeout(stepperUpdate);

    // return stop animation method
    return () => {
      stopAnimation();
    };
  };
}
function createTimingUpdate(from, to, easing, duration, interKeys, render, timeoutController) {
  var stopAnimation = null;
  var timingStyle = interKeys.reduce((res, key) => _objectSpread$j(_objectSpread$j({}, res), {}, {
    [key]: [from[key], to[key]]
  }), {});
  var beginTime;
  var timingUpdate = now => {
    if (!beginTime) {
      beginTime = now;
    }
    var t = (now - beginTime) / duration;
    var currStyle = mapObject((key, val) => alpha(...val, easing(t)), timingStyle);

    // get union set and add compatible prefix
    render(_objectSpread$j(_objectSpread$j(_objectSpread$j({}, from), to), currStyle));
    if (t < 1) {
      stopAnimation = timeoutController.setTimeout(timingUpdate);
    } else {
      var finalStyle = mapObject((key, val) => alpha(...val, easing(1)), timingStyle);
      render(_objectSpread$j(_objectSpread$j(_objectSpread$j({}, from), to), finalStyle));
    }
  };

  // return start animation method
  return () => {
    stopAnimation = timeoutController.setTimeout(timingUpdate);

    // return stop animation method
    return () => {
      stopAnimation();
    };
  };
}

// configure update function
// eslint-disable-next-line import/no-default-export
const configUpdate = (from, to, easing, duration, render, timeoutController) => {
  var interKeys = getIntersectionKeys(from, to);
  return easing.isStepper === true ? createStepperUpdate(from, to, easing, interKeys, render, timeoutController) : createTimingUpdate(from, to, easing, duration, interKeys, render, timeoutController);
};

var ACCURACY = 1e-4;
var cubicBezierFactor = (c1, c2) => [0, 3 * c1, 3 * c2 - 6 * c1, 3 * c1 - 3 * c2 + 1];
var evaluatePolynomial = (params, t) => params.map((param, i) => param * t ** i).reduce((pre, curr) => pre + curr);
var cubicBezier = (c1, c2) => t => {
  var params = cubicBezierFactor(c1, c2);
  return evaluatePolynomial(params, t);
};
var derivativeCubicBezier = (c1, c2) => t => {
  var params = cubicBezierFactor(c1, c2);
  var newParams = [...params.map((param, i) => param * i).slice(1), 0];
  return evaluatePolynomial(newParams, t);
};
// calculate cubic-bezier using Newton's method
var configBezier = function configBezier() {
  var x1, x2, y1, y2;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (args.length === 1) {
    switch (args[0]) {
      case 'linear':
        [x1, y1, x2, y2] = [0.0, 0.0, 1.0, 1.0];
        break;
      case 'ease':
        [x1, y1, x2, y2] = [0.25, 0.1, 0.25, 1.0];
        break;
      case 'ease-in':
        [x1, y1, x2, y2] = [0.42, 0.0, 1.0, 1.0];
        break;
      case 'ease-out':
        [x1, y1, x2, y2] = [0.42, 0.0, 0.58, 1.0];
        break;
      case 'ease-in-out':
        [x1, y1, x2, y2] = [0.0, 0.0, 0.58, 1.0];
        break;
      default:
        {
          var easing = args[0].split('(');
          if (easing[0] === 'cubic-bezier' && easing[1].split(')')[0].split(',').length === 4) {
            [x1, y1, x2, y2] = easing[1].split(')')[0].split(',').map(x => parseFloat(x));
          }
        }
    }
  } else if (args.length === 4) {
    [x1, y1, x2, y2] = args;
  }
  var curveX = cubicBezier(x1, x2);
  var curveY = cubicBezier(y1, y2);
  var derCurveX = derivativeCubicBezier(x1, x2);
  var rangeValue = value => {
    if (value > 1) {
      return 1;
    }
    if (value < 0) {
      return 0;
    }
    return value;
  };
  var bezier = _t => {
    var t = _t > 1 ? 1 : _t;
    var x = t;
    for (var i = 0; i < 8; ++i) {
      var evalT = curveX(x) - t;
      var derVal = derCurveX(x);
      if (Math.abs(evalT - t) < ACCURACY || derVal < ACCURACY) {
        return curveY(x);
      }
      x = rangeValue(x - evalT / derVal);
    }
    return curveY(x);
  };
  bezier.isStepper = false;
  return bezier;
};
var configSpring = function configSpring() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var {
    stiff = 100,
    damping = 8,
    dt = 17
  } = config;
  var stepper = (currX, destX, currV) => {
    var FSpring = -(currX - destX) * stiff;
    var FDamping = currV * damping;
    var newV = currV + (FSpring - FDamping) * dt / 1000;
    var newX = currV * dt / 1000 + currX;
    if (Math.abs(newX - destX) < ACCURACY && Math.abs(newV) < ACCURACY) {
      return [destX, 0];
    }
    return [newX, newV];
  };
  stepper.isStepper = true;
  stepper.dt = dt;
  return stepper;
};
var configEasing = easing => {
  if (typeof easing === 'string') {
    switch (easing) {
      case 'ease':
      case 'ease-in-out':
      case 'ease-out':
      case 'ease-in':
      case 'linear':
        return configBezier(easing);
      case 'spring':
        return configSpring();
      default:
        if (easing.split('(')[0] === 'cubic-bezier') {
          return configBezier(easing);
        }
    }
  }
  if (typeof easing === 'function') {
    return easing;
  }
  return null;
};

/**
 * Represents a single item in the ReactSmoothQueue.
 * The item can be:
 * - A number representing a delay in milliseconds.
 * - An object representing a style change
 * - A StartAnimationFunction that starts eased transition and calls different render
 *      because of course in Recharts we have to have three ways to do everything
 * - An arbitrary function to be executed
 */

function createAnimateManager(timeoutController) {
  var currStyle;
  var handleChange = () => null;
  var shouldStop = false;
  var cancelTimeout = null;
  var setStyle = _style => {
    if (shouldStop) {
      return;
    }
    if (Array.isArray(_style)) {
      if (!_style.length) {
        return;
      }
      var styles = _style;
      var [curr, ...restStyles] = styles;
      if (typeof curr === 'number') {
        cancelTimeout = timeoutController.setTimeout(setStyle.bind(null, restStyles), curr);
        return;
      }
      setStyle(curr);
      cancelTimeout = timeoutController.setTimeout(setStyle.bind(null, restStyles));
      return;
    }
    if (typeof _style === 'string') {
      currStyle = _style;
      handleChange(currStyle);
    }
    if (typeof _style === 'object') {
      currStyle = _style;
      handleChange(currStyle);
    }
    if (typeof _style === 'function') {
      _style();
    }
  };
  return {
    stop: () => {
      shouldStop = true;
    },
    start: style => {
      shouldStop = false;
      if (cancelTimeout) {
        cancelTimeout();
        cancelTimeout = null;
      }
      setStyle(style);
    },
    subscribe: _handleChange => {
      handleChange = _handleChange;
      return () => {
        handleChange = () => null;
      };
    },
    getTimeoutController: () => timeoutController
  };
}

/**
 * Callback type for the timeout function.
 * Receives current time in milliseconds as an argument.
 */

/**
 * A function that, when called, cancels the timeout.
 */

class RequestAnimationFrameTimeoutController {
  setTimeout(callback) {
    var delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var startTime = performance.now();
    var requestId = null;
    var executeCallback = now => {
      if (now - startTime >= delay) {
        callback(now);
        // tests fail without the extra if, even when five lines below it's not needed
        // TODO finish transition to the mocked timeout controller and then remove this condition
      } else if (typeof requestAnimationFrame === 'function') {
        requestId = requestAnimationFrame(executeCallback);
      }
    };
    requestId = requestAnimationFrame(executeCallback);
    return () => {
      cancelAnimationFrame(requestId);
    };
  }
}

function createDefaultAnimationManager() {
  return createAnimateManager(new RequestAnimationFrameTimeoutController());
}

var AnimationManagerContext = /*#__PURE__*/reactExports.createContext(createDefaultAnimationManager);
function useAnimationManager(animationId, animationManagerFromProps) {
  var contextAnimationManager = reactExports.useContext(AnimationManagerContext);
  return reactExports.useMemo(() => animationManagerFromProps !== null && animationManagerFromProps !== void 0 ? animationManagerFromProps : contextAnimationManager(animationId), [animationId, animationManagerFromProps, contextAnimationManager]);
}

var defaultJavascriptAnimateProps = {
  begin: 0,
  duration: 1000,
  easing: 'ease',
  isActive: true,
  canBegin: true,
  onAnimationEnd: () => {},
  onAnimationStart: () => {}
};
var from = {
  t: 0
};
var to = {
  t: 1
};
function JavascriptAnimate(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultJavascriptAnimateProps);
  var {
    isActive,
    canBegin,
    duration,
    easing,
    begin,
    onAnimationEnd,
    onAnimationStart,
    children
  } = props;
  var animationManager = useAnimationManager(props.animationId, props.animationManager);
  var [style, setStyle] = reactExports.useState(isActive ? from : to);
  var stopJSAnimation = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!isActive) {
      setStyle(to);
    }
  }, [isActive]);
  reactExports.useEffect(() => {
    if (!isActive || !canBegin) {
      return noop$3;
    }
    var startAnimation = configUpdate(from, to, configEasing(easing), duration, setStyle, animationManager.getTimeoutController());
    var onAnimationActive = () => {
      stopJSAnimation.current = startAnimation();
    };
    animationManager.start([onAnimationStart, begin, onAnimationActive, duration, onAnimationEnd]);
    return () => {
      animationManager.stop();
      if (stopJSAnimation.current) {
        stopJSAnimation.current();
      }
      onAnimationEnd();
    };
  }, [isActive, canBegin, duration, easing, begin, onAnimationStart, onAnimationEnd, animationManager]);
  return children(style.t);
}

/**
 * This hook returns a unique animation id for the object input.
 * If input changes (as in, reference equality is different), the animation id will change.
 * If input does not change, the animation id will not change.
 *
 * This is useful for animations. The Animate component
 * does have a `shouldReAnimate` prop but that doesn't seem to be doing what the name implies.
 * Also, we don't always want to re-animate on every render;
 * we only want to re-animate when the input changes. Not the internal state (e.g. `isAnimating`).
 *
 * @param input The object to check for changes. Uses reference equality (=== operator)
 * @param prefix Optional prefix to use for the animation id
 * @returns A unique animation id
 */
function useAnimationId(input) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'animation-';
  var animationId = reactExports.useRef(uniqueId(prefix));
  var prevProps = reactExports.useRef(input);
  if (prevProps.current !== input) {
    animationId.current = uniqueId(prefix);
    prevProps.current = input;
  }
  return animationId.current;
}

function ownKeys$i(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$i(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$i(Object(t), true).forEach(function (r) { _defineProperty$k(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$i(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$k(e, r, t) { return (r = _toPropertyKey$k(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$k(t) { var i = _toPrimitive$k(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$k(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends$e() { return _extends$e = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$e.apply(null, arguments); }
var getRectanglePath = (x, y, width, height, radius) => {
  var maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2);
  var ySign = height >= 0 ? 1 : -1;
  var xSign = width >= 0 ? 1 : -1;
  var clockWise = height >= 0 && width >= 0 || height < 0 && width < 0 ? 1 : 0;
  var path;
  if (maxRadius > 0 && radius instanceof Array) {
    var newRadius = [0, 0, 0, 0];
    for (var i = 0, len = 4; i < len; i++) {
      newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
    }
    path = "M".concat(x, ",").concat(y + ySign * newRadius[0]);
    if (newRadius[0] > 0) {
      path += "A ".concat(newRadius[0], ",").concat(newRadius[0], ",0,0,").concat(clockWise, ",").concat(x + xSign * newRadius[0], ",").concat(y);
    }
    path += "L ".concat(x + width - xSign * newRadius[1], ",").concat(y);
    if (newRadius[1] > 0) {
      path += "A ".concat(newRadius[1], ",").concat(newRadius[1], ",0,0,").concat(clockWise, ",\n        ").concat(x + width, ",").concat(y + ySign * newRadius[1]);
    }
    path += "L ".concat(x + width, ",").concat(y + height - ySign * newRadius[2]);
    if (newRadius[2] > 0) {
      path += "A ".concat(newRadius[2], ",").concat(newRadius[2], ",0,0,").concat(clockWise, ",\n        ").concat(x + width - xSign * newRadius[2], ",").concat(y + height);
    }
    path += "L ".concat(x + xSign * newRadius[3], ",").concat(y + height);
    if (newRadius[3] > 0) {
      path += "A ".concat(newRadius[3], ",").concat(newRadius[3], ",0,0,").concat(clockWise, ",\n        ").concat(x, ",").concat(y + height - ySign * newRadius[3]);
    }
    path += 'Z';
  } else if (maxRadius > 0 && radius === +radius && radius > 0) {
    var _newRadius = Math.min(maxRadius, radius);
    path = "M ".concat(x, ",").concat(y + ySign * _newRadius, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x + xSign * _newRadius, ",").concat(y, "\n            L ").concat(x + width - xSign * _newRadius, ",").concat(y, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x + width, ",").concat(y + ySign * _newRadius, "\n            L ").concat(x + width, ",").concat(y + height - ySign * _newRadius, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x + width - xSign * _newRadius, ",").concat(y + height, "\n            L ").concat(x + xSign * _newRadius, ",").concat(y + height, "\n            A ").concat(_newRadius, ",").concat(_newRadius, ",0,0,").concat(clockWise, ",").concat(x, ",").concat(y + height - ySign * _newRadius, " Z");
  } else {
    path = "M ".concat(x, ",").concat(y, " h ").concat(width, " v ").concat(height, " h ").concat(-width, " Z");
  }
  return path;
};
var defaultProps$3 = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  // The radius of border
  // The radius of four corners when radius is a number
  // The radius of left-top, right-top, right-bottom, left-bottom when radius is an array
  radius: 0,
  isAnimationActive: false,
  isUpdateAnimationActive: false,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease'
};
var Rectangle = rectangleProps => {
  var props = resolveDefaultProps(rectangleProps, defaultProps$3);
  var pathRef = reactExports.useRef(null);
  var [totalLength, setTotalLength] = reactExports.useState(-1);
  reactExports.useEffect(() => {
    if (pathRef.current && pathRef.current.getTotalLength) {
      try {
        var pathTotalLength = pathRef.current.getTotalLength();
        if (pathTotalLength) {
          setTotalLength(pathTotalLength);
        }
      } catch (_unused) {
        // calculate total length error
      }
    }
  }, []);
  var {
    x,
    y,
    width,
    height,
    radius,
    className
  } = props;
  var {
    animationEasing,
    animationDuration,
    animationBegin,
    isAnimationActive,
    isUpdateAnimationActive
  } = props;
  var prevWidthRef = reactExports.useRef(width);
  var prevHeightRef = reactExports.useRef(height);
  var prevXRef = reactExports.useRef(x);
  var prevYRef = reactExports.useRef(y);
  var animationIdInput = reactExports.useMemo(() => ({
    x,
    y,
    width,
    height,
    radius
  }), [x, y, width, height, radius]);
  var animationId = useAnimationId(animationIdInput, 'rectangle-');
  if (x !== +x || y !== +y || width !== +width || height !== +height || width === 0 || height === 0) {
    return null;
  }
  var layerClass = clsx('recharts-rectangle', className);
  if (!isUpdateAnimationActive) {
    return /*#__PURE__*/reactExports.createElement("path", _extends$e({}, filterProps(props, true), {
      className: layerClass,
      d: getRectanglePath(x, y, width, height, radius)
    }));
  }
  var prevWidth = prevWidthRef.current;
  var prevHeight = prevHeightRef.current;
  var prevX = prevXRef.current;
  var prevY = prevYRef.current;
  var from = "0px ".concat(totalLength === -1 ? 1 : totalLength, "px");
  var to = "".concat(totalLength, "px 0px");
  var transition = getTransitionVal(['strokeDasharray'], animationDuration, typeof animationEasing === 'string' ? animationEasing : undefined);
  return /*#__PURE__*/reactExports.createElement(JavascriptAnimate, {
    animationId: animationId,
    key: animationId,
    canBegin: totalLength > 0,
    duration: animationDuration,
    easing: animationEasing,
    isActive: isUpdateAnimationActive,
    begin: animationBegin
  }, t => {
    var currWidth = interpolate(prevWidth, width, t);
    var currHeight = interpolate(prevHeight, height, t);
    var currX = interpolate(prevX, x, t);
    var currY = interpolate(prevY, y, t);
    if (pathRef.current) {
      prevWidthRef.current = currWidth;
      prevHeightRef.current = currHeight;
      prevXRef.current = currX;
      prevYRef.current = currY;
    }
    var animationStyle;
    if (!isAnimationActive) {
      animationStyle = {
        strokeDasharray: to
      };
    } else if (t > 0) {
      animationStyle = {
        transition,
        strokeDasharray: to
      };
    } else {
      animationStyle = {
        strokeDasharray: from
      };
    }
    return /*#__PURE__*/reactExports.createElement("path", _extends$e({}, filterProps(props, true), {
      className: layerClass,
      d: getRectanglePath(currX, currY, currWidth, currHeight, radius),
      ref: pathRef,
      style: _objectSpread$i(_objectSpread$i({}, animationStyle), props.style)
    }));
  });
};

/**
 * Only applicable for radial layouts
 * @param {Object} activeCoordinate ChartCoordinate
 * @returns {Object} RadialCursorPoints
 */
function getRadialCursorPoints(activeCoordinate) {
  var {
    cx,
    cy,
    radius,
    startAngle,
    endAngle
  } = activeCoordinate;
  var startPoint = polarToCartesian(cx, cy, radius, startAngle);
  var endPoint = polarToCartesian(cx, cy, radius, endAngle);
  return {
    points: [startPoint, endPoint],
    cx,
    cy,
    radius,
    startAngle,
    endAngle
  };
}

function _extends$d() { return _extends$d = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$d.apply(null, arguments); }
var getDeltaAngle$1 = (startAngle, endAngle) => {
  var sign = mathSign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 359.999);
  return sign * deltaAngle;
};
var getTangentCircle = _ref => {
  var {
    cx,
    cy,
    radius,
    angle,
    sign,
    isExternal,
    cornerRadius,
    cornerIsExternal
  } = _ref;
  var centerRadius = cornerRadius * (isExternal ? 1 : -1) + radius;
  var theta = Math.asin(cornerRadius / centerRadius) / RADIAN;
  var centerAngle = cornerIsExternal ? angle : angle + sign * theta;
  var center = polarToCartesian(cx, cy, centerRadius, centerAngle);
  // The coordinate of point which is tangent to the circle
  var circleTangency = polarToCartesian(cx, cy, radius, centerAngle);
  // The coordinate of point which is tangent to the radius line
  var lineTangencyAngle = cornerIsExternal ? angle - sign * theta : angle;
  var lineTangency = polarToCartesian(cx, cy, centerRadius * Math.cos(theta * RADIAN), lineTangencyAngle);
  return {
    center,
    circleTangency,
    lineTangency,
    theta
  };
};
var getSectorPath = _ref2 => {
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle
  } = _ref2;
  var angle = getDeltaAngle$1(startAngle, endAngle);

  // When the angle of sector equals to 360, star point and end point coincide
  var tempEndAngle = startAngle + angle;
  var outerStartPoint = polarToCartesian(cx, cy, outerRadius, startAngle);
  var outerEndPoint = polarToCartesian(cx, cy, outerRadius, tempEndAngle);
  var path = "M ".concat(outerStartPoint.x, ",").concat(outerStartPoint.y, "\n    A ").concat(outerRadius, ",").concat(outerRadius, ",0,\n    ").concat(+(Math.abs(angle) > 180), ",").concat(+(startAngle > tempEndAngle), ",\n    ").concat(outerEndPoint.x, ",").concat(outerEndPoint.y, "\n  ");
  if (innerRadius > 0) {
    var innerStartPoint = polarToCartesian(cx, cy, innerRadius, startAngle);
    var innerEndPoint = polarToCartesian(cx, cy, innerRadius, tempEndAngle);
    path += "L ".concat(innerEndPoint.x, ",").concat(innerEndPoint.y, "\n            A ").concat(innerRadius, ",").concat(innerRadius, ",0,\n            ").concat(+(Math.abs(angle) > 180), ",").concat(+(startAngle <= tempEndAngle), ",\n            ").concat(innerStartPoint.x, ",").concat(innerStartPoint.y, " Z");
  } else {
    path += "L ".concat(cx, ",").concat(cy, " Z");
  }
  return path;
};
var getSectorWithCorner = _ref3 => {
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    cornerRadius,
    forceCornerRadius,
    cornerIsExternal,
    startAngle,
    endAngle
  } = _ref3;
  var sign = mathSign(endAngle - startAngle);
  var {
    circleTangency: soct,
    lineTangency: solt,
    theta: sot
  } = getTangentCircle({
    cx,
    cy,
    radius: outerRadius,
    angle: startAngle,
    sign,
    cornerRadius,
    cornerIsExternal
  });
  var {
    circleTangency: eoct,
    lineTangency: eolt,
    theta: eot
  } = getTangentCircle({
    cx,
    cy,
    radius: outerRadius,
    angle: endAngle,
    sign: -sign,
    cornerRadius,
    cornerIsExternal
  });
  var outerArcAngle = cornerIsExternal ? Math.abs(startAngle - endAngle) : Math.abs(startAngle - endAngle) - sot - eot;
  if (outerArcAngle < 0) {
    if (forceCornerRadius) {
      return "M ".concat(solt.x, ",").concat(solt.y, "\n        a").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,1,").concat(cornerRadius * 2, ",0\n        a").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,1,").concat(-cornerRadius * 2, ",0\n      ");
    }
    return getSectorPath({
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    });
  }
  var path = "M ".concat(solt.x, ",").concat(solt.y, "\n    A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(soct.x, ",").concat(soct.y, "\n    A").concat(outerRadius, ",").concat(outerRadius, ",0,").concat(+(outerArcAngle > 180), ",").concat(+(sign < 0), ",").concat(eoct.x, ",").concat(eoct.y, "\n    A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(eolt.x, ",").concat(eolt.y, "\n  ");
  if (innerRadius > 0) {
    var {
      circleTangency: sict,
      lineTangency: silt,
      theta: sit
    } = getTangentCircle({
      cx,
      cy,
      radius: innerRadius,
      angle: startAngle,
      sign,
      isExternal: true,
      cornerRadius,
      cornerIsExternal
    });
    var {
      circleTangency: eict,
      lineTangency: eilt,
      theta: eit
    } = getTangentCircle({
      cx,
      cy,
      radius: innerRadius,
      angle: endAngle,
      sign: -sign,
      isExternal: true,
      cornerRadius,
      cornerIsExternal
    });
    var innerArcAngle = cornerIsExternal ? Math.abs(startAngle - endAngle) : Math.abs(startAngle - endAngle) - sit - eit;
    if (innerArcAngle < 0 && cornerRadius === 0) {
      return "".concat(path, "L").concat(cx, ",").concat(cy, "Z");
    }
    path += "L".concat(eilt.x, ",").concat(eilt.y, "\n      A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(eict.x, ",").concat(eict.y, "\n      A").concat(innerRadius, ",").concat(innerRadius, ",0,").concat(+(innerArcAngle > 180), ",").concat(+(sign > 0), ",").concat(sict.x, ",").concat(sict.y, "\n      A").concat(cornerRadius, ",").concat(cornerRadius, ",0,0,").concat(+(sign < 0), ",").concat(silt.x, ",").concat(silt.y, "Z");
  } else {
    path += "L".concat(cx, ",").concat(cy, "Z");
  }
  return path;
};

/**
 * SVG cx, cy are `string | number | undefined`, but internally we use `number` so let's
 * override the types here.
 */

var defaultProps$2 = {
  cx: 0,
  cy: 0,
  innerRadius: 0,
  outerRadius: 0,
  startAngle: 0,
  endAngle: 0,
  cornerRadius: 0,
  forceCornerRadius: false,
  cornerIsExternal: false
};
var Sector = sectorProps => {
  var props = resolveDefaultProps(sectorProps, defaultProps$2);
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    cornerRadius,
    forceCornerRadius,
    cornerIsExternal,
    startAngle,
    endAngle,
    className
  } = props;
  if (outerRadius < innerRadius || startAngle === endAngle) {
    return null;
  }
  var layerClass = clsx('recharts-sector', className);
  var deltaRadius = outerRadius - innerRadius;
  var cr = getPercentValue(cornerRadius, deltaRadius, 0, true);
  var path;
  if (cr > 0 && Math.abs(startAngle - endAngle) < 360) {
    path = getSectorWithCorner({
      cx,
      cy,
      innerRadius,
      outerRadius,
      cornerRadius: Math.min(cr, deltaRadius / 2),
      forceCornerRadius,
      cornerIsExternal,
      startAngle,
      endAngle
    });
  } else {
    path = getSectorPath({
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    });
  }
  return /*#__PURE__*/reactExports.createElement("path", _extends$d({}, filterProps(props, true), {
    className: layerClass,
    d: path
  }));
};

function getCursorPoints(layout, activeCoordinate, offset) {
  var x1, y1, x2, y2;
  if (layout === 'horizontal') {
    x1 = activeCoordinate.x;
    x2 = x1;
    y1 = offset.top;
    y2 = offset.top + offset.height;
  } else if (layout === 'vertical') {
    y1 = activeCoordinate.y;
    y2 = y1;
    x1 = offset.left;
    x2 = offset.left + offset.width;
  } else if (activeCoordinate.cx != null && activeCoordinate.cy != null) {
    if (layout === 'centric') {
      var {
        cx,
        cy,
        innerRadius,
        outerRadius,
        angle
      } = activeCoordinate;
      var innerPoint = polarToCartesian(cx, cy, innerRadius, angle);
      var outerPoint = polarToCartesian(cx, cy, outerRadius, angle);
      x1 = innerPoint.x;
      y1 = innerPoint.y;
      x2 = outerPoint.x;
      y2 = outerPoint.y;
    } else {
      // @ts-expect-error TODO the state is marked as containing Coordinate but actually in polar charts it contains PolarCoordinate, we should keep the polar state separate
      return getRadialCursorPoints(activeCoordinate);
    }
  }
  return [{
    x: x1,
    y: y1
  }, {
    x: x2,
    y: y2
  }];
}

/**
 * This selector always returns the data with the indexes set by a Brush.
 * Trouble is, that might or might not be what you want.
 *
 * In charts with Brush, you will sometimes want to select the full range of data, and sometimes the one decided by the Brush
 * - even if the Brush is active, the panorama inside the Brush should show the full range of data.
 *
 * So instead of this selector, consider using either selectChartDataAndAlwaysIgnoreIndexes or selectChartDataWithIndexesIfNotInPanorama
 *
 * @param state RechartsRootState
 * @returns data defined on the chart root element, such as BarChart or ScatterChart
 */
var selectChartDataWithIndexes = state => state.chartData;

/**
 * This selector will always return the full range of data, ignoring the indexes set by a Brush.
 * Useful for when you want to render the full range of data, even if a Brush is active.
 * For example: in the Brush panorama, in Legend, in Tooltip.
 */
var selectChartDataAndAlwaysIgnoreIndexes = createSelector([selectChartDataWithIndexes], dataState => {
  var dataEndIndex = dataState.chartData != null ? dataState.chartData.length - 1 : 0;
  return {
    chartData: dataState.chartData,
    computedData: dataState.computedData,
    dataEndIndex,
    dataStartIndex: 0
  };
});
var selectChartDataWithIndexesIfNotInPanorama = (state, _unused1, _unused2, isPanorama) => {
  if (isPanorama) {
    return selectChartDataAndAlwaysIgnoreIndexes(state);
  }
  return selectChartDataWithIndexes(state);
};

function isWellFormedNumberDomain(v) {
  if (Array.isArray(v) && v.length === 2) {
    var [min, max] = v;
    if (isWellBehavedNumber(min) && isWellBehavedNumber(max)) {
      return true;
    }
  }
  return false;
}
function extendDomain(providedDomain, boundaryDomain, allowDataOverflow) {
  if (allowDataOverflow) {
    // If the data are allowed to overflow - we're fine with whatever user provided
    return providedDomain;
  }
  /*
   * If the data are not allowed to overflow - we need to extend the domain.
   * Means that effectively the user is allowed to make the domain larger
   * but not smaller.
   */
  return [Math.min(providedDomain[0], boundaryDomain[0]), Math.max(providedDomain[1], boundaryDomain[1])];
}

/**
 * So Recharts allows users to provide their own domains,
 * but it also places some expectations on what the domain is.
 * We can improve on the typescript typing, but we also need a runtime test
 to observe that the user-provided domain is well-formed,
 * that is: an array with exactly two numbers.
 *
 * This function does not accept data as an argument.
 * This is to enable a performance optimization - if the domain is there,
 * and we know what it is without traversing all the data,
 * then we don't have to traverse all the data!
 *
 * If the user-provided domain is not well-formed,
 * this function will return undefined - in which case we should traverse the data to calculate the real domain.
 *
 * This function is for parsing the numerical domain only.
 *
 * @param userDomain external prop, user provided, before validation. Can have various shapes: array, function, special magical strings inside too.
 * @param allowDataOverflow boolean, provided by users. If true then the data domain wins
 *
 * @return [min, max] domain if it's well-formed; undefined if the domain is invalid
 */
function numericalDomainSpecifiedWithoutRequiringData(userDomain, allowDataOverflow) {
  if (!allowDataOverflow) {
    // Cannot compute data overflow if the data is not provided
    return undefined;
  }
  if (typeof userDomain === 'function') {
    // The user function expects the data to be provided as an argument
    return undefined;
  }
  if (Array.isArray(userDomain) && userDomain.length === 2) {
    var [providedMin, providedMax] = userDomain;
    var finalMin, finalMax;
    if (isWellBehavedNumber(providedMin)) {
      finalMin = providedMin;
    } else if (typeof providedMin === 'function') {
      // The user function expects the data to be provided as an argument
      return undefined;
    }
    if (isWellBehavedNumber(providedMax)) {
      finalMax = providedMax;
    } else if (typeof providedMax === 'function') {
      // The user function expects the data to be provided as an argument
      return undefined;
    }
    var candidate = [finalMin, finalMax];
    if (isWellFormedNumberDomain(candidate)) {
      return candidate;
    }
  }
  return undefined;
}

/**
 * So Recharts allows users to provide their own domains,
 * but it also places some expectations on what the domain is.
 * We can improve on the typescript typing, but we also need a runtime test
 * to observe that the user-provided domain is well-formed,
 * that is: an array with exactly two numbers.
 * If the user-provided domain is not well-formed,
 * this function will return undefined - in which case we should traverse the data to calculate the real domain.
 *
 * This function is for parsing the numerical domain only.
 *
 * You are probably thinking, why does domain need tick count?
 * Well it adjusts the domain based on where the "nice ticks" land, and nice ticks depend on the tick count.
 *
 * @param userDomain external prop, user provided, before validation. Can have various shapes: array, function, special magical strings inside too.
 * @param dataDomain calculated from data. Can be undefined, as an option for performance optimization
 * @param allowDataOverflow provided by users. If true then the data domain wins
 *
 * @return [min, max] domain if it's well-formed; undefined if the domain is invalid
 */
function parseNumericalUserDomain(userDomain, dataDomain, allowDataOverflow) {
  if (!allowDataOverflow && dataDomain == null) {
    // Cannot compute data overflow if the data is not provided
    return undefined;
  }
  if (typeof userDomain === 'function' && dataDomain != null) {
    try {
      var result = userDomain(dataDomain, allowDataOverflow);
      if (isWellFormedNumberDomain(result)) {
        return extendDomain(result, dataDomain, allowDataOverflow);
      }
    } catch (_unused) {
      /* ignore the exception and compute domain from data later */
    }
  }
  if (Array.isArray(userDomain) && userDomain.length === 2) {
    var [providedMin, providedMax] = userDomain;
    var finalMin, finalMax;
    if (providedMin === 'auto') {
      if (dataDomain != null) {
        finalMin = Math.min(...dataDomain);
      }
    } else if (isNumber(providedMin)) {
      finalMin = providedMin;
    } else if (typeof providedMin === 'function') {
      try {
        if (dataDomain != null) {
          finalMin = providedMin(dataDomain === null || dataDomain === void 0 ? void 0 : dataDomain[0]);
        }
      } catch (_unused2) {
        /* ignore the exception and compute domain from data later */
      }
    } else if (typeof providedMin === 'string' && MIN_VALUE_REG.test(providedMin)) {
      var match = MIN_VALUE_REG.exec(providedMin);
      if (match == null || dataDomain == null) {
        finalMin = undefined;
      } else {
        var value = +match[1];
        finalMin = dataDomain[0] - value;
      }
    } else {
      finalMin = dataDomain === null || dataDomain === void 0 ? void 0 : dataDomain[0];
    }
    if (providedMax === 'auto') {
      if (dataDomain != null) {
        finalMax = Math.max(...dataDomain);
      }
    } else if (isNumber(providedMax)) {
      finalMax = providedMax;
    } else if (typeof providedMax === 'function') {
      try {
        if (dataDomain != null) {
          finalMax = providedMax(dataDomain === null || dataDomain === void 0 ? void 0 : dataDomain[1]);
        }
      } catch (_unused3) {
        /* ignore the exception and compute domain from data later */
      }
    } else if (typeof providedMax === 'string' && MAX_VALUE_REG.test(providedMax)) {
      var _match = MAX_VALUE_REG.exec(providedMax);
      if (_match == null || dataDomain == null) {
        finalMax = undefined;
      } else {
        var _value = +_match[1];
        finalMax = dataDomain[1] + _value;
      }
    } else {
      finalMax = dataDomain === null || dataDomain === void 0 ? void 0 : dataDomain[1];
    }
    var candidate = [finalMin, finalMax];
    if (isWellFormedNumberDomain(candidate)) {
      if (dataDomain == null) {
        return candidate;
      }
      return extendDomain(candidate, dataDomain, allowDataOverflow);
    }
  }
  return undefined;
}

var identity = i => i;
var PLACE_HOLDER = {
  };
var isPlaceHolder = val => val === PLACE_HOLDER;
var curry0 = fn => function _curried() {
  if (arguments.length === 0 || arguments.length === 1 && isPlaceHolder(arguments.length <= 0 ? undefined : arguments[0])) {
    return _curried;
  }
  return fn(...arguments);
};
var curryN = (n, fn) => {
  if (n === 1) {
    return fn;
  }
  return curry0(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var argsLength = args.filter(arg => arg !== PLACE_HOLDER).length;
    if (argsLength >= n) {
      return fn(...args);
    }
    return curryN(n - argsLength, curry0(function () {
      for (var _len2 = arguments.length, restArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        restArgs[_key2] = arguments[_key2];
      }
      var newArgs = args.map(arg => isPlaceHolder(arg) ? restArgs.shift() : arg);
      return fn(...newArgs, ...restArgs);
    }));
  });
};
var curry = fn => curryN(fn.length, fn);
var range = (begin, end) => {
  var arr = [];
  for (var i = begin; i < end; ++i) {
    arr[i - begin] = i;
  }
  return arr;
};
var map = curry((fn, arr) => {
  if (Array.isArray(arr)) {
    return arr.map(fn);
  }
  return Object.keys(arr).map(key => arr[key]).map(fn);
});
var compose = function compose() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  if (!args.length) {
    return identity;
  }
  var fns = args.reverse();
  // first function can receive multiply arguments
  var firstFn = fns[0];
  var tailsFn = fns.slice(1);
  return function () {
    return tailsFn.reduce((res, fn) => fn(res), firstFn(...arguments));
  };
};
var reverse = arr => {
  if (Array.isArray(arr)) {
    return arr.reverse();
  }

  // can be string
  return arr.split('').reverse().join('');
};
var memoize = fn => {
  var lastArgs = null;
  var lastResult = null;
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    if (lastArgs && args.every((val, i) => {
      var _lastArgs;
      return val === ((_lastArgs = lastArgs) === null || _lastArgs === void 0 ? void 0 : _lastArgs[i]);
    })) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = fn(...args);
    return lastResult;
  };
};

/**
 * @fileOverview Some common arithmetic methods
 * @author xile611
 * @date 2015-09-17
 */

/**
 * Get the digit count of a number.
 * If the absolute value is in the interval [0.1, 1), the result is 0.
 * If the absolute value is in the interval [0.01, 0.1), the digit count is -1.
 * If the absolute value is in the interval [0.001, 0.01), the digit count is -2.
 *
 * @param  {Number} value The number
 * @return {Integer}      Digit count
 */
function getDigitCount(value) {
  var result;
  if (value === 0) {
    result = 1;
  } else {
    result = Math.floor(new Decimal(value).abs().log(10).toNumber()) + 1;
  }
  return result;
}

/**
 * Get the data in the interval [start, end) with a fixed step.
 * Also handles JS calculation precision issues.
 *
 * @param  {Decimal} start Start point
 * @param  {Decimal} end   End point, not included
 * @param  {Decimal} step  Step size
 * @return {Array}         Array of numbers
 */
function rangeStep(start, end, step) {
  var num = new Decimal(start);
  var i = 0;
  var result = [];

  // magic number to prevent infinite loop
  while (num.lt(end) && i < 100000) {
    result.push(num.toNumber());
    num = num.add(step);
    i++;
  }
  return result;
}

/**
 * Linear interpolation of numbers.
 *
 * @param  {Number} a  Endpoint of the domain
 * @param  {Number} b  Endpoint of the domain
 * @param  {Number} t  A value in [0, 1]
 * @return {Number}    A value in the domain
 */
curry((a, b, t) => {
  var newA = +a;
  var newB = +b;
  return newA + t * (newB - newA);
});

/**
 * Inverse operation of linear interpolation.
 *
 * @param  {Number} a Endpoint of the domain
 * @param  {Number} b Endpoint of the domain
 * @param  {Number} x Can be considered as an output value after interpolation
 * @return {Number}   When x is in the range a ~ b, the return value is in [0, 1]
 */
curry((a, b, x) => {
  var diff = b - +a;
  diff = diff || Infinity;
  return (x - a) / diff;
});

/**
 * Inverse operation of linear interpolation with truncation.
 *
 * @param  {Number} a Endpoint of the domain
 * @param  {Number} b Endpoint of the domain
 * @param  {Number} x Can be considered as an output value after interpolation
 * @return {Number}   When x is in the interval a ~ b, the return value is in [0, 1].
 *                    When x is not in the interval a ~ b, it will be truncated to the interval a ~ b.
 */
curry((a, b, x) => {
  var diff = b - +a;
  diff = diff || Infinity;
  return Math.max(0, Math.min(1, (x - a) / diff));
});

/**
 * @fileOverview calculate tick values of scale
 * @author xile611, arcthur
 * @date 2015-09-17
 */

/**
 * Calculate a interval of a minimum value and a maximum value
 *
 * @param  {Number} min       The minimum value
 * @param  {Number} max       The maximum value
 * @return {Array} An interval
 */
var getValidInterval = _ref => {
  var [min, max] = _ref;
  var [validMin, validMax] = [min, max];

  // exchange
  if (min > max) {
    [validMin, validMax] = [max, min];
  }
  return [validMin, validMax];
};

/**
 * Calculate the step which is easy to understand between ticks, like 10, 20, 25
 *
 * @param  roughStep        The rough step calculated by dividing the difference by the tickCount
 * @param  allowDecimals    Allow the ticks to be decimals or not
 * @param  correctionFactor A correction factor
 * @return The step which is easy to understand between two ticks
 */
var getFormatStep = (roughStep, allowDecimals, correctionFactor) => {
  if (roughStep.lte(0)) {
    return new Decimal(0);
  }
  var digitCount = getDigitCount(roughStep.toNumber());
  // The ratio between the rough step and the smallest number which has a bigger
  // order of magnitudes than the rough step
  var digitCountValue = new Decimal(10).pow(digitCount);
  var stepRatio = roughStep.div(digitCountValue);
  // When an integer and a float multiplied, the accuracy of result may be wrong
  var stepRatioScale = digitCount !== 1 ? 0.05 : 0.1;
  var amendStepRatio = new Decimal(Math.ceil(stepRatio.div(stepRatioScale).toNumber())).add(correctionFactor).mul(stepRatioScale);
  var formatStep = amendStepRatio.mul(digitCountValue);
  return allowDecimals ? new Decimal(formatStep.toNumber()) : new Decimal(Math.ceil(formatStep.toNumber()));
};

/**
 * calculate the ticks when the minimum value equals to the maximum value
 *
 * @param  value         The minimum value which is also the maximum value
 * @param  tickCount     The count of ticks
 * @param  allowDecimals Allow the ticks to be decimals or not
 * @return array of ticks
 */
var getTickOfSingleValue = (value, tickCount, allowDecimals) => {
  var step = new Decimal(1);
  // calculate the middle value of ticks
  var middle = new Decimal(value);
  if (!middle.isint() && allowDecimals) {
    var absVal = Math.abs(value);
    if (absVal < 1) {
      // The step should be a float number when the difference is smaller than 1
      step = new Decimal(10).pow(getDigitCount(value) - 1);
      middle = new Decimal(Math.floor(middle.div(step).toNumber())).mul(step);
    } else if (absVal > 1) {
      // Return the maximum integer which is smaller than 'value' when 'value' is greater than 1
      middle = new Decimal(Math.floor(value));
    }
  } else if (value === 0) {
    middle = new Decimal(Math.floor((tickCount - 1) / 2));
  } else if (!allowDecimals) {
    middle = new Decimal(Math.floor(value));
  }
  var middleIndex = Math.floor((tickCount - 1) / 2);
  var fn = compose(map(n => middle.add(new Decimal(n - middleIndex).mul(step)).toNumber()), range);
  return fn(0, tickCount);
};

/**
 * Calculate the step
 *
 * @param  min              The minimum value of an interval
 * @param  max              The maximum value of an interval
 * @param  tickCount        The count of ticks
 * @param  allowDecimals    Allow the ticks to be decimals or not
 * @param  correctionFactor A correction factor
 * @return The step, minimum value of ticks, maximum value of ticks
 */
var _calculateStep = function calculateStep(min, max, tickCount, allowDecimals) {
  var correctionFactor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  // dirty hack (for recharts' test)
  if (!Number.isFinite((max - min) / (tickCount - 1))) {
    return {
      step: new Decimal(0),
      tickMin: new Decimal(0),
      tickMax: new Decimal(0)
    };
  }

  // The step which is easy to understand between two ticks
  var step = getFormatStep(new Decimal(max).sub(min).div(tickCount - 1), allowDecimals, correctionFactor);

  // A medial value of ticks
  var middle;

  // When 0 is inside the interval, 0 should be a tick
  if (min <= 0 && max >= 0) {
    middle = new Decimal(0);
  } else {
    // calculate the middle value
    middle = new Decimal(min).add(max).div(2);
    // minus modulo value
    middle = middle.sub(new Decimal(middle).mod(step));
  }
  var belowCount = Math.ceil(middle.sub(min).div(step).toNumber());
  var upCount = Math.ceil(new Decimal(max).sub(middle).div(step).toNumber());
  var scaleCount = belowCount + upCount + 1;
  if (scaleCount > tickCount) {
    // When more ticks need to cover the interval, step should be bigger.
    return _calculateStep(min, max, tickCount, allowDecimals, correctionFactor + 1);
  }
  if (scaleCount < tickCount) {
    // When less ticks can cover the interval, we should add some additional ticks
    upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount;
    belowCount = max > 0 ? belowCount : belowCount + (tickCount - scaleCount);
  }
  return {
    step,
    tickMin: middle.sub(new Decimal(belowCount).mul(step)),
    tickMax: middle.add(new Decimal(upCount).mul(step))
  };
};
function getNiceTickValuesFn(_ref2) {
  var [min, max] = _ref2;
  var tickCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  var allowDecimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  // More than two ticks should be return
  var count = Math.max(tickCount, 2);
  var [cormin, cormax] = getValidInterval([min, max]);
  if (cormin === -Infinity || cormax === Infinity) {
    var _values = cormax === Infinity ? [cormin, ...range(0, tickCount - 1).map(() => Infinity)] : [...range(0, tickCount - 1).map(() => -Infinity), cormax];
    return min > max ? reverse(_values) : _values;
  }
  if (cormin === cormax) {
    return getTickOfSingleValue(cormin, tickCount, allowDecimals);
  }

  // Get the step between two ticks
  var {
    step,
    tickMin,
    tickMax
  } = _calculateStep(cormin, cormax, count, allowDecimals, 0);
  var values = rangeStep(tickMin, tickMax.add(new Decimal(0.1).mul(step)), step);
  return min > max ? reverse(values) : values;
}

/**
 * Calculate the ticks of an interval.
 * Ticks will be constrained to the interval [min, max] even if it makes them less rounded and nice.
 *
 * @param tuple of [min,max] min: The minimum value, max: The maximum value
 * @param tickCount     The count of ticks. This function may return less than tickCount ticks if the interval is too small.
 * @param allowDecimals Allow the ticks to be decimals or not
 * @return array of ticks
 */
function getTickValuesFixedDomainFn(_ref3, tickCount) {
  var [min, max] = _ref3;
  var allowDecimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  // More than two ticks should be return
  var [cormin, cormax] = getValidInterval([min, max]);
  if (cormin === -Infinity || cormax === Infinity) {
    return [min, max];
  }
  if (cormin === cormax) {
    return [cormin];
  }
  var count = Math.max(tickCount, 2);
  var step = getFormatStep(new Decimal(cormax).sub(cormin).div(count - 1), allowDecimals, 0);
  var values = [...rangeStep(new Decimal(cormin), new Decimal(cormax), step), cormax];
  if (allowDecimals === false) {
    /*
     * allowDecimals is false means that we want to have integer ticks.
     * The step is guaranteed to be an integer in the code above which is great start
     * but when the first step is not an integer, it will start stepping from a decimal value anyway.
     * So we need to round all the values to integers after the fact.
     */
    values = values.map(value => Math.round(value));
  }
  return min > max ? reverse(values) : values;
}
var getNiceTickValues = memoize(getNiceTickValuesFn);
var getTickValuesFixedDomain = memoize(getTickValuesFixedDomainFn);

var selectBarCategoryGap = state => state.rootProps.barCategoryGap;
var selectStackOffsetType = state => state.rootProps.stackOffset;
var selectChartName = state => state.options.chartName;
var selectSyncId = state => state.rootProps.syncId;
var selectSyncMethod = state => state.rootProps.syncMethod;
var selectEventEmitter = state => state.options.eventEmitter;

var defaultPolarAngleAxisProps = {
  allowDuplicatedCategory: true,
  // if I set this to false then Tooltip synchronisation stops working in Radar, wtf
  angleAxisId: 0,
  reversed: false,
  scale: 'auto',
  tick: true,
  type: 'category'
};

var defaultPolarRadiusAxisProps = {
  allowDataOverflow: false,
  allowDuplicatedCategory: true,
  radiusAxisId: 0,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  type: 'number'
};

var combineAxisRangeWithReverse = (axisSettings, axisRange) => {
  if (!axisSettings || !axisRange) {
    return undefined;
  }
  if (axisSettings !== null && axisSettings !== void 0 && axisSettings.reversed) {
    return [axisRange[1], axisRange[0]];
  }
  return axisRange;
};

var implicitAngleAxis = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: false,
  // defaultPolarAngleAxisProps.allowDuplicatedCategory has it set to true but the actual axis rendering ignores the prop because reasons,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: defaultPolarAngleAxisProps.reversed,
  scale: defaultPolarAngleAxisProps.scale,
  tick: defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: defaultPolarAngleAxisProps.type,
  unit: undefined
};
var implicitRadiusAxis = {
  allowDataOverflow: defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: false,
  allowDuplicatedCategory: defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: defaultPolarRadiusAxisProps.scale,
  tick: defaultPolarRadiusAxisProps.tick,
  tickCount: defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: defaultPolarRadiusAxisProps.type,
  unit: undefined
};
var implicitRadialBarAngleAxis = {
  allowDataOverflow: false,
  allowDecimals: false,
  allowDuplicatedCategory: defaultPolarAngleAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarAngleAxisProps.angleAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: defaultPolarAngleAxisProps.scale,
  tick: defaultPolarAngleAxisProps.tick,
  tickCount: undefined,
  ticks: undefined,
  type: 'number',
  unit: undefined
};
var implicitRadialBarRadiusAxis = {
  allowDataOverflow: defaultPolarRadiusAxisProps.allowDataOverflow,
  allowDecimals: false,
  allowDuplicatedCategory: defaultPolarRadiusAxisProps.allowDuplicatedCategory,
  dataKey: undefined,
  domain: undefined,
  id: defaultPolarRadiusAxisProps.radiusAxisId,
  includeHidden: false,
  name: undefined,
  reversed: false,
  scale: defaultPolarRadiusAxisProps.scale,
  tick: defaultPolarRadiusAxisProps.tick,
  tickCount: defaultPolarRadiusAxisProps.tickCount,
  ticks: undefined,
  type: 'category',
  unit: undefined
};
var selectAngleAxis = (state, angleAxisId) => {
  if (state.polarAxis.angleAxis[angleAxisId] != null) {
    return state.polarAxis.angleAxis[angleAxisId];
  }
  if (state.layout.layoutType === 'radial') {
    return implicitRadialBarAngleAxis;
  }
  return implicitAngleAxis;
};
var selectRadiusAxis = (state, radiusAxisId) => {
  if (state.polarAxis.radiusAxis[radiusAxisId] != null) {
    return state.polarAxis.radiusAxis[radiusAxisId];
  }
  if (state.layout.layoutType === 'radial') {
    return implicitRadialBarRadiusAxis;
  }
  return implicitRadiusAxis;
};
var selectPolarOptions = state => state.polarOptions;
var selectMaxRadius = createSelector([selectChartWidth, selectChartHeight, selectChartOffsetInternal], getMaxRadius);
var selectInnerRadius = createSelector([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return getPercentValue(polarChartOptions.innerRadius, maxRadius, 0);
});
var selectOuterRadius = createSelector([selectPolarOptions, selectMaxRadius], (polarChartOptions, maxRadius) => {
  if (polarChartOptions == null) {
    return undefined;
  }
  return getPercentValue(polarChartOptions.outerRadius, maxRadius, maxRadius * 0.8);
});
var combineAngleAxisRange = polarOptions => {
  if (polarOptions == null) {
    return [0, 0];
  }
  var {
    startAngle,
    endAngle
  } = polarOptions;
  return [startAngle, endAngle];
};
var selectAngleAxisRange = createSelector([selectPolarOptions], combineAngleAxisRange);
createSelector([selectAngleAxis, selectAngleAxisRange], combineAxisRangeWithReverse);
var selectRadiusAxisRange = createSelector([selectMaxRadius, selectInnerRadius, selectOuterRadius], (maxRadius, innerRadius, outerRadius) => {
  if (maxRadius == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  return [innerRadius, outerRadius];
});
createSelector([selectRadiusAxis, selectRadiusAxisRange], combineAxisRangeWithReverse);
var selectPolarViewBox = createSelector([selectChartLayout, selectPolarOptions, selectInnerRadius, selectOuterRadius, selectChartWidth, selectChartHeight], (layout, polarOptions, innerRadius, outerRadius, width, height) => {
  if (layout !== 'centric' && layout !== 'radial' || polarOptions == null || innerRadius == null || outerRadius == null) {
    return undefined;
  }
  var {
    cx,
    cy,
    startAngle,
    endAngle
  } = polarOptions;
  return {
    cx: getPercentValue(cx, width, width / 2),
    cy: getPercentValue(cy, height, height / 2),
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise: false // this property look useful, why not use it?
  };
});

var pickAxisType = (_state, axisType) => axisType;

var pickAxisId = (_state, _axisType, axisId) => axisId;

/**
 * Returns identifier for stack series which is one individual graphical item in the stack.
 * @param graphicalItem - The graphical item representing the series in the stack.
 * @return The identifier for the series in the stack
 */
function getStackSeriesIdentifier(graphicalItem) {
  return graphicalItem === null || graphicalItem === void 0 ? void 0 : graphicalItem.id;
}

var selectTooltipAxisType = state => {
  var layout = selectChartLayout(state);
  if (layout === 'horizontal') {
    return 'xAxis';
  }
  if (layout === 'vertical') {
    return 'yAxis';
  }
  if (layout === 'centric') {
    return 'angleAxis';
  }
  return 'radiusAxis';
};

var selectTooltipAxisId = state => state.tooltip.settings.axisId;

var selectTooltipAxis = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  return selectAxisSettings(state, axisType, axisId);
};
var selectTooltipAxisDataKey = createSelector([selectTooltipAxis], axis => axis === null || axis === void 0 ? void 0 : axis.dataKey);

/**
 * In a stacked chart, each graphical item has its own data. That data could be either:
 * - defined on the chart root, in which case the item gets a unique dataKey
 * - or defined on the item itself, in which case multiple items can share the same dataKey
 *
 * That means we cannot use the dataKey as a unique identifier for the item.
 *
 * This type represents a single data point in a stacked chart, where each key is a series identifier
 * and the value is the numeric value for that series using the numerical axis dataKey.
 */

function combineDisplayedStackedData(stackedGraphicalItems, _ref, tooltipAxisSettings) {
  var {
    chartData = []
  } = _ref;
  var {
    allowDuplicatedCategory,
    dataKey: tooltipDataKey
  } = tooltipAxisSettings;

  // A map of tooltip data keys to the stacked data points
  var knownItemsByDataKey = new Map();
  stackedGraphicalItems.forEach(item => {
    var _item$data;
    // If there is no data on the individual item then we use the root chart data
    var resolvedData = (_item$data = item.data) !== null && _item$data !== void 0 ? _item$data : chartData;
    if (resolvedData == null || resolvedData.length === 0) {
      // if that didn't work then we skip this item
      return;
    }
    var stackIdentifier = getStackSeriesIdentifier(item);
    resolvedData.forEach((entry, index) => {
      var tooltipValue = tooltipDataKey == null || allowDuplicatedCategory ? index : String(getValueByDataKey(entry, tooltipDataKey, null));
      var numericValue = getValueByDataKey(entry, item.dataKey, 0);
      var curr;
      if (knownItemsByDataKey.has(tooltipValue)) {
        curr = knownItemsByDataKey.get(tooltipValue);
      } else {
        curr = {};
      }
      Object.assign(curr, {
        [stackIdentifier]: numericValue
      });
      knownItemsByDataKey.set(tooltipValue, curr);
    });
  });
  return Array.from(knownItemsByDataKey.values());
}

/**
 * Some graphical items allow data stacking. The stacks are optional,
 * so all props here are optional too.
 */

/**
 * Some graphical items allow data stacking.
 * This interface is used to represent the items that are stacked
 * because the user has provided the stackId and dataKey properties.
 */

function isStacked(graphicalItem) {
  return graphicalItem.stackId != null && graphicalItem.dataKey != null;
}

function ownKeys$h(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$h(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$h(Object(t), true).forEach(function (r) { _defineProperty$j(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$h(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$j(e, r, t) { return (r = _toPropertyKey$j(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$j(t) { var i = _toPrimitive$j(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$j(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var defaultNumericDomain = [0, 'auto'];

/**
 * angle, radius, X, Y, and Z axes all have domain and range and scale and associated settings
 */

/**
 * X and Y axes have ticks. Z axis is never displayed and so it lacks ticks
 * and tick settings.
 */

/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
var implicitXAxis = {
  allowDataOverflow: false,
  allowDecimals: true,
  allowDuplicatedCategory: true,
  angle: 0,
  dataKey: undefined,
  domain: undefined,
  height: 30,
  hide: true,
  id: 0,
  includeHidden: false,
  interval: 'preserveEnd',
  minTickGap: 5,
  mirror: false,
  name: undefined,
  orientation: 'bottom',
  padding: {
    left: 0,
    right: 0
  },
  reversed: false,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  tickFormatter: undefined,
  ticks: undefined,
  type: 'category',
  unit: undefined
};
var selectXAxisSettingsNoDefaults = (state, axisId) => {
  return state.cartesianAxis.xAxis[axisId];
};
var selectXAxisSettings = (state, axisId) => {
  var axis = selectXAxisSettingsNoDefaults(state, axisId);
  if (axis == null) {
    return implicitXAxis;
  }
  return axis;
};

/**
 * If an axis is not explicitly defined as an element,
 * we still need to render something in the chart and we need
 * some object to hold the domain and default settings.
 */
var implicitYAxis = {
  allowDataOverflow: false,
  allowDecimals: true,
  allowDuplicatedCategory: true,
  angle: 0,
  dataKey: undefined,
  domain: defaultNumericDomain,
  hide: true,
  id: 0,
  includeHidden: false,
  interval: 'preserveEnd',
  minTickGap: 5,
  mirror: false,
  name: undefined,
  orientation: 'left',
  padding: {
    top: 0,
    bottom: 0
  },
  reversed: false,
  scale: 'auto',
  tick: true,
  tickCount: 5,
  tickFormatter: undefined,
  ticks: undefined,
  type: 'number',
  unit: undefined,
  width: DEFAULT_Y_AXIS_WIDTH
};
var selectYAxisSettingsNoDefaults = (state, axisId) => {
  return state.cartesianAxis.yAxis[axisId];
};
var selectYAxisSettings = (state, axisId) => {
  var axis = selectYAxisSettingsNoDefaults(state, axisId);
  if (axis == null) {
    return implicitYAxis;
  }
  return axis;
};
var implicitZAxis = {
  domain: [0, 'auto'],
  includeHidden: false,
  reversed: false,
  allowDataOverflow: false,
  allowDuplicatedCategory: false,
  dataKey: undefined,
  id: 0,
  name: '',
  range: [64, 64],
  scale: 'auto',
  type: 'number',
  unit: ''
};
var selectZAxisSettings = (state, axisId) => {
  var axis = state.cartesianAxis.zAxis[axisId];
  if (axis == null) {
    return implicitZAxis;
  }
  return axis;
};
var selectBaseAxis = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    case 'zAxis':
      {
        return selectZAxisSettings(state, axisId);
      }
    case 'angleAxis':
      {
        return selectAngleAxis(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxis(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};
var selectCartesianAxisSettings = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};

/**
 * Selects either an X or Y axis. Doesn't work with Z axis - for that, instead use selectBaseAxis.
 * @param state Root state
 * @param axisType xAxis | yAxis
 * @param axisId xAxisId | yAxisId
 * @returns axis settings object
 */
var selectAxisSettings = (state, axisType, axisId) => {
  switch (axisType) {
    case 'xAxis':
      {
        return selectXAxisSettings(state, axisId);
      }
    case 'yAxis':
      {
        return selectYAxisSettings(state, axisId);
      }
    case 'angleAxis':
      {
        return selectAngleAxis(state, axisId);
      }
    case 'radiusAxis':
      {
        return selectRadiusAxis(state, axisId);
      }
    default:
      throw new Error("Unexpected axis type: ".concat(axisType));
  }
};

/**
 * @param state RechartsRootState
 * @return boolean true if there is at least one Bar or RadialBar
 */
var selectHasBar = state => state.graphicalItems.cartesianItems.some(item => item.type === 'bar') || state.graphicalItems.polarItems.some(item => item.type === 'radialBar');

/**
 * Filters CartesianGraphicalItemSettings by the relevant axis ID
 * @param axisType 'xAxis' | 'yAxis' | 'zAxis' | 'radiusAxis' | 'angleAxis'
 * @param axisId from props, defaults to 0
 *
 * @returns Predicate function that return true for CartesianGraphicalItemSettings that are relevant to the specified axis
 */
function itemAxisPredicate(axisType, axisId) {
  return item => {
    switch (axisType) {
      case 'xAxis':
        // This is sensitive to the data type, as 0 !== '0'. I wonder if we should be more flexible. How does 2.x branch behave? TODO write test for that
        return 'xAxisId' in item && item.xAxisId === axisId;
      case 'yAxis':
        return 'yAxisId' in item && item.yAxisId === axisId;
      case 'zAxis':
        return 'zAxisId' in item && item.zAxisId === axisId;
      case 'angleAxis':
        return 'angleAxisId' in item && item.angleAxisId === axisId;
      case 'radiusAxis':
        return 'radiusAxisId' in item && item.radiusAxisId === axisId;
      default:
        return false;
    }
  };
}
var selectUnfilteredCartesianItems = state => state.graphicalItems.cartesianItems;
var selectAxisPredicate = createSelector([pickAxisType, pickAxisId], itemAxisPredicate);
var combineGraphicalItemsSettings = (graphicalItems, axisSettings, axisPredicate) => graphicalItems.filter(axisPredicate).filter(item => {
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.includeHidden) === true) {
    return true;
  }
  return !item.hide;
});
var selectCartesianItemsSettings = createSelector([selectUnfilteredCartesianItems, selectBaseAxis, selectAxisPredicate], combineGraphicalItemsSettings);
var selectStackedCartesianItemsSettings = createSelector([selectCartesianItemsSettings], cartesianItems => {
  return cartesianItems.filter(item => item.type === 'area' || item.type === 'bar').filter(isStacked);
});
var filterGraphicalNotStackedItems = cartesianItems => cartesianItems.filter(item => !('stackId' in item) || item.stackId === undefined);
var selectCartesianItemsSettingsExceptStacked = createSelector([selectCartesianItemsSettings], filterGraphicalNotStackedItems);
var combineGraphicalItemsData = cartesianItems => cartesianItems.map(item => item.data).filter(Boolean).flat(1);

/**
 * This is a "cheap" selector - it returns the data but doesn't iterate them, so it is not sensitive on the array length.
 * Also does not apply dataKey yet.
 * @param state RechartsRootState
 * @returns data defined on the chart graphical items, such as Line or Scatter or Pie, and filtered with appropriate dataKey
 */
var selectCartesianGraphicalItemsData = createSelector([selectCartesianItemsSettings], combineGraphicalItemsData);
var combineDisplayedData = (graphicalItemsData, _ref) => {
  var {
    chartData = [],
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (graphicalItemsData.length > 0) {
    /*
     * There is no slicing when data is defined on graphical items. Why?
     * Because Brush ignores data defined on graphical items,
     * and does not render.
     * So Brush will never show up in a Scatter chart for example.
     * This is something we will need to fix.
     *
     * Now, when the root chart data is not defined, the dataEndIndex is 0,
     * which means the itemsData will be sliced to an empty array anyway.
     * But that's an implementation detail, and we can fix that too.
     *
     * Also, in absence of Axis dataKey, we use the dataKey from each item, respectively.
     * This is the usual pattern for numerical axis, that is the one where bars go up:
     * users don't specify any dataKey by default and expect the axis to "just match the data".
     */
    return graphicalItemsData;
  }
  return chartData.slice(dataStartIndex, dataEndIndex + 1);
};

/**
 * This selector will return all data there is in the chart: graphical items, chart root, all together.
 * Useful for figuring out an axis domain (because that needs to know of everything),
 * not useful for rendering individual graphical elements (because they need to know which data is theirs and which is not).
 *
 * This function will discard the original indexes, so it is also not useful for anything that depends on ordering.
 */
var selectDisplayedData = createSelector([selectCartesianGraphicalItemsData, selectChartDataWithIndexesIfNotInPanorama], combineDisplayedData);
var combineAppliedValues = (data, axisSettings, items) => {
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: getValueByDataKey(item, axisSettings.dataKey)
    }));
  }
  if (items.length > 0) {
    return items.map(item => item.dataKey).flatMap(dataKey => data.map(entry => ({
      value: getValueByDataKey(entry, dataKey)
    })));
  }
  return data.map(entry => ({
    value: entry
  }));
};

/**
 * This selector will return all values with the appropriate dataKey applied on them.
 * Which dataKey is appropriate depends on where it is defined.
 *
 * This is an expensive selector - it will iterate all data and compute their value using the provided dataKey.
 */
var selectAllAppliedValues = createSelector([selectDisplayedData, selectBaseAxis, selectCartesianItemsSettings], combineAppliedValues);
function isErrorBarRelevantForAxisType(axisType, errorBar) {
  switch (axisType) {
    case 'xAxis':
      return errorBar.direction === 'x';
    case 'yAxis':
      return errorBar.direction === 'y';
    default:
      return false;
  }
}
function onlyAllowNumbers(data) {
  return data.filter(v => isNumOrStr(v) || v instanceof Date).map(Number).filter(n => isNan(n) === false);
}

/**
 * @param entry One item in the 'data' array. Could be anything really - this is defined externally. This is the raw, before dataKey application
 * @param appliedValue This is the result of applying the 'main' dataKey on the `entry`.
 * @param relevantErrorBars Error bars that are relevant for the current axis and layout and all that.
 * @return either undefined or an array of ErrorValue
 */
function getErrorDomainByDataKey(entry, appliedValue, relevantErrorBars) {
  if (!relevantErrorBars || typeof appliedValue !== 'number' || isNan(appliedValue)) {
    return [];
  }
  if (!relevantErrorBars.length) {
    return [];
  }
  return onlyAllowNumbers(relevantErrorBars.flatMap(eb => {
    var errorValue = getValueByDataKey(entry, eb.dataKey);
    var lowBound, highBound;
    if (Array.isArray(errorValue)) {
      [lowBound, highBound] = errorValue;
    } else {
      lowBound = highBound = errorValue;
    }
    if (!isWellBehavedNumber(lowBound) || !isWellBehavedNumber(highBound)) {
      return undefined;
    }
    return [appliedValue - lowBound, appliedValue + highBound];
  }));
}
var selectDisplayedStackedData = createSelector([selectStackedCartesianItemsSettings, selectChartDataWithIndexesIfNotInPanorama, selectTooltipAxis], combineDisplayedStackedData);
var combineStackGroups = (displayedData, items, stackOffsetType) => {
  var initialItemsGroups = {};
  var itemsGroup = items.reduce((acc, item) => {
    if (item.stackId == null) {
      return acc;
    }
    if (acc[item.stackId] == null) {
      acc[item.stackId] = [];
    }
    acc[item.stackId].push(item);
    return acc;
  }, initialItemsGroups);
  return Object.fromEntries(Object.entries(itemsGroup).map(_ref2 => {
    var [stackId, graphicalItems] = _ref2;
    var dataKeys = graphicalItems.map(getStackSeriesIdentifier);
    return [stackId, {
      // @ts-expect-error getStackedData requires that the input is array of objects, Recharts does not test for that
      stackedData: getStackedData(displayedData, dataKeys, stackOffsetType),
      graphicalItems
    }];
  }));
};

/**
 * Stack groups are groups of graphical items that stack on each other.
 * Stack is a function of axis type (X, Y), axis ID, and stack ID.
 * Graphical items that do not have a stack ID are not going to be present in stack groups.
 */
var selectStackGroups = createSelector([selectDisplayedStackedData, selectStackedCartesianItemsSettings, selectStackOffsetType], combineStackGroups);
var combineDomainOfStackGroups = (stackGroups, _ref3, axisType) => {
  var {
    dataStartIndex,
    dataEndIndex
  } = _ref3;
  if (axisType === 'zAxis') {
    // ZAxis ignores stacks
    return undefined;
  }
  var domainOfStackGroups = getDomainOfStackGroups(stackGroups, dataStartIndex, dataEndIndex);
  if (domainOfStackGroups != null && domainOfStackGroups[0] === 0 && domainOfStackGroups[1] === 0) {
    return undefined;
  }
  return domainOfStackGroups;
};
var selectDomainOfStackGroups = createSelector([selectStackGroups, selectChartDataWithIndexes, pickAxisType], combineDomainOfStackGroups);
var combineAppliedNumericalValuesIncludingErrorValues = (data, axisSettings, items, errorBars, axisType) => {
  if (items.length > 0) {
    return data.flatMap(entry => {
      return items.flatMap(item => {
        var _errorBars$item$id, _axisSettings$dataKey;
        var relevantErrorBars = (_errorBars$item$id = errorBars[item.id]) === null || _errorBars$item$id === void 0 ? void 0 : _errorBars$item$id.filter(errorBar => isErrorBarRelevantForAxisType(axisType, errorBar));
        var valueByDataKey = getValueByDataKey(entry, (_axisSettings$dataKey = axisSettings.dataKey) !== null && _axisSettings$dataKey !== void 0 ? _axisSettings$dataKey : item.dataKey);
        return {
          value: valueByDataKey,
          errorDomain: getErrorDomainByDataKey(entry, valueByDataKey, relevantErrorBars)
        };
      });
    }).filter(Boolean);
  }
  if ((axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.dataKey) != null) {
    return data.map(item => ({
      value: getValueByDataKey(item, axisSettings.dataKey),
      errorDomain: []
    }));
  }
  return data.map(entry => ({
    value: entry,
    errorDomain: []
  }));
};
var selectAllErrorBarSettings = state => state.errorBars;
var combineRelevantErrorBarSettings = (cartesianItemsSettings, allErrorBarSettings, axisType) => {
  return cartesianItemsSettings.flatMap(item => {
    return allErrorBarSettings[item.id];
  }).filter(Boolean).filter(e => {
    return isErrorBarRelevantForAxisType(axisType, e);
  });
};
createSelector([selectCartesianItemsSettingsExceptStacked, selectAllErrorBarSettings, pickAxisType], combineRelevantErrorBarSettings);
var selectAllAppliedNumericalValuesIncludingErrorValues = createSelector([selectDisplayedData, selectBaseAxis, selectCartesianItemsSettingsExceptStacked, selectAllErrorBarSettings, pickAxisType], combineAppliedNumericalValuesIncludingErrorValues);
function onlyAllowNumbersAndStringsAndDates(item) {
  var {
    value
  } = item;
  if (isNumOrStr(value) || value instanceof Date) {
    return value;
  }
  return undefined;
}
var computeNumericalDomain = dataWithErrorDomains => {
  var allDataSquished = dataWithErrorDomains
  // This flatMap has to be flat because we're creating a new array in the return value
  .flatMap(d => [d.value, d.errorDomain])
  // This flat is needed because a) errorDomain is an array, and b) value may be a number, or it may be a range (for Area, for example)
  .flat(1);
  var onlyNumbers = onlyAllowNumbers(allDataSquished);
  if (onlyNumbers.length === 0) {
    return undefined;
  }
  return [Math.min(...onlyNumbers), Math.max(...onlyNumbers)];
};
var computeDomainOfTypeCategory = (allDataSquished, axisSettings, isCategorical) => {
  var categoricalDomain = allDataSquished.map(onlyAllowNumbersAndStringsAndDates).filter(v => v != null);
  if (isCategorical && (axisSettings.dataKey == null || axisSettings.allowDuplicatedCategory && hasDuplicate(categoricalDomain))) {
    /*
     * 1. In an absence of dataKey, Recharts will use array indexes as its categorical domain
     * 2. When category axis has duplicated text, serial numbers are used to generate scale
     */
    return range$1(0, allDataSquished.length);
  }
  if (axisSettings.allowDuplicatedCategory) {
    return categoricalDomain;
  }
  return Array.from(new Set(categoricalDomain));
};
var getDomainDefinition = axisSettings => {
  var _axisSettings$domain;
  if (axisSettings == null || !('domain' in axisSettings)) {
    return defaultNumericDomain;
  }
  if (axisSettings.domain != null) {
    return axisSettings.domain;
  }
  if (axisSettings.ticks != null) {
    if (axisSettings.type === 'number') {
      var allValues = onlyAllowNumbers(axisSettings.ticks);
      return [Math.min(...allValues), Math.max(...allValues)];
    }
    if (axisSettings.type === 'category') {
      return axisSettings.ticks.map(String);
    }
  }
  return (_axisSettings$domain = axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.domain) !== null && _axisSettings$domain !== void 0 ? _axisSettings$domain : defaultNumericDomain;
};
var mergeDomains = function mergeDomains() {
  for (var _len = arguments.length, domains = new Array(_len), _key = 0; _key < _len; _key++) {
    domains[_key] = arguments[_key];
  }
  var allDomains = domains.filter(Boolean);
  if (allDomains.length === 0) {
    return undefined;
  }
  var allValues = allDomains.flat();
  var min = Math.min(...allValues);
  var max = Math.max(...allValues);
  return [min, max];
};
var selectReferenceDots = state => state.referenceElements.dots;
var filterReferenceElements = (elements, axisType, axisId) => {
  return elements.filter(el => el.ifOverflow === 'extendDomain').filter(el => {
    if (axisType === 'xAxis') {
      return el.xAxisId === axisId;
    }
    return el.yAxisId === axisId;
  });
};
var selectReferenceDotsByAxis = createSelector([selectReferenceDots, pickAxisType, pickAxisId], filterReferenceElements);
var selectReferenceAreas = state => state.referenceElements.areas;
var selectReferenceAreasByAxis = createSelector([selectReferenceAreas, pickAxisType, pickAxisId], filterReferenceElements);
var selectReferenceLines = state => state.referenceElements.lines;
var selectReferenceLinesByAxis = createSelector([selectReferenceLines, pickAxisType, pickAxisId], filterReferenceElements);
var combineDotsDomain = (dots, axisType) => {
  var allCoords = onlyAllowNumbers(dots.map(dot => axisType === 'xAxis' ? dot.x : dot.y));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
var selectReferenceDotsDomain = createSelector(selectReferenceDotsByAxis, pickAxisType, combineDotsDomain);
var combineAreasDomain = (areas, axisType) => {
  var allCoords = onlyAllowNumbers(areas.flatMap(area => [axisType === 'xAxis' ? area.x1 : area.y1, axisType === 'xAxis' ? area.x2 : area.y2]));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
var selectReferenceAreasDomain = createSelector([selectReferenceAreasByAxis, pickAxisType], combineAreasDomain);
var combineLinesDomain = (lines, axisType) => {
  var allCoords = onlyAllowNumbers(lines.map(line => axisType === 'xAxis' ? line.x : line.y));
  if (allCoords.length === 0) {
    return undefined;
  }
  return [Math.min(...allCoords), Math.max(...allCoords)];
};
var selectReferenceLinesDomain = createSelector(selectReferenceLinesByAxis, pickAxisType, combineLinesDomain);
var selectReferenceElementsDomain = createSelector(selectReferenceDotsDomain, selectReferenceLinesDomain, selectReferenceAreasDomain, (dotsDomain, linesDomain, areasDomain) => {
  return mergeDomains(dotsDomain, areasDomain, linesDomain);
});
var selectDomainDefinition = createSelector([selectBaseAxis], getDomainDefinition);
var combineNumericalDomain = (axisSettings, domainDefinition, domainOfStackGroups, allDataWithErrorDomains, referenceElementsDomain, layout, axisType) => {
  var domainFromUserPreference = numericalDomainSpecifiedWithoutRequiringData(domainDefinition, axisSettings.allowDataOverflow);
  if (domainFromUserPreference != null) {
    // We're done! No need to compute anything else.
    return domainFromUserPreference;
  }
  var shouldIncludeDomainOfStackGroups = layout === 'vertical' && axisType === 'xAxis' || layout === 'horizontal' && axisType === 'yAxis';
  var mergedDomains = shouldIncludeDomainOfStackGroups ? mergeDomains(domainOfStackGroups, referenceElementsDomain, computeNumericalDomain(allDataWithErrorDomains)) : mergeDomains(referenceElementsDomain, computeNumericalDomain(allDataWithErrorDomains));
  return parseNumericalUserDomain(domainDefinition, mergedDomains, axisSettings.allowDataOverflow);
};
var selectNumericalDomain = createSelector([selectBaseAxis, selectDomainDefinition, selectDomainOfStackGroups, selectAllAppliedNumericalValuesIncludingErrorValues, selectReferenceElementsDomain, selectChartLayout, pickAxisType], combineNumericalDomain);

/**
 * Expand by design maps everything between 0 and 1,
 * there is nothing to compute.
 * See https://d3js.org/d3-shape/stack#stack-offsets
 */
var expandDomain = [0, 1];
var combineAxisDomain = (axisSettings, layout, displayedData, allAppliedValues, stackOffsetType, axisType, numericalDomain) => {
  if ((axisSettings == null || displayedData == null || displayedData.length === 0) && numericalDomain === undefined) {
    return undefined;
  }
  var {
    dataKey,
    type
  } = axisSettings;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (isCategorical && dataKey == null) {
    return range$1(0, displayedData.length);
  }
  if (type === 'category') {
    return computeDomainOfTypeCategory(allAppliedValues, axisSettings, isCategorical);
  }
  if (stackOffsetType === 'expand') {
    return expandDomain;
  }
  return numericalDomain;
};
var selectAxisDomain = createSelector([selectBaseAxis, selectChartLayout, selectDisplayedData, selectAllAppliedValues, selectStackOffsetType, pickAxisType, selectNumericalDomain], combineAxisDomain);
var combineRealScaleType = (axisConfig, layout, hasBar, chartType, axisType) => {
  if (axisConfig == null) {
    return undefined;
  }
  var {
    scale,
    type
  } = axisConfig;
  if (scale === 'auto') {
    if (layout === 'radial' && axisType === 'radiusAxis') {
      return 'band';
    }
    if (layout === 'radial' && axisType === 'angleAxis') {
      return 'linear';
    }
    if (type === 'category' && chartType && (chartType.indexOf('LineChart') >= 0 || chartType.indexOf('AreaChart') >= 0 || chartType.indexOf('ComposedChart') >= 0 && !hasBar)) {
      return 'point';
    }
    if (type === 'category') {
      return 'band';
    }
    return 'linear';
  }
  if (typeof scale === 'string') {
    var name = "scale".concat(upperFirst(scale));
    return name in d3Scales ? name : 'point';
  }
  return undefined;
};
var selectRealScaleType = createSelector([selectBaseAxis, selectChartLayout, selectHasBar, selectChartName, pickAxisType], combineRealScaleType);
function getD3ScaleFromType(realScaleType) {
  if (realScaleType == null) {
    return undefined;
  }
  if (realScaleType in d3Scales) {
    // @ts-expect-error we should do better type verification here
    return d3Scales[realScaleType]();
  }
  var name = "scale".concat(upperFirst(realScaleType));
  if (name in d3Scales) {
    // @ts-expect-error we should do better type verification here
    return d3Scales[name]();
  }
  return undefined;
}
function combineScaleFunction(axis, realScaleType, axisDomain, axisRange) {
  if (axisDomain == null || axisRange == null) {
    return undefined;
  }
  if (typeof axis.scale === 'function') {
    // @ts-expect-error we're going to assume here that if axis.scale is a function then it is a d3Scale function
    return axis.scale.copy().domain(axisDomain).range(axisRange);
  }
  var d3ScaleFunction = getD3ScaleFromType(realScaleType);
  if (d3ScaleFunction == null) {
    return undefined;
  }
  var scale = d3ScaleFunction.domain(axisDomain).range(axisRange);
  // I don't like this function because it mutates the scale. We should come up with a way to compute the domain up front.
  checkDomainOfScale(scale);
  return scale;
}
var combineNiceTicks = (axisDomain, axisSettings, realScaleType) => {
  var domainDefinition = getDomainDefinition(axisSettings);
  if (realScaleType !== 'auto' && realScaleType !== 'linear') {
    return undefined;
  }
  if (axisSettings != null && axisSettings.tickCount && Array.isArray(domainDefinition) && (domainDefinition[0] === 'auto' || domainDefinition[1] === 'auto') && isWellFormedNumberDomain(axisDomain)) {
    return getNiceTickValues(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals);
  }
  if (axisSettings != null && axisSettings.tickCount && axisSettings.type === 'number' && isWellFormedNumberDomain(axisDomain)) {
    return getTickValuesFixedDomain(axisDomain, axisSettings.tickCount, axisSettings.allowDecimals);
  }
  return undefined;
};
var selectNiceTicks = createSelector([selectAxisDomain, selectAxisSettings, selectRealScaleType], combineNiceTicks);
var combineAxisDomainWithNiceTicks = (axisSettings, domain, niceTicks, axisType) => {
  if (
  /*
   * Angle axis for some reason uses nice ticks when rendering axis tick labels,
   * but doesn't use nice ticks for extending domain like all the other axes do.
   * Not really sure why? Is there a good reason,
   * or is it just because someone added support for nice ticks to the other axes and forgot this one?
   */
  axisType !== 'angleAxis' && (axisSettings === null || axisSettings === void 0 ? void 0 : axisSettings.type) === 'number' && isWellFormedNumberDomain(domain) && Array.isArray(niceTicks) && niceTicks.length > 0) {
    var minFromDomain = domain[0];
    var minFromTicks = niceTicks[0];
    var maxFromDomain = domain[1];
    var maxFromTicks = niceTicks[niceTicks.length - 1];
    return [Math.min(minFromDomain, minFromTicks), Math.max(maxFromDomain, maxFromTicks)];
  }
  return domain;
};
var selectAxisDomainIncludingNiceTicks = createSelector([selectBaseAxis, selectAxisDomain, selectNiceTicks, pickAxisType], combineAxisDomainWithNiceTicks);

/**
 * Returns the smallest gap, between two numbers in the data, as a ratio of the whole range (max - min).
 * Ignores domain provided by user and only considers domain from data.
 *
 * The result is a number between 0 and 1.
 */
var selectSmallestDistanceBetweenValues = createSelector(selectAllAppliedValues, selectBaseAxis, (allDataSquished, axisSettings) => {
  if (!axisSettings || axisSettings.type !== 'number') {
    return undefined;
  }
  var smallestDistanceBetweenValues = Infinity;
  var sortedValues = Array.from(onlyAllowNumbers(allDataSquished.map(d => d.value))).sort((a, b) => a - b);
  if (sortedValues.length < 2) {
    return Infinity;
  }
  var diff = sortedValues[sortedValues.length - 1] - sortedValues[0];
  if (diff === 0) {
    return Infinity;
  }
  // Only do n - 1 distance calculations because there's only n - 1 distances between n values.
  for (var i = 0; i < sortedValues.length - 1; i++) {
    var distance = sortedValues[i + 1] - sortedValues[i];
    smallestDistanceBetweenValues = Math.min(smallestDistanceBetweenValues, distance);
  }
  return smallestDistanceBetweenValues / diff;
});
var selectCalculatedPadding = createSelector(selectSmallestDistanceBetweenValues, selectChartLayout, selectBarCategoryGap, selectChartOffsetInternal, (_1, _2, _3, padding) => padding, (smallestDistanceInPercent, layout, barCategoryGap, offset, padding) => {
  if (!isWellBehavedNumber(smallestDistanceInPercent)) {
    return 0;
  }
  var rangeWidth = layout === 'vertical' ? offset.height : offset.width;
  if (padding === 'gap') {
    return smallestDistanceInPercent * rangeWidth / 2;
  }
  if (padding === 'no-gap') {
    var gap = getPercentValue(barCategoryGap, smallestDistanceInPercent * rangeWidth);
    var halfBand = smallestDistanceInPercent * rangeWidth / 2;
    return halfBand - gap - (halfBand - gap) / rangeWidth * gap;
  }
  return 0;
});
var selectCalculatedXAxisPadding = (state, axisId) => {
  var xAxisSettings = selectXAxisSettings(state, axisId);
  if (xAxisSettings == null || typeof xAxisSettings.padding !== 'string') {
    return 0;
  }
  return selectCalculatedPadding(state, 'xAxis', axisId, xAxisSettings.padding);
};
var selectCalculatedYAxisPadding = (state, axisId) => {
  var yAxisSettings = selectYAxisSettings(state, axisId);
  if (yAxisSettings == null || typeof yAxisSettings.padding !== 'string') {
    return 0;
  }
  return selectCalculatedPadding(state, 'yAxis', axisId, yAxisSettings.padding);
};
var selectXAxisPadding = createSelector(selectXAxisSettings, selectCalculatedXAxisPadding, (xAxisSettings, calculated) => {
  var _padding$left, _padding$right;
  if (xAxisSettings == null) {
    return {
      left: 0,
      right: 0
    };
  }
  var {
    padding
  } = xAxisSettings;
  if (typeof padding === 'string') {
    return {
      left: calculated,
      right: calculated
    };
  }
  return {
    left: ((_padding$left = padding.left) !== null && _padding$left !== void 0 ? _padding$left : 0) + calculated,
    right: ((_padding$right = padding.right) !== null && _padding$right !== void 0 ? _padding$right : 0) + calculated
  };
});
var selectYAxisPadding = createSelector(selectYAxisSettings, selectCalculatedYAxisPadding, (yAxisSettings, calculated) => {
  var _padding$top, _padding$bottom;
  if (yAxisSettings == null) {
    return {
      top: 0,
      bottom: 0
    };
  }
  var {
    padding
  } = yAxisSettings;
  if (typeof padding === 'string') {
    return {
      top: calculated,
      bottom: calculated
    };
  }
  return {
    top: ((_padding$top = padding.top) !== null && _padding$top !== void 0 ? _padding$top : 0) + calculated,
    bottom: ((_padding$bottom = padding.bottom) !== null && _padding$bottom !== void 0 ? _padding$bottom : 0) + calculated
  };
});
var combineXAxisRange = createSelector([selectChartOffsetInternal, selectXAxisPadding, selectBrushDimensions, selectBrushSettings, (_state, _axisId, isPanorama) => isPanorama], (offset, padding, brushDimensions, _ref4, isPanorama) => {
  var {
    padding: brushPadding
  } = _ref4;
  if (isPanorama) {
    return [brushPadding.left, brushDimensions.width - brushPadding.right];
  }
  return [offset.left + padding.left, offset.left + offset.width - padding.right];
});
var combineYAxisRange = createSelector([selectChartOffsetInternal, selectChartLayout, selectYAxisPadding, selectBrushDimensions, selectBrushSettings, (_state, _axisId, isPanorama) => isPanorama], (offset, layout, padding, brushDimensions, _ref5, isPanorama) => {
  var {
    padding: brushPadding
  } = _ref5;
  if (isPanorama) {
    return [brushDimensions.height - brushPadding.bottom, brushPadding.top];
  }
  if (layout === 'horizontal') {
    return [offset.top + offset.height - padding.bottom, offset.top + padding.top];
  }
  return [offset.top + padding.top, offset.top + offset.height - padding.bottom];
});
var selectAxisRange = (state, axisType, axisId, isPanorama) => {
  var _selectZAxisSettings;
  switch (axisType) {
    case 'xAxis':
      return combineXAxisRange(state, axisId, isPanorama);
    case 'yAxis':
      return combineYAxisRange(state, axisId, isPanorama);
    case 'zAxis':
      return (_selectZAxisSettings = selectZAxisSettings(state, axisId)) === null || _selectZAxisSettings === void 0 ? void 0 : _selectZAxisSettings.range;
    case 'angleAxis':
      return selectAngleAxisRange(state);
    case 'radiusAxis':
      return selectRadiusAxisRange(state, axisId);
    default:
      return undefined;
  }
};
var selectAxisRangeWithReverse = createSelector([selectBaseAxis, selectAxisRange], combineAxisRangeWithReverse);
var selectAxisScale = createSelector([selectBaseAxis, selectRealScaleType, selectAxisDomainIncludingNiceTicks, selectAxisRangeWithReverse], combineScaleFunction);
createSelector([selectCartesianItemsSettings, selectAllErrorBarSettings, pickAxisType], combineRelevantErrorBarSettings);
function compareIds(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}
var pickAxisOrientation = (_state, orientation) => orientation;
var pickMirror = (_state, _orientation, mirror) => mirror;
var selectAllXAxesWithOffsetType = createSelector(selectAllXAxes, pickAxisOrientation, pickMirror, (allAxes, orientation, mirror) => allAxes.filter(axis => axis.orientation === orientation).filter(axis => axis.mirror === mirror).sort(compareIds));
var selectAllYAxesWithOffsetType = createSelector(selectAllYAxes, pickAxisOrientation, pickMirror, (allAxes, orientation, mirror) => allAxes.filter(axis => axis.orientation === orientation).filter(axis => axis.mirror === mirror).sort(compareIds));
var getXAxisSize = (offset, axisSettings) => {
  return {
    width: offset.width,
    height: axisSettings.height
  };
};
var getYAxisSize = (offset, axisSettings) => {
  var width = typeof axisSettings.width === 'number' ? axisSettings.width : DEFAULT_Y_AXIS_WIDTH;
  return {
    width,
    height: offset.height
  };
};
var selectXAxisSize = createSelector(selectChartOffsetInternal, selectXAxisSettings, getXAxisSize);
var combineXAxisPositionStartingPoint = (offset, orientation, chartHeight) => {
  switch (orientation) {
    case 'top':
      return offset.top;
    case 'bottom':
      return chartHeight - offset.bottom;
    default:
      return 0;
  }
};
var combineYAxisPositionStartingPoint = (offset, orientation, chartWidth) => {
  switch (orientation) {
    case 'left':
      return offset.left;
    case 'right':
      return chartWidth - offset.right;
    default:
      return 0;
  }
};
var selectAllXAxesOffsetSteps = createSelector(selectChartHeight, selectChartOffsetInternal, selectAllXAxesWithOffsetType, pickAxisOrientation, pickMirror, (chartHeight, offset, allAxesWithSameOffsetType, orientation, mirror) => {
  var steps = {};
  var position;
  allAxesWithSameOffsetType.forEach(axis => {
    var axisSize = getXAxisSize(offset, axis);
    if (position == null) {
      position = combineXAxisPositionStartingPoint(offset, orientation, chartHeight);
    }
    var needSpace = orientation === 'top' && !mirror || orientation === 'bottom' && mirror;
    steps[axis.id] = position - Number(needSpace) * axisSize.height;
    position += (needSpace ? -1 : 1) * axisSize.height;
  });
  return steps;
});
var selectAllYAxesOffsetSteps = createSelector(selectChartWidth, selectChartOffsetInternal, selectAllYAxesWithOffsetType, pickAxisOrientation, pickMirror, (chartWidth, offset, allAxesWithSameOffsetType, orientation, mirror) => {
  var steps = {};
  var position;
  allAxesWithSameOffsetType.forEach(axis => {
    var axisSize = getYAxisSize(offset, axis);
    if (position == null) {
      position = combineYAxisPositionStartingPoint(offset, orientation, chartWidth);
    }
    var needSpace = orientation === 'left' && !mirror || orientation === 'right' && mirror;
    steps[axis.id] = position - Number(needSpace) * axisSize.width;
    position += (needSpace ? -1 : 1) * axisSize.width;
  });
  return steps;
});
var selectXAxisOffsetSteps = (state, axisId) => {
  var axisSettings = selectXAxisSettings(state, axisId);
  if (axisSettings == null) {
    return undefined;
  }
  return selectAllXAxesOffsetSteps(state, axisSettings.orientation, axisSettings.mirror);
};
var selectXAxisPosition = createSelector([selectChartOffsetInternal, selectXAxisSettings, selectXAxisOffsetSteps, (_, axisId) => axisId], (offset, axisSettings, allSteps, axisId) => {
  if (axisSettings == null) {
    return undefined;
  }
  var stepOfThisAxis = allSteps === null || allSteps === void 0 ? void 0 : allSteps[axisId];
  if (stepOfThisAxis == null) {
    return {
      x: offset.left,
      y: 0
    };
  }
  return {
    x: offset.left,
    y: stepOfThisAxis
  };
});
var selectYAxisOffsetSteps = (state, axisId) => {
  var axisSettings = selectYAxisSettings(state, axisId);
  if (axisSettings == null) {
    return undefined;
  }
  return selectAllYAxesOffsetSteps(state, axisSettings.orientation, axisSettings.mirror);
};
var selectYAxisPosition = createSelector([selectChartOffsetInternal, selectYAxisSettings, selectYAxisOffsetSteps, (_, axisId) => axisId], (offset, axisSettings, allSteps, axisId) => {
  if (axisSettings == null) {
    return undefined;
  }
  var stepOfThisAxis = allSteps === null || allSteps === void 0 ? void 0 : allSteps[axisId];
  if (stepOfThisAxis == null) {
    return {
      x: 0,
      y: offset.top
    };
  }
  return {
    x: stepOfThisAxis,
    y: offset.top
  };
});
var selectYAxisSize = createSelector(selectChartOffsetInternal, selectYAxisSettings, (offset, axisSettings) => {
  var width = typeof axisSettings.width === 'number' ? axisSettings.width : DEFAULT_Y_AXIS_WIDTH;
  return {
    width,
    height: offset.height
  };
});
var combineDuplicateDomain = (chartLayout, appliedValues, axis, axisType) => {
  if (axis == null) {
    return undefined;
  }
  var {
    allowDuplicatedCategory,
    type,
    dataKey
  } = axis;
  var isCategorical = isCategoricalAxis(chartLayout, axisType);
  var allData = appliedValues.map(av => av.value);
  if (dataKey && isCategorical && type === 'category' && allowDuplicatedCategory && hasDuplicate(allData)) {
    return allData;
  }
  return undefined;
};
var selectDuplicateDomain = createSelector([selectChartLayout, selectAllAppliedValues, selectBaseAxis, pickAxisType], combineDuplicateDomain);
var combineCategoricalDomain = (layout, appliedValues, axis, axisType) => {
  if (axis == null || axis.dataKey == null) {
    return undefined;
  }
  var {
    type,
    scale
  } = axis;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (isCategorical && (type === 'number' || scale !== 'auto')) {
    return appliedValues.map(d => d.value);
  }
  return undefined;
};
var selectCategoricalDomain = createSelector([selectChartLayout, selectAllAppliedValues, selectAxisSettings, pickAxisType], combineCategoricalDomain);
var selectAxisPropsNeededForCartesianGridTicksGenerator = createSelector([selectChartLayout, selectCartesianAxisSettings, selectRealScaleType, selectAxisScale, selectDuplicateDomain, selectCategoricalDomain, selectAxisRange, selectNiceTicks, pickAxisType], (layout, axis, realScaleType, scale, duplicateDomain, categoricalDomain, axisRange, niceTicks, axisType) => {
  if (axis == null) {
    return null;
  }
  var isCategorical = isCategoricalAxis(layout, axisType);
  return {
    angle: axis.angle,
    interval: axis.interval,
    minTickGap: axis.minTickGap,
    orientation: axis.orientation,
    tick: axis.tick,
    tickCount: axis.tickCount,
    tickFormatter: axis.tickFormatter,
    ticks: axis.ticks,
    type: axis.type,
    unit: axis.unit,
    axisType,
    categoricalDomain,
    duplicateDomain,
    isCategorical,
    niceTicks,
    range: axisRange,
    realScaleType,
    scale
  };
});
var combineAxisTicks = (layout, axis, realScaleType, scale, niceTicks, axisRange, duplicateDomain, categoricalDomain, axisType) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  var isCategorical = isCategoricalAxis(layout, axisType);
  var {
    type,
    ticks,
    tickCount
  } = axis;

  // This is testing for `scaleBand` but for band axis the type is reported as `band` so this looks like a dead code with a workaround elsewhere?
  var offsetForBand = realScaleType === 'scaleBand' && typeof scale.bandwidth === 'function' ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && axisRange != null && axisRange.length >= 2 ? mathSign(axisRange[0] - axisRange[1]) * 2 * offset : offset;

  // The ticks set by user should only affect the ticks adjacent to axis line
  var ticksOrNiceTicks = ticks || niceTicks;
  if (ticksOrNiceTicks) {
    var result = ticksOrNiceTicks.map((entry, index) => {
      var scaleContent = duplicateDomain ? duplicateDomain.indexOf(entry) : entry;
      return {
        index,
        // If the scaleContent is not a number, the coordinate will be NaN.
        // That could be the case for example with a PointScale and a string as domain.
        coordinate: scale(scaleContent) + offset,
        value: entry,
        offset
      };
    });
    return result.filter(row => !isNan(row.coordinate));
  }

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }
  if (scale.ticks) {
    return scale.ticks(tickCount)
    // @ts-expect-error why does the offset go here? The type does not require it
    .map(entry => ({
      coordinate: scale(entry) + offset,
      value: entry,
      offset
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
var selectTicksOfAxis = createSelector([selectChartLayout, selectAxisSettings, selectRealScaleType, selectAxisScale, selectNiceTicks, selectAxisRange, selectDuplicateDomain, selectCategoricalDomain, pickAxisType], combineAxisTicks);
var combineGraphicalItemTicks = (layout, axis, scale, axisRange, duplicateDomain, categoricalDomain, axisType) => {
  if (axis == null || scale == null || axisRange == null || axisRange[0] === axisRange[1]) {
    return undefined;
  }
  var isCategorical = isCategoricalAxis(layout, axisType);
  var {
    tickCount
  } = axis;
  var offset = 0;
  offset = axisType === 'angleAxis' && (axisRange === null || axisRange === void 0 ? void 0 : axisRange.length) >= 2 ? mathSign(axisRange[0] - axisRange[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }
  if (scale.ticks) {
    return scale.ticks(tickCount)
    // @ts-expect-error why does the offset go here? The type does not require it
    .map(entry => ({
      coordinate: scale(entry) + offset,
      value: entry,
      offset
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
var selectTicksOfGraphicalItem = createSelector([selectChartLayout, selectAxisSettings, selectAxisScale, selectAxisRange, selectDuplicateDomain, selectCategoricalDomain, pickAxisType], combineGraphicalItemTicks);
var selectAxisWithScale = createSelector(selectBaseAxis, selectAxisScale, (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread$h(_objectSpread$h({}, axis), {}, {
    scale
  });
});
var selectZAxisScale = createSelector([selectBaseAxis, selectRealScaleType, selectAxisDomain, selectAxisRangeWithReverse], combineScaleFunction);
createSelector((state, _axisType, axisId) => selectZAxisSettings(state, axisId), selectZAxisScale, (axis, scale) => {
  if (axis == null || scale == null) {
    return undefined;
  }
  return _objectSpread$h(_objectSpread$h({}, axis), {}, {
    scale
  });
});

/**
 * We are also going to need to implement polar chart directions if we want to support keyboard controls for those.
 */

var selectChartDirection = createSelector([selectChartLayout, selectAllXAxes, selectAllYAxes], (layout, allXAxes, allYAxes) => {
  switch (layout) {
    case 'horizontal':
      {
        return allXAxes.some(axis => axis.reversed) ? 'right-to-left' : 'left-to-right';
      }
    case 'vertical':
      {
        return allYAxes.some(axis => axis.reversed) ? 'bottom-to-top' : 'top-to-bottom';
      }
    // TODO: make this better. For now, right arrow triggers "forward", left arrow "back"
    // however, the tooltip moves an unintuitive direction because of how the indices are rendered
    case 'centric':
    case 'radial':
      {
        return 'left-to-right';
      }
    default:
      {
        return undefined;
      }
  }
});

var selectDefaultTooltipEventType = state => state.options.defaultTooltipEventType;
var selectValidateTooltipEventTypes = state => state.options.validateTooltipEventTypes;
function combineTooltipEventType(shared, defaultTooltipEventType, validateTooltipEventTypes) {
  if (shared == null) {
    return defaultTooltipEventType;
  }
  var eventType = shared ? 'axis' : 'item';
  if (validateTooltipEventTypes == null) {
    return defaultTooltipEventType;
  }
  return validateTooltipEventTypes.includes(eventType) ? eventType : defaultTooltipEventType;
}
function selectTooltipEventType$1(state, shared) {
  var defaultTooltipEventType = selectDefaultTooltipEventType(state);
  var validateTooltipEventTypes = selectValidateTooltipEventTypes(state);
  return combineTooltipEventType(shared, defaultTooltipEventType, validateTooltipEventTypes);
}
function useTooltipEventType(shared) {
  return useAppSelector(state => selectTooltipEventType$1(state, shared));
}

var combineActiveLabel = (tooltipTicks, activeIndex) => {
  var _tooltipTicks$n;
  var n = Number(activeIndex);
  if (isNan(n) || activeIndex == null) {
    return undefined;
  }
  return n >= 0 ? tooltipTicks === null || tooltipTicks === void 0 || (_tooltipTicks$n = tooltipTicks[n]) === null || _tooltipTicks$n === void 0 ? void 0 : _tooltipTicks$n.value : undefined;
};

var selectTooltipSettings = state => state.tooltip.settings;

/**
 * One Tooltip can display multiple TooltipPayloadEntries at a time.
 */

/**
 * So what happens is that the tooltip payload is decided based on the available data, and the dataKey.
 * The dataKey can either be defined on the graphical element (like Line, or Bar)
 * or on the tooltip itself.
 *
 * The data can be defined in the chart element, or in the graphical item.
 *
 * So this type is all the settings, other than the data + dataKey complications.
 */

/**
 * This is what Tooltip renders.
 */

/**
 * null means no active index
 * string means: whichever index from the chart data it is.
 * Different charts have different requirements on data shapes,
 * and are also responsible for providing a function that will accept this index
 * and return data.
 */

/**
 * Different items have different data shapes so the state has no opinion on what the data shape should be;
 * the only requirement is that the chart also provides a searcher function
 * that accepts the data, and a key, and returns whatever the payload in Tooltip should be.
 */

/**
 * So this informs the "tooltip event type". Tooltip event type can be either "axis" or "item"
 * and it is used for two things:
 * 1. Sets the active area
 * 2. Sets the background and cursor highlights
 *
 * Some charts only allow to have one type of tooltip event type, some allow both.
 * Those charts that allow both will have one default, and the "shared" prop will be used to switch between them.
 * Undefined means "use the chart default".
 *
 * Charts that only allow one tooltip event type, will ignore the shared prop.
 */

/**
 * A generic state for user interaction with the chart.
 * User interaction can come through multiple channels: mouse events, keyboard events, or hardcoded in props, or synchronised from other charts.
 *
 * Each of the interaction states is represented as TooltipInteractionState,
 * and then the selectors and Tooltip will decide which of the interaction states to use.
 */

var noInteraction = {
  active: false,
  index: null,
  dataKey: undefined,
  coordinate: undefined
};

/**
 * The tooltip interaction state stores:
 *
 * - Which graphical item is user interacting with at the moment,
 * - which axis (or, which part of chart background) is user interacting with at the moment
 * - The data that individual graphical items wish to be displayed in case the tooltip gets activated
 */

var initialState$8 = {
  itemInteraction: {
    click: noInteraction,
    hover: noInteraction
  },
  axisInteraction: {
    click: noInteraction,
    hover: noInteraction
  },
  keyboardInteraction: noInteraction,
  syncInteraction: {
    active: false,
    index: null,
    dataKey: undefined,
    label: undefined,
    coordinate: undefined
  },
  tooltipItemPayloads: [],
  settings: {
    shared: undefined,
    trigger: 'hover',
    axisId: 0,
    active: false,
    defaultIndex: undefined
  }
};
var tooltipSlice = createSlice({
  name: 'tooltip',
  initialState: initialState$8,
  reducers: {
    addTooltipEntrySettings(state, action) {
      state.tooltipItemPayloads.push(castDraft(action.payload));
    },
    removeTooltipEntrySettings(state, action) {
      var index = current(state).tooltipItemPayloads.indexOf(castDraft(action.payload));
      if (index > -1) {
        state.tooltipItemPayloads.splice(index, 1);
      }
    },
    setTooltipSettingsState(state, action) {
      state.settings = action.payload;
    },
    setActiveMouseOverItemIndex(state, action) {
      state.syncInteraction.active = false;
      state.keyboardInteraction.active = false;
      state.itemInteraction.hover.active = true;
      state.itemInteraction.hover.index = action.payload.activeIndex;
      state.itemInteraction.hover.dataKey = action.payload.activeDataKey;
      state.itemInteraction.hover.coordinate = action.payload.activeCoordinate;
    },
    mouseLeaveChart(state) {
      /*
       * Clear only the active flags. Why?
       * 1. Keep Coordinate to preserve animation - next time the Tooltip appears, we want to render it from
       * the last place where it was when it disappeared.
       * 2. We want to keep all the properties anyway just in case the tooltip has `active=true` prop
       * and continues being visible even after the mouse has left the chart.
       */
      state.itemInteraction.hover.active = false;
      state.axisInteraction.hover.active = false;
    },
    mouseLeaveItem(state) {
      state.itemInteraction.hover.active = false;
    },
    setActiveClickItemIndex(state, action) {
      state.syncInteraction.active = false;
      state.itemInteraction.click.active = true;
      state.keyboardInteraction.active = false;
      state.itemInteraction.click.index = action.payload.activeIndex;
      state.itemInteraction.click.dataKey = action.payload.activeDataKey;
      state.itemInteraction.click.coordinate = action.payload.activeCoordinate;
    },
    setMouseOverAxisIndex(state, action) {
      state.syncInteraction.active = false;
      state.axisInteraction.hover.active = true;
      state.keyboardInteraction.active = false;
      state.axisInteraction.hover.index = action.payload.activeIndex;
      state.axisInteraction.hover.dataKey = action.payload.activeDataKey;
      state.axisInteraction.hover.coordinate = action.payload.activeCoordinate;
    },
    setMouseClickAxisIndex(state, action) {
      state.syncInteraction.active = false;
      state.keyboardInteraction.active = false;
      state.axisInteraction.click.active = true;
      state.axisInteraction.click.index = action.payload.activeIndex;
      state.axisInteraction.click.dataKey = action.payload.activeDataKey;
      state.axisInteraction.click.coordinate = action.payload.activeCoordinate;
    },
    setSyncInteraction(state, action) {
      state.syncInteraction = action.payload;
    },
    setKeyboardInteraction(state, action) {
      state.keyboardInteraction.active = action.payload.active;
      state.keyboardInteraction.index = action.payload.activeIndex;
      state.keyboardInteraction.coordinate = action.payload.activeCoordinate;
      state.keyboardInteraction.dataKey = action.payload.activeDataKey;
    }
  }
});
var {
  addTooltipEntrySettings,
  removeTooltipEntrySettings,
  setTooltipSettingsState,
  setActiveMouseOverItemIndex,
  mouseLeaveItem,
  mouseLeaveChart,
  setActiveClickItemIndex,
  setMouseOverAxisIndex,
  setMouseClickAxisIndex,
  setSyncInteraction,
  setKeyboardInteraction
} = tooltipSlice.actions;
var tooltipReducer = tooltipSlice.reducer;

function ownKeys$g(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$g(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$g(Object(t), true).forEach(function (r) { _defineProperty$i(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$g(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$i(e, r, t) { return (r = _toPropertyKey$i(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$i(t) { var i = _toPrimitive$i(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$i(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function chooseAppropriateMouseInteraction(tooltipState, tooltipEventType, trigger) {
  if (tooltipEventType === 'axis') {
    if (trigger === 'click') {
      return tooltipState.axisInteraction.click;
    }
    return tooltipState.axisInteraction.hover;
  }
  if (trigger === 'click') {
    return tooltipState.itemInteraction.click;
  }
  return tooltipState.itemInteraction.hover;
}
function hasBeenActivePreviously(tooltipInteractionState) {
  return tooltipInteractionState.index != null;
}
var combineTooltipInteractionState = (tooltipState, tooltipEventType, trigger, defaultIndex) => {
  if (tooltipEventType == null) {
    return noInteraction;
  }
  var appropriateMouseInteraction = chooseAppropriateMouseInteraction(tooltipState, tooltipEventType, trigger);
  if (appropriateMouseInteraction == null) {
    return noInteraction;
  }
  if (appropriateMouseInteraction.active) {
    return appropriateMouseInteraction;
  }
  if (tooltipState.keyboardInteraction.active) {
    return tooltipState.keyboardInteraction;
  }
  if (tooltipState.syncInteraction.active && tooltipState.syncInteraction.index != null) {
    return tooltipState.syncInteraction;
  }
  var activeFromProps = tooltipState.settings.active === true;
  if (hasBeenActivePreviously(appropriateMouseInteraction)) {
    if (activeFromProps) {
      return _objectSpread$g(_objectSpread$g({}, appropriateMouseInteraction), {}, {
        active: true
      });
    }
  } else if (defaultIndex != null) {
    return {
      active: true,
      coordinate: undefined,
      dataKey: undefined,
      index: defaultIndex
    };
  }
  return _objectSpread$g(_objectSpread$g({}, noInteraction), {}, {
    coordinate: appropriateMouseInteraction.coordinate
  });
};

var combineActiveTooltipIndex = (tooltipInteraction, chartData) => {
  var desiredIndex = tooltipInteraction === null || tooltipInteraction === void 0 ? void 0 : tooltipInteraction.index;
  if (desiredIndex == null) {
    return null;
  }
  var indexAsNumber = Number(desiredIndex);
  if (!isWellBehavedNumber(indexAsNumber)) {
    // this is for charts like Sankey and Treemap that do not support numerical indexes. We need a proper solution for this before we can start supporting keyboard events on these charts.
    return desiredIndex;
  }

  /*
   * Zero is a trivial limit for single-dimensional charts like Line and Area,
   * but this also needs a support for multidimensional charts like Sankey and Treemap! TODO
   */
  var lowerLimit = 0;
  var upperLimit = +Infinity;
  if (chartData.length > 0) {
    upperLimit = chartData.length - 1;
  }

  // now let's clamp the desiredIndex between the limits
  return String(Math.max(lowerLimit, Math.min(indexAsNumber, upperLimit)));
};

var combineCoordinateForDefaultIndex = (width, height, layout, offset, tooltipTicks, defaultIndex, tooltipConfigurations, tooltipPayloadSearcher) => {
  if (defaultIndex == null || tooltipPayloadSearcher == null) {
    return undefined;
  }
  // With defaultIndex alone, we don't have enough information to decide _which_ of the multiple tooltips to display. So we choose the first one.
  var firstConfiguration = tooltipConfigurations[0];
  // @ts-expect-error we need to rethink the tooltipPayloadSearcher type
  var maybePosition = firstConfiguration == null ? undefined : tooltipPayloadSearcher(firstConfiguration.positions, defaultIndex);
  if (maybePosition != null) {
    return maybePosition;
  }
  var tick = tooltipTicks === null || tooltipTicks === void 0 ? void 0 : tooltipTicks[Number(defaultIndex)];
  if (!tick) {
    return undefined;
  }
  switch (layout) {
    case 'horizontal':
      {
        return {
          x: tick.coordinate,
          y: (offset.top + height) / 2
        };
      }
    default:
      {
        // This logic is not super sound - it conflates vertical, radial, centric layouts into just one. TODO improve!
        return {
          x: (offset.left + width) / 2,
          y: tick.coordinate
        };
      }
  }
};

var combineTooltipPayloadConfigurations = (tooltipState, tooltipEventType, trigger, defaultIndex) => {
  // if tooltip reacts to axis interaction, then we display all items at the same time.
  if (tooltipEventType === 'axis') {
    return tooltipState.tooltipItemPayloads;
  }
  /*
   * By now we already know that tooltipEventType is 'item', so we can only search in itemInteractions.
   * item means that only the hovered or clicked item will be present in the tooltip.
   */
  if (tooltipState.tooltipItemPayloads.length === 0) {
    // No point filtering if the payload is empty
    return [];
  }
  var filterByDataKey;
  if (trigger === 'hover') {
    filterByDataKey = tooltipState.itemInteraction.hover.dataKey;
  } else {
    filterByDataKey = tooltipState.itemInteraction.click.dataKey;
  }
  if (filterByDataKey == null && defaultIndex != null) {
    /*
     * So when we use `defaultIndex` - we don't have a dataKey to filter by because user did not hover over anything yet.
     * In that case let's display the first item in the tooltip; after all, this is `item` interaction case,
     * so we should display only one item at a time instead of all.
     */
    return [tooltipState.tooltipItemPayloads[0]];
  }
  return tooltipState.tooltipItemPayloads.filter(tpc => {
    var _tpc$settings;
    return ((_tpc$settings = tpc.settings) === null || _tpc$settings === void 0 ? void 0 : _tpc$settings.dataKey) === filterByDataKey;
  });
};

var selectTooltipPayloadSearcher = state => state.options.tooltipPayloadSearcher;

var selectTooltipState = state => state.tooltip;

function ownKeys$f(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$f(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$f(Object(t), true).forEach(function (r) { _defineProperty$h(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$f(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$h(e, r, t) { return (r = _toPropertyKey$h(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$h(t) { var i = _toPrimitive$h(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$h(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function selectFinalData(dataDefinedOnItem, dataDefinedOnChart) {
  /*
   * If a payload has data specified directly from the graphical item, prefer that.
   * Otherwise, fill in data from the chart level, using the same index.
   */
  if (dataDefinedOnItem != null) {
    return dataDefinedOnItem;
  }
  return dataDefinedOnChart;
}
var combineTooltipPayload = (tooltipPayloadConfigurations, activeIndex, chartDataState, tooltipAxisDataKey, activeLabel, tooltipPayloadSearcher, tooltipEventType) => {
  if (activeIndex == null || tooltipPayloadSearcher == null) {
    return undefined;
  }
  var {
    chartData,
    computedData,
    dataStartIndex,
    dataEndIndex
  } = chartDataState;
  var init = [];
  return tooltipPayloadConfigurations.reduce((agg, _ref) => {
    var _settings$dataKey;
    var {
      dataDefinedOnItem,
      settings
    } = _ref;
    var finalData = selectFinalData(dataDefinedOnItem, chartData);
    var sliced = Array.isArray(finalData) ? getSliced(finalData, dataStartIndex, dataEndIndex) : finalData;
    var finalDataKey = (_settings$dataKey = settings === null || settings === void 0 ? void 0 : settings.dataKey) !== null && _settings$dataKey !== void 0 ? _settings$dataKey : tooltipAxisDataKey;
    // BaseAxisProps does not support nameKey but it could!
    var finalNameKey = settings === null || settings === void 0 ? void 0 : settings.nameKey; // ?? tooltipAxis?.nameKey;
    var tooltipPayload;
    if (tooltipAxisDataKey && Array.isArray(sliced) &&
    /*
     * findEntryInArray won't work for Scatter because Scatter provides an array of arrays
     * as tooltip payloads and findEntryInArray is not prepared to handle that.
     * Sad but also ScatterChart only allows 'item' tooltipEventType
     * and also this is only a problem if there are multiple Scatters and each has its own data array
     * so let's fix that some other time.
     */
    !Array.isArray(sliced[0]) &&
    /*
     * If the tooltipEventType is 'axis', we should search for the dataKey in the sliced data
     * because thanks to allowDuplicatedCategory=false, the order of elements in the array
     * no longer matches the order of elements in the original data
     * and so we need to search by the active dataKey + label rather than by index.
     *
     * The same happens if multiple graphical items are present in the chart
     * and each of them has its own data array. Those arrays get concatenated
     * and again the tooltip index no longer matches the original data.
     *
     * On the other hand the tooltipEventType 'item' should always search by index
     * because we get the index from interacting over the individual elements
     * which is always accurate, irrespective of the allowDuplicatedCategory setting.
     */
    tooltipEventType === 'axis') {
      tooltipPayload = findEntryInArray(sliced, tooltipAxisDataKey, activeLabel);
    } else {
      /*
       * This is a problem because it assumes that the index is pointing to the displayed data
       * which it isn't because the index is pointing to the tooltip ticks array.
       * The above approach (with findEntryInArray) is the correct one, but it only works
       * if the axis dataKey is defined explicitly, and if the data is an array of objects.
       */
      tooltipPayload = tooltipPayloadSearcher(sliced, activeIndex, computedData, finalNameKey);
    }
    if (Array.isArray(tooltipPayload)) {
      tooltipPayload.forEach(item => {
        var newSettings = _objectSpread$f(_objectSpread$f({}, settings), {}, {
          name: item.name,
          unit: item.unit,
          // color and fill are erased to keep 100% the identical behaviour to recharts 2.x - but there's nothing stopping us from returning them here. It's technically a breaking change.
          color: undefined,
          // color and fill are erased to keep 100% the identical behaviour to recharts 2.x - but there's nothing stopping us from returning them here. It's technically a breaking change.
          fill: undefined
        });
        agg.push(getTooltipEntry({
          tooltipEntrySettings: newSettings,
          dataKey: item.dataKey,
          payload: item.payload,
          // @ts-expect-error getValueByDataKey does not validate the output type
          value: getValueByDataKey(item.payload, item.dataKey),
          name: item.name
        }));
      });
    } else {
      var _getValueByDataKey;
      // I am not quite sure why these two branches (Array vs Array of Arrays) have to behave differently - I imagine we should unify these. 3.x breaking change?
      agg.push(getTooltipEntry({
        tooltipEntrySettings: settings,
        dataKey: finalDataKey,
        payload: tooltipPayload,
        // @ts-expect-error getValueByDataKey does not validate the output type
        value: getValueByDataKey(tooltipPayload, finalDataKey),
        // @ts-expect-error getValueByDataKey does not validate the output type
        name: (_getValueByDataKey = getValueByDataKey(tooltipPayload, finalNameKey)) !== null && _getValueByDataKey !== void 0 ? _getValueByDataKey : settings === null || settings === void 0 ? void 0 : settings.name
      }));
    }
    return agg;
  }, init);
};

var selectTooltipAxisRealScaleType = createSelector([selectTooltipAxis, selectChartLayout, selectHasBar, selectChartName, selectTooltipAxisType], combineRealScaleType);
var selectAllUnfilteredGraphicalItems = createSelector([state => state.graphicalItems.cartesianItems, state => state.graphicalItems.polarItems], (cartesianItems, polarItems) => [...cartesianItems, ...polarItems]);
var selectTooltipAxisPredicate = createSelector([selectTooltipAxisType, selectTooltipAxisId], itemAxisPredicate);
var selectAllGraphicalItemsSettings = createSelector([selectAllUnfilteredGraphicalItems, selectTooltipAxis, selectTooltipAxisPredicate], combineGraphicalItemsSettings);
var selectAllStackedGraphicalItemsSettings = createSelector([selectAllGraphicalItemsSettings], graphicalItems => graphicalItems.filter(isStacked));
var selectTooltipGraphicalItemsData = createSelector([selectAllGraphicalItemsSettings], combineGraphicalItemsData);

/**
 * Data for tooltip always use the data with indexes set by a Brush,
 * and never accept the isPanorama flag:
 * because Tooltip never displays inside the panorama anyway
 * so we don't need to worry what would happen there.
 */
var selectTooltipDisplayedData = createSelector([selectTooltipGraphicalItemsData, selectChartDataWithIndexes], combineDisplayedData);
var selectTooltipStackedData = createSelector([selectAllStackedGraphicalItemsSettings, selectChartDataWithIndexes, selectTooltipAxis], combineDisplayedStackedData);
var selectAllTooltipAppliedValues = createSelector([selectTooltipDisplayedData, selectTooltipAxis, selectAllGraphicalItemsSettings], combineAppliedValues);
var selectTooltipAxisDomainDefinition = createSelector([selectTooltipAxis], getDomainDefinition);
var selectAllStackedGraphicalItems = createSelector([selectAllGraphicalItemsSettings], graphicalItems => graphicalItems.filter(isStacked));
var selectTooltipStackGroups = createSelector([selectTooltipStackedData, selectAllStackedGraphicalItems, selectStackOffsetType], combineStackGroups);
var selectTooltipDomainOfStackGroups = createSelector([selectTooltipStackGroups, selectChartDataWithIndexes, selectTooltipAxisType], combineDomainOfStackGroups);
var selectTooltipItemsSettingsExceptStacked = createSelector([selectAllGraphicalItemsSettings], filterGraphicalNotStackedItems);
var selectTooltipAllAppliedNumericalValuesIncludingErrorValues = createSelector([selectTooltipDisplayedData, selectTooltipAxis, selectTooltipItemsSettingsExceptStacked, selectAllErrorBarSettings, selectTooltipAxisType], combineAppliedNumericalValuesIncludingErrorValues);
var selectReferenceDotsByTooltipAxis = createSelector([selectReferenceDots, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceDotsDomain = createSelector([selectReferenceDotsByTooltipAxis, selectTooltipAxisType], combineDotsDomain);
var selectReferenceAreasByTooltipAxis = createSelector([selectReferenceAreas, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceAreasDomain = createSelector([selectReferenceAreasByTooltipAxis, selectTooltipAxisType], combineAreasDomain);
var selectReferenceLinesByTooltipAxis = createSelector([selectReferenceLines, selectTooltipAxisType, selectTooltipAxisId], filterReferenceElements);
var selectTooltipReferenceLinesDomain = createSelector([selectReferenceLinesByTooltipAxis, selectTooltipAxisType], combineLinesDomain);
var selectTooltipReferenceElementsDomain = createSelector([selectTooltipReferenceDotsDomain, selectTooltipReferenceLinesDomain, selectTooltipReferenceAreasDomain], mergeDomains);
var selectTooltipNumericalDomain = createSelector([selectTooltipAxis, selectTooltipAxisDomainDefinition, selectTooltipDomainOfStackGroups, selectTooltipAllAppliedNumericalValuesIncludingErrorValues, selectTooltipReferenceElementsDomain, selectChartLayout, selectTooltipAxisType], combineNumericalDomain);
var selectTooltipAxisDomain = createSelector([selectTooltipAxis, selectChartLayout, selectTooltipDisplayedData, selectAllTooltipAppliedValues, selectStackOffsetType, selectTooltipAxisType, selectTooltipNumericalDomain], combineAxisDomain);
var selectTooltipNiceTicks = createSelector([selectTooltipAxisDomain, selectTooltipAxis, selectTooltipAxisRealScaleType], combineNiceTicks);
var selectTooltipAxisDomainIncludingNiceTicks = createSelector([selectTooltipAxis, selectTooltipAxisDomain, selectTooltipNiceTicks, selectTooltipAxisType], combineAxisDomainWithNiceTicks);
var selectTooltipAxisRange = state => {
  var axisType = selectTooltipAxisType(state);
  var axisId = selectTooltipAxisId(state);
  var isPanorama = false; // Tooltip never displays in panorama so this is safe to assume
  return selectAxisRange(state, axisType, axisId, isPanorama);
};
var selectTooltipAxisRangeWithReverse = createSelector([selectTooltipAxis, selectTooltipAxisRange], combineAxisRangeWithReverse);
var selectTooltipAxisScale = createSelector([selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisDomainIncludingNiceTicks, selectTooltipAxisRangeWithReverse], combineScaleFunction);
var selectTooltipDuplicateDomain = createSelector([selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], combineDuplicateDomain);
var selectTooltipCategoricalDomain = createSelector([selectChartLayout, selectAllTooltipAppliedValues, selectTooltipAxis, selectTooltipAxisType], combineCategoricalDomain);
var combineTicksOfTooltipAxis = (layout, axis, realScaleType, scale, range, duplicateDomain, categoricalDomain, axisType) => {
  if (!axis) {
    return undefined;
  }
  var {
    type
  } = axis;
  var isCategorical = isCategoricalAxis(layout, axisType);
  if (!scale) {
    return undefined;
  }
  var offsetForBand = realScaleType === 'scaleBand' && scale.bandwidth ? scale.bandwidth() / 2 : 2;
  var offset = type === 'category' && scale.bandwidth ? scale.bandwidth() / offsetForBand : 0;
  offset = axisType === 'angleAxis' && range != null && (range === null || range === void 0 ? void 0 : range.length) >= 2 ? mathSign(range[0] - range[1]) * 2 * offset : offset;

  // When axis is a categorical axis, but the type of axis is number or the scale of axis is not "auto"
  if (isCategorical && categoricalDomain) {
    return categoricalDomain.map((entry, index) => ({
      coordinate: scale(entry) + offset,
      value: entry,
      index,
      offset
    }));
  }

  // When axis has duplicated text, serial numbers are used to generate scale
  return scale.domain().map((entry, index) => ({
    coordinate: scale(entry) + offset,
    value: duplicateDomain ? duplicateDomain[entry] : entry,
    index,
    offset
  }));
};
var selectTooltipAxisTicks = createSelector([selectChartLayout, selectTooltipAxis, selectTooltipAxisRealScaleType, selectTooltipAxisScale, selectTooltipAxisRange, selectTooltipDuplicateDomain, selectTooltipCategoricalDomain, selectTooltipAxisType], combineTicksOfTooltipAxis);
var selectTooltipEventType = createSelector([selectDefaultTooltipEventType, selectValidateTooltipEventTypes, selectTooltipSettings], (defaultTooltipEventType, validateTooltipEventType, settings) => combineTooltipEventType(settings.shared, defaultTooltipEventType, validateTooltipEventType));
var selectTooltipTrigger = state => state.tooltip.settings.trigger;
var selectDefaultIndex = state => state.tooltip.settings.defaultIndex;
var selectTooltipInteractionState$1 = createSelector([selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], combineTooltipInteractionState);
var selectActiveTooltipIndex = createSelector([selectTooltipInteractionState$1, selectTooltipDisplayedData], combineActiveTooltipIndex);
var selectActiveLabel$1 = createSelector([selectTooltipAxisTicks, selectActiveTooltipIndex], combineActiveLabel);
var selectActiveTooltipDataKey = createSelector([selectTooltipInteractionState$1], tooltipInteraction => {
  if (!tooltipInteraction) {
    return undefined;
  }
  return tooltipInteraction.dataKey;
});
var selectTooltipPayloadConfigurations$1 = createSelector([selectTooltipState, selectTooltipEventType, selectTooltipTrigger, selectDefaultIndex], combineTooltipPayloadConfigurations);
var selectTooltipCoordinateForDefaultIndex = createSelector([selectChartWidth, selectChartHeight, selectChartLayout, selectChartOffsetInternal, selectTooltipAxisTicks, selectDefaultIndex, selectTooltipPayloadConfigurations$1, selectTooltipPayloadSearcher], combineCoordinateForDefaultIndex);
var selectActiveTooltipCoordinate = createSelector([selectTooltipInteractionState$1, selectTooltipCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  if (tooltipInteractionState !== null && tooltipInteractionState !== void 0 && tooltipInteractionState.coordinate) {
    return tooltipInteractionState.coordinate;
  }
  return defaultIndexCoordinate;
});
var selectIsTooltipActive$1 = createSelector([selectTooltipInteractionState$1], tooltipInteractionState => tooltipInteractionState.active);
var selectActiveTooltipPayload = createSelector([selectTooltipPayloadConfigurations$1, selectActiveTooltipIndex, selectChartDataWithIndexes, selectTooltipAxisDataKey, selectActiveLabel$1, selectTooltipPayloadSearcher, selectTooltipEventType], combineTooltipPayload);
var selectActiveTooltipDataPoints = createSelector([selectActiveTooltipPayload], payload => {
  if (payload == null) {
    return undefined;
  }
  var dataPoints = payload.map(p => p.payload).filter(p => p != null);
  return Array.from(new Set(dataPoints));
});

function ownKeys$e(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$e(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$e(Object(t), true).forEach(function (r) { _defineProperty$g(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$e(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$g(e, r, t) { return (r = _toPropertyKey$g(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$g(t) { var i = _toPrimitive$g(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$g(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var useTooltipAxis = () => useAppSelector(selectTooltipAxis);
var useTooltipAxisBandSize = () => {
  var tooltipAxis = useTooltipAxis();
  var tooltipTicks = useAppSelector(selectTooltipAxisTicks);
  var tooltipAxisScale = useAppSelector(selectTooltipAxisScale);
  return getBandSizeOfAxis(_objectSpread$e(_objectSpread$e({}, tooltipAxis), {}, {
    scale: tooltipAxisScale
  }), tooltipTicks);
};

var useChartName = () => {
  return useAppSelector(selectChartName);
};
var pickTooltipEventType = (_state, tooltipEventType) => tooltipEventType;
var pickTrigger = (_state, _tooltipEventType, trigger) => trigger;
var pickDefaultIndex = (_state, _tooltipEventType, _trigger, defaultIndex) => defaultIndex;
var selectOrderedTooltipTicks = createSelector(selectTooltipAxisTicks, ticks => sortBy(ticks, o => o.coordinate));
var selectTooltipInteractionState = createSelector([selectTooltipState, pickTooltipEventType, pickTrigger, pickDefaultIndex], combineTooltipInteractionState);
var selectActiveIndex = createSelector([selectTooltipInteractionState, selectTooltipDisplayedData], combineActiveTooltipIndex);
var selectTooltipDataKey = (state, tooltipEventType, trigger) => {
  if (tooltipEventType == null) {
    return undefined;
  }
  var tooltipState = selectTooltipState(state);
  if (tooltipEventType === 'axis') {
    if (trigger === 'hover') {
      return tooltipState.axisInteraction.hover.dataKey;
    }
    return tooltipState.axisInteraction.click.dataKey;
  }
  if (trigger === 'hover') {
    return tooltipState.itemInteraction.hover.dataKey;
  }
  return tooltipState.itemInteraction.click.dataKey;
};
var selectTooltipPayloadConfigurations = createSelector([selectTooltipState, pickTooltipEventType, pickTrigger, pickDefaultIndex], combineTooltipPayloadConfigurations);
var selectCoordinateForDefaultIndex = createSelector([selectChartWidth, selectChartHeight, selectChartLayout, selectChartOffsetInternal, selectTooltipAxisTicks, pickDefaultIndex, selectTooltipPayloadConfigurations, selectTooltipPayloadSearcher], combineCoordinateForDefaultIndex);
var selectActiveCoordinate = createSelector([selectTooltipInteractionState, selectCoordinateForDefaultIndex], (tooltipInteractionState, defaultIndexCoordinate) => {
  var _tooltipInteractionSt;
  return (_tooltipInteractionSt = tooltipInteractionState.coordinate) !== null && _tooltipInteractionSt !== void 0 ? _tooltipInteractionSt : defaultIndexCoordinate;
});
var selectActiveLabel = createSelector(selectTooltipAxisTicks, selectActiveIndex, combineActiveLabel);
var selectTooltipPayload = createSelector([selectTooltipPayloadConfigurations, selectActiveIndex, selectChartDataWithIndexes, selectTooltipAxisDataKey, selectActiveLabel, selectTooltipPayloadSearcher, pickTooltipEventType], combineTooltipPayload);
var selectIsTooltipActive = createSelector([selectTooltipInteractionState], tooltipInteractionState => {
  return {
    isActive: tooltipInteractionState.active,
    activeIndex: tooltipInteractionState.index
  };
});
var combineActiveProps = (chartEvent, layout, polarViewBox, tooltipAxisType, tooltipAxisRange, tooltipTicks, orderedTooltipTicks, offset) => {
  if (!chartEvent || !layout || !tooltipAxisType || !tooltipAxisRange || !tooltipTicks) {
    return undefined;
  }
  var rangeObj = inRange(chartEvent.chartX, chartEvent.chartY, layout, polarViewBox, offset);
  if (!rangeObj) {
    return undefined;
  }
  var pos = calculateTooltipPos(rangeObj, layout);
  var activeIndex = calculateActiveTickIndex(pos, orderedTooltipTicks, tooltipTicks, tooltipAxisType, tooltipAxisRange);
  var activeCoordinate = getActiveCoordinate(layout, tooltipTicks, activeIndex, rangeObj);
  return {
    activeIndex: String(activeIndex),
    activeCoordinate
  };
};

function _extends$c() { return _extends$c = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$c.apply(null, arguments); }
function ownKeys$d(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$d(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$d(Object(t), true).forEach(function (r) { _defineProperty$f(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$d(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$f(e, r, t) { return (r = _toPropertyKey$f(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$f(t) { var i = _toPrimitive$f(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$f(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

/**
 * If set false, no cursor will be drawn when tooltip is active.
 * If set an object, the option is the configuration of cursor.
 * If set a React element, the option is the custom react element of drawing cursor
 */

function CursorInternal(props) {
  var {
    coordinate,
    payload,
    index,
    offset,
    tooltipAxisBandSize,
    layout,
    cursor,
    tooltipEventType,
    chartName
  } = props;

  // The cursor is a part of the Tooltip, and it should be shown (by default) when the Tooltip is active.
  var activeCoordinate = coordinate;
  var activePayload = payload;
  var activeTooltipIndex = index;
  if (!cursor || !activeCoordinate || chartName !== 'ScatterChart' && tooltipEventType !== 'axis') {
    return null;
  }
  var restProps, cursorComp;
  if (chartName === 'ScatterChart') {
    restProps = activeCoordinate;
    cursorComp = Cross;
  } else if (chartName === 'BarChart') {
    restProps = getCursorRectangle(layout, activeCoordinate, offset, tooltipAxisBandSize);
    cursorComp = Rectangle;
  } else if (layout === 'radial') {
    // @ts-expect-error TODO the state is marked as containing Coordinate but actually in polar charts it contains PolarCoordinate, we should keep the polar state separate
    var {
      cx,
      cy,
      radius,
      startAngle,
      endAngle
    } = getRadialCursorPoints(activeCoordinate);
    restProps = {
      cx,
      cy,
      startAngle,
      endAngle,
      innerRadius: radius,
      outerRadius: radius
    };
    cursorComp = Sector;
  } else {
    restProps = {
      points: getCursorPoints(layout, activeCoordinate, offset)
    };
    cursorComp = Curve;
  }
  var extraClassName = typeof cursor === 'object' && 'className' in cursor ? cursor.className : undefined;
  var cursorProps = _objectSpread$d(_objectSpread$d(_objectSpread$d(_objectSpread$d({
    stroke: '#ccc',
    pointerEvents: 'none'
  }, offset), restProps), filterProps(cursor, false)), {}, {
    payload: activePayload,
    payloadIndex: activeTooltipIndex,
    className: clsx('recharts-tooltip-cursor', extraClassName)
  });
  return /*#__PURE__*/reactExports.isValidElement(cursor) ? /*#__PURE__*/reactExports.cloneElement(cursor, cursorProps) : /*#__PURE__*/reactExports.createElement(cursorComp, cursorProps);
}

/*
 * Cursor is the background, or a highlight,
 * that shows when user mouses over or activates
 * an area.
 *
 * It usually shows together with a tooltip
 * to emphasise which part of the chart does the tooltip refer to.
 */
function Cursor(props) {
  var tooltipAxisBandSize = useTooltipAxisBandSize();
  var offset = useOffsetInternal();
  var layout = useChartLayout();
  var chartName = useChartName();
  return /*#__PURE__*/reactExports.createElement(CursorInternal, _extends$c({}, props, {
    coordinate: props.coordinate,
    index: props.index,
    payload: props.payload,
    offset: offset,
    layout: layout,
    tooltipAxisBandSize: tooltipAxisBandSize,
    chartName: chartName
  }));
}

var TooltipPortalContext = /*#__PURE__*/reactExports.createContext(null);
var useTooltipPortal = () => reactExports.useContext(TooltipPortalContext);

var eventCenter = new EventEmitter();
var TOOLTIP_SYNC_EVENT = 'recharts.syncEvent.tooltip';
var BRUSH_SYNC_EVENT = 'recharts.syncEvent.brush';

/**
 * These chart options are decided internally, by Recharts,
 * and will not change during the lifetime of the chart.
 *
 * Changing these options can be done by swapping the root element
 * which will make a brand-new Redux store.
 *
 * If you want to store options that can be changed by the user,
 * use UpdatableChartOptions in rootPropsSlice.ts.
 */

function arrayTooltipSearcher(data, strIndex) {
  if (!strIndex) return undefined;
  var numIndex = Number.parseInt(strIndex, 10);
  if (isNan(numIndex)) {
    return undefined;
  }
  return data === null || data === void 0 ? void 0 : data[numIndex];
}
var initialState$7 = {
  chartName: '',
  tooltipPayloadSearcher: undefined,
  eventEmitter: undefined,
  defaultTooltipEventType: 'axis'
};
var optionsSlice = createSlice({
  name: 'options',
  initialState: initialState$7,
  reducers: {
    createEventEmitter: state => {
      if (state.eventEmitter == null) {
        state.eventEmitter = Symbol('rechartsEventEmitter');
      }
    }
  }
});
var optionsReducer = optionsSlice.reducer;
var {
  createEventEmitter
} = optionsSlice.actions;

function selectSynchronisedTooltipState(state) {
  return state.tooltip.syncInteraction;
}

/**
 * This is the data that's coming through main chart `data` prop
 * Recharts is very flexible in what it accepts so the type is very flexible too.
 * This will typically be an object, and various components will provide various `dataKey`
 * that dictates how to pull data from that object.
 *
 * TL;DR: before dataKey
 */

/**
 * So this is the same unknown type as ChartData but this is after the dataKey has been applied.
 * We still don't know what the type is - that depends on what exactly it was before the dataKey application,
 * and the dataKey can return whatever anyway - but let's keep it separate as a form of documentation.
 *
 * TL;DR: ChartData after dataKey.
 */

var initialChartDataState = {
  chartData: undefined,
  computedData: undefined,
  dataStartIndex: 0,
  dataEndIndex: 0
};
var chartDataSlice = createSlice({
  name: 'chartData',
  initialState: initialChartDataState,
  reducers: {
    setChartData(state, action) {
      state.chartData = action.payload;
      if (action.payload == null) {
        state.dataStartIndex = 0;
        state.dataEndIndex = 0;
        return;
      }
      if (action.payload.length > 0 && state.dataEndIndex !== action.payload.length - 1) {
        state.dataEndIndex = action.payload.length - 1;
      }
    },
    setComputedData(state, action) {
      state.computedData = action.payload;
    },
    setDataStartEndIndexes(state, action) {
      var {
        startIndex,
        endIndex
      } = action.payload;
      if (startIndex != null) {
        state.dataStartIndex = startIndex;
      }
      if (endIndex != null) {
        state.dataEndIndex = endIndex;
      }
    }
  }
});
var {
  setChartData,
  setDataStartEndIndexes,
  setComputedData
} = chartDataSlice.actions;
var chartDataReducer = chartDataSlice.reducer;

var _excluded$d = ["x", "y"];
function ownKeys$c(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$c(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$c(Object(t), true).forEach(function (r) { _defineProperty$e(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$c(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$e(e, r, t) { return (r = _toPropertyKey$e(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$e(t) { var i = _toPrimitive$e(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$e(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties$d(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$d(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$d(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var noop$1 = () => {};
function useTooltipSyncEventsListener() {
  var mySyncId = useAppSelector(selectSyncId);
  var myEventEmitter = useAppSelector(selectEventEmitter);
  var dispatch = useAppDispatch();
  var syncMethod = useAppSelector(selectSyncMethod);
  var tooltipTicks = useAppSelector(selectTooltipAxisTicks);
  var layout = useChartLayout();
  var viewBox = useViewBox();
  var className = useAppSelector(state => state.rootProps.className);
  reactExports.useEffect(() => {
    if (mySyncId == null) {
      // This chart is not synchronised with any other chart so we don't need to listen for any events.
      return noop$1;
    }
    var listener = (incomingSyncId, action, emitter) => {
      if (myEventEmitter === emitter) {
        // We don't want to dispatch actions that we sent ourselves.
        return;
      }
      if (mySyncId !== incomingSyncId) {
        // This event is not for this chart
        return;
      }
      if (syncMethod === 'index') {
        var _action$payload;
        if (viewBox && action !== null && action !== void 0 && (_action$payload = action.payload) !== null && _action$payload !== void 0 && _action$payload.coordinate) {
          var _action$payload$coord = action.payload.coordinate,
            {
              x: _x,
              y: _y
            } = _action$payload$coord,
            otherCoordinateProps = _objectWithoutProperties$d(_action$payload$coord, _excluded$d);
          var boundedCoordinate = _objectSpread$c(_objectSpread$c(_objectSpread$c({}, otherCoordinateProps), typeof _x === 'number' && {
            x: Math.max(viewBox.x, Math.min(_x, viewBox.x + viewBox.width))
          }), typeof _y === 'number' && {
            y: Math.max(viewBox.y, Math.min(_y, viewBox.y + viewBox.height))
          });
          var boundedAction = _objectSpread$c(_objectSpread$c({}, action), {}, {
            payload: _objectSpread$c(_objectSpread$c({}, action.payload), {}, {
              coordinate: boundedCoordinate
            })
          });
          dispatch(boundedAction);
        } else {
          dispatch(action);
        }
        return;
      }
      if (tooltipTicks == null) {
        // for the other two sync methods, we need the ticks to be available
        return;
      }
      var activeTick;
      if (typeof syncMethod === 'function') {
        /*
         * This is what the data shape in 2.x CategoricalChartState used to look like.
         * In 3.x we store things differently but let's try to keep the old shape for compatibility.
         */
        var syncMethodParam = {
          activeTooltipIndex: action.payload.index == null ? undefined : Number(action.payload.index),
          isTooltipActive: action.payload.active,
          activeIndex: action.payload.index == null ? undefined : Number(action.payload.index),
          activeLabel: action.payload.label,
          activeDataKey: action.payload.dataKey,
          activeCoordinate: action.payload.coordinate
        };
        // Call a callback function. If there is an application specific algorithm
        var activeTooltipIndex = syncMethod(tooltipTicks, syncMethodParam);
        activeTick = tooltipTicks[activeTooltipIndex];
      } else if (syncMethod === 'value') {
        // labels are always strings, tick.value might be a string or a number, depending on axis type
        activeTick = tooltipTicks.find(tick => String(tick.value) === action.payload.label);
      }
      var {
        coordinate
      } = action.payload;
      if (activeTick == null || action.payload.active === false || coordinate == null || viewBox == null) {
        dispatch(setSyncInteraction({
          active: false,
          coordinate: undefined,
          dataKey: undefined,
          index: null,
          label: undefined
        }));
        return;
      }
      var {
        x,
        y
      } = coordinate;
      var validateChartX = Math.min(x, viewBox.x + viewBox.width);
      var validateChartY = Math.min(y, viewBox.y + viewBox.height);
      var activeCoordinate = {
        x: layout === 'horizontal' ? activeTick.coordinate : validateChartX,
        y: layout === 'horizontal' ? validateChartY : activeTick.coordinate
      };
      var syncAction = setSyncInteraction({
        active: action.payload.active,
        coordinate: activeCoordinate,
        dataKey: action.payload.dataKey,
        index: String(activeTick.index),
        label: action.payload.label
      });
      dispatch(syncAction);
    };
    eventCenter.on(TOOLTIP_SYNC_EVENT, listener);
    return () => {
      eventCenter.off(TOOLTIP_SYNC_EVENT, listener);
    };
  }, [className, dispatch, myEventEmitter, mySyncId, syncMethod, tooltipTicks, layout, viewBox]);
}
function useBrushSyncEventsListener() {
  var mySyncId = useAppSelector(selectSyncId);
  var myEventEmitter = useAppSelector(selectEventEmitter);
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    if (mySyncId == null) {
      // This chart is not synchronised with any other chart so we don't need to listen for any events.
      return noop$1;
    }
    var listener = (incomingSyncId, action, emitter) => {
      if (myEventEmitter === emitter) {
        // We don't want to dispatch actions that we sent ourselves.
        return;
      }
      if (mySyncId === incomingSyncId) {
        dispatch(setDataStartEndIndexes(action));
      }
    };
    eventCenter.on(BRUSH_SYNC_EVENT, listener);
    return () => {
      eventCenter.off(BRUSH_SYNC_EVENT, listener);
    };
  }, [dispatch, myEventEmitter, mySyncId]);
}

/**
 * Will receive synchronisation events from other charts.
 *
 * Reads syncMethod from state and decides how to synchronise the tooltip based on that.
 *
 * @returns void
 */
function useSynchronisedEventsFromOtherCharts() {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(createEventEmitter());
  }, [dispatch]);
  useTooltipSyncEventsListener();
  useBrushSyncEventsListener();
}

/**
 * Will send events to other charts.
 * If syncId is undefined, no events will be sent.
 *
 * This ignores the syncMethod, because that is set and computed on the receiving end.
 *
 * @param tooltipEventType from Tooltip
 * @param trigger from Tooltip
 * @param activeCoordinate from state
 * @param activeLabel from state
 * @param activeIndex from state
 * @param isTooltipActive from state
 * @returns void
 */
function useTooltipChartSynchronisation(tooltipEventType, trigger, activeCoordinate, activeLabel, activeIndex, isTooltipActive) {
  var activeDataKey = useAppSelector(state => selectTooltipDataKey(state, tooltipEventType, trigger));
  var eventEmitterSymbol = useAppSelector(selectEventEmitter);
  var syncId = useAppSelector(selectSyncId);
  var syncMethod = useAppSelector(selectSyncMethod);
  var tooltipState = useAppSelector(selectSynchronisedTooltipState);
  var isReceivingSynchronisation = tooltipState === null || tooltipState === void 0 ? void 0 : tooltipState.active;
  reactExports.useEffect(() => {
    if (isReceivingSynchronisation) {
      /*
       * This chart currently has active tooltip, synchronised from another chart.
       * Let's not send any outgoing synchronisation events while that's happening
       * to avoid infinite loops.
       */
      return;
    }
    if (syncId == null) {
      /*
       * syncId is not set, means that this chart is not synchronised with any other chart,
       * means we don't need to send synchronisation events
       */
      return;
    }
    if (eventEmitterSymbol == null) {
      /*
       * When using Recharts internal hooks and selectors outside charts context,
       * these properties will be undefined. Let's return silently instead of throwing an error.
       */
      return;
    }
    var syncAction = setSyncInteraction({
      active: isTooltipActive,
      coordinate: activeCoordinate,
      dataKey: activeDataKey,
      index: activeIndex,
      label: typeof activeLabel === 'number' ? String(activeLabel) : activeLabel
    });
    eventCenter.emit(TOOLTIP_SYNC_EVENT, syncId, syncAction, eventEmitterSymbol);
  }, [isReceivingSynchronisation, activeCoordinate, activeDataKey, activeIndex, activeLabel, eventEmitterSymbol, syncId, syncMethod, isTooltipActive]);
}

function ownKeys$b(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$b(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$b(Object(t), true).forEach(function (r) { _defineProperty$d(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$b(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$d(e, r, t) { return (r = _toPropertyKey$d(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$d(t) { var i = _toPrimitive$d(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$d(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function defaultUniqBy(entry) {
  return entry.dataKey;
}
function renderContent(content, props) {
  if (/*#__PURE__*/reactExports.isValidElement(content)) {
    return /*#__PURE__*/reactExports.cloneElement(content, props);
  }
  if (typeof content === 'function') {
    return /*#__PURE__*/reactExports.createElement(content, props);
  }
  return /*#__PURE__*/reactExports.createElement(DefaultTooltipContent, props);
}
var emptyPayload = [];
var defaultTooltipProps = {
  allowEscapeViewBox: {
    x: false,
    y: false
  },
  animationDuration: 400,
  animationEasing: 'ease',
  axisId: 0,
  contentStyle: {},
  cursor: true,
  filterNull: true,
  isAnimationActive: !Global.isSsr,
  itemSorter: 'name',
  itemStyle: {},
  labelStyle: {},
  offset: 10,
  reverseDirection: {
    x: false,
    y: false
  },
  separator: ' : ',
  trigger: 'hover',
  useTranslate3d: false,
  wrapperStyle: {}
};
function Tooltip(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultTooltipProps);
  var {
    active: activeFromProps,
    allowEscapeViewBox,
    animationDuration,
    animationEasing,
    content,
    filterNull,
    isAnimationActive,
    offset,
    payloadUniqBy,
    position,
    reverseDirection,
    useTranslate3d,
    wrapperStyle,
    cursor,
    shared,
    trigger,
    defaultIndex,
    portal: portalFromProps,
    axisId
  } = props;
  var dispatch = useAppDispatch();
  var defaultIndexAsString = typeof defaultIndex === 'number' ? String(defaultIndex) : defaultIndex;
  reactExports.useEffect(() => {
    dispatch(setTooltipSettingsState({
      shared,
      trigger,
      axisId,
      active: activeFromProps,
      defaultIndex: defaultIndexAsString
    }));
  }, [dispatch, shared, trigger, axisId, activeFromProps, defaultIndexAsString]);
  var viewBox = useViewBox();
  var accessibilityLayer = useAccessibilityLayer();
  var tooltipEventType = useTooltipEventType(shared);
  var {
    activeIndex,
    isActive
  } = useAppSelector(state => selectIsTooltipActive(state, tooltipEventType, trigger, defaultIndexAsString));
  var payloadFromRedux = useAppSelector(state => selectTooltipPayload(state, tooltipEventType, trigger, defaultIndexAsString));
  var labelFromRedux = useAppSelector(state => selectActiveLabel(state, tooltipEventType, trigger, defaultIndexAsString));
  var coordinate = useAppSelector(state => selectActiveCoordinate(state, tooltipEventType, trigger, defaultIndexAsString));
  var payload = payloadFromRedux;
  var tooltipPortalFromContext = useTooltipPortal();
  /*
   * The user can set `active=true` on the Tooltip in which case the Tooltip will stay always active,
   * or `active=false` in which case the Tooltip never shows.
   *
   * If the `active` prop is not defined then it will show and hide based on mouse or keyboard activity.
   */
  var finalIsActive = activeFromProps !== null && activeFromProps !== void 0 ? activeFromProps : isActive;
  var [lastBoundingBox, updateBoundingBox] = useElementOffset([payload, finalIsActive]);
  var finalLabel = tooltipEventType === 'axis' ? labelFromRedux : undefined;
  useTooltipChartSynchronisation(tooltipEventType, trigger, coordinate, finalLabel, activeIndex, finalIsActive);
  var tooltipPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : tooltipPortalFromContext;
  if (tooltipPortal == null) {
    return null;
  }
  var finalPayload = payload !== null && payload !== void 0 ? payload : emptyPayload;
  if (!finalIsActive) {
    finalPayload = emptyPayload;
  }
  if (filterNull && finalPayload.length) {
    finalPayload = getUniqPayload(payload.filter(entry => entry.value != null && (entry.hide !== true || props.includeHidden)), payloadUniqBy, defaultUniqBy);
  }
  var hasPayload = finalPayload.length > 0;
  var tooltipElement = /*#__PURE__*/reactExports.createElement(TooltipBoundingBox, {
    allowEscapeViewBox: allowEscapeViewBox,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    active: finalIsActive,
    coordinate: coordinate,
    hasPayload: hasPayload,
    offset: offset,
    position: position,
    reverseDirection: reverseDirection,
    useTranslate3d: useTranslate3d,
    viewBox: viewBox,
    wrapperStyle: wrapperStyle,
    lastBoundingBox: lastBoundingBox,
    innerRef: updateBoundingBox,
    hasPortalFromProps: Boolean(portalFromProps)
  }, renderContent(content, _objectSpread$b(_objectSpread$b({}, props), {}, {
    // @ts-expect-error renderContent method expects the payload to be mutable, TODO make it immutable
    payload: finalPayload,
    label: finalLabel,
    active: finalIsActive,
    coordinate,
    accessibilityLayer
  })));
  return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactDomExports.createPortal(tooltipElement, tooltipPortal), finalIsActive && /*#__PURE__*/reactExports.createElement(Cursor, {
    cursor: cursor,
    tooltipEventType: tooltipEventType,
    coordinate: coordinate,
    payload: payload,
    index: activeIndex
  }));
}

var warn = function warn2(condition, format) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
};

function ownKeys$a(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$a(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$a(Object(t), true).forEach(function (r) { _defineProperty$c(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$a(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$c(e, r, t) { return (r = _toPropertyKey$c(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$c(t) { var i = _toPrimitive$c(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$c(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var ResponsiveContainer = /*#__PURE__*/reactExports.forwardRef((_ref, ref) => {
  var {
    aspect,
    initialDimension = {
      width: -1,
      height: -1
    },
    width = '100%',
    height = '100%',
    /*
     * default min-width to 0 if not specified - 'auto' causes issues with flexbox
     * https://github.com/recharts/recharts/issues/172
     */
    minWidth = 0,
    minHeight,
    maxHeight,
    children,
    debounce = 0,
    id,
    className,
    onResize,
    style = {}
  } = _ref;
  var containerRef = reactExports.useRef(null);
  var onResizeRef = reactExports.useRef();
  onResizeRef.current = onResize;
  reactExports.useImperativeHandle(ref, () => containerRef.current);
  var [sizes, setSizes] = reactExports.useState({
    containerWidth: initialDimension.width,
    containerHeight: initialDimension.height
  });
  var setContainerSize = reactExports.useCallback((newWidth, newHeight) => {
    setSizes(prevState => {
      var roundedWidth = Math.round(newWidth);
      var roundedHeight = Math.round(newHeight);
      if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) {
        return prevState;
      }
      return {
        containerWidth: roundedWidth,
        containerHeight: roundedHeight
      };
    });
  }, []);
  reactExports.useEffect(() => {
    var callback = entries => {
      var _onResizeRef$current;
      var {
        width: containerWidth,
        height: containerHeight
      } = entries[0].contentRect;
      setContainerSize(containerWidth, containerHeight);
      (_onResizeRef$current = onResizeRef.current) === null || _onResizeRef$current === void 0 || _onResizeRef$current.call(onResizeRef, containerWidth, containerHeight);
    };
    if (debounce > 0) {
      callback = throttle(callback, debounce, {
        trailing: true,
        leading: false
      });
    }
    var observer = new ResizeObserver(callback);
    var {
      width: containerWidth,
      height: containerHeight
    } = containerRef.current.getBoundingClientRect();
    setContainerSize(containerWidth, containerHeight);
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [setContainerSize, debounce]);
  var chartContent = reactExports.useMemo(() => {
    var {
      containerWidth,
      containerHeight
    } = sizes;
    if (containerWidth < 0 || containerHeight < 0) {
      return null;
    }
    warn(isPercent(width) || isPercent(height), "The width(%s) and height(%s) are both fixed numbers,\n       maybe you don't need to use a ResponsiveContainer.", width, height);
    warn(!aspect || aspect > 0, 'The aspect(%s) must be greater than zero.', aspect);
    var calculatedWidth = isPercent(width) ? containerWidth : width;
    var calculatedHeight = isPercent(height) ? containerHeight : height;
    if (aspect && aspect > 0) {
      // Preserve the desired aspect ratio
      if (calculatedWidth) {
        // Will default to using width for aspect ratio
        calculatedHeight = calculatedWidth / aspect;
      } else if (calculatedHeight) {
        // But we should also take height into consideration
        calculatedWidth = calculatedHeight * aspect;
      }

      // if maxHeight is set, overwrite if calculatedHeight is greater than maxHeight
      if (maxHeight && calculatedHeight > maxHeight) {
        calculatedHeight = maxHeight;
      }
    }
    warn(calculatedWidth > 0 || calculatedHeight > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", calculatedWidth, calculatedHeight, width, height, minWidth, minHeight, aspect);
    return reactExports.Children.map(children, child => {
      return /*#__PURE__*/reactExports.cloneElement(child, {
        width: calculatedWidth,
        height: calculatedHeight,
        // calculate the actual size and override it.
        style: _objectSpread$a({
          width: calculatedWidth,
          height: calculatedHeight
        }, child.props.style)
      });
    });
  }, [aspect, children, height, maxHeight, minHeight, minWidth, sizes, width]);
  return /*#__PURE__*/reactExports.createElement("div", {
    id: id ? "".concat(id) : undefined,
    className: clsx('recharts-responsive-container', className),
    style: _objectSpread$a(_objectSpread$a({}, style), {}, {
      width,
      height,
      minWidth,
      minHeight,
      maxHeight
    }),
    ref: containerRef
  }, /*#__PURE__*/reactExports.createElement("div", {
    style: {
      width: 0,
      height: 0,
      overflow: 'visible'
    }
  }, chartContent));
});

function _defineProperty$b(e, r, t) { return (r = _toPropertyKey$b(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$b(t) { var i = _toPrimitive$b(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$b(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Simple LRU (Least Recently Used) cache implementation
 */
class LRUCache {
  constructor(maxSize) {
    _defineProperty$b(this, "cache", new Map());
    this.maxSize = maxSize;
  }
  get(key) {
    var value = this.cache.get(key);
    if (value !== undefined) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      var firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  clear() {
    this.cache.clear();
  }
  size() {
    return this.cache.size;
  }
}

function ownKeys$9(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$9(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$9(Object(t), true).forEach(function (r) { _defineProperty$a(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$9(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$a(e, r, t) { return (r = _toPropertyKey$a(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$a(t) { var i = _toPrimitive$a(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$a(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var defaultConfig = {
  cacheSize: 2000,
  enableCache: true
};
var currentConfig = _objectSpread$9({}, defaultConfig);
var stringCache = new LRUCache(currentConfig.cacheSize);
var SPAN_STYLE = {
  position: 'absolute',
  top: '-20000px',
  left: 0,
  padding: 0,
  margin: 0,
  border: 'none',
  whiteSpace: 'pre'
};
var MEASUREMENT_SPAN_ID = 'recharts_measurement_span';
function createCacheKey(text, style) {
  // Simple string concatenation for better performance than JSON.stringify
  var fontSize = style.fontSize || '';
  var fontFamily = style.fontFamily || '';
  var fontWeight = style.fontWeight || '';
  var fontStyle = style.fontStyle || '';
  var letterSpacing = style.letterSpacing || '';
  var textTransform = style.textTransform || '';
  return "".concat(text, "|").concat(fontSize, "|").concat(fontFamily, "|").concat(fontWeight, "|").concat(fontStyle, "|").concat(letterSpacing, "|").concat(textTransform);
}

/**
 * Measure text using DOM (accurate but slower)
 * @param text - The text to measure
 * @param style - CSS style properties to apply
 * @returns The size of the text
 */
var measureTextWithDOM = (text, style) => {
  try {
    var measurementSpan = document.getElementById(MEASUREMENT_SPAN_ID);
    if (!measurementSpan) {
      measurementSpan = document.createElement('span');
      measurementSpan.setAttribute('id', MEASUREMENT_SPAN_ID);
      measurementSpan.setAttribute('aria-hidden', 'true');
      document.body.appendChild(measurementSpan);
    }

    // Apply styles directly without unnecessary object creation
    Object.assign(measurementSpan.style, SPAN_STYLE, style);
    measurementSpan.textContent = "".concat(text);
    var rect = measurementSpan.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  } catch (_unused) {
    return {
      width: 0,
      height: 0
    };
  }
};
var getStringSize = function getStringSize(text) {
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (text === undefined || text === null || Global.isSsr) {
    return {
      width: 0,
      height: 0
    };
  }

  // If caching is disabled, measure directly
  if (!currentConfig.enableCache) {
    return measureTextWithDOM(text, style);
  }
  var cacheKey = createCacheKey(text, style);
  var cachedResult = stringCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  // Measure using DOM
  var result = measureTextWithDOM(text, style);

  // Store in LRU cache
  stringCache.set(cacheKey, result);
  return result;
};

var MULTIPLY_OR_DIVIDE_REGEX = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/;
var ADD_OR_SUBTRACT_REGEX = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/;
var CSS_LENGTH_UNIT_REGEX = /^px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q$/;
var NUM_SPLIT_REGEX = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/;
var CONVERSION_RATES = {
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: 96 / 6,
  in: 96,
  Q: 96 / (2.54 * 40),
  px: 1
};
var FIXED_CSS_LENGTH_UNITS = Object.keys(CONVERSION_RATES);
var STR_NAN = 'NaN';
function convertToPx(value, unit) {
  return value * CONVERSION_RATES[unit];
}
class DecimalCSS {
  static parse(str) {
    var _NUM_SPLIT_REGEX$exec;
    var [, numStr, unit] = (_NUM_SPLIT_REGEX$exec = NUM_SPLIT_REGEX.exec(str)) !== null && _NUM_SPLIT_REGEX$exec !== void 0 ? _NUM_SPLIT_REGEX$exec : [];
    return new DecimalCSS(parseFloat(numStr), unit !== null && unit !== void 0 ? unit : '');
  }
  constructor(num, unit) {
    this.num = num;
    this.unit = unit;
    this.num = num;
    this.unit = unit;
    if (isNan(num)) {
      this.unit = '';
    }
    if (unit !== '' && !CSS_LENGTH_UNIT_REGEX.test(unit)) {
      this.num = NaN;
      this.unit = '';
    }
    if (FIXED_CSS_LENGTH_UNITS.includes(unit)) {
      this.num = convertToPx(num, unit);
      this.unit = 'px';
    }
  }
  add(other) {
    if (this.unit !== other.unit) {
      return new DecimalCSS(NaN, '');
    }
    return new DecimalCSS(this.num + other.num, this.unit);
  }
  subtract(other) {
    if (this.unit !== other.unit) {
      return new DecimalCSS(NaN, '');
    }
    return new DecimalCSS(this.num - other.num, this.unit);
  }
  multiply(other) {
    if (this.unit !== '' && other.unit !== '' && this.unit !== other.unit) {
      return new DecimalCSS(NaN, '');
    }
    return new DecimalCSS(this.num * other.num, this.unit || other.unit);
  }
  divide(other) {
    if (this.unit !== '' && other.unit !== '' && this.unit !== other.unit) {
      return new DecimalCSS(NaN, '');
    }
    return new DecimalCSS(this.num / other.num, this.unit || other.unit);
  }
  toString() {
    return "".concat(this.num).concat(this.unit);
  }
  isNaN() {
    return isNan(this.num);
  }
}
function calculateArithmetic(expr) {
  if (expr.includes(STR_NAN)) {
    return STR_NAN;
  }
  var newExpr = expr;
  while (newExpr.includes('*') || newExpr.includes('/')) {
    var _MULTIPLY_OR_DIVIDE_R;
    var [, leftOperand, operator, rightOperand] = (_MULTIPLY_OR_DIVIDE_R = MULTIPLY_OR_DIVIDE_REGEX.exec(newExpr)) !== null && _MULTIPLY_OR_DIVIDE_R !== void 0 ? _MULTIPLY_OR_DIVIDE_R : [];
    var lTs = DecimalCSS.parse(leftOperand !== null && leftOperand !== void 0 ? leftOperand : '');
    var rTs = DecimalCSS.parse(rightOperand !== null && rightOperand !== void 0 ? rightOperand : '');
    var result = operator === '*' ? lTs.multiply(rTs) : lTs.divide(rTs);
    if (result.isNaN()) {
      return STR_NAN;
    }
    newExpr = newExpr.replace(MULTIPLY_OR_DIVIDE_REGEX, result.toString());
  }
  while (newExpr.includes('+') || /.-\d+(?:\.\d+)?/.test(newExpr)) {
    var _ADD_OR_SUBTRACT_REGE;
    var [, _leftOperand, _operator, _rightOperand] = (_ADD_OR_SUBTRACT_REGE = ADD_OR_SUBTRACT_REGEX.exec(newExpr)) !== null && _ADD_OR_SUBTRACT_REGE !== void 0 ? _ADD_OR_SUBTRACT_REGE : [];
    var _lTs = DecimalCSS.parse(_leftOperand !== null && _leftOperand !== void 0 ? _leftOperand : '');
    var _rTs = DecimalCSS.parse(_rightOperand !== null && _rightOperand !== void 0 ? _rightOperand : '');
    var _result = _operator === '+' ? _lTs.add(_rTs) : _lTs.subtract(_rTs);
    if (_result.isNaN()) {
      return STR_NAN;
    }
    newExpr = newExpr.replace(ADD_OR_SUBTRACT_REGEX, _result.toString());
  }
  return newExpr;
}
var PARENTHESES_REGEX = /\(([^()]*)\)/;
function calculateParentheses(expr) {
  var newExpr = expr;
  var match;
  // eslint-disable-next-line no-cond-assign
  while ((match = PARENTHESES_REGEX.exec(newExpr)) != null) {
    var [, parentheticalExpression] = match;
    newExpr = newExpr.replace(PARENTHESES_REGEX, calculateArithmetic(parentheticalExpression));
  }
  return newExpr;
}
function evaluateExpression(expression) {
  var newExpr = expression.replace(/\s+/g, '');
  newExpr = calculateParentheses(newExpr);
  newExpr = calculateArithmetic(newExpr);
  return newExpr;
}
function safeEvaluateExpression(expression) {
  try {
    return evaluateExpression(expression);
  } catch (_unused) {
    return STR_NAN;
  }
}
function reduceCSSCalc(expression) {
  var result = safeEvaluateExpression(expression.slice(5, -1));
  if (result === STR_NAN) {
    return '';
  }
  return result;
}

var _excluded$c = ["x", "y", "lineHeight", "capHeight", "scaleToFit", "textAnchor", "verticalAnchor", "fill"],
  _excluded2$7 = ["dx", "dy", "angle", "className", "breakAll"];
function _extends$b() { return _extends$b = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$b.apply(null, arguments); }
function _objectWithoutProperties$c(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$c(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$c(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var BREAKING_SPACES = /[ \f\n\r\t\v\u2028\u2029]+/;
var calculateWordWidths = _ref => {
  var {
    children,
    breakAll,
    style
  } = _ref;
  try {
    var words = [];
    if (!isNullish(children)) {
      if (breakAll) {
        words = children.toString().split('');
      } else {
        words = children.toString().split(BREAKING_SPACES);
      }
    }
    var wordsWithComputedWidth = words.map(word => ({
      word,
      width: getStringSize(word, style).width
    }));
    var spaceWidth = breakAll ? 0 : getStringSize('\u00A0', style).width;
    return {
      wordsWithComputedWidth,
      spaceWidth
    };
  } catch (_unused) {
    return null;
  }
};
var calculateWordsByLines = (_ref2, initialWordsWithComputedWith, spaceWidth, lineWidth, scaleToFit) => {
  var {
    maxLines,
    children,
    style,
    breakAll
  } = _ref2;
  var shouldLimitLines = isNumber(maxLines);
  var text = children;
  var calculate = function calculate() {
    var words = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return words.reduce((result, _ref3) => {
      var {
        word,
        width
      } = _ref3;
      var currentLine = result[result.length - 1];
      if (currentLine && (lineWidth == null || scaleToFit || currentLine.width + width + spaceWidth < Number(lineWidth))) {
        // Word can be added to an existing line
        currentLine.words.push(word);
        currentLine.width += width + spaceWidth;
      } else {
        // Add first word to line or word is too long to scaleToFit on existing line
        var newLine = {
          words: [word],
          width
        };
        result.push(newLine);
      }
      return result;
    }, []);
  };
  var originalResult = calculate(initialWordsWithComputedWith);
  var findLongestLine = words => words.reduce((a, b) => a.width > b.width ? a : b);
  if (!shouldLimitLines || scaleToFit) {
    return originalResult;
  }
  var overflows = originalResult.length > maxLines || findLongestLine(originalResult).width > Number(lineWidth);
  if (!overflows) {
    return originalResult;
  }
  var suffix = '…';
  var checkOverflow = index => {
    var tempText = text.slice(0, index);
    var words = calculateWordWidths({
      breakAll,
      style,
      children: tempText + suffix
    }).wordsWithComputedWidth;
    var result = calculate(words);
    var doesOverflow = result.length > maxLines || findLongestLine(result).width > Number(lineWidth);
    return [doesOverflow, result];
  };
  var start = 0;
  var end = text.length - 1;
  var iterations = 0;
  var trimmedResult;
  while (start <= end && iterations <= text.length - 1) {
    var middle = Math.floor((start + end) / 2);
    var prev = middle - 1;
    var [doesPrevOverflow, result] = checkOverflow(prev);
    var [doesMiddleOverflow] = checkOverflow(middle);
    if (!doesPrevOverflow && !doesMiddleOverflow) {
      start = middle + 1;
    }
    if (doesPrevOverflow && doesMiddleOverflow) {
      end = middle - 1;
    }
    if (!doesPrevOverflow && doesMiddleOverflow) {
      trimmedResult = result;
      break;
    }
    iterations++;
  }

  // Fallback to originalResult (result without trimming) if we cannot find the
  // where to trim.  This should not happen :tm:
  return trimmedResult || originalResult;
};
var getWordsWithoutCalculate = children => {
  var words = !isNullish(children) ? children.toString().split(BREAKING_SPACES) : [];
  return [{
    words
  }];
};
var getWordsByLines = _ref4 => {
  var {
    width,
    scaleToFit,
    children,
    style,
    breakAll,
    maxLines
  } = _ref4;
  // Only perform calculations if using features that require them (multiline, scaleToFit)
  if ((width || scaleToFit) && !Global.isSsr) {
    var wordsWithComputedWidth, spaceWidth;
    var wordWidths = calculateWordWidths({
      breakAll,
      children,
      style
    });
    if (wordWidths) {
      var {
        wordsWithComputedWidth: wcw,
        spaceWidth: sw
      } = wordWidths;
      wordsWithComputedWidth = wcw;
      spaceWidth = sw;
    } else {
      return getWordsWithoutCalculate(children);
    }
    return calculateWordsByLines({
      breakAll,
      children,
      maxLines,
      style
    }, wordsWithComputedWidth, spaceWidth, width, scaleToFit);
  }
  return getWordsWithoutCalculate(children);
};
var DEFAULT_FILL = '#808080';
var Text = /*#__PURE__*/reactExports.forwardRef((_ref5, ref) => {
  var {
      x: propsX = 0,
      y: propsY = 0,
      lineHeight = '1em',
      // Magic number from d3
      capHeight = '0.71em',
      scaleToFit = false,
      textAnchor = 'start',
      // Maintain compat with existing charts / default SVG behavior
      verticalAnchor = 'end',
      fill = DEFAULT_FILL
    } = _ref5,
    props = _objectWithoutProperties$c(_ref5, _excluded$c);
  var wordsByLines = reactExports.useMemo(() => {
    return getWordsByLines({
      breakAll: props.breakAll,
      children: props.children,
      maxLines: props.maxLines,
      scaleToFit,
      style: props.style,
      width: props.width
    });
  }, [props.breakAll, props.children, props.maxLines, scaleToFit, props.style, props.width]);
  var {
      dx,
      dy,
      angle,
      className,
      breakAll
    } = props,
    textProps = _objectWithoutProperties$c(props, _excluded2$7);
  if (!isNumOrStr(propsX) || !isNumOrStr(propsY) || wordsByLines.length === 0) {
    return null;
  }
  var x = propsX + (isNumber(dx) ? dx : 0);
  var y = propsY + (isNumber(dy) ? dy : 0);
  var startDy;
  switch (verticalAnchor) {
    case 'start':
      startDy = reduceCSSCalc("calc(".concat(capHeight, ")"));
      break;
    case 'middle':
      startDy = reduceCSSCalc("calc(".concat((wordsByLines.length - 1) / 2, " * -").concat(lineHeight, " + (").concat(capHeight, " / 2))"));
      break;
    default:
      startDy = reduceCSSCalc("calc(".concat(wordsByLines.length - 1, " * -").concat(lineHeight, ")"));
      break;
  }
  var transforms = [];
  if (scaleToFit) {
    var lineWidth = wordsByLines[0].width;
    var {
      width
    } = props;
    transforms.push("scale(".concat(isNumber(width) ? width / lineWidth : 1, ")"));
  }
  if (angle) {
    transforms.push("rotate(".concat(angle, ", ").concat(x, ", ").concat(y, ")"));
  }
  if (transforms.length) {
    textProps.transform = transforms.join(' ');
  }
  return /*#__PURE__*/reactExports.createElement("text", _extends$b({}, filterProps(textProps, true), {
    ref: ref,
    x: x,
    y: y,
    className: clsx('recharts-text', className),
    textAnchor: textAnchor,
    fill: fill.includes('url') ? DEFAULT_FILL : fill
  }), wordsByLines.map((line, index) => {
    var words = line.words.join(breakAll ? '' : ' ');
    return (
      /*#__PURE__*/
      // duplicate words will cause duplicate keys
      // eslint-disable-next-line react/no-array-index-key
      reactExports.createElement("tspan", {
        x: x,
        dy: index === 0 ? startDy : lineHeight,
        key: "".concat(words, "-").concat(index)
      }, words)
    );
  }));
});
Text.displayName = 'Text';

var _excluded$b = ["labelRef"];
function _objectWithoutProperties$b(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$b(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$b(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys$8(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$8(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$8(Object(t), true).forEach(function (r) { _defineProperty$9(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$8(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$9(e, r, t) { return (r = _toPropertyKey$9(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$9(t) { var i = _toPrimitive$9(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$9(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends$a() { return _extends$a = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$a.apply(null, arguments); }
var CartesianLabelContext = /*#__PURE__*/reactExports.createContext(null);
var CartesianLabelContextProvider = _ref => {
  var {
    x,
    y,
    width,
    height,
    children
  } = _ref;
  var viewBox = reactExports.useMemo(() => ({
    x,
    y,
    width,
    height
  }), [x, y, width, height]);
  return /*#__PURE__*/reactExports.createElement(CartesianLabelContext.Provider, {
    value: viewBox
  }, children);
};
var useCartesianLabelContext = () => {
  var labelChildContext = reactExports.useContext(CartesianLabelContext);
  var chartContext = useViewBox();
  return labelChildContext || chartContext;
};
var PolarLabelContext = /*#__PURE__*/reactExports.createContext(null);
var usePolarLabelContext = () => {
  var labelChildContext = reactExports.useContext(PolarLabelContext);
  var chartContext = useAppSelector(selectPolarViewBox);
  return labelChildContext || chartContext;
};
var getLabel = props => {
  var {
    value,
    formatter
  } = props;
  var label = isNullish(props.children) ? value : props.children;
  if (typeof formatter === 'function') {
    return formatter(label);
  }
  return label;
};
var isLabelContentAFunction = content => {
  return content != null && typeof content === 'function';
};
var getDeltaAngle = (startAngle, endAngle) => {
  var sign = mathSign(endAngle - startAngle);
  var deltaAngle = Math.min(Math.abs(endAngle - startAngle), 360);
  return sign * deltaAngle;
};
var renderRadialLabel = (labelProps, position, label, attrs, viewBox) => {
  var {
    offset,
    className
  } = labelProps;
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    clockWise
  } = viewBox;
  var radius = (innerRadius + outerRadius) / 2;
  var deltaAngle = getDeltaAngle(startAngle, endAngle);
  var sign = deltaAngle >= 0 ? 1 : -1;
  var labelAngle, direction;
  switch (position) {
    case 'insideStart':
      labelAngle = startAngle + sign * offset;
      direction = clockWise;
      break;
    case 'insideEnd':
      labelAngle = endAngle - sign * offset;
      direction = !clockWise;
      break;
    case 'end':
      labelAngle = endAngle + sign * offset;
      direction = clockWise;
      break;
    default:
      throw new Error("Unsupported position ".concat(position));
  }
  direction = deltaAngle <= 0 ? direction : !direction;
  var startPoint = polarToCartesian(cx, cy, radius, labelAngle);
  var endPoint = polarToCartesian(cx, cy, radius, labelAngle + (direction ? 1 : -1) * 359);
  var path = "M".concat(startPoint.x, ",").concat(startPoint.y, "\n    A").concat(radius, ",").concat(radius, ",0,1,").concat(direction ? 0 : 1, ",\n    ").concat(endPoint.x, ",").concat(endPoint.y);
  var id = isNullish(labelProps.id) ? uniqueId('recharts-radial-line-') : labelProps.id;
  return /*#__PURE__*/reactExports.createElement("text", _extends$a({}, attrs, {
    dominantBaseline: "central",
    className: clsx('recharts-radial-bar-label', className)
  }), /*#__PURE__*/reactExports.createElement("defs", null, /*#__PURE__*/reactExports.createElement("path", {
    id: id,
    d: path
  })), /*#__PURE__*/reactExports.createElement("textPath", {
    xlinkHref: "#".concat(id)
  }, label));
};
var getAttrsOfPolarLabel = (viewBox, offset, position) => {
  var {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle
  } = viewBox;
  var midAngle = (startAngle + endAngle) / 2;
  if (position === 'outside') {
    var {
      x: _x,
      y: _y
    } = polarToCartesian(cx, cy, outerRadius + offset, midAngle);
    return {
      x: _x,
      y: _y,
      textAnchor: _x >= cx ? 'start' : 'end',
      verticalAnchor: 'middle'
    };
  }
  if (position === 'center') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'middle'
    };
  }
  if (position === 'centerTop') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'start'
    };
  }
  if (position === 'centerBottom') {
    return {
      x: cx,
      y: cy,
      textAnchor: 'middle',
      verticalAnchor: 'end'
    };
  }
  var r = (innerRadius + outerRadius) / 2;
  var {
    x,
    y
  } = polarToCartesian(cx, cy, r, midAngle);
  return {
    x,
    y,
    textAnchor: 'middle',
    verticalAnchor: 'middle'
  };
};
var isPolar = viewBox => 'cx' in viewBox && isNumber(viewBox.cx);
var getAttrsOfCartesianLabel = (props, viewBox) => {
  var {
    parentViewBox: parentViewBoxFromProps,
    offset,
    position
  } = props;
  var parentViewBox;
  if (parentViewBoxFromProps != null && !isPolar(parentViewBoxFromProps)) {
    // Check that nobody is trying to pass a polar viewBox to a cartesian label
    parentViewBox = parentViewBoxFromProps;
  }
  var {
    x,
    y,
    width,
    height
  } = viewBox;

  // Define vertical offsets and position inverts based on the value being positive or negative
  var verticalSign = height >= 0 ? 1 : -1;
  var verticalOffset = verticalSign * offset;
  var verticalEnd = verticalSign > 0 ? 'end' : 'start';
  var verticalStart = verticalSign > 0 ? 'start' : 'end';

  // Define horizontal offsets and position inverts based on the value being positive or negative
  var horizontalSign = width >= 0 ? 1 : -1;
  var horizontalOffset = horizontalSign * offset;
  var horizontalEnd = horizontalSign > 0 ? 'end' : 'start';
  var horizontalStart = horizontalSign > 0 ? 'start' : 'end';
  if (position === 'top') {
    var attrs = {
      x: x + width / 2,
      y: y - verticalSign * offset,
      textAnchor: 'middle',
      verticalAnchor: verticalEnd
    };
    return _objectSpread$8(_objectSpread$8({}, attrs), parentViewBox ? {
      height: Math.max(y - parentViewBox.y, 0),
      width
    } : {});
  }
  if (position === 'bottom') {
    var _attrs = {
      x: x + width / 2,
      y: y + height + verticalOffset,
      textAnchor: 'middle',
      verticalAnchor: verticalStart
    };
    return _objectSpread$8(_objectSpread$8({}, _attrs), parentViewBox ? {
      height: Math.max(parentViewBox.y + parentViewBox.height - (y + height), 0),
      width
    } : {});
  }
  if (position === 'left') {
    var _attrs2 = {
      x: x - horizontalOffset,
      y: y + height / 2,
      textAnchor: horizontalEnd,
      verticalAnchor: 'middle'
    };
    return _objectSpread$8(_objectSpread$8({}, _attrs2), parentViewBox ? {
      width: Math.max(_attrs2.x - parentViewBox.x, 0),
      height
    } : {});
  }
  if (position === 'right') {
    var _attrs3 = {
      x: x + width + horizontalOffset,
      y: y + height / 2,
      textAnchor: horizontalStart,
      verticalAnchor: 'middle'
    };
    return _objectSpread$8(_objectSpread$8({}, _attrs3), parentViewBox ? {
      width: Math.max(parentViewBox.x + parentViewBox.width - _attrs3.x, 0),
      height
    } : {});
  }
  var sizeAttrs = parentViewBox ? {
    width,
    height
  } : {};
  if (position === 'insideLeft') {
    return _objectSpread$8({
      x: x + horizontalOffset,
      y: y + height / 2,
      textAnchor: horizontalStart,
      verticalAnchor: 'middle'
    }, sizeAttrs);
  }
  if (position === 'insideRight') {
    return _objectSpread$8({
      x: x + width - horizontalOffset,
      y: y + height / 2,
      textAnchor: horizontalEnd,
      verticalAnchor: 'middle'
    }, sizeAttrs);
  }
  if (position === 'insideTop') {
    return _objectSpread$8({
      x: x + width / 2,
      y: y + verticalOffset,
      textAnchor: 'middle',
      verticalAnchor: verticalStart
    }, sizeAttrs);
  }
  if (position === 'insideBottom') {
    return _objectSpread$8({
      x: x + width / 2,
      y: y + height - verticalOffset,
      textAnchor: 'middle',
      verticalAnchor: verticalEnd
    }, sizeAttrs);
  }
  if (position === 'insideTopLeft') {
    return _objectSpread$8({
      x: x + horizontalOffset,
      y: y + verticalOffset,
      textAnchor: horizontalStart,
      verticalAnchor: verticalStart
    }, sizeAttrs);
  }
  if (position === 'insideTopRight') {
    return _objectSpread$8({
      x: x + width - horizontalOffset,
      y: y + verticalOffset,
      textAnchor: horizontalEnd,
      verticalAnchor: verticalStart
    }, sizeAttrs);
  }
  if (position === 'insideBottomLeft') {
    return _objectSpread$8({
      x: x + horizontalOffset,
      y: y + height - verticalOffset,
      textAnchor: horizontalStart,
      verticalAnchor: verticalEnd
    }, sizeAttrs);
  }
  if (position === 'insideBottomRight') {
    return _objectSpread$8({
      x: x + width - horizontalOffset,
      y: y + height - verticalOffset,
      textAnchor: horizontalEnd,
      verticalAnchor: verticalEnd
    }, sizeAttrs);
  }
  if (!!position && typeof position === 'object' && (isNumber(position.x) || isPercent(position.x)) && (isNumber(position.y) || isPercent(position.y))) {
    return _objectSpread$8({
      x: x + getPercentValue(position.x, width),
      y: y + getPercentValue(position.y, height),
      textAnchor: 'end',
      verticalAnchor: 'end'
    }, sizeAttrs);
  }
  return _objectSpread$8({
    x: x + width / 2,
    y: y + height / 2,
    textAnchor: 'middle',
    verticalAnchor: 'middle'
  }, sizeAttrs);
};
var defaultLabelProps = {
  offset: 5
};
function Label(outerProps) {
  var props = resolveDefaultProps(outerProps, defaultLabelProps);
  var {
    viewBox: viewBoxFromProps,
    position,
    value,
    children,
    content,
    className = '',
    textBreakAll,
    labelRef
  } = props;
  var polarViewBox = usePolarLabelContext();
  var cartesianViewBox = useCartesianLabelContext();

  /*
   * I am not proud about this solution but it's a quick fix for https://github.com/recharts/recharts/issues/6030#issuecomment-3155352460.
   * What we should really do is split Label into two components: CartesianLabel and PolarLabel and then handle their respective viewBoxes separately.
   * Also other components should set its own viewBox in a context so that we can fix https://github.com/recharts/recharts/issues/6156
   */
  var resolvedViewBox = position === 'center' ? cartesianViewBox : polarViewBox !== null && polarViewBox !== void 0 ? polarViewBox : cartesianViewBox;
  var viewBox = viewBoxFromProps || resolvedViewBox;
  if (!viewBox || isNullish(value) && isNullish(children) && ! /*#__PURE__*/reactExports.isValidElement(content) && typeof content !== 'function') {
    return null;
  }
  var propsWithViewBox = _objectSpread$8(_objectSpread$8({}, props), {}, {
    viewBox
  });
  if (/*#__PURE__*/reactExports.isValidElement(content)) {
    var {
        labelRef: _
      } = propsWithViewBox,
      propsWithoutLabelRef = _objectWithoutProperties$b(propsWithViewBox, _excluded$b);
    return /*#__PURE__*/reactExports.cloneElement(content, propsWithoutLabelRef);
  }
  var label;
  if (typeof content === 'function') {
    label = /*#__PURE__*/reactExports.createElement(content, propsWithViewBox);
    if (/*#__PURE__*/reactExports.isValidElement(label)) {
      return label;
    }
  } else {
    label = getLabel(props);
  }
  var isPolarLabel = isPolar(viewBox);
  var attrs = filterProps(props, true);
  if (isPolarLabel && (position === 'insideStart' || position === 'insideEnd' || position === 'end')) {
    return renderRadialLabel(props, position, label, attrs, viewBox);
  }
  var positionAttrs = isPolarLabel ? getAttrsOfPolarLabel(viewBox, props.offset, props.position) : getAttrsOfCartesianLabel(props, viewBox);
  return /*#__PURE__*/reactExports.createElement(Text, _extends$a({
    ref: labelRef,
    className: clsx('recharts-label', className)
  }, attrs, positionAttrs, {
    breakAll: textBreakAll
  }), label);
}
Label.displayName = 'Label';
var parseLabel = (label, viewBox, labelRef) => {
  if (!label) {
    return null;
  }
  var commonProps = {
    viewBox,
    labelRef
  };
  if (label === true) {
    return /*#__PURE__*/reactExports.createElement(Label, _extends$a({
      key: "label-implicit"
    }, commonProps));
  }
  if (isNumOrStr(label)) {
    return /*#__PURE__*/reactExports.createElement(Label, _extends$a({
      key: "label-implicit",
      value: label
    }, commonProps));
  }
  if (/*#__PURE__*/reactExports.isValidElement(label)) {
    if (label.type === Label) {
      return /*#__PURE__*/reactExports.cloneElement(label, _objectSpread$8({
        key: 'label-implicit'
      }, commonProps));
    }
    return /*#__PURE__*/reactExports.createElement(Label, _extends$a({
      key: "label-implicit",
      content: label
    }, commonProps));
  }
  if (isLabelContentAFunction(label)) {
    return /*#__PURE__*/reactExports.createElement(Label, _extends$a({
      key: "label-implicit",
      content: label
    }, commonProps));
  }
  if (label && typeof label === 'object') {
    return /*#__PURE__*/reactExports.createElement(Label, _extends$a({}, label, {
      key: "label-implicit"
    }, commonProps));
  }
  return null;
};
function CartesianLabelFromLabelProp(_ref3) {
  var {
    label
  } = _ref3;
  var viewBox = useCartesianLabelContext();
  return parseLabel(label, viewBox) || null;
}

var _excluded$a = ["valueAccessor"],
  _excluded2$6 = ["dataKey", "clockWise", "id", "textBreakAll"];
function _extends$9() { return _extends$9 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$9.apply(null, arguments); }
function _objectWithoutProperties$a(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$a(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$a(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }

/**
 * This is public API because we expose it as the valueAccessor parameter.
 *
 * The properties of "viewBox" are repeated as the root props of the entry object.
 * So it doesn't matter if you read entry.x or entry.viewBox.x, they are the same.
 *
 * It's not necessary to pass redundant data, but we keep it for backward compatibility.
 */

/**
 * LabelList props do not allow refs because the same props are reused in multiple elements so we don't have a good single place to ref to.
 */

/**
 * This is the type accepted for the `label` prop on various graphical items.
 * It accepts:
 *
 * boolean:
 *    true = labels show,
 *    false = labels don't show
 * React element:
 *    will be cloned with extra props
 * function:
 *    is used as <Label content={function} />, so this will be called once for each individual label (so typically once for each data point)
 * object:
 *    the props to be passed to a LabelList component
 */

var defaultAccessor = entry => Array.isArray(entry.value) ? last(entry.value) : entry.value;
var CartesianLabelListContext = /*#__PURE__*/reactExports.createContext(undefined);
var CartesianLabelListContextProvider = CartesianLabelListContext.Provider;
var PolarLabelListContext = /*#__PURE__*/reactExports.createContext(undefined);
PolarLabelListContext.Provider;
function useCartesianLabelListContext() {
  return reactExports.useContext(CartesianLabelListContext);
}
function usePolarLabelListContext() {
  return reactExports.useContext(PolarLabelListContext);
}
function LabelList(_ref) {
  var {
      valueAccessor = defaultAccessor
    } = _ref,
    restProps = _objectWithoutProperties$a(_ref, _excluded$a);
  var {
      dataKey,
      clockWise,
      id,
      textBreakAll
    } = restProps,
    others = _objectWithoutProperties$a(restProps, _excluded2$6);
  var cartesianData = useCartesianLabelListContext();
  var polarData = usePolarLabelListContext();
  var data = cartesianData || polarData;
  if (!data || !data.length) {
    return null;
  }
  return /*#__PURE__*/reactExports.createElement(Layer, {
    className: "recharts-label-list"
  }, data.map((entry, index) => {
    var _restProps$fill;
    var value = isNullish(dataKey) ? valueAccessor(entry, index) : getValueByDataKey(entry && entry.payload, dataKey);
    var idProps = isNullish(id) ? {} : {
      id: "".concat(id, "-").concat(index)
    };
    return /*#__PURE__*/reactExports.createElement(Label, _extends$9({}, filterProps(entry, true), others, idProps, {
      /*
       * Prefer to use the explicit fill from LabelList props.
       * Only in an absence of that, fall back to the fill of the entry.
       * The entry fill can be quite difficult to see especially in Bar, Pie, RadialBar in inside positions.
       * On the other hand it's quite convenient in Scatter, Line, or when the position is outside the Bar, Pie filled shapes.
       */
      fill: (_restProps$fill = restProps.fill) !== null && _restProps$fill !== void 0 ? _restProps$fill : entry.fill,
      parentViewBox: entry.parentViewBox,
      value: value,
      textBreakAll: textBreakAll,
      viewBox: entry.viewBox,
      key: "label-".concat(index) // eslint-disable-line react/no-array-index-key
      ,
      index: index
    }));
  }));
}
LabelList.displayName = 'LabelList';
function LabelListFromLabelProp(_ref2) {
  var {
    label
  } = _ref2;
  if (!label) {
    return null;
  }
  if (label === true) {
    return /*#__PURE__*/reactExports.createElement(LabelList, {
      key: "labelList-implicit"
    });
  }
  if (/*#__PURE__*/reactExports.isValidElement(label) || isLabelContentAFunction(label)) {
    return /*#__PURE__*/reactExports.createElement(LabelList, {
      key: "labelList-implicit",
      content: label
    });
  }
  if (typeof label === 'object') {
    return /*#__PURE__*/reactExports.createElement(LabelList, _extends$9({
      key: "labelList-implicit"
    }, label, {
      type: String(label.type)
    }));
  }
  return null;
}

function _extends$8() { return _extends$8 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$8.apply(null, arguments); }
var Dot = props => {
  var {
    cx,
    cy,
    r,
    className
  } = props;
  var layerClass = clsx('recharts-dot', className);
  if (cx === +cx && cy === +cy && r === +r) {
    return /*#__PURE__*/reactExports.createElement("circle", _extends$8({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
      className: layerClass,
      cx: cx,
      cy: cy,
      r: r
    }));
  }
  return null;
};

var initialState$6 = {
  radiusAxis: {},
  angleAxis: {}
};
var polarAxisSlice = createSlice({
  name: 'polarAxis',
  initialState: initialState$6,
  reducers: {
    addRadiusAxis(state, action) {
      state.radiusAxis[action.payload.id] = castDraft(action.payload);
    },
    removeRadiusAxis(state, action) {
      delete state.radiusAxis[action.payload.id];
    },
    addAngleAxis(state, action) {
      state.angleAxis[action.payload.id] = castDraft(action.payload);
    },
    removeAngleAxis(state, action) {
      delete state.angleAxis[action.payload.id];
    }
  }
});
var {
  addRadiusAxis,
  removeRadiusAxis,
  addAngleAxis,
  removeAngleAxis
} = polarAxisSlice.actions;
var polarAxisReducer = polarAxisSlice.reducer;

function SetTooltipEntrySettings(_ref) {
  var {
    fn,
    args
  } = _ref;
  var dispatch = useAppDispatch();
  var isPanorama = useIsPanorama();
  reactExports.useEffect(() => {
    if (isPanorama) {
      // Panorama graphical items should never contribute to Tooltip payload.
      return undefined;
    }
    var tooltipEntrySettings = fn(args);
    dispatch(addTooltipEntrySettings(tooltipEntrySettings));
    return () => {
      dispatch(removeTooltipEntrySettings(tooltipEntrySettings));
    };
  }, [fn, args, dispatch, isPanorama]);
  return null;
}

var noop = () => {};
function SetLegendPayload(_ref) {
  var {
    legendPayload
  } = _ref;
  var dispatch = useAppDispatch();
  var isPanorama = useIsPanorama();
  reactExports.useEffect(() => {
    if (isPanorama) {
      return noop;
    }
    dispatch(addLegendPayload(legendPayload));
    return () => {
      dispatch(removeLegendPayload(legendPayload));
    };
  }, [dispatch, isPanorama, legendPayload]);
  return null;
}

var _ref;

/**
 * Fallback for React.useId() for versions prior to React 18.
 * Generates a unique ID using a simple counter and a prefix.
 *
 * @returns A unique ID that remains consistent across renders.
 */
var useIdFallback = () => {
  var [id] = reactExports.useState(() => uniqueId('uid-'));
  return id;
};

/*
 * This weird syntax is used to avoid a build-time error in React 17 and earlier when building with Webpack.
 * See https://github.com/webpack/webpack/issues/14814
 */
var useId = (_ref = React['useId'.toString()]) !== null && _ref !== void 0 ? _ref : useIdFallback;

/**
 * A hook that generates a unique ID. It uses React.useId() in React 18+ for SSR safety
 * and falls back to a client-side-only unique ID generator for older versions.
 *
 * The ID will stay the same across renders, and you can optionally provide a prefix.
 *
 * @param [prefix] - An optional prefix for the generated ID.
 * @param [customId] - An optional custom ID to override the generated one.
 * @returns The unique ID.
 */
function useUniqueId(prefix, customId) {
  /*
   * We have to call this hook here even if we don't use the result because
   * rules of hooks demand that hooks are never called conditionally.
   */
  var generatedId = useId();

  // If a custom ID is provided, it always takes precedence.
  if (customId) {
    return customId;
  }

  // Apply the prefix if one was provided.
  return prefix ? "".concat(prefix, "-").concat(generatedId) : generatedId;
}

/**
 * The useUniqueId hook returns a unique ID that is either reused from external props or generated internally.
 * Either way the ID is now guaranteed to be present so no more nulls or undefined.
 */

var GraphicalItemIdContext = /*#__PURE__*/reactExports.createContext(undefined);
var RegisterGraphicalItemId = _ref => {
  var {
    id,
    type,
    children
  } = _ref;
  var resolvedId = useUniqueId("recharts-".concat(type), id);
  return /*#__PURE__*/reactExports.createElement(GraphicalItemIdContext.Provider, {
    value: resolvedId
  }, children(resolvedId));
};

/**
 * Unique ID of the graphical item.
 * This is used to identify the graphical item in the state and in the React tree.
 * This is required for every graphical item - it's either provided by the user or generated automatically.
 */

var initialState$5 = {
  cartesianItems: [],
  polarItems: []
};
var graphicalItemsSlice = createSlice({
  name: 'graphicalItems',
  initialState: initialState$5,
  reducers: {
    addCartesianGraphicalItem(state, action) {
      state.cartesianItems.push(castDraft(action.payload));
    },
    replaceCartesianGraphicalItem(state, action) {
      var {
        prev,
        next
      } = action.payload;
      var index = current(state).cartesianItems.indexOf(castDraft(prev));
      if (index > -1) {
        state.cartesianItems[index] = castDraft(next);
      }
    },
    removeCartesianGraphicalItem(state, action) {
      var index = current(state).cartesianItems.indexOf(castDraft(action.payload));
      if (index > -1) {
        state.cartesianItems.splice(index, 1);
      }
    },
    addPolarGraphicalItem(state, action) {
      state.polarItems.push(castDraft(action.payload));
    },
    removePolarGraphicalItem(state, action) {
      var index = current(state).polarItems.indexOf(castDraft(action.payload));
      if (index > -1) {
        state.polarItems.splice(index, 1);
      }
    }
  }
});
var {
  addCartesianGraphicalItem,
  replaceCartesianGraphicalItem,
  removeCartesianGraphicalItem,
  addPolarGraphicalItem,
  removePolarGraphicalItem
} = graphicalItemsSlice.actions;
var graphicalItemsReducer = graphicalItemsSlice.reducer;

function SetCartesianGraphicalItem(props) {
  var dispatch = useAppDispatch();
  var prevPropsRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (prevPropsRef.current === null) {
      dispatch(addCartesianGraphicalItem(props));
    } else if (prevPropsRef.current !== props) {
      dispatch(replaceCartesianGraphicalItem({
        prev: prevPropsRef.current,
        next: props
      }));
    }
    prevPropsRef.current = props;
  }, [dispatch, props]);
  reactExports.useEffect(() => {
    return () => {
      if (prevPropsRef.current) {
        dispatch(removeCartesianGraphicalItem(prevPropsRef.current));
        /*
         * Here we have to reset the ref to null because in StrictMode, the effect will run twice,
         * but it will keep the same ref value from the first render.
         *
         * In browser, React will clear the ref after the first effect cleanup,
         * so that wouldn't be an issue.
         *
         * In StrictMode, however, the ref is kept,
         * and in the hook above the code checks for `prevPropsRef.current === null`
         * which would be false so it would not dispatch the `addCartesianGraphicalItem` action again.
         *
         * https://github.com/recharts/recharts/issues/6022
         */
        prevPropsRef.current = null;
      }
    };
  }, [dispatch]);
  return null;
}

function ownKeys$7(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$7(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$7(Object(t), true).forEach(function (r) { _defineProperty$8(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$7(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$8(e, r, t) { return (r = _toPropertyKey$8(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$8(t) { var i = _toPrimitive$8(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$8(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

/**
 * Properties shared in X, Y, and Z axes
 */

/**
 * These are the external props, visible for users as they set them using our public API.
 * There is all sorts of internal computed things based on these, but they will come through selectors.
 *
 * Properties shared between X and Y axes
 */

/**
 * Z axis is special because it's never displayed. It controls the size of Scatter dots,
 * but it never displays ticks anywhere.
 */

var initialState$4 = {
  xAxis: {},
  yAxis: {},
  zAxis: {}
};

/**
 * This is the slice where each individual Axis element pushes its own configuration.
 * Prefer to use this one instead of axisSlice.
 */
var cartesianAxisSlice = createSlice({
  name: 'cartesianAxis',
  initialState: initialState$4,
  reducers: {
    addXAxis(state, action) {
      state.xAxis[action.payload.id] = castDraft(action.payload);
    },
    removeXAxis(state, action) {
      delete state.xAxis[action.payload.id];
    },
    addYAxis(state, action) {
      state.yAxis[action.payload.id] = castDraft(action.payload);
    },
    removeYAxis(state, action) {
      delete state.yAxis[action.payload.id];
    },
    addZAxis(state, action) {
      state.zAxis[action.payload.id] = castDraft(action.payload);
    },
    removeZAxis(state, action) {
      delete state.zAxis[action.payload.id];
    },
    updateYAxisWidth(state, action) {
      var {
        id,
        width
      } = action.payload;
      if (state.yAxis[id]) {
        state.yAxis[id] = _objectSpread$7(_objectSpread$7({}, state.yAxis[id]), {}, {
          width
        });
      }
    }
  }
});
var {
  addXAxis,
  removeXAxis,
  addYAxis,
  removeYAxis,
  addZAxis,
  removeZAxis,
  updateYAxisWidth
} = cartesianAxisSlice.actions;
var cartesianAxisReducer = cartesianAxisSlice.reducer;

var selectChartOffset = createSelector([selectChartOffsetInternal], offsetInternal => {
  if (!offsetInternal) {
    return undefined;
  }
  return {
    top: offsetInternal.top,
    bottom: offsetInternal.bottom,
    left: offsetInternal.left,
    right: offsetInternal.right
  };
});

var selectPlotArea = createSelector([selectChartOffset, selectChartWidth, selectChartHeight], (offset, chartWidth, chartHeight) => {
  if (!offset || chartWidth == null || chartHeight == null) {
    return undefined;
  }
  return {
    x: offset.left,
    y: offset.top,
    width: Math.max(0, chartWidth - offset.left - offset.right),
    height: Math.max(0, chartHeight - offset.top - offset.bottom)
  };
});

/**
 * Plot area is the area where the actual chart data is rendered.
 * This means: bars, lines, scatter points, etc.
 *
 * The plot area is calculated based on the chart dimensions and the offset.
 *
 * @returns Plot area of the chart in pixels, or undefined if used outside a chart context.
 */
var usePlotArea = () => {
  return useAppSelector(selectPlotArea);
};

/**
 * Returns the currently active data points being displayed in the Tooltip.
 * Active means that it is currently visible; this hook will return `undefined` if there is no current interaction.
 *
 * This follows the `<Tooltip />` props, if the Tooltip element is present in the chart.
 * If there is no `<Tooltip />` then this hook will follow the default Tooltip props.
 *
 * Data point is whatever you pass as an input to the chart using the `data={}` prop.
 *
 * This returns an array because a chart can have multiple graphical items in it (multiple Lines for example)
 * and tooltip with `shared={true}` will display all items at the same time.
 *
 * Returns undefined when used outside a chart context.
 *
 * @returns Data points that are currently visible in a Tooltip
 */
var useActiveTooltipDataPoints = () => {
  return useAppSelector(selectActiveTooltipDataPoints);
};

function ownKeys$6(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$6(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$6(Object(t), true).forEach(function (r) { _defineProperty$7(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$6(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$7(e, r, t) { return (r = _toPropertyKey$7(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$7(t) { var i = _toPrimitive$7(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$7(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var renderActivePoint = _ref => {
  var {
    point,
    childIndex,
    mainColor,
    activeDot,
    dataKey
  } = _ref;
  if (activeDot === false || point.x == null || point.y == null) {
    return null;
  }
  var dotProps = _objectSpread$6(_objectSpread$6({
    index: childIndex,
    dataKey,
    cx: point.x,
    cy: point.y,
    r: 4,
    fill: mainColor !== null && mainColor !== void 0 ? mainColor : 'none',
    strokeWidth: 2,
    stroke: '#fff',
    payload: point.payload,
    value: point.value
  }, filterProps(activeDot, false)), adaptEventHandlers(activeDot));
  var dot;
  if (/*#__PURE__*/reactExports.isValidElement(activeDot)) {
    // @ts-expect-error element cloning does not have types
    dot = /*#__PURE__*/reactExports.cloneElement(activeDot, dotProps);
  } else if (typeof activeDot === 'function') {
    dot = activeDot(dotProps);
  } else {
    dot = /*#__PURE__*/reactExports.createElement(Dot, dotProps);
  }
  return /*#__PURE__*/reactExports.createElement(Layer, {
    className: "recharts-active-dot"
  }, dot);
};
function ActivePoints(_ref2) {
  var {
    points,
    mainColor,
    activeDot,
    itemDataKey
  } = _ref2;
  var activeTooltipIndex = useAppSelector(selectActiveTooltipIndex);
  var activeDataPoints = useActiveTooltipDataPoints();
  if (points == null || activeDataPoints == null) {
    return null;
  }
  var activePoint = points.find(p => activeDataPoints.includes(p.payload));
  if (isNullish(activePoint)) {
    return null;
  }
  return renderActivePoint({
    point: activePoint,
    childIndex: Number(activeTooltipIndex),
    mainColor,
    dataKey: itemDataKey,
    activeDot
  });
}

/**
 * ErrorBars have lot more settings but all the others are scoped to the component itself.
 * Only some of them required to be reported to the global store because XAxis and YAxis need to know
 * if the error bar is contributing to extending the axis domain.
 */

var initialState$3 = {};
var errorBarSlice = createSlice({
  name: 'errorBars',
  initialState: initialState$3,
  reducers: {
    addErrorBar: (state, action) => {
      var {
        itemId,
        errorBar
      } = action.payload;
      if (!state[itemId]) {
        state[itemId] = [];
      }
      state[itemId].push(errorBar);
    },
    replaceErrorBar: (state, action) => {
      var {
        itemId,
        prev,
        next
      } = action.payload;
      if (state[itemId]) {
        state[itemId] = state[itemId].map(e => e.dataKey === prev.dataKey && e.direction === prev.direction ? next : e);
      }
    },
    removeErrorBar: (state, action) => {
      var {
        itemId,
        errorBar
      } = action.payload;
      if (state[itemId]) {
        state[itemId] = state[itemId].filter(e => e.dataKey !== errorBar.dataKey || e.direction !== errorBar.direction);
      }
    }
  }
});
var {
  addErrorBar,
  replaceErrorBar,
  removeErrorBar
} = errorBarSlice.actions;
var errorBarReducer = errorBarSlice.reducer;

var _excluded$9 = ["children"];
function _objectWithoutProperties$9(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$9(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$9(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var initialContextState = {
  data: [],
  xAxisId: 'xAxis-0',
  yAxisId: 'yAxis-0',
  dataPointFormatter: () => ({
    x: 0,
    y: 0,
    value: 0
  }),
  errorBarOffset: 0
};
var ErrorBarContext = /*#__PURE__*/reactExports.createContext(initialContextState);
function SetErrorBarContext(props) {
  var {
      children
    } = props,
    rest = _objectWithoutProperties$9(props, _excluded$9);
  return /*#__PURE__*/reactExports.createElement(ErrorBarContext.Provider, {
    value: rest
  }, children);
}

function useNeedsClip(xAxisId, yAxisId) {
  var _xAxis$allowDataOverf, _yAxis$allowDataOverf;
  var xAxis = useAppSelector(state => selectXAxisSettings(state, xAxisId));
  var yAxis = useAppSelector(state => selectYAxisSettings(state, yAxisId));
  var needClipX = (_xAxis$allowDataOverf = xAxis === null || xAxis === void 0 ? void 0 : xAxis.allowDataOverflow) !== null && _xAxis$allowDataOverf !== void 0 ? _xAxis$allowDataOverf : implicitXAxis.allowDataOverflow;
  var needClipY = (_yAxis$allowDataOverf = yAxis === null || yAxis === void 0 ? void 0 : yAxis.allowDataOverflow) !== null && _yAxis$allowDataOverf !== void 0 ? _yAxis$allowDataOverf : implicitYAxis.allowDataOverflow;
  var needClip = needClipX || needClipY;
  return {
    needClip,
    needClipX,
    needClipY
  };
}
function GraphicalItemClipPath(_ref) {
  var {
    xAxisId,
    yAxisId,
    clipPathId
  } = _ref;
  var plotArea = usePlotArea();
  var {
    needClipX,
    needClipY,
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  if (!needClip) {
    return null;
  }
  var {
    x,
    y,
    width,
    height
  } = plotArea;
  return /*#__PURE__*/reactExports.createElement("clipPath", {
    id: "clipPath-".concat(clipPathId)
  }, /*#__PURE__*/reactExports.createElement("rect", {
    x: needClipX ? x : x - width / 2,
    y: needClipY ? y : y - height / 2,
    width: needClipX ? width : width * 2,
    height: needClipY ? height : height * 2
  }));
}

var ChartDataContextProvider = props => {
  var {
    chartData
  } = props;
  var dispatch = useAppDispatch();
  var isPanorama = useIsPanorama();
  reactExports.useEffect(() => {
    if (isPanorama) {
      // Panorama mode reuses data from the main chart, so we must not overwrite it here.
      return () => {
        // there is nothing to clean up
      };
    }
    dispatch(setChartData(chartData));
    return () => {
      dispatch(setChartData(undefined));
    };
  }, [chartData, dispatch, isPanorama]);
  return null;
};

/**
 * From all Brush properties, only height has a default value and will always be defined.
 * Other properties are nullable and will be computed from offsets and margins if they are not set.
 */

var initialState$2 = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }
};
var brushSlice = createSlice({
  name: 'brush',
  initialState: initialState$2,
  reducers: {
    setBrushSettings(_state, action) {
      if (action.payload == null) {
        return initialState$2;
      }
      return action.payload;
    }
  }
});
var {
  setBrushSettings
} = brushSlice.actions;
var brushReducer = brushSlice.reducer;

function _defineProperty$6(e, r, t) { return (r = _toPropertyKey$6(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$6(t) { var i = _toPrimitive$6(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$6(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class ScaleHelper {
  static create(obj) {
    return new ScaleHelper(obj);
  }
  constructor(scale) {
    this.scale = scale;
  }
  get domain() {
    return this.scale.domain;
  }
  get range() {
    return this.scale.range;
  }
  get rangeMin() {
    return this.range()[0];
  }
  get rangeMax() {
    return this.range()[1];
  }
  get bandwidth() {
    return this.scale.bandwidth;
  }
  apply(value) {
    var {
      bandAware,
      position
    } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (value === undefined) {
      return undefined;
    }
    if (position) {
      switch (position) {
        case 'start':
          {
            return this.scale(value);
          }
        case 'middle':
          {
            var offset = this.bandwidth ? this.bandwidth() / 2 : 0;
            return this.scale(value) + offset;
          }
        case 'end':
          {
            var _offset = this.bandwidth ? this.bandwidth() : 0;
            return this.scale(value) + _offset;
          }
        default:
          {
            return this.scale(value);
          }
      }
    }
    if (bandAware) {
      var _offset2 = this.bandwidth ? this.bandwidth() / 2 : 0;
      return this.scale(value) + _offset2;
    }
    return this.scale(value);
  }
  isInRange(value) {
    var range = this.range();
    var first = range[0];
    var last = range[range.length - 1];
    return first <= last ? value >= first && value <= last : value >= last && value <= first;
  }
}
_defineProperty$6(ScaleHelper, "EPS", 1e-4);

/** Normalizes the angle so that 0 <= angle < 180.
 * @param {number} angle Angle in degrees.
 * @return {number} the normalized angle with a value of at least 0 and never greater or equal to 180. */
function normalizeAngle(angle) {
  return (angle % 180 + 180) % 180;
}

/** Calculates the width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 * @param {Object} size Width and height of the text in a horizontal position.
 * @param {number} angle Angle in degrees in which the text is displayed.
 * @return {number} The width of the largest horizontal line that fits inside a rectangle that is displayed at an angle.
 */
var getAngledRectangleWidth = function getAngledRectangleWidth(_ref5) {
  var {
    width,
    height
  } = _ref5;
  var angle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Ensure angle is >= 0 && < 180
  var normalizedAngle = normalizeAngle(angle);
  var angleRadians = normalizedAngle * Math.PI / 180;

  /* Depending on the height and width of the rectangle, we may need to use different formulas to calculate the angled
   * width. This threshold defines when each formula should kick in. */
  var angleThreshold = Math.atan(height / width);
  var angledWidth = angleRadians > angleThreshold && angleRadians < Math.PI - angleThreshold ? height / Math.sin(angleRadians) : width / Math.cos(angleRadians);
  return Math.abs(angledWidth);
};

var initialState$1 = {
  dots: [],
  areas: [],
  lines: []
};
var referenceElementsSlice = createSlice({
  name: 'referenceElements',
  initialState: initialState$1,
  reducers: {
    addDot: (state, action) => {
      state.dots.push(action.payload);
    },
    removeDot: (state, action) => {
      var index = current(state).dots.findIndex(dot => dot === action.payload);
      if (index !== -1) {
        state.dots.splice(index, 1);
      }
    },
    addArea: (state, action) => {
      state.areas.push(action.payload);
    },
    removeArea: (state, action) => {
      var index = current(state).areas.findIndex(area => area === action.payload);
      if (index !== -1) {
        state.areas.splice(index, 1);
      }
    },
    addLine: (state, action) => {
      state.lines.push(action.payload);
    },
    removeLine: (state, action) => {
      var index = current(state).lines.findIndex(line => line === action.payload);
      if (index !== -1) {
        state.lines.splice(index, 1);
      }
    }
  }
});
var {
  addDot,
  removeDot,
  addArea,
  removeArea,
  addLine,
  removeLine
} = referenceElementsSlice.actions;
var referenceElementsReducer = referenceElementsSlice.reducer;

var ClipPathIdContext = /*#__PURE__*/reactExports.createContext(undefined);

/**
 * Generates a unique clip path ID for use in SVG elements,
 * and puts it in a context provider.
 *
 * To read the clip path ID, use the `useClipPathId` hook,
 * or render `<ClipPath>` component which will automatically use the ID from this context.
 *
 * @param props children - React children to be wrapped by the provider
 * @returns React Context Provider
 */
var ClipPathProvider = _ref => {
  var {
    children
  } = _ref;
  var [clipPathId] = reactExports.useState("".concat(uniqueId('recharts'), "-clip"));
  var plotArea = usePlotArea();
  if (plotArea == null) {
    return null;
  }
  var {
    x,
    y,
    width,
    height
  } = plotArea;
  return /*#__PURE__*/reactExports.createElement(ClipPathIdContext.Provider, {
    value: clipPathId
  }, /*#__PURE__*/reactExports.createElement("defs", null, /*#__PURE__*/reactExports.createElement("clipPath", {
    id: clipPathId
  }, /*#__PURE__*/reactExports.createElement("rect", {
    x: x,
    y: y,
    height: height,
    width: width
  }))), children);
};

function shallowEqual(a, b) {
  /* eslint-disable no-restricted-syntax */
  for (var key in a) {
    if ({}.hasOwnProperty.call(a, key) && (!{}.hasOwnProperty.call(b, key) || a[key] !== b[key])) {
      return false;
    }
  }
  for (var _key in b) {
    if ({}.hasOwnProperty.call(b, _key) && !{}.hasOwnProperty.call(a, _key)) {
      return false;
    }
  }
  return true;
}

/**
 * Given an array and a number N, return a new array which contains every nTh
 * element of the input array. For n below 1, an empty array is returned.
 * If isValid is provided, all candidates must suffice the condition, else undefined is returned.
 * @param {T[]} array An input array.
 * @param {integer} n A number
 * @param {Function} isValid A function to evaluate a candidate form the array
 * @returns {T[]} The result array of the same type as the input array.
 */
function getEveryNthWithCondition(array, n, isValid) {
  if (n < 1) {
    return [];
  }
  if (n === 1 && isValid === undefined) {
    return array;
  }
  var result = [];
  for (var i = 0; i < array.length; i += n) {
    {
      result.push(array[i]);
    }
  }
  return result;
}

function getAngledTickWidth(contentSize, unitSize, angle) {
  var size = {
    width: contentSize.width + unitSize.width,
    height: contentSize.height + unitSize.height
  };
  return getAngledRectangleWidth(size, angle);
}
function getTickBoundaries(viewBox, sign, sizeKey) {
  var isWidth = sizeKey === 'width';
  var {
    x,
    y,
    width,
    height
  } = viewBox;
  if (sign === 1) {
    return {
      start: isWidth ? x : y,
      end: isWidth ? x + width : y + height
    };
  }
  return {
    start: isWidth ? x + width : y + height,
    end: isWidth ? x : y
  };
}
function isVisible(sign, tickPosition, getSize, start, end) {
  /* Since getSize() is expensive (it reads the ticks' size from the DOM), we do this check first to avoid calculating
   * the tick's size. */
  if (sign * tickPosition < sign * start || sign * tickPosition > sign * end) {
    return false;
  }
  var size = getSize();
  return sign * (tickPosition - sign * size / 2 - start) >= 0 && sign * (tickPosition + sign * size / 2 - end) <= 0;
}
function getNumberIntervalTicks(ticks, interval) {
  return getEveryNthWithCondition(ticks, interval + 1);
}

function getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap) {
  // If the ticks are readonly, then the slice might not be necessary
  var result = (ticks || []).slice();
  var {
    start: initialStart,
    end
  } = boundaries;
  var index = 0;
  // Premature optimisation idea 1: Estimate a lower bound, and start from there.
  // For now, start from every tick
  var stepsize = 1;
  var start = initialStart;
  var _loop = function _loop() {
      // Given stepsize, evaluate whether every stepsize-th tick can be shown.
      // If it can not, then increase the stepsize by 1, and try again.

      var entry = ticks === null || ticks === void 0 ? void 0 : ticks[index];

      // Break condition - If we have evaluated all the ticks, then we are done.
      if (entry === undefined) {
        return {
          v: getEveryNthWithCondition(ticks, stepsize)
        };
      }

      // Check if the element collides with the next element
      var i = index;
      var size;
      var getSize = () => {
        if (size === undefined) {
          size = getTickSize(entry, i);
        }
        return size;
      };
      var tickCoord = entry.coordinate;
      // We will always show the first tick.
      var isShow = index === 0 || isVisible(sign, tickCoord, getSize, start, end);
      if (!isShow) {
        // Start all over with a larger stepsize
        index = 0;
        start = initialStart;
        stepsize += 1;
      }
      if (isShow) {
        // If it can be shown, update the start
        start = tickCoord + sign * (getSize() / 2 + minTickGap);
        index += stepsize;
      }
    },
    _ret;
  while (stepsize <= result.length) {
    _ret = _loop();
    if (_ret) return _ret.v;
  }
  return [];
}

function ownKeys$5(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$5(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$5(Object(t), true).forEach(function (r) { _defineProperty$5(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$5(e, r, t) { return (r = _toPropertyKey$5(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$5(t) { var i = _toPrimitive$5(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$5(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap) {
  var result = (ticks || []).slice();
  var len = result.length;
  var {
    start
  } = boundaries;
  var {
    end
  } = boundaries;
  var _loop = function _loop(i) {
    var entry = result[i];
    var size;
    var getSize = () => {
      if (size === undefined) {
        size = getTickSize(entry, i);
      }
      return size;
    };
    if (i === len - 1) {
      var gap = sign * (entry.coordinate + sign * getSize() / 2 - end);
      result[i] = entry = _objectSpread$5(_objectSpread$5({}, entry), {}, {
        tickCoord: gap > 0 ? entry.coordinate - gap * sign : entry.coordinate
      });
    } else {
      result[i] = entry = _objectSpread$5(_objectSpread$5({}, entry), {}, {
        tickCoord: entry.coordinate
      });
    }
    var isShow = isVisible(sign, entry.tickCoord, getSize, start, end);
    if (isShow) {
      end = entry.tickCoord - sign * (getSize() / 2 + minTickGap);
      result[i] = _objectSpread$5(_objectSpread$5({}, entry), {}, {
        isShow: true
      });
    }
  };
  for (var i = len - 1; i >= 0; i--) {
    _loop(i);
  }
  return result;
}
function getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, preserveEnd) {
  // This method is mutating the array so clone is indeed necessary here
  var result = (ticks || []).slice();
  var len = result.length;
  var {
    start,
    end
  } = boundaries;
  if (preserveEnd) {
    // Try to guarantee the tail to be displayed
    var tail = ticks[len - 1];
    var tailSize = getTickSize(tail, len - 1);
    var tailGap = sign * (tail.coordinate + sign * tailSize / 2 - end);
    result[len - 1] = tail = _objectSpread$5(_objectSpread$5({}, tail), {}, {
      tickCoord: tailGap > 0 ? tail.coordinate - tailGap * sign : tail.coordinate
    });
    var isTailShow = isVisible(sign, tail.tickCoord, () => tailSize, start, end);
    if (isTailShow) {
      end = tail.tickCoord - sign * (tailSize / 2 + minTickGap);
      result[len - 1] = _objectSpread$5(_objectSpread$5({}, tail), {}, {
        isShow: true
      });
    }
  }
  var count = preserveEnd ? len - 1 : len;
  var _loop2 = function _loop2(i) {
    var entry = result[i];
    var size;
    var getSize = () => {
      if (size === undefined) {
        size = getTickSize(entry, i);
      }
      return size;
    };
    if (i === 0) {
      var gap = sign * (entry.coordinate - sign * getSize() / 2 - start);
      result[i] = entry = _objectSpread$5(_objectSpread$5({}, entry), {}, {
        tickCoord: gap < 0 ? entry.coordinate - gap * sign : entry.coordinate
      });
    } else {
      result[i] = entry = _objectSpread$5(_objectSpread$5({}, entry), {}, {
        tickCoord: entry.coordinate
      });
    }
    var isShow = isVisible(sign, entry.tickCoord, getSize, start, end);
    if (isShow) {
      start = entry.tickCoord + sign * (getSize() / 2 + minTickGap);
      result[i] = _objectSpread$5(_objectSpread$5({}, entry), {}, {
        isShow: true
      });
    }
  };
  for (var i = 0; i < count; i++) {
    _loop2(i);
  }
  return result;
}
function getTicks(props, fontSize, letterSpacing) {
  var {
    tick,
    ticks,
    viewBox,
    minTickGap,
    orientation,
    interval,
    tickFormatter,
    unit,
    angle
  } = props;
  if (!ticks || !ticks.length || !tick) {
    return [];
  }
  if (isNumber(interval) || Global.isSsr) {
    var _getNumberIntervalTic;
    return (_getNumberIntervalTic = getNumberIntervalTicks(ticks, isNumber(interval) ? interval : 0)) !== null && _getNumberIntervalTic !== void 0 ? _getNumberIntervalTic : [];
  }
  var candidates = [];
  var sizeKey = orientation === 'top' || orientation === 'bottom' ? 'width' : 'height';
  var unitSize = unit && sizeKey === 'width' ? getStringSize(unit, {
    fontSize,
    letterSpacing
  }) : {
    width: 0,
    height: 0
  };
  var getTickSize = (content, index) => {
    var value = typeof tickFormatter === 'function' ? tickFormatter(content.value, index) : content.value;
    // Recharts only supports angles when sizeKey === 'width'
    return sizeKey === 'width' ? getAngledTickWidth(getStringSize(value, {
      fontSize,
      letterSpacing
    }), unitSize, angle) : getStringSize(value, {
      fontSize,
      letterSpacing
    })[sizeKey];
  };
  var sign = ticks.length >= 2 ? mathSign(ticks[1].coordinate - ticks[0].coordinate) : 1;
  var boundaries = getTickBoundaries(viewBox, sign, sizeKey);
  if (interval === 'equidistantPreserveStart') {
    return getEquidistantTicks(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  if (interval === 'preserveStart' || interval === 'preserveStartEnd') {
    candidates = getTicksStart(sign, boundaries, getTickSize, ticks, minTickGap, interval === 'preserveStartEnd');
  } else {
    candidates = getTicksEnd(sign, boundaries, getTickSize, ticks, minTickGap);
  }
  return candidates.filter(entry => entry.isShow);
}

/**
 * Calculates the width of the Y-axis based on the tick labels and the axis label.
 * @param {Object} params - The parameters object.
 * @param {React.RefObject<any>} params.cartesianAxisRef - The ref to the CartesianAxis component.
 * @param {React.RefObject<Element>} params.labelRef - The ref to the label element.
 * @param {number} [params.labelGapWithTick=5] - The gap between the label and the tick.
 * @returns {number} The calculated width of the Y-axis.
 */
var getCalculatedYAxisWidth = _ref => {
  var {
    ticks,
    label,
    labelGapWithTick = 5,
    // Default gap between label and tick
    tickSize = 0,
    tickMargin = 0
  } = _ref;
  // find the max width of the tick labels
  var maxTickWidth = 0;
  if (ticks) {
    ticks.forEach(tickNode => {
      if (tickNode) {
        var bbox = tickNode.getBoundingClientRect();
        if (bbox.width > maxTickWidth) {
          maxTickWidth = bbox.width;
        }
      }
    });

    // calculate width of the axis label
    var labelWidth = label ? label.getBoundingClientRect().width : 0;
    var tickWidth = tickSize + tickMargin;

    // calculate the updated width of the y-axis
    var updatedYAxisWidth = maxTickWidth + tickWidth + labelWidth + (label ? labelGapWithTick : 0);
    return Math.round(updatedYAxisWidth);
  }
  return 0;
};

var _excluded$8 = ["axisLine", "width", "height", "className", "hide", "ticks"],
  _excluded2$5 = ["viewBox"],
  _excluded3$4 = ["viewBox"];
function _objectWithoutProperties$8(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$8(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$8(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends$7() { return _extends$7 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$7.apply(null, arguments); }
function ownKeys$4(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$4(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$4(Object(t), true).forEach(function (r) { _defineProperty$4(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$4(e, r, t) { return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$4(t) { var i = _toPrimitive$4(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$4(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }

/** The orientation of the axis in correspondence to the chart */

/** A unit to be appended to a value */

/** The formatter function of tick */

var defaultCartesianAxisProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  viewBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  // The orientation of axis
  orientation: 'bottom',
  // The ticks
  ticks: [],
  stroke: '#666',
  tickLine: true,
  axisLine: true,
  tick: true,
  mirror: false,
  minTickGap: 5,
  // The width or height of tick
  tickSize: 6,
  tickMargin: 2,
  interval: 'preserveEnd'
};

/*
 * `viewBox` and `scale` are SVG attributes.
 * Recharts however - unfortunately - has its own attributes named `viewBox` and `scale`
 * that are completely different data shape and different purpose.
 */

function AxisLine(axisLineProps) {
  var {
    x,
    y,
    width,
    height,
    orientation,
    mirror,
    axisLine,
    otherSvgProps
  } = axisLineProps;
  if (!axisLine) {
    return null;
  }
  var props = _objectSpread$4(_objectSpread$4(_objectSpread$4({}, otherSvgProps), filterProps(axisLine, false)), {}, {
    fill: 'none'
  });
  if (orientation === 'top' || orientation === 'bottom') {
    var needHeight = +(orientation === 'top' && !mirror || orientation === 'bottom' && mirror);
    props = _objectSpread$4(_objectSpread$4({}, props), {}, {
      x1: x,
      y1: y + needHeight * height,
      x2: x + width,
      y2: y + needHeight * height
    });
  } else {
    var needWidth = +(orientation === 'left' && !mirror || orientation === 'right' && mirror);
    props = _objectSpread$4(_objectSpread$4({}, props), {}, {
      x1: x + needWidth * width,
      y1: y,
      x2: x + needWidth * width,
      y2: y + height
    });
  }
  return /*#__PURE__*/reactExports.createElement("line", _extends$7({}, props, {
    className: clsx('recharts-cartesian-axis-line', get(axisLine, 'className'))
  }));
}

/**
 * Calculate the coordinates of endpoints in ticks.
 * @param data The data of a simple tick.
 * @param x The x-coordinate of the axis.
 * @param y The y-coordinate of the axis.
 * @param width The width of the axis.
 * @param height The height of the axis.
 * @param orientation The orientation of the axis.
 * @param tickSize The length of the tick line.
 * @param mirror If true, the ticks are mirrored.
 * @param tickMargin The margin between the tick line and the tick text.
 * @returns An object with `line` and `tick` coordinates.
 * `line` is the coordinates for the tick line, and `tick` is the coordinate for the tick text.
 */
function getTickLineCoord(data, x, y, width, height, orientation, tickSize, mirror, tickMargin) {
  var x1, x2, y1, y2, tx, ty;
  var sign = mirror ? -1 : 1;
  var finalTickSize = data.tickSize || tickSize;
  var tickCoord = isNumber(data.tickCoord) ? data.tickCoord : data.coordinate;
  switch (orientation) {
    case 'top':
      x1 = x2 = data.coordinate;
      y2 = y + +!mirror * height;
      y1 = y2 - sign * finalTickSize;
      ty = y1 - sign * tickMargin;
      tx = tickCoord;
      break;
    case 'left':
      y1 = y2 = data.coordinate;
      x2 = x + +!mirror * width;
      x1 = x2 - sign * finalTickSize;
      tx = x1 - sign * tickMargin;
      ty = tickCoord;
      break;
    case 'right':
      y1 = y2 = data.coordinate;
      x2 = x + +mirror * width;
      x1 = x2 + sign * finalTickSize;
      tx = x1 + sign * tickMargin;
      ty = tickCoord;
      break;
    default:
      x1 = x2 = data.coordinate;
      y2 = y + +mirror * height;
      y1 = y2 + sign * finalTickSize;
      ty = y1 + sign * tickMargin;
      tx = tickCoord;
      break;
  }
  return {
    line: {
      x1,
      y1,
      x2,
      y2
    },
    tick: {
      x: tx,
      y: ty
    }
  };
}

/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The text anchor of the tick.
 */
function getTickTextAnchor(orientation, mirror) {
  switch (orientation) {
    case 'left':
      return mirror ? 'start' : 'end';
    case 'right':
      return mirror ? 'end' : 'start';
    default:
      return 'middle';
  }
}

/**
 * @param orientation The orientation of the axis.
 * @param mirror If true, the ticks are mirrored.
 * @returns The vertical text anchor of the tick.
 */
function getTickVerticalAnchor(orientation, mirror) {
  switch (orientation) {
    case 'left':
    case 'right':
      return 'middle';
    case 'top':
      return mirror ? 'start' : 'end';
    default:
      return mirror ? 'end' : 'start';
  }
}
function TickItem(props) {
  var {
    option,
    tickProps,
    value
  } = props;
  var tickItem;
  var combinedClassName = clsx(tickProps.className, 'recharts-cartesian-axis-tick-value');
  if (/*#__PURE__*/reactExports.isValidElement(option)) {
    // @ts-expect-error element cloning is not typed
    tickItem = /*#__PURE__*/reactExports.cloneElement(option, _objectSpread$4(_objectSpread$4({}, tickProps), {}, {
      className: combinedClassName
    }));
  } else if (typeof option === 'function') {
    tickItem = option(_objectSpread$4(_objectSpread$4({}, tickProps), {}, {
      className: combinedClassName
    }));
  } else {
    var className = 'recharts-cartesian-axis-tick-value';
    if (typeof option !== 'boolean') {
      className = clsx(className, option === null || option === void 0 ? void 0 : option.className);
    }
    tickItem = /*#__PURE__*/reactExports.createElement(Text, _extends$7({}, tickProps, {
      className: className
    }), value);
  }
  return tickItem;
}
function Ticks(props) {
  var {
    ticks = [],
    tick,
    tickLine,
    stroke,
    tickFormatter,
    unit,
    padding,
    tickTextProps,
    orientation,
    mirror,
    x,
    y,
    width,
    height,
    tickSize,
    tickMargin,
    fontSize,
    letterSpacing,
    getTicksConfig,
    events
  } = props;
  // @ts-expect-error some properties are optional in props but required in getTicks
  var finalTicks = getTicks(_objectSpread$4(_objectSpread$4({}, getTicksConfig), {}, {
    ticks
  }), fontSize, letterSpacing);
  var textAnchor = getTickTextAnchor(orientation, mirror);
  var verticalAnchor = getTickVerticalAnchor(orientation, mirror);
  var axisProps = svgPropertiesNoEvents(getTicksConfig);
  var customTickProps = filterProps(tick, false);
  var tickLineProps = _objectSpread$4(_objectSpread$4({}, axisProps), {}, {
    fill: 'none'
  }, filterProps(tickLine, false));
  var items = finalTicks.map((entry, i) => {
    var {
      line: lineCoord,
      tick: tickCoord
    } = getTickLineCoord(entry, x, y, width, height, orientation, tickSize, mirror, tickMargin);
    var tickProps = _objectSpread$4(_objectSpread$4(_objectSpread$4(_objectSpread$4({
      // @ts-expect-error textAnchor from axisProps is typed as `string` but Text wants type `TextAnchor`
      textAnchor,
      verticalAnchor
    }, axisProps), {}, {
      stroke: 'none',
      fill: stroke
    }, customTickProps), tickCoord), {}, {
      index: i,
      payload: entry,
      visibleTicksCount: finalTicks.length,
      tickFormatter,
      padding
    }, tickTextProps);
    return /*#__PURE__*/reactExports.createElement(Layer, _extends$7({
      className: "recharts-cartesian-axis-tick",
      key: "tick-".concat(entry.value, "-").concat(entry.coordinate, "-").concat(entry.tickCoord)
    }, adaptEventsOfChild(events, entry, i)), tickLine &&
    /*#__PURE__*/
    // @ts-expect-error recharts scale is not compatible with SVG scale
    reactExports.createElement("line", _extends$7({}, tickLineProps, lineCoord, {
      className: clsx('recharts-cartesian-axis-tick-line', get(tickLine, 'className'))
    })), tick && /*#__PURE__*/reactExports.createElement(TickItem, {
      option: tick,
      tickProps: tickProps,
      value: "".concat(typeof tickFormatter === 'function' ? tickFormatter(entry.value, i) : entry.value).concat(unit || '')
    }));
  });
  if (items.length > 0) {
    return /*#__PURE__*/reactExports.createElement("g", {
      className: "recharts-cartesian-axis-ticks"
    }, items);
  }
  return null;
}
var CartesianAxisComponent = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  var {
      axisLine,
      width,
      height,
      className,
      hide,
      ticks
    } = props,
    rest = _objectWithoutProperties$8(props, _excluded$8);
  var [fontSize, setFontSize] = reactExports.useState('');
  var [letterSpacing, setLetterSpacing] = reactExports.useState('');
  var tickRefs = reactExports.useRef([]);
  reactExports.useImperativeHandle(ref, () => ({
    getCalculatedWidth: () => {
      var _props$labelRef;
      return getCalculatedYAxisWidth({
        ticks: tickRefs.current,
        label: (_props$labelRef = props.labelRef) === null || _props$labelRef === void 0 ? void 0 : _props$labelRef.current,
        labelGapWithTick: 5,
        tickSize: props.tickSize,
        tickMargin: props.tickMargin
      });
    }
  }));
  var layerRef = reactExports.useCallback(el => {
    if (el) {
      var tickNodes = el.getElementsByClassName('recharts-cartesian-axis-tick-value');
      tickRefs.current = Array.from(tickNodes);
      var tick = tickNodes[0];
      if (tick) {
        var computedStyle = window.getComputedStyle(tick);
        var calculatedFontSize = computedStyle.fontSize;
        var calculatedLetterSpacing = computedStyle.letterSpacing;
        if (calculatedFontSize !== fontSize || calculatedLetterSpacing !== letterSpacing) {
          setFontSize(calculatedFontSize);
          setLetterSpacing(calculatedLetterSpacing);
        }
      }
    }
  }, [fontSize, letterSpacing]);
  if (hide) {
    return null;
  }

  /*
   * This is different condition from what validateWidthHeight is doing;
   * the CartesianAxis does allow width or height to be undefined.
   */
  if (width != null && width <= 0 || height != null && height <= 0) {
    return null;
  }
  return /*#__PURE__*/reactExports.createElement(Layer, {
    className: clsx('recharts-cartesian-axis', className),
    ref: layerRef
  }, /*#__PURE__*/reactExports.createElement(AxisLine, {
    x: props.x,
    y: props.y,
    width: width,
    height: height,
    orientation: props.orientation,
    mirror: props.mirror,
    axisLine: axisLine,
    otherSvgProps: svgPropertiesNoEvents(props)
  }), /*#__PURE__*/reactExports.createElement(Ticks, {
    ticks: ticks,
    tick: props.tick,
    tickLine: props.tickLine,
    stroke: props.stroke,
    tickFormatter: props.tickFormatter,
    unit: props.unit,
    padding: props.padding,
    tickTextProps: props.tickTextProps,
    orientation: props.orientation,
    mirror: props.mirror,
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    tickSize: props.tickSize,
    tickMargin: props.tickMargin,
    fontSize: fontSize,
    letterSpacing: letterSpacing,
    getTicksConfig: props,
    events: rest
  }), /*#__PURE__*/reactExports.createElement(CartesianLabelContextProvider, {
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height
  }, /*#__PURE__*/reactExports.createElement(CartesianLabelFromLabelProp, {
    label: props.label
  }), props.children));
});
var MemoCartesianAxis = /*#__PURE__*/reactExports.memo(CartesianAxisComponent, (prevProps, nextProps) => {
  var {
      viewBox: prevViewBox
    } = prevProps,
    prevRestProps = _objectWithoutProperties$8(prevProps, _excluded2$5);
  var {
      viewBox: nextViewBox
    } = nextProps,
    nextRestProps = _objectWithoutProperties$8(nextProps, _excluded3$4);
  return shallowEqual(prevViewBox, nextViewBox) && shallowEqual(prevRestProps, nextRestProps);
});
var CartesianAxis = /*#__PURE__*/reactExports.forwardRef((outsideProps, ref) => {
  var props = resolveDefaultProps(outsideProps, defaultCartesianAxisProps);
  return /*#__PURE__*/reactExports.createElement(MemoCartesianAxis, _extends$7({}, props, {
    ref: ref
  }));
});
CartesianAxis.displayName = 'CartesianAxis';

var _excluded$7 = ["x1", "y1", "x2", "y2", "key"],
  _excluded2$4 = ["offset"],
  _excluded3$3 = ["xAxisId", "yAxisId"],
  _excluded4$2 = ["xAxisId", "yAxisId"];
function ownKeys$3(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$3(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$3(Object(t), true).forEach(function (r) { _defineProperty$3(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$3(e, r, t) { return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$3(t) { var i = _toPrimitive$3(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$3(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends$6() { return _extends$6 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$6.apply(null, arguments); }
function _objectWithoutProperties$7(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$7(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$7(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }

/**
 * The <CartesianGrid horizontal
 */

var Background = props => {
  var {
    fill
  } = props;
  if (!fill || fill === 'none') {
    return null;
  }
  var {
    fillOpacity,
    x,
    y,
    width,
    height,
    ry
  } = props;
  return /*#__PURE__*/reactExports.createElement("rect", {
    x: x,
    y: y,
    ry: ry,
    width: width,
    height: height,
    stroke: "none",
    fill: fill,
    fillOpacity: fillOpacity,
    className: "recharts-cartesian-grid-bg"
  });
};
function renderLineItem(option, props) {
  var lineItem;
  if (/*#__PURE__*/reactExports.isValidElement(option)) {
    // @ts-expect-error typescript does not see the props type when cloning an element
    lineItem = /*#__PURE__*/reactExports.cloneElement(option, props);
  } else if (typeof option === 'function') {
    lineItem = option(props);
  } else {
    var {
        x1,
        y1,
        x2,
        y2,
        key
      } = props,
      others = _objectWithoutProperties$7(props, _excluded$7);
    var _svgPropertiesNoEvent = svgPropertiesNoEvents(others),
      {
        offset: __
      } = _svgPropertiesNoEvent,
      restOfFilteredProps = _objectWithoutProperties$7(_svgPropertiesNoEvent, _excluded2$4);
    lineItem = /*#__PURE__*/reactExports.createElement("line", _extends$6({}, restOfFilteredProps, {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      fill: "none",
      key: key
    }));
  }
  return lineItem;
}
function HorizontalGridLines(props) {
  var {
    x,
    width,
    horizontal = true,
    horizontalPoints
  } = props;
  if (!horizontal || !horizontalPoints || !horizontalPoints.length) {
    return null;
  }
  var {
      xAxisId,
      yAxisId
    } = props,
    otherLineItemProps = _objectWithoutProperties$7(props, _excluded3$3);
  var items = horizontalPoints.map((entry, i) => {
    var lineItemProps = _objectSpread$3(_objectSpread$3({}, otherLineItemProps), {}, {
      x1: x,
      y1: entry,
      x2: x + width,
      y2: entry,
      key: "line-".concat(i),
      index: i
    });
    return renderLineItem(horizontal, lineItemProps);
  });
  return /*#__PURE__*/reactExports.createElement("g", {
    className: "recharts-cartesian-grid-horizontal"
  }, items);
}
function VerticalGridLines(props) {
  var {
    y,
    height,
    vertical = true,
    verticalPoints
  } = props;
  if (!vertical || !verticalPoints || !verticalPoints.length) {
    return null;
  }
  var {
      xAxisId,
      yAxisId
    } = props,
    otherLineItemProps = _objectWithoutProperties$7(props, _excluded4$2);
  var items = verticalPoints.map((entry, i) => {
    var lineItemProps = _objectSpread$3(_objectSpread$3({}, otherLineItemProps), {}, {
      x1: entry,
      y1: y,
      x2: entry,
      y2: y + height,
      key: "line-".concat(i),
      index: i
    });
    return renderLineItem(vertical, lineItemProps);
  });
  return /*#__PURE__*/reactExports.createElement("g", {
    className: "recharts-cartesian-grid-vertical"
  }, items);
}
function HorizontalStripes(props) {
  var {
    horizontalFill,
    fillOpacity,
    x,
    y,
    width,
    height,
    horizontalPoints,
    horizontal = true
  } = props;
  if (!horizontal || !horizontalFill || !horizontalFill.length) {
    return null;
  }

  // Why =y -y? I was trying to find any difference that this makes, with floating point numbers and edge cases but ... nothing.
  var roundedSortedHorizontalPoints = horizontalPoints.map(e => Math.round(e + y - y)).sort((a, b) => a - b);
  // Why is this condition `!==` instead of `<=` ?
  if (y !== roundedSortedHorizontalPoints[0]) {
    roundedSortedHorizontalPoints.unshift(0);
  }
  var items = roundedSortedHorizontalPoints.map((entry, i) => {
    // Why do we strip only the last stripe if it is invisible, and not all invisible stripes?
    var lastStripe = !roundedSortedHorizontalPoints[i + 1];
    var lineHeight = lastStripe ? y + height - entry : roundedSortedHorizontalPoints[i + 1] - entry;
    if (lineHeight <= 0) {
      return null;
    }
    var colorIndex = i % horizontalFill.length;
    return /*#__PURE__*/reactExports.createElement("rect", {
      key: "react-".concat(i) // eslint-disable-line react/no-array-index-key
      ,
      y: entry,
      x: x,
      height: lineHeight,
      width: width,
      stroke: "none",
      fill: horizontalFill[colorIndex],
      fillOpacity: fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /*#__PURE__*/reactExports.createElement("g", {
    className: "recharts-cartesian-gridstripes-horizontal"
  }, items);
}
function VerticalStripes(props) {
  var {
    vertical = true,
    verticalFill,
    fillOpacity,
    x,
    y,
    width,
    height,
    verticalPoints
  } = props;
  if (!vertical || !verticalFill || !verticalFill.length) {
    return null;
  }
  var roundedSortedVerticalPoints = verticalPoints.map(e => Math.round(e + x - x)).sort((a, b) => a - b);
  if (x !== roundedSortedVerticalPoints[0]) {
    roundedSortedVerticalPoints.unshift(0);
  }
  var items = roundedSortedVerticalPoints.map((entry, i) => {
    var lastStripe = !roundedSortedVerticalPoints[i + 1];
    var lineWidth = lastStripe ? x + width - entry : roundedSortedVerticalPoints[i + 1] - entry;
    if (lineWidth <= 0) {
      return null;
    }
    var colorIndex = i % verticalFill.length;
    return /*#__PURE__*/reactExports.createElement("rect", {
      key: "react-".concat(i) // eslint-disable-line react/no-array-index-key
      ,
      x: entry,
      y: y,
      width: lineWidth,
      height: height,
      stroke: "none",
      fill: verticalFill[colorIndex],
      fillOpacity: fillOpacity,
      className: "recharts-cartesian-grid-bg"
    });
  });
  return /*#__PURE__*/reactExports.createElement("g", {
    className: "recharts-cartesian-gridstripes-vertical"
  }, items);
}
var defaultVerticalCoordinatesGenerator = (_ref, syncWithTicks) => {
  var {
    xAxis,
    width,
    height,
    offset
  } = _ref;
  return getCoordinatesOfGrid(getTicks(_objectSpread$3(_objectSpread$3(_objectSpread$3({}, defaultCartesianAxisProps), xAxis), {}, {
    ticks: getTicksOfAxis(xAxis),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.left, offset.left + offset.width, syncWithTicks);
};
var defaultHorizontalCoordinatesGenerator = (_ref2, syncWithTicks) => {
  var {
    yAxis,
    width,
    height,
    offset
  } = _ref2;
  return getCoordinatesOfGrid(getTicks(_objectSpread$3(_objectSpread$3(_objectSpread$3({}, defaultCartesianAxisProps), yAxis), {}, {
    ticks: getTicksOfAxis(yAxis),
    viewBox: {
      x: 0,
      y: 0,
      width,
      height
    }
  })), offset.top, offset.top + offset.height, syncWithTicks);
};
var defaultProps$1 = {
  horizontal: true,
  vertical: true,
  // The ordinates of horizontal grid lines
  horizontalPoints: [],
  // The abscissas of vertical grid lines
  verticalPoints: [],
  stroke: '#ccc',
  fill: 'none',
  // The fill of colors of grid lines
  verticalFill: [],
  horizontalFill: [],
  xAxisId: 0,
  yAxisId: 0
};
function CartesianGrid(props) {
  var chartWidth = useChartWidth();
  var chartHeight = useChartHeight();
  var offset = useOffsetInternal();
  var propsIncludingDefaults = _objectSpread$3(_objectSpread$3({}, resolveDefaultProps(props, defaultProps$1)), {}, {
    x: isNumber(props.x) ? props.x : offset.left,
    y: isNumber(props.y) ? props.y : offset.top,
    width: isNumber(props.width) ? props.width : offset.width,
    height: isNumber(props.height) ? props.height : offset.height
  });
  var {
    xAxisId,
    yAxisId,
    x,
    y,
    width,
    height,
    syncWithTicks,
    horizontalValues,
    verticalValues
  } = propsIncludingDefaults;
  var isPanorama = useIsPanorama();
  var xAxis = useAppSelector(state => selectAxisPropsNeededForCartesianGridTicksGenerator(state, 'xAxis', xAxisId, isPanorama));
  var yAxis = useAppSelector(state => selectAxisPropsNeededForCartesianGridTicksGenerator(state, 'yAxis', yAxisId, isPanorama));
  if (!isNumber(width) || width <= 0 || !isNumber(height) || height <= 0 || !isNumber(x) || x !== +x || !isNumber(y) || y !== +y) {
    return null;
  }

  /*
   * verticalCoordinatesGenerator and horizontalCoordinatesGenerator are defined
   * outside the propsIncludingDefaults because they were never part of the original props
   * and they were never passed as a prop down to horizontal/vertical custom elements.
   * If we add these two to propsIncludingDefaults then we are changing public API.
   * Not a bad thing per se but also not necessary.
   */
  var verticalCoordinatesGenerator = propsIncludingDefaults.verticalCoordinatesGenerator || defaultVerticalCoordinatesGenerator;
  var horizontalCoordinatesGenerator = propsIncludingDefaults.horizontalCoordinatesGenerator || defaultHorizontalCoordinatesGenerator;
  var {
    horizontalPoints,
    verticalPoints
  } = propsIncludingDefaults;

  // No horizontal points are specified
  if ((!horizontalPoints || !horizontalPoints.length) && typeof horizontalCoordinatesGenerator === 'function') {
    var isHorizontalValues = horizontalValues && horizontalValues.length;
    var generatorResult = horizontalCoordinatesGenerator({
      yAxis: yAxis ? _objectSpread$3(_objectSpread$3({}, yAxis), {}, {
        ticks: isHorizontalValues ? horizontalValues : yAxis.ticks
      }) : undefined,
      width: chartWidth,
      height: chartHeight,
      offset
    }, isHorizontalValues ? true : syncWithTicks);
    warn(Array.isArray(generatorResult), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof generatorResult, "]"));
    if (Array.isArray(generatorResult)) {
      horizontalPoints = generatorResult;
    }
  }

  // No vertical points are specified
  if ((!verticalPoints || !verticalPoints.length) && typeof verticalCoordinatesGenerator === 'function') {
    var isVerticalValues = verticalValues && verticalValues.length;
    var _generatorResult = verticalCoordinatesGenerator({
      xAxis: xAxis ? _objectSpread$3(_objectSpread$3({}, xAxis), {}, {
        ticks: isVerticalValues ? verticalValues : xAxis.ticks
      }) : undefined,
      width: chartWidth,
      height: chartHeight,
      offset
    }, isVerticalValues ? true : syncWithTicks);
    warn(Array.isArray(_generatorResult), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof _generatorResult, "]"));
    if (Array.isArray(_generatorResult)) {
      verticalPoints = _generatorResult;
    }
  }
  return /*#__PURE__*/reactExports.createElement("g", {
    className: "recharts-cartesian-grid"
  }, /*#__PURE__*/reactExports.createElement(Background, {
    fill: propsIncludingDefaults.fill,
    fillOpacity: propsIncludingDefaults.fillOpacity,
    x: propsIncludingDefaults.x,
    y: propsIncludingDefaults.y,
    width: propsIncludingDefaults.width,
    height: propsIncludingDefaults.height,
    ry: propsIncludingDefaults.ry
  }), /*#__PURE__*/reactExports.createElement(HorizontalStripes, _extends$6({}, propsIncludingDefaults, {
    horizontalPoints: horizontalPoints
  })), /*#__PURE__*/reactExports.createElement(VerticalStripes, _extends$6({}, propsIncludingDefaults, {
    verticalPoints: verticalPoints
  })), /*#__PURE__*/reactExports.createElement(HorizontalGridLines, _extends$6({}, propsIncludingDefaults, {
    offset: offset,
    horizontalPoints: horizontalPoints,
    xAxis: xAxis,
    yAxis: yAxis
  })), /*#__PURE__*/reactExports.createElement(VerticalGridLines, _extends$6({}, propsIncludingDefaults, {
    offset: offset,
    verticalPoints: verticalPoints,
    xAxis: xAxis,
    yAxis: yAxis
  })));
}
CartesianGrid.displayName = 'CartesianGrid';

var selectXAxisWithScale$1 = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks$1 = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale$1 = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks$1 = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'yAxis', yAxisId, isPanorama);
var selectBandSize$1 = createSelector([selectChartLayout, selectXAxisWithScale$1, selectYAxisWithScale$1, selectXAxisTicks$1, selectYAxisTicks$1], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, 'xAxis')) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickLineId = (_state, _xAxisId, _yAxisId, _isPanorama, id) => id;
function isLineSettings(item) {
  return item.type === 'line';
}

/*
 * There is a race condition problem because we read some data from props and some from the state.
 * The state is updated through a dispatch and is one render behind,
 * and so we have this weird one tick render where the displayedData in one selector have the old dataKey
 * but the new dataKey in another selector.
 *
 * So here instead of reading the dataKey from the props, we always read it from the state.
 */
var selectSynchronisedLineSettings = createSelector([selectUnfilteredCartesianItems, pickLineId], (graphicalItems, id) => graphicalItems.filter(isLineSettings).find(x => x.id === id));
var selectLinePoints = createSelector([selectChartLayout, selectXAxisWithScale$1, selectYAxisWithScale$1, selectXAxisTicks$1, selectYAxisTicks$1, selectSynchronisedLineSettings, selectBandSize$1, selectChartDataWithIndexesIfNotInPanorama], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, lineSettings, bandSize, _ref) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (lineSettings == null || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return undefined;
  }
  var {
    dataKey,
    data
  } = lineSettings;
  var displayedData;
  if (data != null && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }
  return computeLinePoints({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  });
});

var _excluded$6 = ["id"],
  _excluded2$3 = ["type", "layout", "connectNulls", "needClip"],
  _excluded3$2 = ["activeDot", "animateNewValues", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "hide", "isAnimationActive", "label", "legendType", "xAxisId", "yAxisId", "id"];
function ownKeys$2(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$2(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$2(Object(t), true).forEach(function (r) { _defineProperty$2(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$2(e, r, t) { return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$2(t) { var i = _toPrimitive$2(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$2(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties$6(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$6(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$6(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends$5() { return _extends$5 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$5.apply(null, arguments); }

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

var computeLegendPayloadFromAreaData$1 = props => {
  var {
    dataKey,
    name,
    stroke,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: stroke,
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
function getTooltipEntrySettings$1(props) {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit
  } = props;
  return {
    dataDefinedOnItem: data,
    positions: undefined,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: undefined,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: props.tooltipType,
      color: props.stroke,
      unit
    }
  };
}
var generateSimpleStrokeDasharray = (totalLength, length) => {
  return "".concat(length, "px ").concat(totalLength - length, "px");
};
function repeat(lines, count) {
  var linesUnit = lines.length % 2 !== 0 ? [...lines, 0] : lines;
  var result = [];
  for (var i = 0; i < count; ++i) {
    result = [...result, ...linesUnit];
  }
  return result;
}
var getStrokeDasharray = (length, totalLength, lines) => {
  var lineLength = lines.reduce((pre, next) => pre + next);

  // if lineLength is 0 return the default when no strokeDasharray is provided
  if (!lineLength) {
    return generateSimpleStrokeDasharray(totalLength, length);
  }
  var count = Math.floor(length / lineLength);
  var remainLength = length % lineLength;
  var restLength = totalLength - length;
  var remainLines = [];
  for (var i = 0, sum = 0; i < lines.length; sum += lines[i], ++i) {
    if (sum + lines[i] > remainLength) {
      remainLines = [...lines.slice(0, i), remainLength - sum];
      break;
    }
  }
  var emptyLines = remainLines.length % 2 === 0 ? [0, restLength] : [restLength];
  return [...repeat(lines, count), ...remainLines, ...emptyLines].map(line => "".concat(line, "px")).join(', ');
};
function renderDotItem$1(option, props) {
  var dotItem;
  if (/*#__PURE__*/reactExports.isValidElement(option)) {
    dotItem = /*#__PURE__*/reactExports.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dotItem = option(props);
  } else {
    var className = clsx('recharts-line-dot', typeof option !== 'boolean' ? option.className : '');
    dotItem = /*#__PURE__*/reactExports.createElement(Dot, _extends$5({}, props, {
      className: className
    }));
  }
  return dotItem;
}
function shouldRenderDots$1(points, dot) {
  if (points == null) {
    return false;
  }
  if (dot) {
    return true;
  }
  return points.length === 1;
}
function Dots$1(_ref) {
  var {
    clipPathId,
    points,
    props
  } = _ref;
  var {
    dot,
    dataKey,
    needClip
  } = props;
  if (!shouldRenderDots$1(points, dot)) {
    return null;
  }

  /*
   * Exclude ID from the props passed to the Dots component
   * because then the ID would be applied to multiple dots and it would no longer be unique.
   */
  var {
      id
    } = props,
    propsWithoutId = _objectWithoutProperties$6(props, _excluded$6);
  var clipDot = isClipDot(dot);
  var lineProps = svgPropertiesNoEvents(propsWithoutId);
  var customDotProps = filterProps(dot, true);
  var dots = points.map((entry, i) => {
    var dotProps = _objectSpread$2(_objectSpread$2(_objectSpread$2({
      key: "dot-".concat(i),
      r: 3
    }, lineProps), customDotProps), {}, {
      index: i,
      cx: entry.x,
      cy: entry.y,
      dataKey,
      value: entry.value,
      payload: entry.payload,
      points
    });
    return renderDotItem$1(dot, dotProps);
  });
  var dotsProps = {
    clipPath: needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : undefined
  };
  return /*#__PURE__*/reactExports.createElement(Layer, _extends$5({
    className: "recharts-line-dots",
    key: "dots"
  }, dotsProps), dots);
}
function LineLabelListProvider(_ref2) {
  var {
    showLabels,
    children,
    points
  } = _ref2;
  var labelListEntries = reactExports.useMemo(() => {
    return points === null || points === void 0 ? void 0 : points.map(point => {
      var viewBox = {
        x: point.x,
        y: point.y,
        width: 0,
        height: 0
      };
      return _objectSpread$2(_objectSpread$2({}, viewBox), {}, {
        value: point.value,
        payload: point.payload,
        viewBox,
        /*
         * Line is not passing parentViewBox to the LabelList so the labels can escape - looks like a bug, should we pass parentViewBox?
         * Or should this just be the root chart viewBox?
         */
        parentViewBox: undefined,
        fill: undefined
      });
    });
  }, [points]);
  return /*#__PURE__*/reactExports.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : null
  }, children);
}
function StaticCurve(_ref3) {
  var {
    clipPathId,
    pathRef,
    points,
    strokeDasharray,
    props
  } = _ref3;
  var {
      type,
      layout,
      connectNulls,
      needClip
    } = props,
    others = _objectWithoutProperties$6(props, _excluded2$3);
  var curveProps = _objectSpread$2(_objectSpread$2({}, filterProps(others, true)), {}, {
    fill: 'none',
    className: 'recharts-line-curve',
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined,
    points,
    type,
    layout,
    connectNulls,
    strokeDasharray: strokeDasharray !== null && strokeDasharray !== void 0 ? strokeDasharray : props.strokeDasharray
  });
  return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/reactExports.createElement(Curve, _extends$5({}, curveProps, {
    pathRef: pathRef
  })), /*#__PURE__*/reactExports.createElement(Dots$1, {
    points: points,
    clipPathId: clipPathId,
    props: props
  }));
}
function getTotalLength(mainCurve) {
  try {
    return mainCurve && mainCurve.getTotalLength && mainCurve.getTotalLength() || 0;
  } catch (_unused) {
    return 0;
  }
}
function CurveWithAnimation(_ref4) {
  var {
    clipPathId,
    props,
    pathRef,
    previousPointsRef,
    longestAnimatedLengthRef
  } = _ref4;
  var {
    points,
    strokeDasharray,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    animateNewValues,
    width,
    height,
    onAnimationEnd,
    onAnimationStart
  } = props;
  var prevPoints = previousPointsRef.current;
  var animationId = useAnimationId(props, 'recharts-line-');
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var showLabels = !isAnimating;
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  var totalLength = getTotalLength(pathRef.current);
  /*
   * Here we want to detect if the length animation has been interrupted.
   * For that we keep a reference to the furthest length that has been animated.
   *
   * And then, to keep things smooth, we add to it the current length that is being animated right now.
   *
   * If we did Math.max then it makes the length animation "pause" but we want to keep it smooth
   * so in case we have some "leftover" length from the previous animation we add it to the current length.
   *
   * This is not perfect because the animation changes speed due to easing. The default easing is 'ease' which is not linear
   * and makes it stand out. But it's good enough I suppose.
   * If we want to fix it then we need to keep track of multiple animations and their easing and timings.
   *
   * If you want to see this in action, try to change the dataKey of the line chart while the initial animation is running.
   * The Line begins with zero length and slowly grows to the full length. While this growth is in progress,
   * change the dataKey and the Line will continue growing from where it has grown so far.
   */
  var startingPoint = longestAnimatedLengthRef.current;
  return /*#__PURE__*/reactExports.createElement(LineLabelListProvider, {
    points: points,
    showLabels: showLabels
  }, props.children, /*#__PURE__*/reactExports.createElement(JavascriptAnimate, {
    animationId: animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, t => {
    var lengthInterpolated = interpolate(startingPoint, totalLength + startingPoint, t);
    var curLength = Math.min(lengthInterpolated, totalLength);
    var currentStrokeDasharray;
    if (isAnimationActive) {
      if (strokeDasharray) {
        var lines = "".concat(strokeDasharray).split(/[,\s]+/gim).map(num => parseFloat(num));
        currentStrokeDasharray = getStrokeDasharray(curLength, totalLength, lines);
      } else {
        currentStrokeDasharray = generateSimpleStrokeDasharray(totalLength, curLength);
      }
    } else {
      currentStrokeDasharray = strokeDasharray == null ? undefined : String(strokeDasharray);
    }
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepData = t === 1 ? points : points.map((entry, index) => {
        var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
        if (prevPoints[prevPointIndex]) {
          var prev = prevPoints[prevPointIndex];
          return _objectSpread$2(_objectSpread$2({}, entry), {}, {
            x: interpolate(prev.x, entry.x, t),
            y: interpolate(prev.y, entry.y, t)
          });
        }

        // magic number of faking previous x and y location
        if (animateNewValues) {
          return _objectSpread$2(_objectSpread$2({}, entry), {}, {
            x: interpolate(width * 2, entry.x, t),
            y: interpolate(height / 2, entry.y, t)
          });
        }
        return _objectSpread$2(_objectSpread$2({}, entry), {}, {
          x: entry.x,
          y: entry.y
        });
      });
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = stepData;
      return /*#__PURE__*/reactExports.createElement(StaticCurve, {
        props: props,
        points: stepData,
        clipPathId: clipPathId,
        pathRef: pathRef,
        strokeDasharray: currentStrokeDasharray
      });
    }

    /*
     * Here it is important to wait a little bit with updating the previousPointsRef
     * before the animation has a time to initialize.
     * If we set the previous pointsRef immediately, we set it before the Legend height it calculated
     * and before pathRef is set.
     * If that happens, the Line will re-render again after Legend had reported its height
     * which will start a new animation with the previous points as the starting point
     * which gives the effect of the Line animating slightly upwards (where the animation distance equals the Legend height).
     * Waiting for t > 0 is indirect but good enough to ensure that the Legend height is calculated and animation works properly.
     *
     * Total length similarly is calculated from the pathRef. We should not update the previousPointsRef
     * before the pathRef is set, otherwise we will have a wrong total length.
     */
    if (t > 0 && totalLength > 0) {
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = points;
      /*
       * totalLength is set from a ref and is not updated in the first tick of the animation.
       * It defaults to zero which is exactly what we want here because we want to grow from zero,
       * however the same happens when the data change.
       *
       * In that case we want to remember the previous length and continue from there, and only animate the shape.
       *
       * Therefore the totalLength > 0 check.
       *
       * The Animate is about to fire handleAnimationStart which will update the state
       * and cause a re-render and read a new proper totalLength which will be used in the next tick
       * and update the longestAnimatedLengthRef.
       */
      // eslint-disable-next-line no-param-reassign
      longestAnimatedLengthRef.current = curLength;
    }
    return /*#__PURE__*/reactExports.createElement(StaticCurve, {
      props: props,
      points: points,
      clipPathId: clipPathId,
      pathRef: pathRef,
      strokeDasharray: currentStrokeDasharray
    });
  }), /*#__PURE__*/reactExports.createElement(LabelListFromLabelProp, {
    label: props.label
  }));
}
function RenderCurve(_ref5) {
  var {
    clipPathId,
    props
  } = _ref5;
  var previousPointsRef = reactExports.useRef(null);
  var longestAnimatedLengthRef = reactExports.useRef(0);
  var pathRef = reactExports.useRef(null);
  return /*#__PURE__*/reactExports.createElement(CurveWithAnimation, {
    props: props,
    clipPathId: clipPathId,
    previousPointsRef: previousPointsRef,
    longestAnimatedLengthRef: longestAnimatedLengthRef,
    pathRef: pathRef
  });
}
var errorBarDataPointFormatter = (dataPoint, dataKey) => {
  return {
    x: dataPoint.x,
    y: dataPoint.y,
    value: dataPoint.value,
    // @ts-expect-error getValueByDataKey does not validate the output type
    errorVal: getValueByDataKey(dataPoint.payload, dataKey)
  };
};

// eslint-disable-next-line react/prefer-stateless-function
class LineWithState extends reactExports.Component {
  render() {
    var _filterProps;
    var {
      hide,
      dot,
      points,
      className,
      xAxisId,
      yAxisId,
      top,
      left,
      width,
      height,
      id,
      needClip
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx('recharts-line', className);
    var clipPathId = id;
    var {
      r = 3,
      strokeWidth = 2
    } = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
      r: 3,
      strokeWidth: 2
    };
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactExports.createElement(Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/reactExports.createElement("defs", null, /*#__PURE__*/reactExports.createElement(GraphicalItemClipPath, {
      clipPathId: clipPathId,
      xAxisId: xAxisId,
      yAxisId: yAxisId
    }), !clipDot && /*#__PURE__*/reactExports.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /*#__PURE__*/reactExports.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /*#__PURE__*/reactExports.createElement(SetErrorBarContext, {
      xAxisId: xAxisId,
      yAxisId: yAxisId,
      data: points,
      dataPointFormatter: errorBarDataPointFormatter,
      errorBarOffset: 0
    }, /*#__PURE__*/reactExports.createElement(RenderCurve, {
      props: this.props,
      clipPathId: clipPathId
    }))), /*#__PURE__*/reactExports.createElement(ActivePoints, {
      activeDot: this.props.activeDot,
      points: points,
      mainColor: this.props.stroke,
      itemDataKey: this.props.dataKey
    }));
  }
}
var defaultLineProps = {
  activeDot: true,
  animateNewValues: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: false,
  dot: true,
  fill: '#fff',
  hide: false,
  isAnimationActive: !Global.isSsr,
  label: false,
  legendType: 'line',
  stroke: '#3182bd',
  strokeWidth: 1,
  xAxisId: 0,
  yAxisId: 0
};
function LineImpl(props) {
  var _resolveDefaultProps = resolveDefaultProps(props, defaultLineProps),
    {
      activeDot,
      animateNewValues,
      animationBegin,
      animationDuration,
      animationEasing,
      connectNulls,
      dot,
      hide,
      isAnimationActive,
      label,
      legendType,
      xAxisId,
      yAxisId,
      id
    } = _resolveDefaultProps,
    everythingElse = _objectWithoutProperties$6(_resolveDefaultProps, _excluded3$2);
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var plotArea = usePlotArea();
  var layout = useChartLayout();
  var isPanorama = useIsPanorama();
  var points = useAppSelector(state => selectLinePoints(state, xAxisId, yAxisId, isPanorama, id));
  if (layout !== 'horizontal' && layout !== 'vertical' || points == null || plotArea == null) {
    // Cannot render Line in an unsupported layout
    return null;
  }
  var {
    height,
    width,
    x: left,
    y: top
  } = plotArea;
  return /*#__PURE__*/reactExports.createElement(LineWithState, _extends$5({}, everythingElse, {
    id: id,
    connectNulls: connectNulls,
    dot: dot,
    activeDot: activeDot,
    animateNewValues: animateNewValues,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    isAnimationActive: isAnimationActive,
    hide: hide,
    label: label,
    legendType: legendType,
    xAxisId: xAxisId,
    yAxisId: yAxisId,
    points: points,
    layout: layout,
    height: height,
    width: width,
    left: left,
    top: top,
    needClip: needClip
  }));
}
function computeLinePoints(_ref6) {
  var {
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataKey,
    bandSize,
    displayedData
  } = _ref6;
  return displayedData.map((entry, index) => {
    // @ts-expect-error getValueByDataKey does not validate the output type
    var value = getValueByDataKey(entry, dataKey);
    if (layout === 'horizontal') {
      var _x = getCateCoordinateOfLine({
        axis: xAxis,
        ticks: xAxisTicks,
        bandSize,
        entry,
        index
      });
      var _y = isNullish(value) ? null : yAxis.scale(value);
      return {
        x: _x,
        y: _y,
        value,
        payload: entry
      };
    }
    var x = isNullish(value) ? null : xAxis.scale(value);
    var y = getCateCoordinateOfLine({
      axis: yAxis,
      ticks: yAxisTicks,
      bandSize,
      entry,
      index
    });
    if (x == null || y == null) {
      return null;
    }
    return {
      x,
      y,
      value,
      payload: entry
    };
  }).filter(Boolean);
}
function LineFn(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultLineProps);
  var isPanorama = useIsPanorama();
  return /*#__PURE__*/reactExports.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "line"
  }, id => /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactExports.createElement(SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData$1(props)
  }), /*#__PURE__*/reactExports.createElement(SetTooltipEntrySettings, {
    fn: getTooltipEntrySettings$1,
    args: props
  }), /*#__PURE__*/reactExports.createElement(SetCartesianGraphicalItem, {
    type: "line",
    id: id,
    data: props.data,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    dataKey: props.dataKey,
    hide: props.hide,
    isPanorama: isPanorama
  }), /*#__PURE__*/reactExports.createElement(LineImpl, _extends$5({}, props, {
    id: id
  }))));
}
var Line = /*#__PURE__*/reactExports.memo(LineFn);
Line.displayName = 'Line';

var selectXAxisWithScale = (state, xAxisId, _yAxisId, isPanorama) => selectAxisWithScale(state, 'xAxis', xAxisId, isPanorama);
var selectXAxisTicks = (state, xAxisId, _yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'xAxis', xAxisId, isPanorama);
var selectYAxisWithScale = (state, _xAxisId, yAxisId, isPanorama) => selectAxisWithScale(state, 'yAxis', yAxisId, isPanorama);
var selectYAxisTicks = (state, _xAxisId, yAxisId, isPanorama) => selectTicksOfGraphicalItem(state, 'yAxis', yAxisId, isPanorama);
var selectBandSize = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
  if (isCategoricalAxis(layout, 'xAxis')) {
    return getBandSizeOfAxis(xAxis, xAxisTicks, false);
  }
  return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickAreaId = (_state, _xAxisId, _yAxisId, _isPanorama, id) => id;

/*
 * There is a race condition problem because we read some data from props and some from the state.
 * The state is updated through a dispatch and is one render behind,
 * and so we have this weird one tick render where the displayedData in one selector have the old dataKey
 * but the new dataKey in another selector.
 *
 * A proper fix is to either move everything into the state, or read the dataKey always from props
 * - but this is a smaller change.
 */
var selectSynchronisedAreaSettings = createSelector([selectUnfilteredCartesianItems, pickAreaId], (graphicalItems, id) => graphicalItems.filter(item => item.type === 'area').find(item => item.id === id));
var selectGraphicalItemStackedData = (state, xAxisId, yAxisId, isPanorama, id) => {
  var _stackGroups$stackId;
  var areaSettings = selectSynchronisedAreaSettings(state, xAxisId, yAxisId, isPanorama, id);
  if (areaSettings == null) {
    return undefined;
  }
  var layout = selectChartLayout(state);
  var isXAxisCategorical = isCategoricalAxis(layout, 'xAxis');
  var stackGroups;
  if (isXAxisCategorical) {
    stackGroups = selectStackGroups(state, 'yAxis', yAxisId, isPanorama);
  } else {
    stackGroups = selectStackGroups(state, 'xAxis', xAxisId, isPanorama);
  }
  if (stackGroups == null) {
    return undefined;
  }
  var {
    stackId
  } = areaSettings;
  var stackSeriesIdentifier = getStackSeriesIdentifier(areaSettings);
  if (stackId == null || stackSeriesIdentifier == null) {
    return undefined;
  }
  var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
  return groups === null || groups === void 0 ? void 0 : groups.find(v => v.key === stackSeriesIdentifier);
};
var selectArea = createSelector([selectChartLayout, selectXAxisWithScale, selectYAxisWithScale, selectXAxisTicks, selectYAxisTicks, selectGraphicalItemStackedData, selectChartDataWithIndexesIfNotInPanorama, selectBandSize, selectSynchronisedAreaSettings], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings) => {
  var {
    chartData,
    dataStartIndex,
    dataEndIndex
  } = _ref;
  if (areaSettings == null || layout !== 'horizontal' && layout !== 'vertical' || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) {
    return undefined;
  }
  var {
    data
  } = areaSettings;
  var displayedData;
  if (data && data.length > 0) {
    displayedData = data;
  } else {
    displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
  }
  if (displayedData == null) {
    return undefined;
  }

  // Where is this supposed to come from? No charts have that as a prop.
  var chartBaseValue = undefined;
  return computeArea({
    layout,
    xAxis,
    yAxis,
    xAxisTicks,
    yAxisTicks,
    dataStartIndex,
    areaSettings,
    stackedData,
    displayedData,
    chartBaseValue,
    bandSize
  });
});

var _excluded$5 = ["id"],
  _excluded2$2 = ["activeDot", "animationBegin", "animationDuration", "animationEasing", "connectNulls", "dot", "fill", "fillOpacity", "hide", "isAnimationActive", "legendType", "stroke", "xAxisId", "yAxisId"];
function _objectWithoutProperties$5(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$5(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$5(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys$1(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread$1(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys$1(Object(t), true).forEach(function (r) { _defineProperty$1(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty$1(e, r, t) { return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey$1(t) { var i = _toPrimitive$1(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive$1(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends$4() { return _extends$4 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$4.apply(null, arguments); }

/**
 * Internal props, combination of external props + defaultProps + private Recharts state
 */

/**
 * External props, intended for end users to fill in
 */

/**
 * Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
 */

function getLegendItemColor(stroke, fill) {
  return stroke && stroke !== 'none' ? stroke : fill;
}
var computeLegendPayloadFromAreaData = props => {
  var {
    dataKey,
    name,
    stroke,
    fill,
    legendType,
    hide
  } = props;
  return [{
    inactive: hide,
    dataKey,
    type: legendType,
    color: getLegendItemColor(stroke, fill),
    value: getTooltipNameProp(name, dataKey),
    payload: props
  }];
};
function getTooltipEntrySettings(props) {
  var {
    dataKey,
    data,
    stroke,
    strokeWidth,
    fill,
    name,
    hide,
    unit
  } = props;
  return {
    dataDefinedOnItem: data,
    positions: undefined,
    settings: {
      stroke,
      strokeWidth,
      fill,
      dataKey,
      nameKey: undefined,
      name: getTooltipNameProp(name, dataKey),
      hide,
      type: props.tooltipType,
      color: getLegendItemColor(stroke, fill),
      unit
    }
  };
}
var renderDotItem = (option, props) => {
  var dotItem;
  if (/*#__PURE__*/reactExports.isValidElement(option)) {
    dotItem = /*#__PURE__*/reactExports.cloneElement(option, props);
  } else if (typeof option === 'function') {
    dotItem = option(props);
  } else {
    var className = clsx('recharts-area-dot', typeof option !== 'boolean' ? option.className : '');
    dotItem = /*#__PURE__*/reactExports.createElement(Dot, _extends$4({}, props, {
      className: className
    }));
  }
  return dotItem;
};
function shouldRenderDots(points, dot) {
  if (points == null) {
    return false;
  }
  if (dot) {
    return true;
  }
  return points.length === 1;
}
function Dots(_ref) {
  var {
    clipPathId,
    points,
    props
  } = _ref;
  var {
    needClip,
    dot,
    dataKey
  } = props;
  if (!shouldRenderDots(points, dot)) {
    return null;
  }
  var clipDot = isClipDot(dot);
  var areaProps = svgPropertiesNoEvents(props);
  var customDotProps = filterProps(dot, true);
  var dots = points.map((entry, i) => {
    var dotProps = _objectSpread$1(_objectSpread$1(_objectSpread$1({
      key: "dot-".concat(i),
      r: 3
    }, areaProps), customDotProps), {}, {
      index: i,
      cx: entry.x,
      cy: entry.y,
      dataKey,
      value: entry.value,
      payload: entry.payload,
      points
    });
    return renderDotItem(dot, dotProps);
  });
  var dotsProps = {
    clipPath: needClip ? "url(#clipPath-".concat(clipDot ? '' : 'dots-').concat(clipPathId, ")") : undefined
  };
  return /*#__PURE__*/reactExports.createElement(Layer, _extends$4({
    className: "recharts-area-dots"
  }, dotsProps), dots);
}
function AreaLabelListProvider(_ref2) {
  var {
    showLabels,
    children,
    points
  } = _ref2;
  var labelListEntries = points.map(point => {
    var viewBox = {
      x: point.x,
      y: point.y,
      width: 0,
      height: 0
    };
    return _objectSpread$1(_objectSpread$1({}, viewBox), {}, {
      value: point.value,
      payload: point.payload,
      parentViewBox: undefined,
      viewBox,
      fill: undefined
    });
  });
  return /*#__PURE__*/reactExports.createElement(CartesianLabelListContextProvider, {
    value: showLabels ? labelListEntries : null
  }, children);
}
function StaticArea(_ref3) {
  var {
    points,
    baseLine,
    needClip,
    clipPathId,
    props
  } = _ref3;
  var {
    layout,
    type,
    stroke,
    connectNulls,
    isRange
  } = props;
  var {
      id
    } = props,
    propsWithoutId = _objectWithoutProperties$5(props, _excluded$5);
  var allOtherProps = svgPropertiesNoEvents(propsWithoutId);
  return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/reactExports.createElement(Layer, {
    clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : undefined
  }, /*#__PURE__*/reactExports.createElement(Curve, _extends$4({}, allOtherProps, {
    id: id,
    points: points,
    connectNulls: connectNulls,
    type: type,
    baseLine: baseLine,
    layout: layout,
    stroke: "none",
    className: "recharts-area-area"
  })), stroke !== 'none' && /*#__PURE__*/reactExports.createElement(Curve, _extends$4({}, allOtherProps, {
    className: "recharts-area-curve",
    layout: layout,
    type: type,
    connectNulls: connectNulls,
    fill: "none",
    points: points
  })), stroke !== 'none' && isRange && /*#__PURE__*/reactExports.createElement(Curve, _extends$4({}, allOtherProps, {
    className: "recharts-area-curve",
    layout: layout,
    type: type,
    connectNulls: connectNulls,
    fill: "none",
    points: baseLine
  }))), /*#__PURE__*/reactExports.createElement(Dots, {
    points: points,
    props: propsWithoutId,
    clipPathId: clipPathId
  }));
}
function VerticalRect(_ref4) {
  var {
    alpha,
    baseLine,
    points,
    strokeWidth
  } = _ref4;
  var startY = points[0].y;
  var endY = points[points.length - 1].y;
  if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) {
    return null;
  }
  var height = alpha * Math.abs(startY - endY);
  var maxX = Math.max(...points.map(entry => entry.x || 0));
  if (isNumber(baseLine)) {
    maxX = Math.max(baseLine, maxX);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxX = Math.max(...baseLine.map(entry => entry.x || 0), maxX);
  }
  if (isNumber(maxX)) {
    return /*#__PURE__*/reactExports.createElement("rect", {
      x: 0,
      y: startY < endY ? startY : startY - height,
      width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
      height: Math.floor(height)
    });
  }
  return null;
}
function HorizontalRect(_ref5) {
  var {
    alpha,
    baseLine,
    points,
    strokeWidth
  } = _ref5;
  var startX = points[0].x;
  var endX = points[points.length - 1].x;
  if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) {
    return null;
  }
  var width = alpha * Math.abs(startX - endX);
  var maxY = Math.max(...points.map(entry => entry.y || 0));
  if (isNumber(baseLine)) {
    maxY = Math.max(baseLine, maxY);
  } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
    maxY = Math.max(...baseLine.map(entry => entry.y || 0), maxY);
  }
  if (isNumber(maxY)) {
    return /*#__PURE__*/reactExports.createElement("rect", {
      x: startX < endX ? startX : startX - width,
      y: 0,
      width: width,
      height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
    });
  }
  return null;
}
function ClipRect(_ref6) {
  var {
    alpha,
    layout,
    points,
    baseLine,
    strokeWidth
  } = _ref6;
  if (layout === 'vertical') {
    return /*#__PURE__*/reactExports.createElement(VerticalRect, {
      alpha: alpha,
      points: points,
      baseLine: baseLine,
      strokeWidth: strokeWidth
    });
  }
  return /*#__PURE__*/reactExports.createElement(HorizontalRect, {
    alpha: alpha,
    points: points,
    baseLine: baseLine,
    strokeWidth: strokeWidth
  });
}
function AreaWithAnimation(_ref7) {
  var {
    needClip,
    clipPathId,
    props,
    previousPointsRef,
    previousBaselineRef
  } = _ref7;
  var {
    points,
    baseLine,
    isAnimationActive,
    animationBegin,
    animationDuration,
    animationEasing,
    onAnimationStart,
    onAnimationEnd
  } = props;
  var animationId = useAnimationId(props, 'recharts-area-');
  var [isAnimating, setIsAnimating] = reactExports.useState(false);
  var showLabels = !isAnimating;
  var handleAnimationEnd = reactExports.useCallback(() => {
    if (typeof onAnimationEnd === 'function') {
      onAnimationEnd();
    }
    setIsAnimating(false);
  }, [onAnimationEnd]);
  var handleAnimationStart = reactExports.useCallback(() => {
    if (typeof onAnimationStart === 'function') {
      onAnimationStart();
    }
    setIsAnimating(true);
  }, [onAnimationStart]);
  var prevPoints = previousPointsRef.current;
  var prevBaseLine = previousBaselineRef.current;
  return /*#__PURE__*/reactExports.createElement(AreaLabelListProvider, {
    showLabels: showLabels,
    points: points
  }, props.children, /*#__PURE__*/reactExports.createElement(JavascriptAnimate, {
    animationId: animationId,
    begin: animationBegin,
    duration: animationDuration,
    isActive: isAnimationActive,
    easing: animationEasing,
    onAnimationEnd: handleAnimationEnd,
    onAnimationStart: handleAnimationStart,
    key: animationId
  }, t => {
    if (prevPoints) {
      var prevPointsDiffFactor = prevPoints.length / points.length;
      var stepPoints =
      /*
       * Here it is important that at the very end of the animation, on the last frame,
       * we render the original points without any interpolation.
       * This is needed because the code above is checking for reference equality to decide if the animation should run
       * and if we create a new array instance (even if the numbers were the same)
       * then we would break animations.
       */
      t === 1 ? points : points.map((entry, index) => {
        var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
        if (prevPoints[prevPointIndex]) {
          var prev = prevPoints[prevPointIndex];
          return _objectSpread$1(_objectSpread$1({}, entry), {}, {
            x: interpolate(prev.x, entry.x, t),
            y: interpolate(prev.y, entry.y, t)
          });
        }
        return entry;
      });
      var stepBaseLine;
      if (isNumber(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, baseLine, t);
      } else if (isNullish(baseLine) || isNan(baseLine)) {
        stepBaseLine = interpolate(prevBaseLine, 0, t);
      } else {
        stepBaseLine = baseLine.map((entry, index) => {
          var prevPointIndex = Math.floor(index * prevPointsDiffFactor);
          if (Array.isArray(prevBaseLine) && prevBaseLine[prevPointIndex]) {
            var prev = prevBaseLine[prevPointIndex];
            return _objectSpread$1(_objectSpread$1({}, entry), {}, {
              x: interpolate(prev.x, entry.x, t),
              y: interpolate(prev.y, entry.y, t)
            });
          }
          return entry;
        });
      }
      if (t > 0) {
        /*
         * We need to keep the refs in the parent component because we need to remember the last shape of the animation
         * even if AreaWithAnimation is unmounted as that happens when changing props.
         *
         * And we need to update the refs here because here is where the interpolation is computed.
         * Eslint doesn't like changing function arguments, but we need it so here is an eslint-disable.
         */
        // eslint-disable-next-line no-param-reassign
        previousPointsRef.current = stepPoints;
        // eslint-disable-next-line no-param-reassign
        previousBaselineRef.current = stepBaseLine;
      }
      return /*#__PURE__*/reactExports.createElement(StaticArea, {
        points: stepPoints,
        baseLine: stepBaseLine,
        needClip: needClip,
        clipPathId: clipPathId,
        props: props
      });
    }
    if (t > 0) {
      // eslint-disable-next-line no-param-reassign
      previousPointsRef.current = points;
      // eslint-disable-next-line no-param-reassign
      previousBaselineRef.current = baseLine;
    }
    return /*#__PURE__*/reactExports.createElement(Layer, null, isAnimationActive && /*#__PURE__*/reactExports.createElement("defs", null, /*#__PURE__*/reactExports.createElement("clipPath", {
      id: "animationClipPath-".concat(clipPathId)
    }, /*#__PURE__*/reactExports.createElement(ClipRect, {
      alpha: t,
      points: points,
      baseLine: baseLine,
      layout: props.layout,
      strokeWidth: props.strokeWidth
    }))), /*#__PURE__*/reactExports.createElement(Layer, {
      clipPath: "url(#animationClipPath-".concat(clipPathId, ")")
    }, /*#__PURE__*/reactExports.createElement(StaticArea, {
      points: points,
      baseLine: baseLine,
      needClip: needClip,
      clipPathId: clipPathId,
      props: props
    })));
  }), /*#__PURE__*/reactExports.createElement(LabelListFromLabelProp, {
    label: props.label
  }));
}

/*
 * This components decides if the area should be animated or not.
 * It also holds the state of the animation.
 */
function RenderArea(_ref8) {
  var {
    needClip,
    clipPathId,
    props
  } = _ref8;
  /*
   * These two must be refs, not state!
   * Because we want to store the most recent shape of the animation in case we have to interrupt the animation;
   * that happens when user initiates another animation before the current one finishes.
   *
   * If this was a useState, then every step in the animation would trigger a re-render.
   * So, useRef it is.
   */
  var previousPointsRef = reactExports.useRef(null);
  var previousBaselineRef = reactExports.useRef();
  return /*#__PURE__*/reactExports.createElement(AreaWithAnimation, {
    needClip: needClip,
    clipPathId: clipPathId,
    props: props,
    previousPointsRef: previousPointsRef,
    previousBaselineRef: previousBaselineRef
  });
}
class AreaWithState extends reactExports.PureComponent {
  render() {
    var _filterProps;
    var {
      hide,
      dot,
      points,
      className,
      top,
      left,
      needClip,
      xAxisId,
      yAxisId,
      width,
      height,
      id,
      baseLine
    } = this.props;
    if (hide) {
      return null;
    }
    var layerClass = clsx('recharts-area', className);
    var clipPathId = id;
    var {
      r = 3,
      strokeWidth = 2
    } = (_filterProps = filterProps(dot, false)) !== null && _filterProps !== void 0 ? _filterProps : {
      r: 3,
      strokeWidth: 2
    };
    var clipDot = isClipDot(dot);
    var dotSize = r * 2 + strokeWidth;
    return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactExports.createElement(Layer, {
      className: layerClass
    }, needClip && /*#__PURE__*/reactExports.createElement("defs", null, /*#__PURE__*/reactExports.createElement(GraphicalItemClipPath, {
      clipPathId: clipPathId,
      xAxisId: xAxisId,
      yAxisId: yAxisId
    }), !clipDot && /*#__PURE__*/reactExports.createElement("clipPath", {
      id: "clipPath-dots-".concat(clipPathId)
    }, /*#__PURE__*/reactExports.createElement("rect", {
      x: left - dotSize / 2,
      y: top - dotSize / 2,
      width: width + dotSize,
      height: height + dotSize
    }))), /*#__PURE__*/reactExports.createElement(RenderArea, {
      needClip: needClip,
      clipPathId: clipPathId,
      props: this.props
    })), /*#__PURE__*/reactExports.createElement(ActivePoints, {
      points: points,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot
    }), this.props.isRange && Array.isArray(baseLine) && /*#__PURE__*/reactExports.createElement(ActivePoints, {
      points: baseLine,
      mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
      itemDataKey: this.props.dataKey,
      activeDot: this.props.activeDot
    }));
  }
}
var defaultAreaProps = {
  activeDot: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  connectNulls: false,
  dot: false,
  fill: '#3182bd',
  fillOpacity: 0.6,
  hide: false,
  isAnimationActive: !Global.isSsr,
  legendType: 'line',
  stroke: '#3182bd',
  xAxisId: 0,
  yAxisId: 0
};
function AreaImpl(props) {
  var _useAppSelector;
  var _resolveDefaultProps = resolveDefaultProps(props, defaultAreaProps),
    {
      activeDot,
      animationBegin,
      animationDuration,
      animationEasing,
      connectNulls,
      dot,
      fill,
      fillOpacity,
      hide,
      isAnimationActive,
      legendType,
      stroke,
      xAxisId,
      yAxisId
    } = _resolveDefaultProps,
    everythingElse = _objectWithoutProperties$5(_resolveDefaultProps, _excluded2$2);
  var layout = useChartLayout();
  var chartName = useChartName();
  var {
    needClip
  } = useNeedsClip(xAxisId, yAxisId);
  var isPanorama = useIsPanorama();
  var {
    points,
    isRange,
    baseLine
  } = (_useAppSelector = useAppSelector(state => selectArea(state, xAxisId, yAxisId, isPanorama, props.id))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {};
  var plotArea = usePlotArea();
  if (layout !== 'horizontal' && layout !== 'vertical' || plotArea == null) {
    // Can't render Area in an unsupported layout
    return null;
  }
  if (chartName !== 'AreaChart' && chartName !== 'ComposedChart') {
    // There is nothing stopping us from rendering Area in other charts, except for historical reasons. Do we want to allow that?
    return null;
  }
  var {
    height,
    width,
    x: left,
    y: top
  } = plotArea;
  if (!points || !points.length) {
    return null;
  }
  return /*#__PURE__*/reactExports.createElement(AreaWithState, _extends$4({}, everythingElse, {
    activeDot: activeDot,
    animationBegin: animationBegin,
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    baseLine: baseLine,
    connectNulls: connectNulls,
    dot: dot,
    fill: fill,
    fillOpacity: fillOpacity,
    height: height,
    hide: hide,
    layout: layout,
    isAnimationActive: isAnimationActive,
    isRange: isRange,
    legendType: legendType,
    needClip: needClip,
    points: points,
    stroke: stroke,
    width: width,
    left: left,
    top: top,
    xAxisId: xAxisId,
    yAxisId: yAxisId
  }));
}
var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
  // The baseValue can be defined both on the AreaChart, and on the Area.
  // The value for the item takes precedence.
  var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
  if (isNumber(baseValue)) {
    return baseValue;
  }
  var numericAxis = layout === 'horizontal' ? yAxis : xAxis;
  // @ts-expect-error d3scale .domain() returns unknown, Math.max expects number
  var domain = numericAxis.scale.domain();
  if (numericAxis.type === 'number') {
    var domainMax = Math.max(domain[0], domain[1]);
    var domainMin = Math.min(domain[0], domain[1]);
    if (baseValue === 'dataMin') {
      return domainMin;
    }
    if (baseValue === 'dataMax') {
      return domainMax;
    }
    return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
  }
  if (baseValue === 'dataMin') {
    return domain[0];
  }
  if (baseValue === 'dataMax') {
    return domain[1];
  }
  return domain[0];
};
function computeArea(_ref9) {
  var {
    areaSettings: {
      connectNulls,
      baseValue: itemBaseValue,
      dataKey
    },
    stackedData,
    layout,
    chartBaseValue,
    xAxis,
    yAxis,
    displayedData,
    dataStartIndex,
    xAxisTicks,
    yAxisTicks,
    bandSize
  } = _ref9;
  var hasStack = stackedData && stackedData.length;
  var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
  var isHorizontalLayout = layout === 'horizontal';
  var isRange = false;
  var points = displayedData.map((entry, index) => {
    var value;
    if (hasStack) {
      value = stackedData[dataStartIndex + index];
    } else {
      value = getValueByDataKey(entry, dataKey);
      if (!Array.isArray(value)) {
        value = [baseValue, value];
      } else {
        isRange = true;
      }
    }
    var isBreakPoint = value[1] == null || hasStack && !connectNulls && getValueByDataKey(entry, dataKey) == null;
    if (isHorizontalLayout) {
      return {
        x: getCateCoordinateOfLine({
          axis: xAxis,
          ticks: xAxisTicks,
          bandSize,
          entry,
          index
        }),
        y: isBreakPoint ? null : yAxis.scale(value[1]),
        value,
        payload: entry
      };
    }
    return {
      x: isBreakPoint ? null : xAxis.scale(value[1]),
      y: getCateCoordinateOfLine({
        axis: yAxis,
        ticks: yAxisTicks,
        bandSize,
        entry,
        index
      }),
      value,
      payload: entry
    };
  });
  var baseLine;
  if (hasStack || isRange) {
    baseLine = points.map(entry => {
      var x = Array.isArray(entry.value) ? entry.value[0] : null;
      if (isHorizontalLayout) {
        return {
          x: entry.x,
          y: x != null && entry.y != null ? yAxis.scale(x) : null,
          payload: entry.payload
        };
      }
      return {
        x: x != null ? xAxis.scale(x) : null,
        y: entry.y,
        payload: entry.payload
      };
    });
  } else {
    baseLine = isHorizontalLayout ? yAxis.scale(baseValue) : xAxis.scale(baseValue);
  }
  return {
    points,
    baseLine,
    isRange
  };
}
function AreaFn(outsideProps) {
  var props = resolveDefaultProps(outsideProps, defaultAreaProps);
  var isPanorama = useIsPanorama();
  // Report all props to Redux store first, before calling any hooks, to avoid circular dependencies.
  return /*#__PURE__*/reactExports.createElement(RegisterGraphicalItemId, {
    id: props.id,
    type: "area"
  }, id => /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactExports.createElement(SetLegendPayload, {
    legendPayload: computeLegendPayloadFromAreaData(props)
  }), /*#__PURE__*/reactExports.createElement(SetTooltipEntrySettings, {
    fn: getTooltipEntrySettings,
    args: props
  }), /*#__PURE__*/reactExports.createElement(SetCartesianGraphicalItem, {
    type: "area",
    id: id,
    data: props.data,
    dataKey: props.dataKey,
    xAxisId: props.xAxisId,
    yAxisId: props.yAxisId,
    zAxisId: 0,
    stackId: getNormalizedStackId(props.stackId),
    hide: props.hide,
    barSize: undefined,
    baseValue: props.baseValue,
    isPanorama: isPanorama,
    connectNulls: props.connectNulls
  }), /*#__PURE__*/reactExports.createElement(AreaImpl, _extends$4({}, props, {
    id: id
  }))));
}
var Area = /*#__PURE__*/reactExports.memo(AreaFn);
Area.displayName = 'Area';

var _excluded$4 = ["dangerouslySetInnerHTML", "ticks"],
  _excluded2$1 = ["id"],
  _excluded3$1 = ["domain"],
  _excluded4$1 = ["domain"];
function _extends$3() { return _extends$3 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$3.apply(null, arguments); }
function _objectWithoutProperties$4(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$4(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$4(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function SetXAxisSettings(settings) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(addXAxis(settings));
    return () => {
      dispatch(removeXAxis(settings));
    };
  }, [settings, dispatch]);
  return null;
}
var XAxisImpl = props => {
  var {
    xAxisId,
    className
  } = props;
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var axisType = 'xAxis';
  var scale = useAppSelector(state => selectAxisScale(state, axisType, xAxisId, isPanorama));
  var cartesianTickItems = useAppSelector(state => selectTicksOfAxis(state, axisType, xAxisId, isPanorama));
  var axisSize = useAppSelector(state => selectXAxisSize(state, xAxisId));
  var position = useAppSelector(state => selectXAxisPosition(state, xAxisId));
  /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */
  var synchronizedSettings = useAppSelector(state => selectXAxisSettingsNoDefaults(state, xAxisId));
  if (axisSize == null || position == null || synchronizedSettings == null) {
    return null;
  }
  var {
      dangerouslySetInnerHTML,
      ticks
    } = props,
    allOtherProps = _objectWithoutProperties$4(props, _excluded$4);
  var {
      id
    } = synchronizedSettings,
    restSynchronizedSettings = _objectWithoutProperties$4(synchronizedSettings, _excluded2$1);
  return /*#__PURE__*/reactExports.createElement(CartesianAxis, _extends$3({}, allOtherProps, restSynchronizedSettings, {
    scale: scale,
    x: position.x,
    y: position.y,
    width: axisSize.width,
    height: axisSize.height,
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems
  }));
};
var xAxisDefaultProps = {
  allowDataOverflow: implicitXAxis.allowDataOverflow,
  allowDecimals: implicitXAxis.allowDecimals,
  allowDuplicatedCategory: implicitXAxis.allowDuplicatedCategory,
  height: implicitXAxis.height,
  hide: false,
  mirror: implicitXAxis.mirror,
  orientation: implicitXAxis.orientation,
  padding: implicitXAxis.padding,
  reversed: implicitXAxis.reversed,
  scale: implicitXAxis.scale,
  tickCount: implicitXAxis.tickCount,
  type: implicitXAxis.type,
  xAxisId: 0
};
var XAxisSettingsDispatcher = outsideProps => {
  var _props$interval, _props$includeHidden, _props$angle, _props$minTickGap, _props$tick;
  var props = resolveDefaultProps(outsideProps, xAxisDefaultProps);
  return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactExports.createElement(SetXAxisSettings, {
    interval: (_props$interval = props.interval) !== null && _props$interval !== void 0 ? _props$interval : 'preserveEnd',
    id: props.xAxisId,
    scale: props.scale,
    type: props.type,
    padding: props.padding,
    allowDataOverflow: props.allowDataOverflow,
    domain: props.domain,
    dataKey: props.dataKey,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    includeHidden: (_props$includeHidden = props.includeHidden) !== null && _props$includeHidden !== void 0 ? _props$includeHidden : false,
    reversed: props.reversed,
    ticks: props.ticks,
    height: props.height,
    orientation: props.orientation,
    mirror: props.mirror,
    hide: props.hide,
    unit: props.unit,
    name: props.name,
    angle: (_props$angle = props.angle) !== null && _props$angle !== void 0 ? _props$angle : 0,
    minTickGap: (_props$minTickGap = props.minTickGap) !== null && _props$minTickGap !== void 0 ? _props$minTickGap : 5,
    tick: (_props$tick = props.tick) !== null && _props$tick !== void 0 ? _props$tick : true,
    tickFormatter: props.tickFormatter
  }), /*#__PURE__*/reactExports.createElement(XAxisImpl, props));
};
var XAxisMemoComparator = (prevProps, nextProps) => {
  var {
      domain: prevDomain
    } = prevProps,
    prevRest = _objectWithoutProperties$4(prevProps, _excluded3$1);
  var {
      domain: nextDomain
    } = nextProps,
    nextRest = _objectWithoutProperties$4(nextProps, _excluded4$1);
  if (!shallowEqual(prevRest, nextRest)) {
    return false;
  }
  if (Array.isArray(prevDomain) && prevDomain.length === 2 && Array.isArray(nextDomain) && nextDomain.length === 2) {
    return prevDomain[0] === nextDomain[0] && prevDomain[1] === nextDomain[1];
  }
  return shallowEqual({
    domain: prevDomain
  }, {
    domain: nextDomain
  });
};
var XAxis = /*#__PURE__*/reactExports.memo(XAxisSettingsDispatcher, XAxisMemoComparator);
XAxis.displayName = 'XAxis';

var _excluded$3 = ["dangerouslySetInnerHTML", "ticks"],
  _excluded2 = ["id"],
  _excluded3 = ["domain"],
  _excluded4 = ["domain"];
function _extends$2() { return _extends$2 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$2.apply(null, arguments); }
function _objectWithoutProperties$3(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$3(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$3(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function SetYAxisSettings(settings) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(addYAxis(settings));
    return () => {
      dispatch(removeYAxis(settings));
    };
  }, [settings, dispatch]);
  return null;
}
var YAxisImpl = props => {
  var {
    yAxisId,
    className,
    width,
    label
  } = props;
  var cartesianAxisRef = reactExports.useRef(null);
  var labelRef = reactExports.useRef(null);
  var viewBox = useAppSelector(selectAxisViewBox);
  var isPanorama = useIsPanorama();
  var dispatch = useAppDispatch();
  var axisType = 'yAxis';
  var scale = useAppSelector(state => selectAxisScale(state, axisType, yAxisId, isPanorama));
  var axisSize = useAppSelector(state => selectYAxisSize(state, yAxisId));
  var position = useAppSelector(state => selectYAxisPosition(state, yAxisId));
  var cartesianTickItems = useAppSelector(state => selectTicksOfAxis(state, axisType, yAxisId, isPanorama));
  /*
   * Here we select settings from the store and prefer to use them instead of the actual props
   * so that the chart is consistent. If we used the props directly, some components will use axis settings
   * from state and some from props and because there is a render step between these two, they might be showing different things.
   * https://github.com/recharts/recharts/issues/6257
   */
  var synchronizedSettings = useAppSelector(state => selectYAxisSettingsNoDefaults(state, yAxisId));
  reactExports.useLayoutEffect(() => {
    // No dynamic width calculation is done when width !== 'auto'
    // or when a function/react element is used for label
    if (width !== 'auto' || !axisSize || isLabelContentAFunction(label) || /*#__PURE__*/reactExports.isValidElement(label) || synchronizedSettings == null) {
      return;
    }
    var axisComponent = cartesianAxisRef.current;
    if (!axisComponent) {
      return;
    }
    var updatedYAxisWidth = axisComponent.getCalculatedWidth();

    // if the width has changed, dispatch an action to update the width
    if (Math.round(axisSize.width) !== Math.round(updatedYAxisWidth)) {
      dispatch(updateYAxisWidth({
        id: yAxisId,
        width: updatedYAxisWidth
      }));
    }
  }, [
  // The dependency on cartesianAxisRef.current is not needed because useLayoutEffect will run after every render.
  // The ref will be populated by then.
  // To re-run this effect when ticks change, we can depend on the ticks array from the store.
  cartesianTickItems, axisSize, dispatch, label, yAxisId, width, synchronizedSettings]);
  if (axisSize == null || position == null || synchronizedSettings == null) {
    return null;
  }
  var {
      dangerouslySetInnerHTML,
      ticks
    } = props,
    allOtherProps = _objectWithoutProperties$3(props, _excluded$3);
  var {
      id
    } = synchronizedSettings,
    restSynchronizedSettings = _objectWithoutProperties$3(synchronizedSettings, _excluded2);
  return /*#__PURE__*/reactExports.createElement(CartesianAxis, _extends$2({}, allOtherProps, restSynchronizedSettings, {
    ref: cartesianAxisRef,
    labelRef: labelRef,
    scale: scale,
    x: position.x,
    y: position.y,
    tickTextProps: width === 'auto' ? {
      width: undefined
    } : {
      width
    },
    width: axisSize.width,
    height: axisSize.height,
    className: clsx("recharts-".concat(axisType, " ").concat(axisType), className),
    viewBox: viewBox,
    ticks: cartesianTickItems
  }));
};
var yAxisDefaultProps = {
  allowDataOverflow: implicitYAxis.allowDataOverflow,
  allowDecimals: implicitYAxis.allowDecimals,
  allowDuplicatedCategory: implicitYAxis.allowDuplicatedCategory,
  hide: false,
  mirror: implicitYAxis.mirror,
  orientation: implicitYAxis.orientation,
  padding: implicitYAxis.padding,
  reversed: implicitYAxis.reversed,
  scale: implicitYAxis.scale,
  tickCount: implicitYAxis.tickCount,
  type: implicitYAxis.type,
  width: implicitYAxis.width,
  yAxisId: 0
};
var YAxisSettingsDispatcher = outsideProps => {
  var _props$interval, _props$includeHidden, _props$angle, _props$minTickGap, _props$tick;
  var props = resolveDefaultProps(outsideProps, yAxisDefaultProps);
  return /*#__PURE__*/reactExports.createElement(reactExports.Fragment, null, /*#__PURE__*/reactExports.createElement(SetYAxisSettings, {
    interval: (_props$interval = props.interval) !== null && _props$interval !== void 0 ? _props$interval : 'preserveEnd',
    id: props.yAxisId,
    scale: props.scale,
    type: props.type,
    domain: props.domain,
    allowDataOverflow: props.allowDataOverflow,
    dataKey: props.dataKey,
    allowDuplicatedCategory: props.allowDuplicatedCategory,
    allowDecimals: props.allowDecimals,
    tickCount: props.tickCount,
    padding: props.padding,
    includeHidden: (_props$includeHidden = props.includeHidden) !== null && _props$includeHidden !== void 0 ? _props$includeHidden : false,
    reversed: props.reversed,
    ticks: props.ticks,
    width: props.width,
    orientation: props.orientation,
    mirror: props.mirror,
    hide: props.hide,
    unit: props.unit,
    name: props.name,
    angle: (_props$angle = props.angle) !== null && _props$angle !== void 0 ? _props$angle : 0,
    minTickGap: (_props$minTickGap = props.minTickGap) !== null && _props$minTickGap !== void 0 ? _props$minTickGap : 5,
    tick: (_props$tick = props.tick) !== null && _props$tick !== void 0 ? _props$tick : true,
    tickFormatter: props.tickFormatter
  }), /*#__PURE__*/reactExports.createElement(YAxisImpl, props));
};
var YAxisMemoComparator = (prevProps, nextProps) => {
  var {
      domain: prevDomain
    } = prevProps,
    prevRest = _objectWithoutProperties$3(prevProps, _excluded3);
  var {
      domain: nextDomain
    } = nextProps,
    nextRest = _objectWithoutProperties$3(nextProps, _excluded4);
  if (!shallowEqual(prevRest, nextRest)) {
    return false;
  }
  if (Array.isArray(prevDomain) && prevDomain.length === 2 && Array.isArray(nextDomain) && nextDomain.length === 2) {
    return prevDomain[0] === nextDomain[0] && prevDomain[1] === nextDomain[1];
  }
  return shallowEqual({
    domain: prevDomain
  }, {
    domain: nextDomain
  });
};
var YAxis = /*#__PURE__*/reactExports.memo(YAxisSettingsDispatcher, YAxisMemoComparator);
YAxis.displayName = 'YAxis';

var pickChartPointer = (_state, chartPointer) => chartPointer;
var selectActivePropsFromChartPointer = createSelector([pickChartPointer, selectChartLayout, selectPolarViewBox, selectTooltipAxisType, selectTooltipAxisRangeWithReverse, selectTooltipAxisTicks, selectOrderedTooltipTicks, selectChartOffsetInternal], combineActiveProps);

/**
 * Computes the chart coordinates from the mouse event.
 *
 * The coordinates are relative to the top-left corner of the chart,
 * where the top-left corner of the chart is (0, 0).
 * Moving right, the x-coordinate increases, and moving down, the y-coordinate increases.
 *
 * The coordinates are rounded to the nearest integer and are including a CSS transform scale.
 * So a chart that's scaled will return the same coordinates as a chart that's not scaled.
 *
 * @param event The mouse event from React event handlers
 * @return chartPointer The chart coordinates relative to the top-left corner of the chart
 */
var getChartPointer = event => {
  var rect = event.currentTarget.getBoundingClientRect();
  var scaleX = rect.width / event.currentTarget.offsetWidth;
  var scaleY = rect.height / event.currentTarget.offsetHeight;
  return {
    /*
     * Here it's important to use:
     * - event.clientX and event.clientY to get the mouse position relative to the viewport, including scroll.
     * - pageX and pageY are not used because they are relative to the whole document, and ignore scroll.
     * - rect.left and rect.top are used to get the position of the chart relative to the viewport.
     * - offsetX and offsetY are not used because they are relative to the offset parent
     *  which may or may not be the same as the clientX and clientY, depending on the position of the chart in the DOM
     *  and surrounding element styles. CSS position: relative, absolute, fixed, will change the offset parent.
     * - scaleX and scaleY are necessary for when the chart element is scaled using CSS `transform: scale(N)`.
     */
    chartX: Math.round((event.clientX - rect.left) / scaleX),
    chartY: Math.round((event.clientY - rect.top) / scaleY)
  };
};

var mouseClickAction = createAction('mouseClick');
var mouseClickMiddleware = createListenerMiddleware();

// TODO: there's a bug here when you click the chart the activeIndex resets to zero
mouseClickMiddleware.startListening({
  actionCreator: mouseClickAction,
  effect: (action, listenerApi) => {
    var mousePointer = action.payload;
    var activeProps = selectActivePropsFromChartPointer(listenerApi.getState(), getChartPointer(mousePointer));
    if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
      listenerApi.dispatch(setMouseClickAxisIndex({
        activeIndex: activeProps.activeIndex,
        activeDataKey: undefined,
        activeCoordinate: activeProps.activeCoordinate
      }));
    }
  }
});
var mouseMoveAction = createAction('mouseMove');
var mouseMoveMiddleware = createListenerMiddleware();
mouseMoveMiddleware.startListening({
  actionCreator: mouseMoveAction,
  effect: (action, listenerApi) => {
    var mousePointer = action.payload;
    var state = listenerApi.getState();
    var tooltipEventType = selectTooltipEventType$1(state, state.tooltip.settings.shared);
    var activeProps = selectActivePropsFromChartPointer(state, getChartPointer(mousePointer));

    // this functionality only applies to charts that have axes
    if (tooltipEventType === 'axis') {
      if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
        listenerApi.dispatch(setMouseOverAxisIndex({
          activeIndex: activeProps.activeIndex,
          activeDataKey: undefined,
          activeCoordinate: activeProps.activeCoordinate
        }));
      } else {
        // this is needed to clear tooltip state when the mouse moves out of the inRange (svg - offset) function, but not yet out of the svg
        listenerApi.dispatch(mouseLeaveChart());
      }
    }
  }
});

/**
 * These are chart options that users can choose - which means they can also
 * choose to change them which should trigger a re-render.
 */

var initialState = {
  accessibilityLayer: true,
  barCategoryGap: '10%',
  barGap: 4,
  barSize: undefined,
  className: undefined,
  maxBarSize: undefined,
  stackOffset: 'none',
  syncId: undefined,
  syncMethod: 'index'
};
var rootPropsSlice = createSlice({
  name: 'rootProps',
  initialState,
  reducers: {
    updateOptions: (state, action) => {
      var _action$payload$barGa;
      state.accessibilityLayer = action.payload.accessibilityLayer;
      state.barCategoryGap = action.payload.barCategoryGap;
      state.barGap = (_action$payload$barGa = action.payload.barGap) !== null && _action$payload$barGa !== void 0 ? _action$payload$barGa : initialState.barGap;
      state.barSize = action.payload.barSize;
      state.maxBarSize = action.payload.maxBarSize;
      state.stackOffset = action.payload.stackOffset;
      state.syncId = action.payload.syncId;
      state.syncMethod = action.payload.syncMethod;
      state.className = action.payload.className;
    }
  }
});
var rootPropsReducer = rootPropsSlice.reducer;
var {
  updateOptions
} = rootPropsSlice.actions;

var polarOptionsSlice = createSlice({
  name: 'polarOptions',
  initialState: null,
  reducers: {
    updatePolarOptions: (_state, action) => {
      return action.payload;
    }
  }
});
var {
  updatePolarOptions
} = polarOptionsSlice.actions;
var polarOptionsReducer = polarOptionsSlice.reducer;

var keyDownAction = createAction('keyDown');
var focusAction = createAction('focus');
var keyboardEventsMiddleware = createListenerMiddleware();
keyboardEventsMiddleware.startListening({
  actionCreator: keyDownAction,
  effect: (action, listenerApi) => {
    var state = listenerApi.getState();
    var accessibilityLayerIsActive = state.rootProps.accessibilityLayer !== false;
    if (!accessibilityLayerIsActive) {
      return;
    }
    var {
      keyboardInteraction
    } = state.tooltip;
    var key = action.payload;
    if (key !== 'ArrowRight' && key !== 'ArrowLeft' && key !== 'Enter') {
      return;
    }

    // TODO this is lacking index for charts that do not support numeric indexes
    var currentIndex = Number(combineActiveTooltipIndex(keyboardInteraction, selectTooltipDisplayedData(state)));
    var tooltipTicks = selectTooltipAxisTicks(state);
    if (key === 'Enter') {
      var _coordinate = selectCoordinateForDefaultIndex(state, 'axis', 'hover', String(keyboardInteraction.index));
      listenerApi.dispatch(setKeyboardInteraction({
        active: !keyboardInteraction.active,
        activeIndex: keyboardInteraction.index,
        activeDataKey: keyboardInteraction.dataKey,
        activeCoordinate: _coordinate
      }));
      return;
    }
    var direction = selectChartDirection(state);
    var directionMultiplier = direction === 'left-to-right' ? 1 : -1;
    var movement = key === 'ArrowRight' ? 1 : -1;
    var nextIndex = currentIndex + movement * directionMultiplier;
    if (tooltipTicks == null || nextIndex >= tooltipTicks.length || nextIndex < 0) {
      return;
    }
    var coordinate = selectCoordinateForDefaultIndex(state, 'axis', 'hover', String(nextIndex));
    listenerApi.dispatch(setKeyboardInteraction({
      active: true,
      activeIndex: nextIndex.toString(),
      activeDataKey: undefined,
      activeCoordinate: coordinate
    }));
  }
});
keyboardEventsMiddleware.startListening({
  actionCreator: focusAction,
  effect: (_action, listenerApi) => {
    var state = listenerApi.getState();
    var accessibilityLayerIsActive = state.rootProps.accessibilityLayer !== false;
    if (!accessibilityLayerIsActive) {
      return;
    }
    var {
      keyboardInteraction
    } = state.tooltip;
    if (keyboardInteraction.active) {
      return;
    }
    if (keyboardInteraction.index == null) {
      var nextIndex = '0';
      var coordinate = selectCoordinateForDefaultIndex(state, 'axis', 'hover', String(nextIndex));
      listenerApi.dispatch(setKeyboardInteraction({
        activeDataKey: undefined,
        active: true,
        activeIndex: nextIndex,
        activeCoordinate: coordinate
      }));
    }
  }
});

var externalEventAction = createAction('externalEvent');
var externalEventsMiddleware = createListenerMiddleware();
externalEventsMiddleware.startListening({
  actionCreator: externalEventAction,
  effect: (action, listenerApi) => {
    if (action.payload.handler == null) {
      return;
    }
    var state = listenerApi.getState();
    var nextState = {
      activeCoordinate: selectActiveTooltipCoordinate(state),
      activeDataKey: selectActiveTooltipDataKey(state),
      activeIndex: selectActiveTooltipIndex(state),
      activeLabel: selectActiveLabel$1(state),
      activeTooltipIndex: selectActiveTooltipIndex(state),
      isTooltipActive: selectIsTooltipActive$1(state)
    };
    action.payload.handler(nextState, action.payload.reactEvent);
  }
});

var selectAllTooltipPayloadConfiguration = createSelector([selectTooltipState], tooltipState => tooltipState.tooltipItemPayloads);
var selectTooltipCoordinate = createSelector([selectAllTooltipPayloadConfiguration, selectTooltipPayloadSearcher, (_state, tooltipIndex, _dataKey) => tooltipIndex, (_state, _tooltipIndex, dataKey) => dataKey], (allTooltipConfigurations, tooltipPayloadSearcher, tooltipIndex, dataKey) => {
  var mostRelevantTooltipConfiguration = allTooltipConfigurations.find(tooltipConfiguration => {
    return tooltipConfiguration.settings.dataKey === dataKey;
  });
  if (mostRelevantTooltipConfiguration == null) {
    return undefined;
  }
  var {
    positions
  } = mostRelevantTooltipConfiguration;
  if (positions == null) {
    return undefined;
  }
  // @ts-expect-error tooltipPayloadSearcher is not typed well
  var maybePosition = tooltipPayloadSearcher(positions, tooltipIndex);
  return maybePosition;
});

var touchEventAction = createAction('touchMove');
var touchEventMiddleware = createListenerMiddleware();
touchEventMiddleware.startListening({
  actionCreator: touchEventAction,
  effect: (action, listenerApi) => {
    var touchEvent = action.payload;
    var state = listenerApi.getState();
    var tooltipEventType = selectTooltipEventType$1(state, state.tooltip.settings.shared);
    if (tooltipEventType === 'axis') {
      var activeProps = selectActivePropsFromChartPointer(state, getChartPointer({
        clientX: touchEvent.touches[0].clientX,
        clientY: touchEvent.touches[0].clientY,
        currentTarget: touchEvent.currentTarget
      }));
      if ((activeProps === null || activeProps === void 0 ? void 0 : activeProps.activeIndex) != null) {
        listenerApi.dispatch(setMouseOverAxisIndex({
          activeIndex: activeProps.activeIndex,
          activeDataKey: undefined,
          activeCoordinate: activeProps.activeCoordinate
        }));
      }
    } else if (tooltipEventType === 'item') {
      var _target$getAttribute;
      var touch = touchEvent.touches[0];
      var target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!target || !target.getAttribute) {
        return;
      }
      var itemIndex = target.getAttribute(DATA_ITEM_INDEX_ATTRIBUTE_NAME);
      var dataKey = (_target$getAttribute = target.getAttribute(DATA_ITEM_DATAKEY_ATTRIBUTE_NAME)) !== null && _target$getAttribute !== void 0 ? _target$getAttribute : undefined;
      var coordinate = selectTooltipCoordinate(listenerApi.getState(), itemIndex, dataKey);
      listenerApi.dispatch(setActiveMouseOverItemIndex({
        activeDataKey: dataKey,
        activeIndex: itemIndex,
        activeCoordinate: coordinate
      }));
    }
  }
});

var rootReducer = combineReducers({
  brush: brushReducer,
  cartesianAxis: cartesianAxisReducer,
  chartData: chartDataReducer,
  errorBars: errorBarReducer,
  graphicalItems: graphicalItemsReducer,
  layout: chartLayoutReducer,
  legend: legendReducer,
  options: optionsReducer,
  polarAxis: polarAxisReducer,
  polarOptions: polarOptionsReducer,
  referenceElements: referenceElementsReducer,
  rootProps: rootPropsReducer,
  tooltip: tooltipReducer
});
var createRechartsStore = function createRechartsStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    // redux-toolkit v1 types are unhappy with the preloadedState type. Remove the `as any` when bumping to v2
    preloadedState: preloadedState,
    // @ts-expect-error redux-toolkit v1 types are unhappy with the middleware array. Remove this comment when bumping to v2
    middleware: getDefaultMiddleware => getDefaultMiddleware({
      serializableCheck: false
    }).concat([mouseClickMiddleware.middleware, mouseMoveMiddleware.middleware, keyboardEventsMiddleware.middleware, externalEventsMiddleware.middleware, touchEventMiddleware.middleware]),
    devTools: Global.devToolsEnabled
  });
};

function RechartsStoreProvider(_ref) {
  var {
    preloadedState,
    children,
    reduxStoreName
  } = _ref;
  var isPanorama = useIsPanorama();
  /*
   * Why the ref? Redux official documentation recommends to use store as a singleton,
   * and reuse that everywhere: https://redux-toolkit.js.org/api/configureStore#basic-example
   *
   * Which is correct! Except that is considering deploying Redux in an app.
   * Recharts as a library supports multiple charts on the same page.
   * And each of these charts needs its own store independent of others!
   *
   * The alternative is to have everything in the store keyed by the chart id.
   * Which would make working with everything a little bit more painful because we need the chart id everywhere.
   */
  var storeRef = reactExports.useRef(null);

  /*
   * Panorama means that this chart is not its own chart, it's only a "preview"
   * being rendered as a child of Brush.
   * In such case, it should not have a store on its own - it should implicitly inherit
   * whatever data is in the "parent" or "root" chart.
   * Which here is represented by not having a Provider at all. All selectors will use the root store by default.
   */
  if (isPanorama) {
    return children;
  }
  if (storeRef.current == null) {
    storeRef.current = createRechartsStore(preloadedState);
  }

  // ts-expect-error React-Redux types demand that the context internal value is not null, but we have that as default.
  var nonNullContext = RechartsReduxContext;
  return /*#__PURE__*/reactExports.createElement(Provider_default, {
    context: nonNullContext,
    store: storeRef.current
  }, children);
}

/**
 * "Main" props are props that are only accepted on the main chart,
 * as opposed to the small panorama chart inside a Brush.
 */

function ReportMainChartProps(_ref) {
  var {
    layout,
    width,
    height,
    margin
  } = _ref;
  var dispatch = useAppDispatch();

  /*
   * Skip dispatching properties in panorama chart for two reasons:
   * 1. The root chart should be deciding on these properties, and
   * 2. Brush reads these properties from redux store, and so they must remain stable
   *      to avoid circular dependency and infinite re-rendering.
   */
  var isPanorama = useIsPanorama();
  /*
   * useEffect here is required to avoid the "Cannot update a component while rendering a different component" error.
   * https://github.com/facebook/react/issues/18178
   *
   * Reported in https://github.com/recharts/recharts/issues/5514
   */
  reactExports.useEffect(() => {
    if (!isPanorama) {
      dispatch(setLayout(layout));
      dispatch(setChartSize({
        width,
        height
      }));
      dispatch(setMargin(margin));
    }
  }, [dispatch, isPanorama, layout, width, height, margin]);
  return null;
}

function ReportChartProps(props) {
  var dispatch = useAppDispatch();
  reactExports.useEffect(() => {
    dispatch(updateOptions(props));
  }, [dispatch, props]);
  return null;
}

var _excluded$2 = ["children"];
function _objectWithoutProperties$2(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$2(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$2(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends$1() { return _extends$1 = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends$1.apply(null, arguments); }
var FULL_WIDTH_AND_HEIGHT = {
  width: '100%',
  height: '100%'
};
var MainChartSurface = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  var width = useChartWidth();
  var height = useChartHeight();
  var hasAccessibilityLayer = useAccessibilityLayer();
  if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
    return null;
  }
  var {
    children,
    otherAttributes,
    title,
    desc
  } = props;
  var tabIndex, role;
  if (typeof otherAttributes.tabIndex === 'number') {
    tabIndex = otherAttributes.tabIndex;
  } else {
    tabIndex = hasAccessibilityLayer ? 0 : undefined;
  }
  if (typeof otherAttributes.role === 'string') {
    role = otherAttributes.role;
  } else {
    role = hasAccessibilityLayer ? 'application' : undefined;
  }
  return /*#__PURE__*/reactExports.createElement(Surface, _extends$1({}, otherAttributes, {
    title: title,
    desc: desc,
    role: role,
    tabIndex: tabIndex,
    width: width,
    height: height,
    style: FULL_WIDTH_AND_HEIGHT,
    ref: ref
  }), children);
});
var BrushPanoramaSurface = _ref => {
  var {
    children
  } = _ref;
  var brushDimensions = useAppSelector(selectBrushDimensions);
  if (!brushDimensions) {
    return null;
  }
  var {
    width,
    height,
    y,
    x
  } = brushDimensions;
  return /*#__PURE__*/reactExports.createElement(Surface, {
    width: width,
    height: height,
    x: x,
    y: y
  }, children);
};
var RootSurface = /*#__PURE__*/reactExports.forwardRef((_ref2, ref) => {
  var {
      children
    } = _ref2,
    rest = _objectWithoutProperties$2(_ref2, _excluded$2);
  var isPanorama = useIsPanorama();
  if (isPanorama) {
    return /*#__PURE__*/reactExports.createElement(BrushPanoramaSurface, null, children);
  }
  return /*#__PURE__*/reactExports.createElement(MainChartSurface, _extends$1({
    ref: ref
  }, rest), children);
});

function useReportScale() {
  var dispatch = useAppDispatch();
  var [ref, setRef] = reactExports.useState(null);
  var scale = useAppSelector(selectContainerScale);
  reactExports.useEffect(() => {
    if (ref == null) {
      return;
    }
    var rect = ref.getBoundingClientRect();
    var newScale = rect.width / ref.offsetWidth;
    if (isWellBehavedNumber(newScale) && newScale !== scale) {
      dispatch(setScale(newScale));
    }
  }, [ref, dispatch, scale]);
  return setRef;
}

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var RechartsWrapper = /*#__PURE__*/reactExports.forwardRef((_ref, ref) => {
  var {
    children,
    className,
    height,
    onClick,
    onContextMenu,
    onDoubleClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onMouseUp,
    onTouchEnd,
    onTouchMove,
    onTouchStart,
    style,
    width
  } = _ref;
  var dispatch = useAppDispatch();
  var [tooltipPortal, setTooltipPortal] = reactExports.useState(null);
  var [legendPortal, setLegendPortal] = reactExports.useState(null);
  useSynchronisedEventsFromOtherCharts();
  var setScaleRef = useReportScale();
  var innerRef = reactExports.useCallback(node => {
    setScaleRef(node);
    if (typeof ref === 'function') {
      ref(node);
    }
    setTooltipPortal(node);
    setLegendPortal(node);
  }, [setScaleRef, ref, setTooltipPortal, setLegendPortal]);
  var myOnClick = reactExports.useCallback(e => {
    dispatch(mouseClickAction(e));
    dispatch(externalEventAction({
      handler: onClick,
      reactEvent: e
    }));
  }, [dispatch, onClick]);
  var myOnMouseEnter = reactExports.useCallback(e => {
    dispatch(mouseMoveAction(e));
    dispatch(externalEventAction({
      handler: onMouseEnter,
      reactEvent: e
    }));
  }, [dispatch, onMouseEnter]);
  var myOnMouseLeave = reactExports.useCallback(e => {
    dispatch(mouseLeaveChart());
    dispatch(externalEventAction({
      handler: onMouseLeave,
      reactEvent: e
    }));
  }, [dispatch, onMouseLeave]);
  var myOnMouseMove = reactExports.useCallback(e => {
    dispatch(mouseMoveAction(e));
    dispatch(externalEventAction({
      handler: onMouseMove,
      reactEvent: e
    }));
  }, [dispatch, onMouseMove]);
  var onFocus = reactExports.useCallback(() => {
    dispatch(focusAction());
  }, [dispatch]);
  var onKeyDown = reactExports.useCallback(e => {
    dispatch(keyDownAction(e.key));
  }, [dispatch]);
  var myOnContextMenu = reactExports.useCallback(e => {
    dispatch(externalEventAction({
      handler: onContextMenu,
      reactEvent: e
    }));
  }, [dispatch, onContextMenu]);
  var myOnDoubleClick = reactExports.useCallback(e => {
    dispatch(externalEventAction({
      handler: onDoubleClick,
      reactEvent: e
    }));
  }, [dispatch, onDoubleClick]);
  var myOnMouseDown = reactExports.useCallback(e => {
    dispatch(externalEventAction({
      handler: onMouseDown,
      reactEvent: e
    }));
  }, [dispatch, onMouseDown]);
  var myOnMouseUp = reactExports.useCallback(e => {
    dispatch(externalEventAction({
      handler: onMouseUp,
      reactEvent: e
    }));
  }, [dispatch, onMouseUp]);
  var myOnTouchStart = reactExports.useCallback(e => {
    dispatch(externalEventAction({
      handler: onTouchStart,
      reactEvent: e
    }));
  }, [dispatch, onTouchStart]);

  /*
   * onTouchMove is special because it behaves different from mouse events.
   * Mouse events have enter + leave combo that notify us when the mouse is over
   * a certain element. Touch events don't have that; touch only gives us
   * start (finger down), end (finger up) and move (finger moving).
   * So we need to figure out which element the user is touching
   * ourselves. Fortunately, there's a convenient method for that:
   * https://developer.mozilla.org/en-US/docs/Web/API/Document/elementFromPoint
   */
  var myOnTouchMove = reactExports.useCallback(e => {
    dispatch(touchEventAction(e));
    dispatch(externalEventAction({
      handler: onTouchMove,
      reactEvent: e
    }));
  }, [dispatch, onTouchMove]);
  var myOnTouchEnd = reactExports.useCallback(e => {
    dispatch(externalEventAction({
      handler: onTouchEnd,
      reactEvent: e
    }));
  }, [dispatch, onTouchEnd]);
  return /*#__PURE__*/reactExports.createElement(TooltipPortalContext.Provider, {
    value: tooltipPortal
  }, /*#__PURE__*/reactExports.createElement(LegendPortalContext.Provider, {
    value: legendPortal
  }, /*#__PURE__*/reactExports.createElement("div", {
    className: clsx('recharts-wrapper', className),
    style: _objectSpread({
      position: 'relative',
      cursor: 'default',
      width,
      height
    }, style),
    onClick: myOnClick,
    onContextMenu: myOnContextMenu,
    onDoubleClick: myOnDoubleClick,
    onFocus: onFocus,
    onKeyDown: onKeyDown,
    onMouseDown: myOnMouseDown,
    onMouseEnter: myOnMouseEnter,
    onMouseLeave: myOnMouseLeave,
    onMouseMove: myOnMouseMove,
    onMouseUp: myOnMouseUp,
    onTouchEnd: myOnTouchEnd,
    onTouchMove: myOnTouchMove,
    onTouchStart: myOnTouchStart,
    ref: innerRef
  }, children)));
});

var _excluded$1 = ["children", "className", "width", "height", "style", "compact", "title", "desc"];
function _objectWithoutProperties$1(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose$1(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose$1(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var CategoricalChart = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  var {
      children,
      className,
      width,
      height,
      style,
      compact,
      title,
      desc
    } = props,
    others = _objectWithoutProperties$1(props, _excluded$1);
  var attrs = svgPropertiesNoEvents(others);

  // The "compact" mode is used as the panorama within Brush
  if (compact) {
    return /*#__PURE__*/reactExports.createElement(RootSurface, {
      otherAttributes: attrs,
      title: title,
      desc: desc
    }, children);
  }
  return /*#__PURE__*/reactExports.createElement(RechartsWrapper, {
    className: className,
    style: style,
    width: width,
    height: height,
    onClick: props.onClick,
    onMouseLeave: props.onMouseLeave,
    onMouseEnter: props.onMouseEnter,
    onMouseMove: props.onMouseMove,
    onMouseDown: props.onMouseDown,
    onMouseUp: props.onMouseUp,
    onContextMenu: props.onContextMenu,
    onDoubleClick: props.onDoubleClick,
    onTouchStart: props.onTouchStart,
    onTouchMove: props.onTouchMove,
    onTouchEnd: props.onTouchEnd
  }, /*#__PURE__*/reactExports.createElement(RootSurface, {
    otherAttributes: attrs,
    title: title,
    desc: desc,
    ref: ref
  }, /*#__PURE__*/reactExports.createElement(ClipPathProvider, null, children)));
});

var _excluded = ["width", "height"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var defaultMargin = {
  top: 5,
  right: 5,
  bottom: 5,
  left: 5
};
var defaultProps = {
  accessibilityLayer: true,
  layout: 'horizontal',
  stackOffset: 'none',
  barCategoryGap: '10%',
  barGap: 4,
  margin: defaultMargin,
  reverseStackOrder: false,
  syncMethod: 'index'
};

/**
 * These are one-time, immutable options that decide the chart's behavior.
 * Users who wish to call CartesianChart may decide to pass these options explicitly,
 * but usually we would expect that they use one of the convenience components like BarChart, LineChart, etc.
 */

var CartesianChart = /*#__PURE__*/reactExports.forwardRef(function CartesianChart(props, ref) {
  var _categoricalChartProp;
  var rootChartProps = resolveDefaultProps(props.categoricalChartProps, defaultProps);
  var {
      width,
      height
    } = rootChartProps,
    otherCategoricalProps = _objectWithoutProperties(rootChartProps, _excluded);
  if (!isPositiveNumber(width) || !isPositiveNumber(height)) {
    return null;
  }
  var {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    categoricalChartProps
  } = props;
  var options = {
    chartName,
    defaultTooltipEventType,
    validateTooltipEventTypes,
    tooltipPayloadSearcher,
    eventEmitter: undefined
  };
  return /*#__PURE__*/reactExports.createElement(RechartsStoreProvider, {
    preloadedState: {
      options
    },
    reduxStoreName: (_categoricalChartProp = categoricalChartProps.id) !== null && _categoricalChartProp !== void 0 ? _categoricalChartProp : chartName
  }, /*#__PURE__*/reactExports.createElement(ChartDataContextProvider, {
    chartData: categoricalChartProps.data
  }), /*#__PURE__*/reactExports.createElement(ReportMainChartProps, {
    width: width,
    height: height,
    layout: rootChartProps.layout,
    margin: rootChartProps.margin
  }), /*#__PURE__*/reactExports.createElement(ReportChartProps, {
    accessibilityLayer: rootChartProps.accessibilityLayer,
    barCategoryGap: rootChartProps.barCategoryGap,
    maxBarSize: rootChartProps.maxBarSize,
    stackOffset: rootChartProps.stackOffset,
    barGap: rootChartProps.barGap,
    barSize: rootChartProps.barSize,
    syncId: rootChartProps.syncId,
    syncMethod: rootChartProps.syncMethod,
    className: rootChartProps.className
  }), /*#__PURE__*/reactExports.createElement(CategoricalChart, _extends({}, otherCategoricalProps, {
    width: width,
    height: height,
    ref: ref
  })));
});

var allowedTooltipTypes$1 = ['axis'];
var LineChart = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  return /*#__PURE__*/reactExports.createElement(CartesianChart, {
    chartName: "LineChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes$1,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref: ref
  });
});

var allowedTooltipTypes = ['axis'];
var AreaChart = /*#__PURE__*/reactExports.forwardRef((props, ref) => {
  return /*#__PURE__*/reactExports.createElement(CartesianChart, {
    chartName: "AreaChart",
    defaultTooltipEventType: "axis",
    validateTooltipEventTypes: allowedTooltipTypes,
    tooltipPayloadSearcher: arrayTooltipSearcher,
    categoricalChartProps: props,
    ref: ref
  });
});

export { AreaChart as A, CartesianGrid as C, LineChart as L, ResponsiveContainer as R, Tooltip as T, XAxis as X, YAxis as Y, Legend as a, Line as b, Area as c };
