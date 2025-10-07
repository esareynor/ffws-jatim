import { j as jsxRuntimeExports, c as ReactDOM, d as React } from './react-vendor-CILUtiK9.js';
import { A as AppProvider } from './contexts-CRJrMtRL.js';
import { L as Layout } from './layout-components-DJ5s5Jbu.js';
import './mapbox-vendor-C_nsdMnr.js';
import './vendor-HC16imTC.js';
import './services-BvR663xD.js';
import './common-components-BNIdnCuC.js';
import './device-components-CA_EA_AT.js';
import './charts-vendor-Tn6b3eh3.js';

true              &&(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
}());

function App() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, {}) });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
