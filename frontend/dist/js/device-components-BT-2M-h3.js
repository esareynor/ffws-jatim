import{r as s,j as a}from"./react-vendor-DaqBZZGs.js";import{m as $}from"./mapbox-vendor-bGD9Ygvt.js";const L=({tickerData:u,onStationChange:c,currentStationIndex:f,onAutoSwitchToggle:g,interval:w=5e3,stopDelay:S=5e3})=>{const[e,j]=s.useState(!1),[x,h]=s.useState(f??0),[o,b]=s.useState(!1),[v,l]=s.useState(!0),r=s.useRef(null),i=s.useRef(null),m=s.useRef(u);s.useEffect(()=>{const t=u?[...u].sort((n,d)=>n.id-d.id):[];m.current=t,t&&t.length>0&&h(n=>n>=t.length?0:n)},[u]),s.useEffect(()=>{e&&(!u||u.length===0)&&(console.log("Ticker data is empty, stopping auto switch"),A())},[u,e]);const y=s.useCallback(()=>{const t=m.current;if(!t||t.length===0){console.warn("Tick called but no ticker data available");return}l(!1),h(n=>{const d=(n+1)%t.length,p=t[d];if(console.log(`Tick: Switching from index ${n} to ${d}, station: ${p?.name}`),typeof window.mapboxAutoSwitch=="function"&&p){console.log("Auto switching to next station:",p.name);try{window.mapboxAutoSwitch(p,d),setTimeout(()=>{l(!0)},1e3)}catch(k){console.error("Error calling mapboxAutoSwitch:",k),l(!0)}}else console.warn("mapboxAutoSwitch is not available or station is undefined"),l(!0);return c&&c(p,d),d})},[c]),A=s.useCallback(()=>{console.log("Stopping auto switch immediately"),r.current&&(clearInterval(r.current),r.current=null),i.current&&(clearTimeout(i.current),i.current=null),j(!1),b(!1),l(!0),document.dispatchEvent(new CustomEvent("autoSwitchDeactivated",{detail:{active:!1}})),g&&g(!1)},[g]);s.useEffect(()=>{if(console.log("AutoSwitchToggle effect running, isPlaying:",e),r.current&&(console.log("Clearing existing interval"),clearInterval(r.current),r.current=null),e)if(i.current&&(console.log("Clearing pending stop timeout"),clearTimeout(i.current),i.current=null,b(!1)),m.current&&m.current.length>0){const t=m.current,n=t[x];if(l(!1),typeof window.mapboxAutoSwitch=="function"&&n){console.log("Initial auto switch to station:",n.name,"at index:",x);try{window.mapboxAutoSwitch(n,x),setTimeout(()=>{l(!0)},1e3)}catch(d){console.error("Error on initial switch:",d),l(!0)}}else console.warn("Cannot perform initial switch: mapboxAutoSwitch not available or no station data"),l(!0);y(),console.log(`Starting new interval with ${w}ms delay`),r.current=setInterval(()=>y(),w),document.dispatchEvent(new CustomEvent("autoSwitchActivated",{detail:{active:!0,currentIndex:x,stationCount:t.length}}))}else console.warn("Cannot start auto switch: No ticker data available"),A();else o||r.current&&(clearInterval(r.current),r.current=null,console.log("Auto switch interval cleared due to isPlaying = false"),document.dispatchEvent(new CustomEvent("autoSwitchDeactivated",{detail:{active:!1}})));return()=>{r.current&&(clearInterval(r.current),r.current=null),i.current&&(clearTimeout(i.current),i.current=null)}},[e,o,w,y,A]);const C=()=>{const t=m.current;if(!t||t.length===0){console.warn("Cannot start auto switch: No ticker data available");return}i.current&&(clearTimeout(i.current),i.current=null,b(!1)),console.log("Auto switch starting. Available stations:",t.length),t.length>0&&console.log("Station names:",t.map(n=>n.name).join(", ")),console.log("Starting with station index:",x),typeof window.mapboxAutoSwitch!="function"&&(console.warn("mapboxAutoSwitch function is not available on window object!"),console.log("Window object functions:",Object.keys(window).filter(n=>typeof window[n]=="function"))),j(!0)},T=()=>{if(o){console.log("Already pending stop, ignoring stopAutoSwitch call");return}console.log("Auto switch will stop in",S/1e3,"seconds"),b(!0),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{A()},S)},N=()=>{if(console.log("Toggle play/pause called. Current state - isPlaying:",e,"isPendingStop:",o),o){i.current&&(clearTimeout(i.current),i.current=null),b(!1),console.log("Auto switch stop cancelled, continuing");return}const t=!e;console.log("Setting isPlaying to:",t),t?C():A(),g&&g(t)};s.useEffect(()=>{if(f!==void 0&&f!==x&&(console.log("Syncing with external currentStationIndex:",f),h(f),e&&m.current&&m.current.length>0)){const t=m.current[f];t&&typeof window.mapboxAutoSwitch=="function"&&(console.log("Auto updating to new index station:",t.name),l(!1),window.mapboxAutoSwitch(t,f),setTimeout(()=>{l(!0)},1e3))}},[f]),s.useEffect(()=>{const t=p=>{if(e&&!o){console.log("User interaction detected, starting stop delay:",p.detail),T();const k=document.querySelector('[aria-label="Buka Filter"]');k&&(k.style.backgroundColor="white")}};document.addEventListener("userInteraction",t);const n=p=>{console.log("Auto switch event received:",p.type,p.detail)},d=p=>{console.log("Received mapboxReadyForAutoSwitch event:",p.detail),e&&!r.current&&m.current?.length>0&&(console.log("Restarting tick interval after mapbox confirmation"),r.current&&(clearInterval(r.current),r.current=null),l(!1),y(),r.current=setInterval(()=>y(),w))};return document.addEventListener("autoSwitchActivated",n),document.addEventListener("autoSwitchDeactivated",n),document.addEventListener("mapboxReadyForAutoSwitch",d),()=>{document.removeEventListener("userInteraction",t),document.removeEventListener("autoSwitchActivated",n),document.removeEventListener("autoSwitchDeactivated",n),document.removeEventListener("mapboxReadyForAutoSwitch",d)}},[e,o,w,y]);const E=u&&u.length>0;return a.jsxs("div",{className:"flex flex-col sm:flex-row items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm border border-gray-200",children:[a.jsxs("div",{className:"flex items-center gap-3 mb-2 sm:mb-0",children:[a.jsx("span",{className:"text-sm font-semibold text-gray-800",children:"Auto Switch"}),a.jsxs("div",{className:"flex items-center gap-2",children:[e&&!o&&a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsx("div",{className:`w-2.5 h-2.5 rounded-full ${v?"bg-green-500 animate-pulse":"bg-yellow-500 animate-ping"}`}),a.jsx("span",{className:`text-xs font-medium ${v?"text-green-600":"text-yellow-600"}`,children:v?"At Marker":"Moving..."})]}),o&&a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsx("div",{className:"w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping"}),a.jsx("span",{className:"text-xs font-medium text-yellow-600",children:"Stopping..."})]}),!e&&!o&&a.jsxs("div",{className:"flex items-center gap-1",children:[a.jsx("div",{className:"w-2.5 h-2.5 bg-gray-400 rounded-full"}),a.jsx("span",{className:"text-xs font-medium text-gray-500",children:"Inactive"})]})]})]}),a.jsx("button",{onClick:N,disabled:!E,className:`relative inline-flex items-center h-7 rounded-full transition-all duration-200 ease-in-out focus:outline-none select-none ${E?"cursor-pointer hover:opacity-90":"opacity-50 cursor-not-allowed"}`,title:o?"Cancel stop":e?"Stop Auto Switch":"Start Auto Switch","aria-label":o?"Cancel auto switch stop":e?"Stop auto switch":"Start auto switch",children:a.jsx("div",{className:`relative w-12 h-7 rounded-full transition-all duration-200 ease-in-out ${o?"bg-yellow-400":e?"bg-green-500":"bg-gray-300"}`,children:a.jsxs("div",{className:`absolute top-0.5 left-0.5 w-6 h-6 rounded-full transition-all duration-200 ease-in-out ${e||o?"translate-x-5":"translate-x-0"} ${o?"animate-pulse":""}`,children:[a.jsx("div",{className:"absolute inset-0 rounded-full bg-gradient-to-b from-white via-gray-50 to-gray-100 shadow-md border border-gray-200"}),a.jsx("div",{className:"absolute inset-0 rounded-full bg-gradient-to-b from-white/90 to-transparent"})]})})})]})},M=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"})),P=({map:u,station:c,isVisible:f,coordinates:g,onShowDetail:w,onClose:S})=>{const e=s.useRef(null);return s.useEffect(()=>{if(!u||!f||!c||!g){e.current&&(e.current.remove(),e.current=null);return}e.current&&e.current.remove();const j=l=>{switch(l){case"safe":return"bg-green-500";case"warning":return"bg-yellow-500";case"alert":return"bg-red-500";default:return"bg-gray-500"}},x=l=>{switch(l){case"safe":return"Aman";case"warning":return"Waspada";case"alert":return"Bahaya";default:return"Tidak Diketahui"}},h=document.createElement("div");h.className="map-tooltip-content",h.innerHTML=`
      <div class="tooltip-header">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full ${j(c.status)} mr-2"></div>
          <h3 class="font-bold text-gray-900">${c.name.replace("Stasiun ","")}</h3>
        </div>
        <button class="tooltip-close-btn">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="tooltip-level">
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">Level Air:</span>
          <div class="text-right">
            <span class="font-semibold text-lg block">${c.value}</span>
            <span class="text-xs text-gray-500">${c.unit}</span>
          </div>
        </div>
        <div class="text-xs text-gray-500 mt-1">
          Status: ${x(c.status)}
        </div>
      </div>
      
      <div class="tooltip-info">
        <div class="text-xs text-gray-500 mb-1">ID: ${c.id}</div>
        <div class="text-xs text-gray-500 truncate">${c.location}</div>
      </div>
      
      <button class="tooltip-detail-btn">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Lihat Detail
      </button>
    `;const o=document.createElement("style");o.textContent=`
      .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      .map-tooltip-content {
        padding: 12px;
        width: 240px;
      }
      
      .tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .tooltip-header h3 {
        font-size: 14px;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 160px;
      }
      
      .tooltip-close-btn {
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        color: #9CA3AF;
        cursor: pointer;
        padding: 0;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: auto;
        height: auto;
        font-weight: bold;
      }
      
      .tooltip-close-btn svg {
        stroke-width: 3;
        font-weight: bold;
      }
      
      .tooltip-close-btn:hover {
        color: #4B5563;
        background: none !important;
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
      }
      
      .tooltip-close-btn:focus {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
      }
      
      .tooltip-level {
        margin-bottom: 10px;
      }
      
      .tooltip-info {
        margin-bottom: 12px;
        padding-bottom: 10px;
      }
      
      .tooltip-detail-btn {
        width: 100%;
        background-color: #3B82F6;
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .tooltip-detail-btn:hover {
        background-color: #2563EB;
      }
    `,document.head.appendChild(o),e.current=new $.Popup({closeButton:!1,closeOnClick:!1,offset:[0,-30]}).setLngLat(g).setDOMContent(h).addTo(u);const b=h.querySelector(".tooltip-detail-btn");b&&b.addEventListener("click",()=>{w(c)});const v=h.querySelector(".tooltip-close-btn");return v&&v.addEventListener("click",()=>{S()}),()=>{e.current&&(e.current.remove(),e.current=null)}},[u,f,c,g,w,S]),null},B=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));export{L as A,M as a,B as m};
