// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 3.0.0
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */
!function (t, i, n, s) { var e = function (s, e) { this.elem = s, this.$elem = t(s), this.options = e, this.metadata = this.$elem.data("plugin-options"), this.$win = t(i), this.sections = {}, this.didScroll = !1, this.$doc = t(n), this.docHeight = this.$doc.height() }; e.prototype = { defaults: { navItems: "a", currentClass: "current", changeHash: !1, easing: "swing", filter: "", scrollSpeed: 750, scrollThreshold: .5, begin: !1, end: !1, scrollChange: !1 }, init: function () { return this.config = t.extend({}, this.defaults, this.options, this.metadata), this.$nav = this.$elem.find(this.config.navItems), "" !== this.config.filter && (this.$nav = this.$nav.filter(this.config.filter)), this.$nav.on("click.onePageNav", t.proxy(this.handleClick, this)), this.getPositions(), this.bindInterval(), this.$win.on("resize.onePageNav", t.proxy(this.getPositions, this)), this }, adjustNav: function (t, i) { t.$elem.find("." + t.config.currentClass).removeClass(t.config.currentClass), i.addClass(t.config.currentClass) }, bindInterval: function () { var t, i = this; i.$win.on("scroll.onePageNav", function () { i.didScroll = !0 }), i.t = setInterval(function () { t = i.$doc.height(), i.didScroll && (i.didScroll = !1, i.scrollChange()), t !== i.docHeight && (i.docHeight = t, i.getPositions()) }, 250) }, getHash: function (t) { return t.attr("href").split("#")[1] }, getPositions: function () { var i, n, s, e = this; e.$nav.each(function () { i = e.getHash(t(this)), s = t("#" + i), s.length && (n = s.offset().top, e.sections[i] = Math.round(n)) }) }, getSection: function (t) { var i = null, n = Math.round(this.$win.height() * this.config.scrollThreshold); for (var s in this.sections) this.sections[s] - n < t && (i = s); return i }, handleClick: function (n) { var s = this, e = t(n.currentTarget), o = e.parent(), a = "#" + s.getHash(e); o.hasClass(s.config.currentClass) || (s.config.begin && s.config.begin(), s.adjustNav(s, o), s.unbindInterval(), s.scrollTo(a, function () { s.config.changeHash && (i.location.hash = a), s.bindInterval(), s.config.end && s.config.end() })), n.preventDefault() }, scrollChange: function () { var t, i = this.$win.scrollTop(), n = this.getSection(i); null !== n && (t = this.$elem.find('a[href$="#' + n + '"]').parent(), t.hasClass(this.config.currentClass) || (this.adjustNav(this, t), this.config.scrollChange && this.config.scrollChange(t))) }, scrollTo: function (i, n) { var s = t(i).offset().top; t("html, body").animate({ scrollTop: s - this.config.scrollOffset }, this.config.scrollSpeed, this.config.easing, n) }, unbindInterval: function () { clearInterval(this.t), this.$win.unbind("scroll.onePageNav") } }, e.defaults = e.prototype.defaults, t.fn.onePageNav = function (t) { return this.each(function () { new e(this, t).init() }) } }(jQuery, window, document);


/*!
 * scrollup v2.4.1
 * Url: http://markgoodyear.com/labs/scrollup/
 * Copyright (c) Mark Goodyear — @markgdyr — http://markgoodyear.com
 * License: MIT
 */
!function (l, o, e) { "use strict"; l.fn.scrollUp = function (o) { l.data(e.body, "scrollUp") || (l.data(e.body, "scrollUp", !0), l.fn.scrollUp.init(o)) }, l.fn.scrollUp.init = function (r) { var s, t, c, i, n, a, d, p = l.fn.scrollUp.settings = l.extend({}, l.fn.scrollUp.defaults, r), f = !1; switch (d = p.scrollTrigger ? l(p.scrollTrigger) : l("<a/>", { id: p.scrollName, href: "#top" }), p.scrollTitle && d.attr("title", p.scrollTitle), d.appendTo("body"), p.scrollImg || p.scrollTrigger || d.html(p.scrollText), d.css({ display: "none", position: "fixed", zIndex: p.zIndex }), p.activeOverlay && l("<div/>", { id: p.scrollName + "-active" }).css({ position: "absolute", top: p.scrollDistance + "px", width: "100%", borderTop: "1px dotted" + p.activeOverlay, zIndex: p.zIndex }).appendTo("body"), p.animation) { case "fade": s = "fadeIn", t = "fadeOut", c = p.animationSpeed; break; case "slide": s = "slideDown", t = "slideUp", c = p.animationSpeed; break; default: s = "show", t = "hide", c = 0 }i = "top" === p.scrollFrom ? p.scrollDistance : l(e).height() - l(o).height() - p.scrollDistance, n = l(o).scroll(function () { l(o).scrollTop() > i ? f || (d[s](c), f = !0) : f && (d[t](c), f = !1) }), p.scrollTarget ? "number" == typeof p.scrollTarget ? a = p.scrollTarget : "string" == typeof p.scrollTarget && (a = Math.floor(l(p.scrollTarget).offset().top)) : a = 0, d.click(function (o) { o.preventDefault(), l("html, body").animate({ scrollTop: a }, p.scrollSpeed, p.easingType) }) }, l.fn.scrollUp.defaults = { scrollName: "scrollUp", scrollDistance: 300, scrollFrom: "top", scrollSpeed: 300, easingType: "linear", animation: "fade", animationSpeed: 200, scrollTrigger: !1, scrollTarget: !1, scrollText: "Scroll to top", scrollTitle: !1, scrollImg: !1, activeOverlay: !1, zIndex: 2147483647 }, l.fn.scrollUp.destroy = function (r) { l.removeData(e.body, "scrollUp"), l("#" + l.fn.scrollUp.settings.scrollName).remove(), l("#" + l.fn.scrollUp.settings.scrollName + "-active").remove(), l.fn.jquery.split(".")[1] >= 7 ? l(o).off("scroll", r) : l(o).unbind("scroll", r) }, l.scrollUp = l.fn.scrollUp }(jQuery, window, document);