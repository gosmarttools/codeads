(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;
  var popupId = script.getAttribute('data-popup-id');
  if (!popupId) return;

  var origin = (function () {
    try {
      return new URL(script.src).origin;
    } catch (e) {
      return '';
    }
  })();
  if (!origin) return;

  var dismissKey = 'edgeToolsPopupDismissed:' + popupId;
  if (sessionStorage.getItem(dismissKey) === '1') return;

  function matchesPattern(pattern, url) {
    pattern = pattern.trim();
    if (!pattern) return false;
    if (pattern.indexOf('*') === -1) return url.indexOf(pattern) !== -1;
    var escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    try {
      return new RegExp(escaped).test(url);
    } catch (e) {
      return false;
    }
  }

  function shouldShow(config) {
    var url = window.location.href;
    for (var i = 0; i < config.hideUrls.length; i++) {
      if (matchesPattern(config.hideUrls[i], url)) return false;
    }
    if (config.showUrls.length > 0) {
      for (var j = 0; j < config.showUrls.length; j++) {
        if (matchesPattern(config.showUrls[j], url)) return true;
      }
      return false;
    }
    return true;
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  var DESIGN_STYLES = {
    base:
      '.overlay{position:fixed;inset:0;background:rgba(15,15,20,.5);z-index:2147483000;display:flex;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:etFadeIn .2s ease;}' +
      '@keyframes etFadeIn{from{opacity:0}to{opacity:1}}' +
      '@keyframes etSlideUp{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}' +
      '@keyframes etSlideDown{from{transform:translateY(-100%)}to{transform:translateY(0)}}' +
      '.close{position:absolute;top:10px;right:10px;width:26px;height:26px;border:none;background:rgba(0,0,0,.06);border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#555;font-size:15px;line-height:1;}' +
      '.close:hover{background:rgba(0,0,0,.12);}' +
      '.cta{display:inline-block;text-decoration:none;font-weight:600;cursor:pointer;border:none;font-family:inherit;}' +
      '.border-gradient{position:relative;}' +
      '.border-gradient::before{content:"";position:absolute;inset:-2px;border-radius:inherit;padding:2px;background:linear-gradient(135deg,#6C63FF,#f59e0b,#db2777,#6C63FF);background-size:300% 300%;animation:etBorderGradient 3s ease infinite;-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;}' +
      '@keyframes etBorderGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}' +
      '.border-glow{position:relative;}' +
      '.border-glow::after{content:"";position:absolute;inset:-6px;border-radius:inherit;background:radial-gradient(circle,rgba(108,99,255,.55),transparent 70%);filter:blur(8px);z-index:-1;animation:etBorderGlow 2s ease-in-out infinite;pointer-events:none;}' +
      '@keyframes etBorderGlow{0%,100%{opacity:.45}50%{opacity:1}}',
    1:
      '.card{position:relative;background:#fff;border-radius:16px;max-width:400px;width:calc(100% - 40px);padding:32px 28px 28px;box-shadow:0 20px 60px rgba(0,0,0,.25);animation:etSlideUp .25s ease;text-align:center;}' +
      '.title{font-size:21px;font-weight:700;color:#141420;margin:0 0 10px;letter-spacing:-.3px;}' +
      '.desc{font-size:14px;line-height:1.55;color:#5a5a68;margin:0 0 22px;}' +
      '.cta{background:#6C63FF;color:#fff;padding:12px 28px;border-radius:9px;font-size:14px;}' +
      '.cta:hover{background:#5548e0;}',
    2:
      '.wrap2{position:fixed;bottom:20px;right:20px;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}' +
      '.card{position:relative;background:#141420;color:#fff;border-radius:14px;max-width:320px;width:calc(100vw - 40px);padding:22px 22px 20px;box-shadow:0 12px 40px rgba(0,0,0,.3);animation:etSlideUp .3s ease;}' +
      '.title{font-size:16px;font-weight:700;margin:0 0 8px;}' +
      '.desc{font-size:13px;line-height:1.5;color:#c7c7d4;margin:0 0 18px;}' +
      '.cta{background:#fff;color:#141420;padding:9px 20px;border-radius:8px;font-size:13px;}' +
      '.cta:hover{background:#e6e6ef;}' +
      '.close{background:rgba(255,255,255,.12);color:#fff;}' +
      '.close:hover{background:rgba(255,255,255,.22);}',
    3:
      '.wrap3{position:fixed;top:0;left:0;right:0;z-index:2147483000;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;animation:etSlideDown .25s ease;}' +
      '.card{position:relative;background:#6C63FF;color:#fff;padding:13px 50px;display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;text-align:center;}' +
      '.title{font-size:14px;font-weight:700;margin:0;}' +
      '.desc{font-size:13px;margin:0;opacity:.9;}' +
      '.cta{background:#fff;color:#6C63FF;padding:7px 16px;border-radius:7px;font-size:12.5px;white-space:nowrap;}' +
      '.cta:hover{background:#eceaff;}' +
      '.close{background:rgba(255,255,255,.18);color:#fff;top:8px;}' +
      '.close:hover{background:rgba(255,255,255,.3);}',
  };

  function render(config) {
    var host = document.createElement('div');
    host.id = 'edge-tools-popup-' + popupId;
    var shadow = host.attachShadow({ mode: 'open' });

    var style = document.createElement('style');
    style.textContent = DESIGN_STYLES.base + (DESIGN_STYLES[config.design] || DESIGN_STYLES[1]);
    shadow.appendChild(style);

    var title = escapeHtml(config.title);
    var desc = escapeHtml(config.description);
    var ctaText = escapeHtml(config.ctaText);
    var ctaUrl = escapeAttr(config.ctaUrl);

    var borderClass = config.borderStyle && config.borderStyle !== 'none' ? ' border-' + config.borderStyle : '';
    var cardClass = 'card' + borderClass;

    var markup;
    if (config.design === 2) {
      markup =
        '<div class="wrap2"><div class="' + cardClass + '">' +
        '<button class="close" data-close aria-label="Close">&times;</button>' +
        '<div class="title">' + title + '</div>' +
        '<div class="desc">' + desc + '</div>' +
        '<a class="cta" href="' + ctaUrl + '" target="_blank" rel="noopener noreferrer">' + ctaText + '</a>' +
        '</div></div>';
    } else if (config.design === 3) {
      markup =
        '<div class="wrap3"><div class="' + cardClass + '">' +
        '<button class="close" data-close aria-label="Close">&times;</button>' +
        '<span class="title">' + title + '</span>' +
        '<span class="desc">' + desc + '</span>' +
        '<a class="cta" href="' + ctaUrl + '" target="_blank" rel="noopener noreferrer">' + ctaText + '</a>' +
        '</div></div>';
    } else {
      markup =
        '<div class="overlay" data-overlay><div class="' + cardClass + '">' +
        '<button class="close" data-close aria-label="Close">&times;</button>' +
        '<div class="title">' + title + '</div>' +
        '<div class="desc">' + desc + '</div>' +
        '<a class="cta" href="' + ctaUrl + '" target="_blank" rel="noopener noreferrer">' + ctaText + '</a>' +
        '</div></div>';
    }

    var container = document.createElement('div');
    container.innerHTML = markup;
    shadow.appendChild(container.firstChild);

    document.body.appendChild(host);

    function dismiss() {
      sessionStorage.setItem(dismissKey, '1');
      host.remove();
    }

    shadow.querySelector('[data-close]').addEventListener('click', dismiss);
    var overlay = shadow.querySelector('[data-overlay]');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) dismiss();
      });
    }
  }

  function init() {
    fetch(origin + '/api/popups/public/' + encodeURIComponent(popupId))
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.ok || !json.data) return;
        if (!shouldShow(json.data)) return;
        render(json.data);
      })
      .catch(function () {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();