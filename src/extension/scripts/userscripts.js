"use strict";

// src/userscripts/home/index.ts
function setupHomeScript() {
  $("#Main .tab").addClass("effect-btn");
  $("#Main .topic_buttons a.tb").addClass("effect-btn");
  $("#Main .topic-link, .item_hot_topic_title > a, .item_node").prop("target", "_blank");
}

// src/userscripts/style.ts
var style = `body{--v2p-color-main-100: #f1f5f9;--v2p-color-main-200: #e2e8f0;--v2p-color-main-300: #cbd5e1;--v2p-color-main-400: #94a3b8;--v2p-color-main-500: #64748b;--v2p-color-main-600: #475569;--v2p-color-main-700: #334155;--v2p-color-main-800: #1e293b;--v2p-color-accent-50: #ecfdf5;--v2p-color-accent-100: #d1fae5;--v2p-color-accent-200: #a7f3d0;--v2p-color-accent-300: #6ee7b7;--v2p-color-accent-400: #34d399;--v2p-color-accent-500: #10b981;--v2p-color-accent-600: #059669;--v2p-color-border: rgb(238 238 238);--v2p-color-wrapper-bg: rgb(249 250 252);--v2p-color-content-bg: #fff;--v2p-color-heart: #f43f5e;--v2p-color-heart-fill: #ffe4e6;--v2p-box-shadow: 0 2px 2px var(--v2p-color-main-200);--v2p-font-noto-sans: -apple-system, BlinkMacSystemFont, "Noto Sans SC", sans-serif;--color-fade: var(--v2p-color-main-400);--color-gray: var(--v2p-color-main-400);--link-color: var(--v2p-color-main-800);--link-caution-color: #f59e0b;--box-border-color: var(--v2p-color-main-100);--box-foreground-color: var(--v2p-color-main-800);--box-background-color: var(--v2p-color-content-bg);--box-background-alt-color: var(--v2p-color-main-100);--box-background-hover-color: var(--v2p-color-main-200);--button-background-color: var(--v2p-color-main-200);--button-foreground-color: var(--v2p-color-main-500);--button-border-color: var(--v2p-color-main-300);color:var(--v2p-color-main-800);font-family:var(--v2p-font-noto-sans);background-color:var(--v2p-color-wrapper-bg)}body:has(.Night){--v2p-color-main-100: #222;--v2p-color-main-200: #393939;--v2p-color-main-300: #4c4c4c;--v2p-color-main-400: #6a6a6a;--v2p-color-main-500: #999;--v2p-color-main-600: #cbcbcb;--v2p-color-main-700: #e0e0e0;--v2p-color-main-800: #f1f1f1;--v2p-color-accent-50: #ecfdf5;--v2p-color-accent-100: #d1fae5;--v2p-color-accent-200: #a7f3d0;--v2p-color-accent-300: #6ee7b7;--v2p-color-accent-400: #34d399;--v2p-color-accent-500: #10b981;--v2p-color-accent-600: #059669;--v2p-color-border: rgb(238 238 238);--v2p-color-wrapper-bg: #181818;--v2p-color-content-bg: #222}body{overflow:overlay;scrollbar-gutter:stable}body #Top{height:55px;background-color:var(--v2p-color-content-bg);border:none}body #Bottom{border:none}body #Wrapper{background-color:inherit;background-image:none}body #Wrapper.Night{background-color:inherit;background-image:none}body #Wrapper .content{display:flex;gap:15px}body #Leftbar{order:1;float:none}body #Main{flex:1;order:2;margin:0}body #Rightbar{order:3;float:none}body h1{text-shadow:2px 2px var(--v2p-color-content-bg)}body .box{overflow:hidden;background-color:var(--v2p-color-content-bg);border:none;border-radius:8px;box-shadow:none}body .box .header .gray{color:var(--v2p-color-main-400)}body .button.normal,body .button.super{position:relative;display:inline-flex;gap:5px;align-items:center;height:28px;padding:0 12px;color:var(--v2p-color-main-500);font-weight:500;font-size:14px;font-family:inherit;line-height:28px;background:none;background-color:var(--v2p-color-main-100);border:none;border-radius:6px;outline:none;box-shadow:0 1.8px 0 var(--v2p-color-main-200),0 1.8px 0 var(--v2p-color-main-100);cursor:pointer;user-select:none}body .button.normal:hover:enabled,body .button.super:hover:enabled{color:var(--v2p-color-main-500);font-weight:500;text-shadow:none;background-color:var(--v2p-color-main-100);border:none;box-shadow:0 1.8px 0 var(--v2p-color-main-200),0 1.8px 0 var(--v2p-color-main-100)}body .button.normal.hover_now,body .button.normal.disable_now,body .button.super.hover_now,body .button.super.disable_now{color:var(--v2p-color-main-500) !important;text-shadow:none !important;background-color:var(--v2p-color-main-100) !important}body .button.normal.disable_now,body .button.super.disable_now{cursor:default;opacity:.5;pointer-events:none}body .button.normal kbd,body .button.super kbd{position:relative;right:-4px;padding:0 3px;font-size:90%;line-height:initial;border:1px solid var(--v2p-color-main-200);border-radius:4px}body .button.special{color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-100);box-shadow:0 1.8px 0 var(--v2p-color-accent-200),0 1.8px 0 var(--v2p-color-accent-100)}body .button.special:hover:enabled{color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-100);box-shadow:0 1.8px 0 var(--v2p-color-accent-200),0 1.8px 0 var(--v2p-color-accent-100)}body .button.v2p-prev-btn,body .button.v2p-next-btn{padding:0 15px}body a.node:link{padding:5px 6px;color:var(--v2p-color-main-400);font-size:13px;background-color:var(--v2p-color-main-100);border-radius:4px}body .outdated{font-size:12px;border-color:var(--v2p-color-main-200);border-bottom:none}body .page_normal:link,body .page_normal:visited,body .page_current:link,body .page_current:visited{border:none}body .page_normal:link,body .page_normal:visited{background-color:var(--v2p-color-content-bg);box-shadow:0 2px 2px var(--v2p-color-main-200)}body .page_current:link,body .page_current:visited{font-weight:500;background-color:var(--v2p-color-main-200);box-shadow:none}body .page_input{display:none}body .dock_area{background-image:none}::selection{color:currentcolor;background-color:var(--v2p-color-main-200)}img::selection{background-color:var(--v2p-color-main-400)}#reply-box.reply-box-sticky{bottom:20px;z-index:10;overflow:hidden;border:none;border-radius:10px;box-shadow:0 0 15px 5px var(--v2p-color-main-200)}#reply-box #reply_content{border-color:var(--v2p-color-main-300);border-radius:6px}#reply-box #reply_content+.flex-one-row{gap:10px;justify-content:flex-start}#reply-box #reply_content+.flex-one-row .gray{margin-left:auto}#Main #reply-box>.cell.flex-one-row,#Main #reply-box>.cell.flex-row-end{padding:12px 10px;font-size:12px}#Main #reply-box .flex-one-row{padding:0;font-size:12px}#search-container{height:30px;margin:0 30px;background-color:var(--v2p-color-main-100);border:none;border-radius:6px}#search-container::before{top:0;left:4px;background-size:14px 14px;opacity:.6;filter:none}#search-container.active{background-color:var(--v2p-color-main-100)}#search-container #search-result{top:42px;box-shadow:0 0 15px 5px var(--v2p-color-main-200)}#no-comments-yet{color:var(--v2p-color-main-400);border-color:var(--v2p-color-main-400)}.box .tag{color:var(--v2p-color-main-400);font-size:12px;background-color:var(--v2p-color-main-100);border-radius:5px}.box .tag::before{color:var(--v2p-color-main-500)}.box .tag>li{opacity:.6}#Top .content{height:100%}#Top .site-nav{height:100%;padding:0}#Top .tools{display:flex;gap:8px 15px;align-items:center;justify-content:flex-end;font-weight:400;font-size:14px}#Top .tools .top{margin-left:0;padding:3px 5px;color:var(--v2p-color-main-400);border-radius:4px}#Top .tools .top:hover{color:var(--v2p-color-main-800)}#Top .tools .top:not(.effect-btn):hover{background-color:var(--v2p-color-main-100)}#Top .tools .top.effect-btn{transition:color .3s}#Main>.box{padding:0 12px}#Main>.box .cell{padding:20px 10px}#Main .topic_content{font-size:16px}#Main .subtle{background-color:var(--v2p-color-accent-50);border-left:3px solid var(--v2p-color-accent-200)}#Main .vote:link{color:var(--v2p-color-main-500);border-color:var(--v2p-color-main-300);border-radius:5px}#Main .vote:link:hover{box-shadow:0 2px 2px var(--v2p-color-main-200)}#Main .cell_tab_current{border-color:var(--v2p-color-main-800)}#Main .cell .topic-link{color:var(--v2p-color-main-800);text-decoration:none}#Main .cell .topic-link:visited{color:var(--v2p-color-main-400)}#Main .cell .topic_info{position:relative}#Main .cell .topic_info::after{position:absolute;top:0;right:0;bottom:-6px;left:0;z-index:1;background-color:var(--v2p-color-content-bg);content:""}#Main .cell .topic_info .votes,#Main .cell .topic_info .node,#Main .cell .topic_info strong:first-of-type,#Main .cell .topic_info span:first-of-type{position:relative;z-index:99}#Main .cell .topic_info a[href^="/member"]{color:var(--v2p-color-main-500);font-weight:500}#Main .cell:hover .count_livid{opacity:1}#Main .cell .count_livid{display:inline-block;padding:5px 10px;color:var(--v2p-color-main-400);font-weight:400;font-size:12px;white-space:nowrap;background-color:var(--v2p-color-main-200);border-radius:5px;opacity:.8}#Main .cell .item_title{font-weight:600;opacity:.8}#Main .cell .item_title:hover{opacity:1}#Main .cell.item tr>td:nth-child(2){width:30px}#Main #Tabs{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center}#Main #Tabs .tab{margin:0}#Main #SecondaryTabs{padding:10px;background-color:var(--v2p-color-main-100);border-radius:5px}#Main .cell[id^=r]:hover>table td:last-of-type .fr a{opacity:1}#Main .cell[id^=r]>table:first-of-type td:first-of-type{width:40px}#Main .cell[id^=r]>table:first-of-type td:first-of-type .avatar{width:40px !important;border-radius:5px}#Main .cell[id^=r]>table~.cell{padding:20px 0 0 15px;border:none}#Main .cell[id^=r]>table~.cell .cell{padding:20px 0 0;border:none}#Main .cell[id^=r]>table~.cell tr td:first-of-type{width:25px}#Main .cell[id^=r]>table~.cell tr td:first-of-type .avatar{width:25px !important;border-radius:4px}#Main .cell[id^=r]>table~.cell tr td:nth-child(3) strong a{font-size:13px;opacity:.75}#Main .cell[id^=r]>table~.cell .reply_content{font-size:14px}#Main .cell[id^=r]>table td:nth-of-type(2){width:15px}#Main .cell[id^=r]>table td:last-of-type a.dark{color:var(--v2p-color-main-600);text-decoration:none}#Main .cell[id^=r]>table td:last-of-type .fr{position:relative;top:-3px;user-select:none}#Main .cell[id^=r]>table td:last-of-type .fr a{opacity:0}#Main .cell[id^=r]>table td:last-of-type .fr+.sep3{height:0}#Main .cell[id^=r]:last-of-type{border:none}#Main .cell[id^=r] .no{position:relative;top:-4px;padding:5px 10px;color:var(--v2p-color-main-300);font-size:12px;background-color:rgba(0,0,0,0);border-radius:5px;user-select:none}#Main .cell[id^=r] .badge{padding:2px 5px;font-weight:600;border:1px solid var(--v2p-color-accent-400);user-select:none}#Main .cell[id^=r] .badge:first-child{border-top-left-radius:4px;border-bottom-left-radius:4px}#Main .cell[id^=r] .badge:last-child{border-top-right-radius:4px;border-bottom-right-radius:4px}#Main .cell[id^=r] .badge.op{color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-50)}#Main .cell[id^=r] .badge.mod{color:var(--v2p-color-content-bg);background-color:var(--v2p-color-accent-400)}#Main .topic_content a[href^=http],#Main .reply_content a[href^=http]{color:var(--v2p-color-main-500);text-decoration:none;background-color:var(--v2p-color-main-100)}#Main .topic_content a[href^=http]:hover,#Main .reply_content a[href^=http]:hover{color:var(--v2p-color-accent-500);background-color:var(--v2p-color-accent-50)}#Main .reply_content{font-size:15px}#Main .reply_content a[href^=http]{font-size:12px}#Main .reply_content a[href^="/member"]{color:var(--v2p-color-main-400);font-size:13px;text-decoration:underline;background-color:var(--v2p-color-main-100)}#Main .thank_area{font-size:12px}#Main .tab{background-color:rgba(0,0,0,0)}#Main .tab:not(.effect-btn):hover{background-color:var(--v2p-color-main-100)}#Main .tab_current{background-color:var(--v2p-color-main-700)}.topic_buttons{display:flex;flex-direction:row-reverse;align-items:center;padding:8px 0;column-gap:5px;background:none}.topic_buttons .topic_stats{margin-left:auto;padding:0 !important;font-size:12px;text-shadow:none}.topic_buttons a.tb:link{display:flex;flex-direction:row-reverse;align-items:center;padding:5px;column-gap:5px;background:none;border-radius:4px}.topic_buttons .tb:hover:not(.effect-btn){background:var(--v2p-color-main-100);filter:none}.topic_buttons .tb:nth-child(1)::after{content:"\u{1F64F}"}.topic_buttons .tb:nth-child(2)::after{content:"\u2B50"}.topic_buttons .tb:nth-child(3)::after{content:"\u{1F426}"}.topic_buttons .tb:nth-child(4)::after{content:"\u{1F648}"}#Rightbar .box{opacity:.5;transition:opacity .25s}#Rightbar .box:hover{opacity:1}#Rightbar .balance_area{display:flex;align-items:center}#Bottom .inner .small.fade{display:none}#Bottom a.dark:link{color:var(--v2p-color-main-600)}body.modal-open{overflow:hidden}.effect-btn{position:relative;z-index:1;margin:0;background:none;background-color:rgba(0,0,0,0);cursor:pointer;user-select:none}.effect-btn::before{position:absolute;top:0;right:-5px;bottom:0;left:-5px;z-index:-1;background-color:var(--v2p-color-main-100);border-radius:5px;transform:scale(0.6);opacity:0;transition:background-color .3s,transform .3s,opacity .3s;content:""}.effect-btn:hover::before{transform:scale(1);opacity:1}.v2p-icon-heart{display:inline-flex;width:16px;height:16px;color:var(--v2p-color-heart)}.v2p-icon-heart svg{fill:var(--v2p-color-heart-fill)}#Main>.box>.cell>.gray:has(.v2p-popular-btn){display:inline-flex;align-items:center}.v2p-popular-btn{display:inline-flex;align-items:center;justify-content:center;padding:5px 0;transition:color .3s}.v2p-popular-btn:hover{color:var(--v2p-color-heart);opacity:.85}.v2p-popular-btn:hover::before{background-color:var(--v2p-color-heart-fill)}.v2p-popular-btn .v2p-icon-heart{margin-right:5px;color:currentcolor}.v2p-popular-btn .v2p-icon-heart svg{fill:none}.v2p-dot{margin:0 8px;font-weight:800;font-size:20px;font-size:15px}.v2p-paging{background:none !important}.v2p-cm-mask{position:fixed;z-index:999;padding:60px;overflow:hidden;overflow-y:auto;background-color:rgba(0,0,0,.25);inset:0}.v2p-cm-content.box{position:relative;box-sizing:border-box;width:800px;height:100%;margin:0 auto;padding:0 20px;overflow-x:hidden;overflow-y:auto}.v2p-cm-content.box .v2p-controls>a:has(.v2p-ac-reply){cursor:not-allowed;pointer-events:none}.v2p-cm-content.box .no{pointer-events:none}.v2p-cm-bar{position:sticky;top:0;right:0;left:0;z-index:10;display:flex;align-items:center;padding:15px 0 20px;background-color:var(--v2p-color-content-bg)}.v2p-cm-close-btn{margin-left:auto}.heart-box{position:relative;top:3px;display:inline-flex;align-items:center;column-gap:5px}@supports not selector(:has(*)){#Main .cell[id^=r]>table:hover .v2p-controls{opacity:1}}@supports selector(:has(*)){#Main .cell[id^=r]:not(:has(.cell:hover))>table:hover .v2p-controls{opacity:1}}.v2p-controls{display:inline-flex;align-items:center;margin-right:15px;font-size:12px;column-gap:15px;opacity:0}.v2p-controls>a{text-decoration:none;opacity:1}.v2p-control{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;padding:4px 0;color:var(--v2p-color-main-400)}.topic_buttons .v2p-tb.effect-btn{color:var(--v2p-color-main-400);transition:color .3s}.topic_buttons .v2p-tb.effect-btn:hover{color:currentcolor}.topic_buttons .v2p-tb.effect-btn::after{display:none}.v2p-tb-icon{width:15px;height:15px}#v2p-tooltip{position:absolute;top:0;left:0;z-index:999;width:max-content;padding:12px;color:var(--v2p-color-main-600);font-weight:bold;font-size:14px;background:var(--v2p-color-content-bg);border-radius:5px;box-shadow:var(--v2p-box-shadow);visibility:hidden}#v2p-tooltip-arrow{position:absolute;width:8px;height:8px;background:inherit;transform:rotate(45deg)}.v2p-emoticons{display:grid;grid-template-columns:repeat(6, 1fr);gap:8px}
`;
function addGlobalStyle() {
  $(`<style type='text/css'>${style}</style>`).appendTo("head");
}

// src/userscripts/globals.ts
var loginName = $('#Top .tools > a[href^="/member"]').text();
var $topicContentBox = $("#Main .box:has(.topic_content)");
var $commentBox = $('#Main .box:has(.cell[id^="r_"])');
var $commentCells = $commentBox.find('.cell[id^="r_"]');
var $commentTableRows = $commentCells.find("> table > tbody > tr");
var commentData = $commentTableRows.map((idx, tr) => {
  const id = $commentCells[idx].id;
  const td = $(tr).find("> td:nth-child(3)");
  const member = td.find("> strong > a");
  const memberName = member.text();
  const memberLink = member.prop("href");
  const content = td.find("> .reply_content").text();
  const likes = Number(td.find("span.small").text());
  const floor = td.find("span.no").text();
  const matchArr = Array.from(content.matchAll(/@(\S+)\s/g));
  const refNames = matchArr.length > 0 ? matchArr.map(([, name]) => {
    return name;
  }) : void 0;
  return { id, memberName, memberLink, content, likes, floor, index: idx, refNames };
}).get();
function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i;
  const windowsPlatforms = /(win32|win64|windows|wince)/i;
  const iosPlatforms = /(iphone|ipad|ipod)/i;
  let os = null;
  if (macosPlatforms.test(userAgent)) {
    os = "macos";
  } else if (iosPlatforms.test(userAgent)) {
    os = "ios";
  } else if (windowsPlatforms.test(userAgent)) {
    os = "windows";
  } else if (userAgent.includes("android")) {
    os = "android";
  } else if (userAgent.includes("linux")) {
    os = "linux";
  }
  return os;
}

// node_modules/.pnpm/@floating-ui+core@1.2.1/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getLengthFromAxis(axis) {
  return axis === "y" ? "height" : "width";
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "x" : "y";
}
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const side = getSide(placement);
  const isVertical = mainAxis === "x";
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
var computePosition = async (reference, floating, config) => {
  const {
    placement = "bottom",
    strategy = "absolute",
    middleware = [],
    platform: platform2
  } = config;
  const validMiddleware = middleware.filter(Boolean);
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
  if (false) {
    if (platform2 == null) {
      console.error(["Floating UI: `platform` property was not passed to config. If you", "want to use Floating UI on the web, install @floating-ui/dom", "instead of the /core package. Otherwise, you can create your own", "`platform`: https://floating-ui.com/docs/platform"].join(" "));
    }
    if (validMiddleware.filter((_ref) => {
      let {
        name
      } = _ref;
      return name === "autoPlacement" || name === "flip";
    }).length > 1) {
      throw new Error(["Floating UI: duplicate `flip` and/or `autoPlacement` middleware", "detected. This will lead to an infinite loop. Ensure only one of", "either has been passed to the `middleware` array."].join(" "));
    }
    if (!reference || !floating) {
      console.error(["Floating UI: The reference and/or floating element was not defined", "when `computePosition()` was called. Ensure that both elements have", "been created and can be measured."].join(" "));
    }
  }
  let rects = await platform2.getElementRects({
    reference,
    floating,
    strategy
  });
  let {
    x,
    y
  } = computeCoordsFromPlacement(rects, placement, rtl);
  let statefulPlacement = placement;
  let middlewareData = {};
  let resetCount = 0;
  for (let i = 0; i < validMiddleware.length; i++) {
    const {
      name,
      fn
    } = validMiddleware[i];
    const {
      x: nextX,
      y: nextY,
      data,
      reset
    } = await fn({
      x,
      y,
      initialPlacement: placement,
      placement: statefulPlacement,
      strategy,
      middlewareData,
      rects,
      platform: platform2,
      elements: {
        reference,
        floating
      }
    });
    x = nextX != null ? nextX : x;
    y = nextY != null ? nextY : y;
    middlewareData = {
      ...middlewareData,
      [name]: {
        ...middlewareData[name],
        ...data
      }
    };
    if (false) {
      if (resetCount > 50) {
        console.warn(["Floating UI: The middleware lifecycle appears to be running in an", "infinite loop. This is usually caused by a `reset` continually", "being returned without a break condition."].join(" "));
      }
    }
    if (reset && resetCount <= 50) {
      resetCount++;
      if (typeof reset === "object") {
        if (reset.placement) {
          statefulPlacement = reset.placement;
        }
        if (reset.rects) {
          rects = reset.rects === true ? await platform2.getElementRects({
            reference,
            floating,
            strategy
          }) : reset.rects;
        }
        ({
          x,
          y
        } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
      }
      i = -1;
      continue;
    }
  }
  return {
    x,
    y,
    placement: statefulPlacement,
    strategy,
    middlewareData
  };
};
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getSideObjectFromPadding(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  return {
    ...rect,
    top: rect.y,
    left: rect.x,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  };
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x,
    y,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = options;
  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    ...rects.floating,
    x,
    y
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    rect,
    offsetParent,
    strategy
  }) : rect);
  if (false)
    ;
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
var min = Math.min;
var max = Math.max;
function within(min$1, value, max$1) {
  return max(min$1, min(value, max$1));
}
var oppositeSideMap = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  let mainAlignmentSide = mainAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide)
  };
}
var oppositeAlignmentMap = {
  start: "end",
  end: "start"
};
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl)
        return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
var flip = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "flip",
    options,
    async fn(state) {
      var _middlewareData$flip;
      const {
        placement,
        middlewareData,
        rects,
        initialPlacement,
        platform: platform2,
        elements
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = true,
        fallbackPlacements: specifiedFallbackPlacements,
        fallbackStrategy = "bestFit",
        fallbackAxisSideDirection = "none",
        flipAlignment = true,
        ...detectOverflowOptions
      } = options;
      const side = getSide(placement);
      const isBasePlacement = getSide(initialPlacement) === initialPlacement;
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
      const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
      if (!specifiedFallbackPlacements && fallbackAxisSideDirection !== "none") {
        fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
      }
      const placements = [initialPlacement, ...fallbackPlacements];
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const overflows = [];
      let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
      if (checkMainAxis) {
        overflows.push(overflow[side]);
      }
      if (checkCrossAxis) {
        const {
          main,
          cross
        } = getAlignmentSides(placement, rects, rtl);
        overflows.push(overflow[main], overflow[cross]);
      }
      overflowsData = [...overflowsData, {
        placement,
        overflows
      }];
      if (!overflows.every((side2) => side2 <= 0)) {
        var _middlewareData$flip2, _overflowsData$filter;
        const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
        const nextPlacement = placements[nextIndex];
        if (nextPlacement) {
          return {
            data: {
              index: nextIndex,
              overflows: overflowsData
            },
            reset: {
              placement: nextPlacement
            }
          };
        }
        let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
        if (!resetPlacement) {
          switch (fallbackStrategy) {
            case "bestFit": {
              var _overflowsData$map$so;
              const placement2 = (_overflowsData$map$so = overflowsData.map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a, b) => a[1] - b[1])[0]) == null ? void 0 : _overflowsData$map$so[0];
              if (placement2) {
                resetPlacement = placement2;
              }
              break;
            }
            case "initialPlacement":
              resetPlacement = initialPlacement;
              break;
          }
        }
        if (placement !== resetPlacement) {
          return {
            reset: {
              placement: resetPlacement
            }
          };
        }
      }
      return {};
    }
  };
};
async function convertValueToCoords(state, value) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === "x";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = typeof value === "function" ? value(state) : value;
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: 0,
    crossAxis: 0,
    alignmentAxis: null,
    ...rawValue
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var offset = function(value) {
  if (value === void 0) {
    value = 0;
  }
  return {
    name: "offset",
    options: value,
    async fn(state) {
      const {
        x,
        y
      } = state;
      const diffCoords = await convertValueToCoords(state, value);
      return {
        x: x + diffCoords.x,
        y: y + diffCoords.y,
        data: diffCoords
      };
    }
  };
};
function getCrossAxis(axis) {
  return axis === "x" ? "y" : "x";
}
var shift = function(options) {
  if (options === void 0) {
    options = {};
  }
  return {
    name: "shift",
    options,
    async fn(state) {
      const {
        x,
        y,
        placement
      } = state;
      const {
        mainAxis: checkMainAxis = true,
        crossAxis: checkCrossAxis = false,
        limiter = {
          fn: (_ref) => {
            let {
              x: x2,
              y: y2
            } = _ref;
            return {
              x: x2,
              y: y2
            };
          }
        },
        ...detectOverflowOptions
      } = options;
      const coords = {
        x,
        y
      };
      const overflow = await detectOverflow(state, detectOverflowOptions);
      const mainAxis = getMainAxisFromPlacement(getSide(placement));
      const crossAxis = getCrossAxis(mainAxis);
      let mainAxisCoord = coords[mainAxis];
      let crossAxisCoord = coords[crossAxis];
      if (checkMainAxis) {
        const minSide = mainAxis === "y" ? "top" : "left";
        const maxSide = mainAxis === "y" ? "bottom" : "right";
        const min3 = mainAxisCoord + overflow[minSide];
        const max3 = mainAxisCoord - overflow[maxSide];
        mainAxisCoord = within(min3, mainAxisCoord, max3);
      }
      if (checkCrossAxis) {
        const minSide = crossAxis === "y" ? "top" : "left";
        const maxSide = crossAxis === "y" ? "bottom" : "right";
        const min3 = crossAxisCoord + overflow[minSide];
        const max3 = crossAxisCoord - overflow[maxSide];
        crossAxisCoord = within(min3, crossAxisCoord, max3);
      }
      const limitedCoords = limiter.fn({
        ...state,
        [mainAxis]: mainAxisCoord,
        [crossAxis]: crossAxisCoord
      });
      return {
        ...limitedCoords,
        data: {
          x: limitedCoords.x - x,
          y: limitedCoords.y - y
        }
      };
    }
  };
};

// node_modules/.pnpm/@floating-ui+dom@1.2.1/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getWindow(node) {
  var _node$ownerDocument;
  return ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
var min2 = Math.min;
var max2 = Math.max;
var round = Math.round;
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width);
  let height = parseFloat(css.height);
  const offsetWidth = element.offsetWidth;
  const offsetHeight = element.offsetHeight;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    fallback: shouldFallback
  };
}
function getNodeName(node) {
  return isNode(node) ? (node.nodeName || "").toLowerCase() : "";
}
var uaString;
function getUAString() {
  if (uaString) {
    return uaString;
  }
  const uaData = navigator.userAgentData;
  if (uaData && Array.isArray(uaData.brands)) {
    uaString = uaData.brands.map((item) => item.brand + "/" + item.version).join(" ");
    return uaString;
  }
  return navigator.userAgent;
}
function isHTMLElement(value) {
  return value instanceof getWindow(value).HTMLElement;
}
function isElement(value) {
  return value instanceof getWindow(value).Element;
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  const OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle$1(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const isFirefox = /firefox/i.test(getUAString());
  const css = getComputedStyle$1(element);
  const backdropFilter = css.backdropFilter || css.WebkitBackdropFilter;
  return css.transform !== "none" || css.perspective !== "none" || (backdropFilter ? backdropFilter !== "none" : false) || isFirefox && css.willChange === "filter" || isFirefox && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective"].some((value) => css.willChange.includes(value)) || ["paint", "layout", "strict", "content"].some((value) => {
    const contain = css.contain;
    return contain != null ? contain.includes(value) : false;
  });
}
function isClientRectVisualViewportBased() {
  return /^((?!chrome|android).)*safari/i.test(getUAString());
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
var FALLBACK_SCALE = {
  x: 1,
  y: 1
};
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return FALLBACK_SCALE;
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    fallback
  } = getCssDimensions(domElement);
  let x = (fallback ? round(rect.width) : rect.width) / width;
  let y = (fallback ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y
  };
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  var _win$visualViewport, _win$visualViewport2;
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = FALLBACK_SCALE;
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const win = domElement ? getWindow(domElement) : window;
  const addVisualOffsets = isClientRectVisualViewportBased() && isFixedStrategy;
  let x = (clientRect.left + (addVisualOffsets ? ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0 : 0)) / scale.x;
  let y = (clientRect.top + (addVisualOffsets ? ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0 : 0)) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win2 = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentIFrame = win2.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win2) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      iframeRect.x += (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      iframeRect.y += (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += iframeRect.x;
      y += iframeRect.y;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}
function getDocumentElement(node) {
  return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = {
    x: 1,
    y: 1
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max2(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max2(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max2(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return parentNode.ownerDocument.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor));
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isClientRectVisualViewportBased();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {
    x: 1,
    y: 1
  };
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const mutableRect = {
      ...clippingAncestor
    };
    if (isClientRectVisualViewportBased()) {
      var _win$visualViewport, _win$visualViewport2;
      const win = getWindow(element);
      mutableRect.x -= ((_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) || 0;
      mutableRect.y -= ((_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) || 0;
    }
    rect = mutableRect;
  }
  return rectToClientRect(rect);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const containingBlock = isContainingBlock(currentNode);
    const shouldIgnoreCurrentNode = computedStyle.position === "fixed";
    if (shouldIgnoreCurrentNode) {
      currentContainingBlockComputedStyle = null;
    } else {
      const shouldDropCurrentNode = elementIsFixed ? !containingBlock && !currentContainingBlockComputedStyle : !containingBlock && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max2(rect.top, accRect.top);
    accRect.right = min2(rect.right, accRect.right);
    accRect.bottom = min2(rect.bottom, accRect.bottom);
    accRect.left = max2(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  if (isHTMLElement(element)) {
    return getCssDimensions(element);
  }
  return element.getBoundingClientRect();
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static" && !isContainingBlock(offsetParent))) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const rect = getBoundingClientRect(element, true, strategy === "fixed", offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== "fixed") {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
var platform = {
  getClippingRect,
  convertOffsetParentRelativeRectToViewportRelativeRect,
  isElement,
  getDimensions,
  getOffsetParent,
  getDocumentElement,
  getScale,
  async getElementRects(_ref) {
    let {
      reference,
      floating,
      strategy
    } = _ref;
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    return {
      reference: getRectRelativeToOffsetParent(reference, await getOffsetParentFn(floating), strategy),
      floating: {
        x: 0,
        y: 0,
        ...await getDimensionsFn(floating)
      }
    };
  },
  getClientRects: (element) => Array.from(element.getClientRects()),
  isRTL: (element) => getComputedStyle$1(element).direction === "rtl"
};
var computePosition2 = (reference, floating, options) => {
  const cache = /* @__PURE__ */ new Map();
  const mergedOptions = {
    platform,
    ...options
  };
  const platformWithCache = {
    ...mergedOptions.platform,
    _c: cache
  };
  return computePosition(reference, floating, {
    ...mergedOptions,
    platform: platformWithCache
  });
};

// src/userscripts/icons.ts
var iconEmoji = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  style="width:18px; height:18px;"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
  />
</svg>
`;
var iconHeart = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
  />
</svg>
`;
var iconHide = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
  />
</svg>
`;
var iconReply = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
  />
</svg>
`;
var iconStar = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <polygon
    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
  ></polygon>
</svg>
`;
var iconTwitter = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path
    d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
  ></path>
</svg>
`;
var iconIgnore = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M8 15h8"></path>
  <path d="M8 9h2"></path>
  <path d="M14 9h2"></path>
</svg>
`;
var iconLove = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path
    d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"
  ></path>
</svg>
`;

// src/userscripts/topic/comment.ts
function popular() {
  $topicContentBox.find(".topic_content a[href]").prop("target", "_blank");
  const popularCommentData = commentData.filter(({ likes }) => likes > 0).sort((a, b) => b.likes - a.likes);
  if (popularCommentData.length > 4 || popularCommentData.length > 0 && popularCommentData.every(({ likes }) => likes >= 4)) {
    const cmMask = $('<div class="v2p-cm-mask">');
    const cmContent = $(`
      <div class="v2p-cm-content box">
        <div class="v2p-cm-bar">
          <span>\u672C\u9875\u5171\u6709 ${popularCommentData.length} \u6761\u70ED\u95E8\u56DE\u590D</span>
          <button class="v2p-cm-close-btn normal button">\u5173\u95ED<kbd>Esc</kbd></button>
        </div>
      </div>
    `);
    const cmContainer = cmMask.append(cmContent).hide();
    {
      const commentBoxCount = $commentBox.find(".cell:first-of-type > span.gray");
      const countText = commentBoxCount.text();
      const newCountText = countText.substring(0, countText.indexOf("\u56DE\u590D") + 2);
      const countTextSpan = `<span class="count-text">${newCountText}</span><span class="v2p-dot">\xB7</span>`;
      let boundEvent = false;
      const clickHandler = (e) => {
        if ($(e.target).closest(cmContent).length === 0) {
          handleModalClose();
        }
      };
      const keyupHandler = (e) => {
        if (e.key === "Escape") {
          handleModalClose();
        }
      };
      const handleModalClose = () => {
        $(document).off("click", clickHandler);
        $(document).off("keydown", keyupHandler);
        boundEvent = false;
        cmContainer.fadeOut("fast");
        document.body.classList.remove("modal-open");
      };
      const handleModalOpen = () => {
        if (!boundEvent) {
          $(document).on("click", clickHandler);
          $(document).on("keydown", keyupHandler);
          boundEvent = true;
        }
        cmContainer.fadeIn("fast");
        document.body.classList.add("modal-open");
      };
      const closeBtn = cmContainer.find(".v2p-cm-close-btn");
      closeBtn.on("click", handleModalClose);
      const popularBtn = $(
        `<span class="v2p-popular-btn effect-btn"><span class="v2p-icon-heart">${iconHeart}</span>\u67E5\u770B\u672C\u9875\u611F\u8C22\u56DE\u590D</span>`
      );
      popularBtn.on("click", (e) => {
        e.stopPropagation();
        handleModalOpen();
      });
      commentBoxCount.empty().append(countTextSpan).append(popularBtn);
    }
    const templete = $("<templete></templete>");
    popularCommentData.forEach(({ index }) => {
      templete.append($commentCells.eq(index).clone());
    });
    cmContent.append(templete.html());
    $commentBox.append(cmContainer);
  }
}
function replaceHeart() {
  $commentCells.find(".small.fade").addClass("heart-box").find('img[alt="\u2764\uFE0F"]').replaceWith(`<span class="v2p-icon-heart">${iconHeart}</span>`);
}
function setControls() {
  const os = getOS();
  const replyBtn = $(
    `<button class="normal button">\u56DE\u590D<kbd>${os === "macos" ? "Cmd" : "Ctrl"}+Enter</kbd></button>`
  ).replaceAll($('#reply-box input[type="submit"]'));
  const emoticons = ["\u{1F929}", "\u{1F602}", "\u{1F605}", "\u{1F973}", "\u{1F600}", "\u{1F436}", "\u{1F414}", "\u{1F921}", "\u{1F4A9}"];
  const emoticonsContent = $(`
    <div class="v2p-emoticons">
      ${emoticons.map((emoji) => `<span>${emoji}</span>`).join("")}
    </div>
  `);
  const emojiBtn = $(
    `<button type="button" class="normal button">${iconEmoji}</button>`
  ).insertAfter(replyBtn);
  const closeBtn = $('<button type="button" class="normal button">\u9690\u85CF</button>');
  const tooltip = $('<div id="v2p-tooltip" role="tooltip"></div>').append(emoticonsContent, closeBtn).appendTo($("#reply-box"));
  const tooltipEle = tooltip.get(0);
  closeBtn.on("click", () => {
    tooltipEle.style.visibility = "hidden";
  });
  const handler = () => {
    void computePosition2(emojiBtn.get(0), tooltipEle, {
      placement: "bottom",
      middleware: [offset(6), flip(), shift({ padding: 8 })]
    }).then(({ x, y }) => {
      Object.assign(tooltipEle.style, {
        left: `${x}px`,
        top: `${y}px`
      });
      tooltipEle.style.visibility = "visible";
    });
  };
  emojiBtn.on("click", handler);
  const crtlAreas = $commentTableRows.find("> td:last-of-type > .fr");
  crtlAreas.each((_, el) => {
    const ctrlArea = $(el);
    const crtlContainer = $('<span class="v2p-controls">');
    const thankIcon = $(`<span class="v2p-control">${iconHeart}</span>`);
    const thankArea = ctrlArea.find("> .thank_area");
    const thanked = thankArea.hasClass("thanked");
    if (thanked) {
      thankIcon.prop("title", "\u5DF2\u611F\u8C22").css({ color: "#f43f5e", cursor: "default" });
      crtlContainer.append($("<a>").append(thankIcon));
    } else {
      const thankEle = thankArea.find("> .thank");
      const hide2 = thankEle.eq(0).removeClass("thank");
      const thank = thankEle.eq(1).removeClass("thank");
      hide2.html(`<span class="v2p-control effect-btn" title="\u9690\u85CF">${iconHide}</span>`);
      thankIcon.prop("title", "\u611F\u8C22").addClass("effect-btn");
      thank.empty().append(thankIcon);
      crtlContainer.append(hide2).append(thank);
    }
    const reply = ctrlArea.find("a:last-of-type");
    reply.find('> img[alt="Reply"]').replaceWith(
      `<span class="v2p-control v2p-ac-reply effect-btn" title="\u56DE\u590D">${iconReply}</span>`
    );
    crtlContainer.append(reply);
    thankArea.remove();
    const floorNum = ctrlArea.find(".no").clone();
    ctrlArea.empty().append(crtlContainer, floorNum);
  });
  const topicBtn = $(".topic_buttons .tb").addClass("v2p-tb");
  topicBtn.eq(0).append(`<span class="v2p-tb-icon">${iconStar}</span>`);
  topicBtn.eq(1).append(`<span class="v2p-tb-icon">${iconTwitter}</span>`);
  topicBtn.eq(2).append(`<span class="v2p-tb-icon">${iconIgnore}</span>`);
  topicBtn.eq(3).append(`<span class="v2p-tb-icon">${iconLove}</span>`);
}
function nestedComments() {
  const topicOwnerName = $("#Main > .box:nth-child(1) > .header > small > a").text();
  let i = 1;
  while (i < $commentCells.length) {
    const cellDom = $commentCells[i];
    const { memberName, content } = commentData[i];
    if (memberName === topicOwnerName) {
      cellDom.classList.add("owner");
    }
    if (memberName === loginName) {
      cellDom.classList.add("self");
    }
    if (content.includes("@")) {
      for (let j = i - 1; j >= 0; j--) {
        if (content.match(`@${commentData[j].memberName}`)) {
          cellDom.classList.add("responder");
          $commentCells[j].append(cellDom);
          break;
        }
      }
    }
    i++;
  }
}

// src/userscripts/topic/paging.ts
function paging() {
  const notCommentCells = $commentBox.find('> .cell:not([id^="r_"])');
  if (notCommentCells.length <= 1) {
    return;
  }
  const pagingCells = notCommentCells.slice(1).addClass("v2p-paging");
  const pageBtns = pagingCells.find(".super.button");
  pageBtns.eq(0).addClass("v2p-prev-btn");
  pageBtns.eq(1).addClass("v2p-next-btn");
}

// src/userscripts/topic/index.ts
function setupTopicScript() {
  $commentTableRows.find("> td:nth-child(3) > strong > a").prop("target", "_blank");
  replaceHeart();
  setControls();
  popular();
  nestedComments();
  paging();
}

// src/userscripts/index.ts
{
  $("#Top .site-nav .tools > .top").addClass("effect-btn");
}
addGlobalStyle();
setupHomeScript();
setupTopicScript();
