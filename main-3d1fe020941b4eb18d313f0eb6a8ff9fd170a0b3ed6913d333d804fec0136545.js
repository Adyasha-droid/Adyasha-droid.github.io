function updateTable(e, t) {
    var n = e.releases;
    for (var i in e.current_release) {
        var r = $("#downloads-" + t + "-" + i);
        r.addClass("collapsed").find(".loading").remove(), n.filter(function(e) {
            return e.channel == i
        }).forEach(function(t, n) {
            if (n === releasesToShow) {
                var i = $("<a />").text("Show all...").attr("href", "#").click(function(e) {
                    $(this).closest("table").removeClass("collapsed"), $(this).closest("tr").remove(), e.preventDefault()
                });
                $("<tr>").append($('<td colspan="3"></td></tr>').append(i)).appendTo(r)
            }
            var o = n >= releasesToShow ? "overflow" : "",
                s = e.base_url + "/" + t.archive,
                a = $("<tr />").addClass(o).appendTo(r),
                l = $("<span />").text(t.hash.substr(0, 7)).addClass("git-hash"),
                u = $("<a />").attr("href", s).text(t.version),
                c = new Date(Date.parse(t.release_date));
            $("<td />").append(u).appendTo(a), $("<td />").append(l).appendTo(a), $("<td />").addClass("date").text(c.toLocaleDateString()).appendTo(a)
        })
    }
}

function updateTableFailed(e) {
    $("#tab-os-" + e).find(".loading").text("Failed to load releases. Refresh page to try again.")
}

function updateDownloadLink(e, t) {
    var n = "stable",
        i = e.releases.filter(function(e) {
            return e.channel == n
        });
    if (i.length) {
        var r = i[0],
            o = r.archive.split("/"),
            s = o[o.length - 1];
        $(".download-latest-link-" + t).text(s).attr("href", e.base_url + "/" + r.archive), $(".download-latest-link-filename-" + t).text(s), $(".download-latest-link-filename").text(s);
        var a = "flutter_",
            l = $('code:contains("' + a + '")'),
            u = $(l).contents().filter(function() {
                return 3 == this.nodeType && this.textContent.includes(a)
            }),
            c = $(u).text().replace(new RegExp("^(.*?)\\b" + a + "\\w+_v.*"), "$1" + s);
        $(u).replaceWith(c)
    }
}

function updateDownloadLinkFailed(e) {
    $(".download-latest-link-" + e).text("(failed)")
}

function setupTabs(e, t, n) {
    function i(e) {
        var t = e.match(/(#|\btab=)([\w-]+)/);
        return t ? t[2] : ""
    }

    function r(e) {
        e.preventDefault(), $(this).tab("show");
        var n = i($(this).attr("href"));
        t && window.localStorage && window.localStorage.setItem(t, n);
        var r = location,
            o = "?tab=" + n;
        if (n && r.search != o) {
            var s = r.protocol + "//" + r.host + r.pathname + o + r.hash;
            history.replaceState(undefined, undefined, s)
        }
    }

    function o(e) {
        a.filter('[href="#' + e + '"]').click()
    }
    var s, a = $("li a", e);
    a.click(r), (s = i(location.search)) ? o(s) : t && window.localStorage && (s = window.localStorage.getItem(t)) ? o(s) : n && o(n)
}

function setupToolsTabs(e, t, n, i) {
    function r() {
        s.removeClass("current"), a.removeClass("current")
    }

    function o(e) {
        $.escapeSelector(e);
        s.filter("[data-tab='" + t + e + "']").click()
    }
    var s = $(".tabs__top-bar li", e),
        a = $(".tabs__content", e);
    s.click(function() {
        var e = $(this).attr("data-tab"),
            i = $(this).attr("data-tab-href");
        if (i) location.href = i;
        else if ($("#" + e).length) {
            r(), $(this).addClass("current"), $("#" + e).addClass("current");
            var o = e.replace(t, "");
            history.replaceState && history.replaceState(undefined, undefined, "#" + o), n && window.localStorage && window.localStorage.setItem(n, o)
        }
    }), location.hash && location.hash.length > 1 ? o(location.hash.substr(1)) : n && window.localStorage && window.localStorage.getItem(n) ? o(window.localStorage.getItem(n)) : i && o(i)
}

function adjustToc() {
    var e = "#site-toc--side",
        t = $(e);
    $(t).find(".site-toc--button__page-top").click(function() {
        $("html, body").animate({
            scrollTop: 0
        }, "fast")
    }), $("body").scrollspy({
        offset: 100,
        target: e
    })
}

function initFixedColumns() {
    function e() {
        if ("none" != $(t).css("display")) {
            var e = $(r).outerHeight(),
                o = $(n).outerHeight(),
                s = $(n).offset().top - $(window).scrollTop(),
                a = e + Math.max(o - (e - s), 0),
                l = $(i).offset().top - $(window).scrollTop(),
                u = $(window).height() - l,
                c = $(window).height() - a - u;
            $(t).css("max-height", c), $(t).css("top", a)
        }
    }
    var t = "[data-fixed-column]",
        n = ".site-banner",
        i = "footer.site-footer",
        r = ".site-header";
    $(t).length && ($(t).css("position", "fixed"), $(window).scroll(e), e())
}

function getOS() {
    var e = navigator.userAgent;
    return -1 !== e.indexOf("Win") ? "windows" : -1 !== e.indexOf("Mac") ? "macos" : -1 !== e.indexOf("Linux") || -1 !== e.indexOf("X11") ? "linux" : void 0
}

function initVideoModal() {
    var e = $("[data-video-modal]");
    if (e.length) {
        var t = document.createElement("script");
        t.src = "https://www.youtube.com/iframe_api";
        var n = document.getElementsByTagName("script")[0];
        n.parentNode.insertBefore(t, n), window.onYouTubeIframeAPIReady = function() {
            window.videoPlayer = new YT.Player("video-player-iframe")
        }
    }
    e.on("shown.bs.modal", function(e) {
        if (window.videoPlayer) {
            var t = e.relatedTarget.dataset.video;
            window.videoPlayer.loadVideoById(t), window.videoPlayer.playVideo()
        }
    }), e.on("hide.bs.modal", function() {
        window.videoPlayer && window.videoPlayer.stopVideo()
    })
}

function initCarousel() {
    var e = ".carousel-item",
        t = $(".carousel");
    t.on("slide.bs.carousel", function(n) {
        t.find(e).eq(n.from).addClass("transition-out")
    }), t.on("slid.bs.carousel", function(n) {
        t.find(e).eq(n.from).removeClass("transition-out")
    })
}

function initSnackbar() {
    var e = ".snackbar__action";
    $(".snackbar").each(function() {
        var t = $(this);
        t.find(e).click(function() {
            t.fadeOut()
        })
    })
}

function setupClipboardJS() {
    new ClipboardJS(".code-excerpt__copy-btn", {
        text: function(e) {
            var t = e.getAttribute("data-clipboard-target"),
                n = /^(\$\s*)|(C:\\(.*)>\s*)/gm;
            return document.querySelector(t).textContent.replace(n, "")
        }
    }).on("success", _copiedFeedback)
}

function _copiedFeedback(e) {
    e.clearSelection();
    var t, n = "Copied",
        i = e.trigger,
        r = i.getAttribute("title") || i.getAttribute("data-original-title");
    r !== n && (t = r, setTimeout(function() {
        _changeTooltip(i, t)
    }, 1500), _changeTooltip(i, n))
}

function _changeTooltip(e, t) {
    e.setAttribute("title", t), $(e).tooltip("dispose"), $(e).tooltip("show"), $(e).is(":hover") || $(e).tooltip("hide")
}

function addCopyCodeButtonsEverywhere() {
    var e = $("pre");
    e.wrap(function() {
        return 0 === $(this).parent("div.code-excerpt__code").length ? '<div class="code-excerpt__code"></div>' : ""
    }), e.wrap(function(e) {
        return '<div id="code-excerpt-' + e + '"></div>'
    }), e.parent().parent().prepend(function(e) {
        return '<button class="code-excerpt__copy-btn" type="button"    data-toggle="tooltip" title="Copy code"    data-clipboard-target="#code-excerpt-' + e + '">  <i class="material-icons">content_copy</i></button>'
    })
}! function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document) throw new Error("jQuery requires a window with a document");
        return t(e)
    } : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    "use strict";

    function n(e, t, n) {
        var i, r = (t = t || se).createElement("script");
        if (r.text = e, n)
            for (i in _e) n[i] && (r[i] = n[i]);
        t.head.appendChild(r).parentNode.removeChild(r)
    }

    function i(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? de[he.call(e)] || "object" : typeof e
    }

    function r(e) {
        var t = !!e && "length" in e && e.length,
            n = i(e);
        return !ye(e) && !be(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    function o(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }

    function s(e, t, n) {
        return ye(t) ? xe.grep(e, function(e, i) {
            return !!t.call(e, i, e) !== n
        }) : t.nodeType ? xe.grep(e, function(e) {
            return e === t !== n
        }) : "string" != typeof t ? xe.grep(e, function(e) {
            return fe.call(t, e) > -1 !== n
        }) : xe.filter(t, e, n)
    }

    function a(e, t) {
        for (;
            (e = e[t]) && 1 !== e.nodeType;);
        return e
    }

    function l(e) {
        var t = {};
        return xe.each(e.match(Oe) || [], function(e, n) {
            t[n] = !0
        }), t
    }

    function u(e) {
        return e
    }

    function c(e) {
        throw e
    }

    function f(e, t, n, i) {
        var r;
        try {
            e && ye(r = e.promise) ? r.call(e).done(t).fail(n) : e && ye(r = e.then) ? r.call(e, t, n) : t.apply(undefined, [e].slice(i))
        } catch (e) {
            n.apply(undefined, [e])
        }
    }

    function d() {
        se.removeEventListener("DOMContentLoaded", d), e.removeEventListener("load", d), xe.ready()
    }

    function h(e, t) {
        return t.toUpperCase()
    }

    function p(e) {
        return e.replace(qe, "ms-").replace(He, h)
    }

    function g() {
        this.expando = xe.expando + g.uid++
    }

    function m(e) {
        return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : Be.test(e) ? JSON.parse(e) : e)
    }

    function v(e, t, n) {
        var i;
        if (n === undefined && 1 === e.nodeType)
            if (i = "data-" + t.replace(We, "-$&").toLowerCase(), "string" == typeof(n = e.getAttribute(i))) {
                try {
                    n = m(n)
                } catch (r) {}
                Me.set(e, t, n)
            } else n = undefined;
        return n
    }

    function y(e, t, n, i) {
        var r, o, s = 20,
            a = i ? function() {
                return i.cur()
            } : function() {
                return xe.css(e, t, "")
            },
            l = a(),
            u = n && n[3] || (xe.cssNumber[t] ? "" : "px"),
            c = (xe.cssNumber[t] || "px" !== u && +l) && ze.exec(xe.css(e, t));
        if (c && c[3] !== u) {
            for (l /= 2, u = u || c[3], c = +l || 1; s--;) xe.style(e, t, c + u), (1 - o) * (1 - (o = a() / l || .5)) <= 0 && (s = 0), c /= o;
            c *= 2, xe.style(e, t, c + u), n = n || []
        }
        return n && (c = +c || +l || 0, r = n[1] ? c + (n[1] + 1) * n[2] : +n[2], i && (i.unit = u, i.start = c, i.end = r)), r
    }

    function b(e) {
        var t, n = e.ownerDocument,
            i = e.nodeName,
            r = Xe[i];
        return r || (t = n.body.appendChild(n.createElement(i)), r = xe.css(t, "display"), t.parentNode.removeChild(t), "none" === r && (r = "block"), Xe[i] = r, r)
    }

    function _(e, t) {
        for (var n, i, r = [], o = 0, s = e.length; o < s; o++)(i = e[o]).style && (n = i.style.display, t ? ("none" === n && (r[o] = Fe.get(i, "display") || null, r[o] || (i.style.display = "")), "" === i.style.display && Ve(i) && (r[o] = b(i))) : "none" !== n && (r[o] = "none", Fe.set(i, "display", n)));
        for (o = 0; o < s; o++) null != r[o] && (e[o].style.display = r[o]);
        return e
    }

    function w(e, t) {
        var n;
        return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], t === undefined || t && o(e, t) ? xe.merge([e], n) : n
    }

    function x(e, t) {
        for (var n = 0, i = e.length; n < i; n++) Fe.set(e[n], "globalEval", !t || Fe.get(t[n], "globalEval"))
    }

    function T(e, t, n, r, o) {
        for (var s, a, l, u, c, f, d = t.createDocumentFragment(), h = [], p = 0, g = e.length; p < g; p++)
            if ((s = e[p]) || 0 === s)
                if ("object" === i(s)) xe.merge(h, s.nodeType ? [s] : s);
                else if (nt.test(s)) {
            for (a = a || d.appendChild(t.createElement("div")), l = (Ge.exec(s) || ["", ""])[1].toLowerCase(), u = Ze[l] || Ze._default, a.innerHTML = u[1] + xe.htmlPrefilter(s) + u[2], f = u[0]; f--;) a = a.lastChild;
            xe.merge(h, a.childNodes), (a = d.firstChild).textContent = ""
        } else h.push(t.createTextNode(s));
        for (d.textContent = "", p = 0; s = h[p++];)
            if (r && xe.inArray(s, r) > -1) o && o.push(s);
            else if (c = xe.contains(s.ownerDocument, s), a = w(d.appendChild(s), "script"), c && x(a), n)
            for (f = 0; s = a[f++];) Je.test(s.type || "") && n.push(s);
        return d
    }

    function E() {
        return !0
    }

    function C() {
        return !1
    }

    function S() {
        try {
            return se.activeElement
        } catch (e) {}
    }

    function N(e, t, n, i, r, o) {
        var s, a;
        if ("object" == typeof t) {
            for (a in "string" != typeof n && (i = i || n, n = undefined), t) N(e, a, n, i, t[a], o);
            return e
        }
        if (null == i && null == r ? (r = n, i = n = undefined) : null == r && ("string" == typeof n ? (r = i, i = undefined) : (r = i, i = n, n = undefined)), !1 === r) r = C;
        else if (!r) return e;
        return 1 === o && (s = r, (r = function(e) {
            return xe().off(e), s.apply(this, arguments)
        }).guid = s.guid || (s.guid = xe.guid++)), e.each(function() {
            xe.event.add(this, t, r, i, n)
        })
    }

    function k(e, t) {
        return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") && xe(e).children("tbody")[0] || e
    }

    function D(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
    }

    function A(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
    }

    function P(e, t) {
        var n, i, r, o, s, a, l, u;
        if (1 === t.nodeType) {
            if (Fe.hasData(e) && (o = Fe.access(e), s = Fe.set(t, o), u = o.events))
                for (r in delete s.handle, s.events = {}, u)
                    for (n = 0, i = u[r].length; n < i; n++) xe.event.add(t, r, u[r][n]);
            Me.hasData(e) && (a = Me.access(e), l = xe.extend({}, a), Me.set(t, l))
        }
    }

    function R(e, t) {
        var n = t.nodeName.toLowerCase();
        "input" === n && Ke.test(e.type) ? t.checked = e.checked : "input" !== n && "textarea" !== n || (t.defaultValue = e.defaultValue)
    }

    function O(e, t, i, r) {
        t = ue.apply([], t);
        var o, s, a, l, u, c, f = 0,
            d = e.length,
            h = d - 1,
            p = t[0],
            g = ye(p);
        if (g || d > 1 && "string" == typeof p && !ve.checkClone && ut.test(p)) return e.each(function(n) {
            var o = e.eq(n);
            g && (t[0] = p.call(this, n, o.html())), O(o, t, i, r)
        });
        if (d && (s = (o = T(t, e[0].ownerDocument, !1, e, r)).firstChild, 1 === o.childNodes.length && (o = s), s || r)) {
            for (l = (a = xe.map(w(o, "script"), D)).length; f < d; f++) u = o, f !== h && (u = xe.clone(u, !0, !0), l && xe.merge(a, w(u, "script"))), i.call(e[f], u, f);
            if (l)
                for (c = a[a.length - 1].ownerDocument, xe.map(a, A), f = 0; f < l; f++) u = a[f], Je.test(u.type || "") && !Fe.access(u, "globalEval") && xe.contains(c, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? xe._evalUrl && xe._evalUrl(u.src) : n(u.textContent.replace(ct, ""), c, u))
        }
        return e
    }

    function L(e, t, n) {
        for (var i, r = t ? xe.filter(t, e) : e, o = 0; null != (i = r[o]); o++) n || 1 !== i.nodeType || xe.cleanData(w(i)), i.parentNode && (n && xe.contains(i.ownerDocument, i) && x(w(i, "script")), i.parentNode.removeChild(i));
        return e
    }

    function I(e, t, n) {
        var i, r, o, s, a = e.style;
        return (n = n || dt(e)) && ("" !== (s = n.getPropertyValue(t) || n[t]) || xe.contains(e.ownerDocument, e) || (s = xe.style(e, t)), !ve.pixelBoxStyles() && ft.test(s) && ht.test(t) && (i = a.width, r = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = s, s = n.width, a.width = i, a.minWidth = r, a.maxWidth = o)), s !== undefined ? s + "" : s
    }

    function j(e, t) {
        return {
            get: function() {
                if (!e()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }

    function q(e) {
        if (e in bt) return e;
        for (var t = e[0].toUpperCase() + e.slice(1), n = yt.length; n--;)
            if ((e = yt[n] + t) in bt) return e
    }

    function H(e) {
        var t = xe.cssProps[e];
        return t || (t = xe.cssProps[e] = q(e) || e), t
    }

    function $(e, t, n) {
        var i = ze.exec(t);
        return i ? Math.max(0, i[2] - (n || 0)) + (i[3] || "px") : t
    }

    function F(e, t, n, i, r, o) {
        var s = "width" === t ? 1 : 0,
            a = 0,
            l = 0;
        if (n === (i ? "border" : "content")) return 0;
        for (; s < 4; s += 2) "margin" === n && (l += xe.css(e, n + Qe[s], !0, r)), i ? ("content" === n && (l -= xe.css(e, "padding" + Qe[s], !0, r)), "margin" !== n && (l -= xe.css(e, "border" + Qe[s] + "Width", !0, r))) : (l += xe.css(e, "padding" + Qe[s], !0, r), "padding" !== n ? l += xe.css(e, "border" + Qe[s] + "Width", !0, r) : a += xe.css(e, "border" + Qe[s] + "Width", !0, r));
        return !i && o >= 0 && (l += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - l - a - .5))), l
    }

    function M(e, t, n) {
        var i = dt(e),
            r = I(e, t, i),
            o = "border-box" === xe.css(e, "boxSizing", !1, i),
            s = o;
        if (ft.test(r)) {
            if (!n) return r;
            r = "auto"
        }
        return s = s && (ve.boxSizingReliable() || r === e.style[t]), ("auto" === r || !parseFloat(r) && "inline" === xe.css(e, "display", !1, i)) && (r = e["offset" + t[0].toUpperCase() + t.slice(1)], s = !0), (r = parseFloat(r) || 0) + F(e, t, n || (o ? "border" : "content"), s, i, r) + "px"
    }

    function B(e, t, n, i, r) {
        return new B.prototype.init(e, t, n, i, r)
    }

    function W() {
        wt && (!1 === se.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(W) : e.setTimeout(W, xe.fx.interval), xe.fx.tick())
    }

    function U() {
        return e.setTimeout(function() {
            _t = undefined
        }), _t = Date.now()
    }

    function z(e, t) {
        var n, i = 0,
            r = {
                height: e
            };
        for (t = t ? 1 : 0; i < 4; i += 2 - t) r["margin" + (n = Qe[i])] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function Q(e, t, n) {
        for (var i, r = (X.tweeners[t] || []).concat(X.tweeners["*"]), o = 0, s = r.length; o < s; o++)
            if (i = r[o].call(n, t, e)) return i
    }

    function V(e, t, n) {
        var i, r, o, s, a, l, u, c, f = "width" in t || "height" in t,
            d = this,
            h = {},
            p = e.style,
            g = e.nodeType && Ve(e),
            m = Fe.get(e, "fxshow");
        for (i in n.queue || (null == (s = xe._queueHooks(e, "fx")).unqueued && (s.unqueued = 0, a = s.empty.fire, s.empty.fire = function() {
                s.unqueued || a()
            }), s.unqueued++, d.always(function() {
                d.always(function() {
                    s.unqueued--, xe.queue(e, "fx").length || s.empty.fire()
                })
            })), t)
            if (r = t[i], xt.test(r)) {
                if (delete t[i], o = o || "toggle" === r, r === (g ? "hide" : "show")) {
                    if ("show" !== r || !m || m[i] === undefined) continue;
                    g = !0
                }
                h[i] = m && m[i] || xe.style(e, i)
            }
        if ((l = !xe.isEmptyObject(t)) || !xe.isEmptyObject(h))
            for (i in f && 1 === e.nodeType && (n.overflow = [p.overflow, p.overflowX, p.overflowY], null == (u = m && m.display) && (u = Fe.get(e, "display")), "none" === (c = xe.css(e, "display")) && (u ? c = u : (_([e], !0), u = e.style.display || u, c = xe.css(e, "display"), _([e]))), ("inline" === c || "inline-block" === c && null != u) && "none" === xe.css(e, "float") && (l || (d.done(function() {
                    p.display = u
                }), null == u && (c = p.display, u = "none" === c ? "" : c)), p.display = "inline-block")), n.overflow && (p.overflow = "hidden", d.always(function() {
                    p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
                })), l = !1, h) l || (m ? "hidden" in m && (g = m.hidden) : m = Fe.access(e, "fxshow", {
                display: u
            }), o && (m.hidden = !g), g && _([e], !0), d.done(function() {
                for (i in g || _([e]), Fe.remove(e, "fxshow"), h) xe.style(e, i, h[i])
            })), l = Q(g ? m[i] : 0, i, d), i in m || (m[i] = l.start, g && (l.end = l.start, l.start = 0))
    }

    function Y(e, t) {
        var n, i, r, o, s;
        for (n in e)
            if (r = t[i = p(n)], o = e[n], Array.isArray(o) && (r = o[1], o = e[n] = o[0]), n !== i && (e[i] = o, delete e[n]), (s = xe.cssHooks[i]) && "expand" in s)
                for (n in o = s.expand(o), delete e[i], o) n in e || (e[n] = o[n], t[n] = r);
            else t[i] = r
    }

    function X(e, t, n) {
        var i, r, o = 0,
            s = X.prefilters.length,
            a = xe.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (r) return !1;
                for (var t = _t || U(), n = Math.max(0, u.startTime + u.duration - t), i = 1 - (n / u.duration || 0), o = 0, s = u.tweens.length; o < s; o++) u.tweens[o].run(i);
                return a.notifyWith(e, [u, i, n]), i < 1 && s ? n : (s || a.notifyWith(e, [u, 1, 0]), a.resolveWith(e, [u]), !1)
            },
            u = a.promise({
                elem: e,
                props: xe.extend({}, t),
                opts: xe.extend(!0, {
                    specialEasing: {},
                    easing: xe.easing._default
                }, n),
                originalProperties: t,
                originalOptions: n,
                startTime: _t || U(),
                duration: n.duration,
                tweens: [],
                createTween: function(t, n) {
                    var i = xe.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                    return u.tweens.push(i), i
                },
                stop: function(t) {
                    var n = 0,
                        i = t ? u.tweens.length : 0;
                    if (r) return this;
                    for (r = !0; n < i; n++) u.tweens[n].run(1);
                    return t ? (a.notifyWith(e, [u, 1, 0]), a.resolveWith(e, [u, t])) : a.rejectWith(e, [u, t]), this
                }
            }),
            c = u.props;
        for (Y(c, u.opts.specialEasing); o < s; o++)
            if (i = X.prefilters[o].call(u, e, c, u.opts)) return ye(i.stop) && (xe._queueHooks(u.elem, u.opts.queue).stop = i.stop.bind(i)), i;
        return xe.map(c, Q, u), ye(u.opts.start) && u.opts.start.call(e, u), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), xe.fx.timer(xe.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u
    }

    function K(e) {
        return (e.match(Oe) || []).join(" ")
    }

    function G(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }

    function J(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(Oe) || []
    }

    function Z(e, t, n, r) {
        var o;
        if (Array.isArray(t)) xe.each(t, function(t, i) {
            n || Lt.test(e) ? r(e, i) : Z(e + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, n, r)
        });
        else if (n || "object" !== i(t)) r(e, t);
        else
            for (o in t) Z(e + "[" + o + "]", t[o], n, r)
    }

    function ee(e) {
        return function(t, n) {
            "string" != typeof t && (n = t, t = "*");
            var i, r = 0,
                o = t.toLowerCase().match(Oe) || [];
            if (ye(n))
                for (; i = o[r++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
        }
    }

    function te(e, t, n, i) {
        function r(a) {
            var l;
            return o[a] = !0, xe.each(e[a] || [], function(e, a) {
                var u = a(t, n, i);
                return "string" != typeof u || s || o[u] ? s ? !(l = u) : void 0 : (t.dataTypes.unshift(u), r(u), !1)
            }), l
        }
        var o = {},
            s = e === Qt;
        return r(t.dataTypes[0]) || !o["*"] && r("*")
    }

    function ne(e, t) {
        var n, i, r = xe.ajaxSettings.flatOptions || {};
        for (n in t) t[n] !== undefined && ((r[n] ? e : i || (i = {}))[n] = t[n]);
        return i && xe.extend(!0, e, i), e
    }

    function ie(e, t, n) {
        for (var i, r, o, s, a = e.contents, l = e.dataTypes;
            "*" === l[0];) l.shift(), i === undefined && (i = e.mimeType || t.getResponseHeader("Content-Type"));
        if (i)
            for (r in a)
                if (a[r] && a[r].test(i)) {
                    l.unshift(r);
                    break
                }
        if (l[0] in n) o = l[0];
        else {
            for (r in n) {
                if (!l[0] || e.converters[r + " " + l[0]]) {
                    o = r;
                    break
                }
                s || (s = r)
            }
            o = o || s
        }
        if (o) return o !== l[0] && l.unshift(o), n[o]
    }

    function re(e, t, n, i) {
        var r, o, s, a, l, u = {},
            c = e.dataTypes.slice();
        if (c[1])
            for (s in e.converters) u[s.toLowerCase()] = e.converters[s];
        for (o = c.shift(); o;)
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())
                if ("*" === o) o = l;
                else if ("*" !== l && l !== o) {
            if (!(s = u[l + " " + o] || u["* " + o]))
                for (r in u)
                    if ((a = r.split(" "))[1] === o && (s = u[l + " " + a[0]] || u["* " + a[0]])) {
                        !0 === s ? s = u[r] : !0 !== u[r] && (o = a[0], c.unshift(a[1]));
                        break
                    }
            if (!0 !== s)
                if (s && e.throws) t = s(t);
                else try {
                    t = s(t)
                } catch (f) {
                    return {
                        state: "parsererror",
                        error: s ? f : "No conversion from " + l + " to " + o
                    }
                }
        }
        return {
            state: "success",
            data: t
        }
    }
    var oe = [],
        se = e.document,
        ae = Object.getPrototypeOf,
        le = oe.slice,
        ue = oe.concat,
        ce = oe.push,
        fe = oe.indexOf,
        de = {},
        he = de.toString,
        pe = de.hasOwnProperty,
        ge = pe.toString,
        me = ge.call(Object),
        ve = {},
        ye = function(e) {
            return "function" == typeof e && "number" != typeof e.nodeType
        },
        be = function(e) {
            return null != e && e === e.window
        },
        _e = {
            type: !0,
            src: !0,
            noModule: !0
        },
        we = "3.3.1",
        xe = function(e, t) {
            return new xe.fn.init(e, t)
        },
        Te = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    xe.fn = xe.prototype = {
        jquery: we,
        constructor: xe,
        length: 0,
        toArray: function() {
            return le.call(this)
        },
        get: function(e) {
            return null == e ? le.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = xe.merge(this.constructor(), e);
            return t.prevObject = this, t
        },
        each: function(e) {
            return xe.each(this, e)
        },
        map: function(e) {
            return this.pushStack(xe.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(le.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        eq: function(e) {
            var t = this.length,
                n = +e + (e < 0 ? t : 0);
            return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: ce,
        sort: oe.sort,
        splice: oe.splice
    }, xe.extend = xe.fn.extend = function() {
        var e, t, n, i, r, o, s = arguments[0] || {},
            a = 1,
            l = arguments.length,
            u = !1;
        for ("boolean" == typeof s && (u = s, s = arguments[a] || {}, a++), "object" == typeof s || ye(s) || (s = {}), a === l && (s = this, a--); a < l; a++)
            if (null != (e = arguments[a]))
                for (t in e) n = s[t], s !== (i = e[t]) && (u && i && (xe.isPlainObject(i) || (r = Array.isArray(i))) ? (r ? (r = !1, o = n && Array.isArray(n) ? n : []) : o = n && xe.isPlainObject(n) ? n : {}, s[t] = xe.extend(u, o, i)) : i !== undefined && (s[t] = i));
        return s
    }, xe.extend({
        expando: "jQuery" + (we + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== he.call(e)) && (!(t = ae(e)) || "function" == typeof(n = pe.call(t, "constructor") && t.constructor) && ge.call(n) === me)
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e) return !1;
            return !0
        },
        globalEval: function(e) {
            n(e)
        },
        each: function(e, t) {
            var n, i = 0;
            if (r(e))
                for (n = e.length; i < n && !1 !== t.call(e[i], i, e[i]); i++);
            else
                for (i in e)
                    if (!1 === t.call(e[i], i, e[i])) break;
            return e
        },
        trim: function(e) {
            return null == e ? "" : (e + "").replace(Te, "")
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (r(Object(e)) ? xe.merge(n, "string" == typeof e ? [e] : e) : ce.call(n, e)), n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : fe.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, i = 0, r = e.length; i < n; i++) e[r++] = t[i];
            return e.length = r, e
        },
        grep: function(e, t, n) {
            for (var i = [], r = 0, o = e.length, s = !n; r < o; r++) !t(e[r], r) !== s && i.push(e[r]);
            return i
        },
        map: function(e, t, n) {
            var i, o, s = 0,
                a = [];
            if (r(e))
                for (i = e.length; s < i; s++) null != (o = t(e[s], s, n)) && a.push(o);
            else
                for (s in e) null != (o = t(e[s], s, n)) && a.push(o);
            return ue.apply([], a)
        },
        guid: 1,
        support: ve
    }), "function" == typeof Symbol && (xe.fn[Symbol.iterator] = oe[Symbol.iterator]), xe.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        de["[object " + t + "]"] = t.toLowerCase()
    });
    var Ee = function(e) {
        function t(e, t, n, i) {
            var r, o, s, a, l, u, c, d = t && t.ownerDocument,
                p = t ? t.nodeType : 9;
            if (n = n || [], "string" != typeof e || !e || 1 !== p && 9 !== p && 11 !== p) return n;
            if (!i && ((t ? t.ownerDocument || t : M) !== O && R(t), t = t || O, I)) {
                if (11 !== p && (l = ve.exec(e)))
                    if (r = l[1]) {
                        if (9 === p) {
                            if (!(s = t.getElementById(r))) return n;
                            if (s.id === r) return n.push(s), n
                        } else if (d && (s = d.getElementById(r)) && $(t, s) && s.id === r) return n.push(s), n
                    } else {
                        if (l[2]) return J.apply(n, t.getElementsByTagName(e)), n;
                        if ((r = l[3]) && x.getElementsByClassName && t.getElementsByClassName) return J.apply(n, t.getElementsByClassName(r)), n
                    }
                if (x.qsa && !Q[e + " "] && (!j || !j.test(e))) {
                    if (1 !== p) d = t, c = e;
                    else if ("object" !== t.nodeName.toLowerCase()) {
                        for ((a = t.getAttribute("id")) ? a = a.replace(we, xe) : t.setAttribute("id", a = F), o = (u = S(e)).length; o--;) u[o] = "#" + a + " " + h(u[o]);
                        c = u.join(","), d = ye.test(e) && f(t.parentNode) || t
                    }
                    if (c) try {
                        return J.apply(n, d.querySelectorAll(c)), n
                    } catch (g) {} finally {
                        a === F && t.removeAttribute("id")
                    }
                }
            }
            return k(e.replace(ae, "$1"), t, n, i)
        }

        function n() {
            function e(n, i) {
                return t.push(n + " ") > T.cacheLength && delete e[t.shift()], e[n + " "] = i
            }
            var t = [];
            return e
        }

        function i(e) {
            return e[F] = !0, e
        }

        function r(e) {
            var t = O.createElement("fieldset");
            try {
                return !!e(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function o(e, t) {
            for (var n = e.split("|"), i = n.length; i--;) T.attrHandle[n[i]] = t
        }

        function s(e, t) {
            var n = t && e,
                i = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (i) return i;
            if (n)
                for (; n = n.nextSibling;)
                    if (n === t) return -1;
            return e ? 1 : -1
        }

        function a(e) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === e
            }
        }

        function l(e) {
            return function(t) {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function u(e) {
            return function(t) {
                return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Ee(t) === e : t.disabled === e : "label" in t && t.disabled === e
            }
        }

        function c(e) {
            return i(function(t) {
                return t = +t, i(function(n, i) {
                    for (var r, o = e([], n.length, t), s = o.length; s--;) n[r = o[s]] && (n[r] = !(i[r] = n[r]))
                })
            })
        }

        function f(e) {
            return e && "undefined" != typeof e.getElementsByTagName && e
        }

        function d() {}

        function h(e) {
            for (var t = 0, n = e.length, i = ""; t < n; t++) i += e[t].value;
            return i
        }

        function p(e, t, n) {
            var i = t.dir,
                r = t.next,
                o = r || i,
                s = n && "parentNode" === o,
                a = W++;
            return t.first ? function(t, n, r) {
                for (; t = t[i];)
                    if (1 === t.nodeType || s) return e(t, n, r);
                return !1
            } : function(t, n, l) {
                var u, c, f, d = [B, a];
                if (l) {
                    for (; t = t[i];)
                        if ((1 === t.nodeType || s) && e(t, n, l)) return !0
                } else
                    for (; t = t[i];)
                        if (1 === t.nodeType || s)
                            if (c = (f = t[F] || (t[F] = {}))[t.uniqueID] || (f[t.uniqueID] = {}), r && r === t.nodeName.toLowerCase()) t = t[i] || t;
                            else {
                                if ((u = c[o]) && u[0] === B && u[1] === a) return d[2] = u[2];
                                if (c[o] = d, d[2] = e(t, n, l)) return !0
                            } return !1
            }
        }

        function g(e) {
            return e.length > 1 ? function(t, n, i) {
                for (var r = e.length; r--;)
                    if (!e[r](t, n, i)) return !1;
                return !0
            } : e[0]
        }

        function m(e, n, i) {
            for (var r = 0, o = n.length; r < o; r++) t(e, n[r], i);
            return i
        }

        function v(e, t, n, i, r) {
            for (var o, s = [], a = 0, l = e.length, u = null != t; a < l; a++)(o = e[a]) && (n && !n(o, i, r) || (s.push(o), u && t.push(a)));
            return s
        }

        function y(e, t, n, r, o, s) {
            return r && !r[F] && (r = y(r)), o && !o[F] && (o = y(o, s)), i(function(i, s, a, l) {
                var u, c, f, d = [],
                    h = [],
                    p = s.length,
                    g = i || m(t || "*", a.nodeType ? [a] : a, []),
                    y = !e || !i && t ? g : v(g, d, e, a, l),
                    b = n ? o || (i ? e : p || r) ? [] : s : y;
                if (n && n(y, b, a, l), r)
                    for (u = v(b, h), r(u, [], a, l), c = u.length; c--;)(f = u[c]) && (b[h[c]] = !(y[h[c]] = f));
                if (i) {
                    if (o || e) {
                        if (o) {
                            for (u = [], c = b.length; c--;)(f = b[c]) && u.push(y[c] = f);
                            o(null, b = [], u, l)
                        }
                        for (c = b.length; c--;)(f = b[c]) && (u = o ? ee(i, f) : d[c]) > -1 && (i[u] = !(s[u] = f))
                    }
                } else b = v(b === s ? b.splice(p, b.length) : b), o ? o(null, s, b, l) : J.apply(s, b)
            })
        }

        function b(e) {
            for (var t, n, i, r = e.length, o = T.relative[e[0].type], s = o || T.relative[" "], a = o ? 1 : 0, l = p(function(e) {
                    return e === t
                }, s, !0), u = p(function(e) {
                    return ee(t, e) > -1
                }, s, !0), c = [function(e, n, i) {
                    var r = !o && (i || n !== D) || ((t = n).nodeType ? l(e, n, i) : u(e, n, i));
                    return t = null, r
                }]; a < r; a++)
                if (n = T.relative[e[a].type]) c = [p(g(c), n)];
                else {
                    if ((n = T.filter[e[a].type].apply(null, e[a].matches))[F]) {
                        for (i = ++a; i < r && !T.relative[e[i].type]; i++);
                        return y(a > 1 && g(c), a > 1 && h(e.slice(0, a - 1).concat({
                            value: " " === e[a - 2].type ? "*" : ""
                        })).replace(ae, "$1"), n, a < i && b(e.slice(a, i)), i < r && b(e = e.slice(i)), i < r && h(e))
                    }
                    c.push(n)
                }
            return g(c)
        }

        function _(e, n) {
            var r = n.length > 0,
                o = e.length > 0,
                s = function(i, s, a, l, u) {
                    var c, f, d, h = 0,
                        p = "0",
                        g = i && [],
                        m = [],
                        y = D,
                        b = i || o && T.find.TAG("*", u),
                        _ = B += null == y ? 1 : Math.random() || .1,
                        w = b.length;
                    for (u && (D = s === O || s || u); p !== w && null != (c = b[p]); p++) {
                        if (o && c) {
                            for (f = 0, s || c.ownerDocument === O || (R(c), a = !I); d = e[f++];)
                                if (d(c, s || O, a)) {
                                    l.push(c);
                                    break
                                }
                            u && (B = _)
                        }
                        r && ((c = !d && c) && h--, i && g.push(c))
                    }
                    if (h += p, r && p !== h) {
                        for (f = 0; d = n[f++];) d(g, m, s, a);
                        if (i) {
                            if (h > 0)
                                for (; p--;) g[p] || m[p] || (m[p] = K.call(l));
                            m = v(m)
                        }
                        J.apply(l, m), u && !i && m.length > 0 && h + n.length > 1 && t.uniqueSort(l)
                    }
                    return u && (B = _, D = y), g
                };
            return r ? i(s) : s
        }
        var w, x, T, E, C, S, N, k, D, A, P, R, O, L, I, j, q, H, $, F = "sizzle" + 1 * new Date,
            M = e.document,
            B = 0,
            W = 0,
            U = n(),
            z = n(),
            Q = n(),
            V = function(e, t) {
                return e === t && (P = !0), 0
            },
            Y = {}.hasOwnProperty,
            X = [],
            K = X.pop,
            G = X.push,
            J = X.push,
            Z = X.slice,
            ee = function(e, t) {
                for (var n = 0, i = e.length; n < i; n++)
                    if (e[n] === t) return n;
                return -1
            },
            te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            ne = "[\\x20\\t\\r\\n\\f]",
            ie = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
            re = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ie + "))|)" + ne + "*\\]",
            oe = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + re + ")*)|.*)\\)|)",
            se = new RegExp(ne + "+", "g"),
            ae = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
            le = new RegExp("^" + ne + "*," + ne + "*"),
            ue = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
            ce = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
            fe = new RegExp(oe),
            de = new RegExp("^" + ie + "$"),
            he = {
                ID: new RegExp("^#(" + ie + ")"),
                CLASS: new RegExp("^\\.(" + ie + ")"),
                TAG: new RegExp("^(" + ie + "|[*])"),
                ATTR: new RegExp("^" + re),
                PSEUDO: new RegExp("^" + oe),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + te + ")$", "i"),
                needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
            },
            pe = /^(?:input|select|textarea|button)$/i,
            ge = /^h\d$/i,
            me = /^[^{]+\{\s*\[native \w/,
            ve = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ye = /[+~]/,
            be = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
            _e = function(e, t, n) {
                var i = "0x" + t - 65536;
                return i != i || n ? t : i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
            },
            we = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            xe = function(e, t) {
                return t ? "\0" === e ? "\ufffd" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
            },
            Te = function() {
                R()
            },
            Ee = p(function(e) {
                return !0 === e.disabled && ("form" in e || "label" in e)
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            J.apply(X = Z.call(M.childNodes), M.childNodes), X[M.childNodes.length].nodeType
        } catch (Ce) {
            J = {
                apply: X.length ? function(e, t) {
                    G.apply(e, Z.call(t))
                } : function(e, t) {
                    for (var n = e.length, i = 0; e[n++] = t[i++];);
                    e.length = n - 1
                }
            }
        }
        for (w in x = t.support = {}, C = t.isXML = function(e) {
                var t = e && (e.ownerDocument || e).documentElement;
                return !!t && "HTML" !== t.nodeName
            }, R = t.setDocument = function(e) {
                var t, n, i = e ? e.ownerDocument || e : M;
                return i !== O && 9 === i.nodeType && i.documentElement ? (L = (O = i).documentElement, I = !C(O), M !== O && (n = O.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", Te, !1) : n.attachEvent && n.attachEvent("onunload", Te)), x.attributes = r(function(e) {
                    return e.className = "i", !e.getAttribute("className")
                }), x.getElementsByTagName = r(function(e) {
                    return e.appendChild(O.createComment("")), !e.getElementsByTagName("*").length
                }), x.getElementsByClassName = me.test(O.getElementsByClassName), x.getById = r(function(e) {
                    return L.appendChild(e).id = F, !O.getElementsByName || !O.getElementsByName(F).length
                }), x.getById ? (T.filter.ID = function(e) {
                    var t = e.replace(be, _e);
                    return function(e) {
                        return e.getAttribute("id") === t
                    }
                }, T.find.ID = function(e, t) {
                    if ("undefined" != typeof t.getElementById && I) {
                        var n = t.getElementById(e);
                        return n ? [n] : []
                    }
                }) : (T.filter.ID = function(e) {
                    var t = e.replace(be, _e);
                    return function(e) {
                        var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
                        return n && n.value === t
                    }
                }, T.find.ID = function(e, t) {
                    if ("undefined" != typeof t.getElementById && I) {
                        var n, i, r, o = t.getElementById(e);
                        if (o) {
                            if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
                            for (r = t.getElementsByName(e), i = 0; o = r[i++];)
                                if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
                        }
                        return []
                    }
                }), T.find.TAG = x.getElementsByTagName ? function(e, t) {
                    return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : x.qsa ? t.querySelectorAll(e) : void 0
                } : function(e, t) {
                    var n, i = [],
                        r = 0,
                        o = t.getElementsByTagName(e);
                    if ("*" === e) {
                        for (; n = o[r++];) 1 === n.nodeType && i.push(n);
                        return i
                    }
                    return o
                }, T.find.CLASS = x.getElementsByClassName && function(e, t) {
                    if ("undefined" != typeof t.getElementsByClassName && I) return t.getElementsByClassName(e)
                }, q = [], j = [], (x.qsa = me.test(O.querySelectorAll)) && (r(function(e) {
                    L.appendChild(e).innerHTML = "<a id='" + F + "'></a><select id='" + F + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && j.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || j.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + F + "-]").length || j.push("~="), e.querySelectorAll(":checked").length || j.push(":checked"), e.querySelectorAll("a#" + F + "+*").length || j.push(".#.+[+~]")
                }), r(function(e) {
                    e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                    var t = O.createElement("input");
                    t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && j.push("name" + ne + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && j.push(":enabled", ":disabled"), L.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && j.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), j.push(",.*:")
                })), (x.matchesSelector = me.test(H = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && r(function(e) {
                    x.disconnectedMatch = H.call(e, "*"), H.call(e, "[s!='']:x"), q.push("!=", oe)
                }), j = j.length && new RegExp(j.join("|")), q = q.length && new RegExp(q.join("|")), t = me.test(L.compareDocumentPosition), $ = t || me.test(L.contains) ? function(e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                        i = t && t.parentNode;
                    return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
                } : function(e, t) {
                    if (t)
                        for (; t = t.parentNode;)
                            if (t === e) return !0;
                    return !1
                }, V = t ? function(e, t) {
                    if (e === t) return P = !0, 0;
                    var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                    return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !x.sortDetached && t.compareDocumentPosition(e) === n ? e === O || e.ownerDocument === M && $(M, e) ? -1 : t === O || t.ownerDocument === M && $(M, t) ? 1 : A ? ee(A, e) - ee(A, t) : 0 : 4 & n ? -1 : 1)
                } : function(e, t) {
                    if (e === t) return P = !0, 0;
                    var n, i = 0,
                        r = e.parentNode,
                        o = t.parentNode,
                        a = [e],
                        l = [t];
                    if (!r || !o) return e === O ? -1 : t === O ? 1 : r ? -1 : o ? 1 : A ? ee(A, e) - ee(A, t) : 0;
                    if (r === o) return s(e, t);
                    for (n = e; n = n.parentNode;) a.unshift(n);
                    for (n = t; n = n.parentNode;) l.unshift(n);
                    for (; a[i] === l[i];) i++;
                    return i ? s(a[i], l[i]) : a[i] === M ? -1 : l[i] === M ? 1 : 0
                }, O) : O
            }, t.matches = function(e, n) {
                return t(e, null, null, n)
            }, t.matchesSelector = function(e, n) {
                if ((e.ownerDocument || e) !== O && R(e), n = n.replace(ce, "='$1']"), x.matchesSelector && I && !Q[n + " "] && (!q || !q.test(n)) && (!j || !j.test(n))) try {
                    var i = H.call(e, n);
                    if (i || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
                } catch (Ce) {}
                return t(n, O, null, [e]).length > 0
            }, t.contains = function(e, t) {
                return (e.ownerDocument || e) !== O && R(e), $(e, t)
            }, t.attr = function(e, t) {
                (e.ownerDocument || e) !== O && R(e);
                var n = T.attrHandle[t.toLowerCase()],
                    i = n && Y.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !I) : undefined;
                return i !== undefined ? i : x.attributes || !I ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
            }, t.escape = function(e) {
                return (e + "").replace(we, xe)
            }, t.error = function(e) {
                throw new Error("Syntax error, unrecognized expression: " + e)
            }, t.uniqueSort = function(e) {
                var t, n = [],
                    i = 0,
                    r = 0;
                if (P = !x.detectDuplicates, A = !x.sortStable && e.slice(0), e.sort(V), P) {
                    for (; t = e[r++];) t === e[r] && (i = n.push(r));
                    for (; i--;) e.splice(n[i], 1)
                }
                return A = null, e
            }, E = t.getText = function(e) {
                var t, n = "",
                    i = 0,
                    r = e.nodeType;
                if (r) {
                    if (1 === r || 9 === r || 11 === r) {
                        if ("string" == typeof e.textContent) return e.textContent;
                        for (e = e.firstChild; e; e = e.nextSibling) n += E(e)
                    } else if (3 === r || 4 === r) return e.nodeValue
                } else
                    for (; t = e[i++];) n += E(t);
                return n
            }, (T = t.selectors = {
                cacheLength: 50,
                createPseudo: i,
                match: he,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(e) {
                        return e[1] = e[1].replace(be, _e), e[3] = (e[3] || e[4] || e[5] || "").replace(be, _e), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                    },
                    CHILD: function(e) {
                        return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                    },
                    PSEUDO: function(e) {
                        var t, n = !e[6] && e[2];
                        return he.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && fe.test(n) && (t = S(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(e) {
                        var t = e.replace(be, _e).toLowerCase();
                        return "*" === e ? function() {
                            return !0
                        } : function(e) {
                            return e.nodeName && e.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(e) {
                        var t = U[e + " "];
                        return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && U(e, function(e) {
                            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(e, n, i) {
                        return function(r) {
                            var o = t.attr(r, e);
                            return null == o ? "!=" === n : !n || (o += "", "=" === n ? o === i : "!=" === n ? o !== i : "^=" === n ? i && 0 === o.indexOf(i) : "*=" === n ? i && o.indexOf(i) > -1 : "$=" === n ? i && o.slice(-i.length) === i : "~=" === n ? (" " + o.replace(se, " ") + " ").indexOf(i) > -1 : "|=" === n && (o === i || o.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(e, t, n, i, r) {
                        var o = "nth" !== e.slice(0, 3),
                            s = "last" !== e.slice(-4),
                            a = "of-type" === t;
                        return 1 === i && 0 === r ? function(e) {
                            return !!e.parentNode
                        } : function(t, n, l) {
                            var u, c, f, d, h, p, g = o !== s ? "nextSibling" : "previousSibling",
                                m = t.parentNode,
                                v = a && t.nodeName.toLowerCase(),
                                y = !l && !a,
                                b = !1;
                            if (m) {
                                if (o) {
                                    for (; g;) {
                                        for (d = t; d = d[g];)
                                            if (a ? d.nodeName.toLowerCase() === v : 1 === d.nodeType) return !1;
                                        p = g = "only" === e && !p && "nextSibling"
                                    }
                                    return !0
                                }
                                if (p = [s ? m.firstChild : m.lastChild], s && y) {
                                    for (b = (h = (u = (c = (f = (d = m)[F] || (d[F] = {}))[d.uniqueID] || (f[d.uniqueID] = {}))[e] || [])[0] === B && u[1]) && u[2], d = h && m.childNodes[h]; d = ++h && d && d[g] || (b = h = 0) || p.pop();)
                                        if (1 === d.nodeType && ++b && d === t) {
                                            c[e] = [B, h, b];
                                            break
                                        }
                                } else if (y && (b = h = (u = (c = (f = (d = t)[F] || (d[F] = {}))[d.uniqueID] || (f[d.uniqueID] = {}))[e] || [])[0] === B && u[1]), !1 === b)
                                    for (;
                                        (d = ++h && d && d[g] || (b = h = 0) || p.pop()) && ((a ? d.nodeName.toLowerCase() !== v : 1 !== d.nodeType) || !++b || (y && ((c = (f = d[F] || (d[F] = {}))[d.uniqueID] || (f[d.uniqueID] = {}))[e] = [B, b]), d !== t)););
                                return (b -= r) === i || b % i == 0 && b / i >= 0
                            }
                        }
                    },
                    PSEUDO: function(e, n) {
                        var r, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                        return o[F] ? o(n) : o.length > 1 ? (r = [e, e, "", n], T.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function(e, t) {
                            for (var i, r = o(e, n), s = r.length; s--;) e[i = ee(e, r[s])] = !(t[i] = r[s])
                        }) : function(e) {
                            return o(e, 0, r)
                        }) : o
                    }
                },
                pseudos: {
                    not: i(function(e) {
                        var t = [],
                            n = [],
                            r = N(e.replace(ae, "$1"));
                        return r[F] ? i(function(e, t, n, i) {
                            for (var o, s = r(e, null, i, []), a = e.length; a--;)(o = s[a]) && (e[a] = !(t[a] = o))
                        }) : function(e, i, o) {
                            return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
                        }
                    }),
                    has: i(function(e) {
                        return function(n) {
                            return t(e, n).length > 0
                        }
                    }),
                    contains: i(function(e) {
                        return e = e.replace(be, _e),
                            function(t) {
                                return (t.textContent || t.innerText || E(t)).indexOf(e) > -1
                            }
                    }),
                    lang: i(function(e) {
                        return de.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(be, _e).toLowerCase(),
                            function(t) {
                                var n;
                                do {
                                    if (n = I ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                } while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var n = e.location && e.location.hash;
                        return n && n.slice(1) === t.id
                    },
                    root: function(e) {
                        return e === L
                    },
                    focus: function(e) {
                        return e === O.activeElement && (!O.hasFocus || O.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                    },
                    enabled: u(!1),
                    disabled: u(!0),
                    checked: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && !!e.checked || "option" === t && !!e.selected
                    },
                    selected: function(e) {
                        return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                    },
                    empty: function(e) {
                        for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(e) {
                        return !T.pseudos.empty(e)
                    },
                    header: function(e) {
                        return ge.test(e.nodeName)
                    },
                    input: function(e) {
                        return pe.test(e.nodeName)
                    },
                    button: function(e) {
                        var t = e.nodeName.toLowerCase();
                        return "input" === t && "button" === e.type || "button" === t
                    },
                    text: function(e) {
                        var t;
                        return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: c(function() {
                        return [0]
                    }),
                    last: c(function(e, t) {
                        return [t - 1]
                    }),
                    eq: c(function(e, t, n) {
                        return [n < 0 ? n + t : n]
                    }),
                    even: c(function(e, t) {
                        for (var n = 0; n < t; n += 2) e.push(n);
                        return e
                    }),
                    odd: c(function(e, t) {
                        for (var n = 1; n < t; n += 2) e.push(n);
                        return e
                    }),
                    lt: c(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; --i >= 0;) e.push(i);
                        return e
                    }),
                    gt: c(function(e, t, n) {
                        for (var i = n < 0 ? n + t : n; ++i < t;) e.push(i);
                        return e
                    })
                }
            }).pseudos.nth = T.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) T.pseudos[w] = a(w);
        for (w in {
                submit: !0,
                reset: !0
            }) T.pseudos[w] = l(w);
        return d.prototype = T.filters = T.pseudos, T.setFilters = new d, S = t.tokenize = function(e, n) {
            var i, r, o, s, a, l, u, c = z[e + " "];
            if (c) return n ? 0 : c.slice(0);
            for (a = e, l = [], u = T.preFilter; a;) {
                for (s in i && !(r = le.exec(a)) || (r && (a = a.slice(r[0].length) || a), l.push(o = [])), i = !1, (r = ue.exec(a)) && (i = r.shift(), o.push({
                        value: i,
                        type: r[0].replace(ae, " ")
                    }), a = a.slice(i.length)), T.filter) !(r = he[s].exec(a)) || u[s] && !(r = u[s](r)) || (i = r.shift(), o.push({
                    value: i,
                    type: s,
                    matches: r
                }), a = a.slice(i.length));
                if (!i) break
            }
            return n ? a.length : a ? t.error(e) : z(e, l).slice(0)
        }, N = t.compile = function(e, t) {
            var n, i = [],
                r = [],
                o = Q[e + " "];
            if (!o) {
                for (t || (t = S(e)), n = t.length; n--;)(o = b(t[n]))[F] ? i.push(o) : r.push(o);
                (o = Q(e, _(r, i))).selector = e
            }
            return o
        }, k = t.select = function(e, t, n, i) {
            var r, o, s, a, l, u = "function" == typeof e && e,
                c = !i && S(e = u.selector || e);
            if (n = n || [], 1 === c.length) {
                if ((o = c[0] = c[0].slice(0)).length > 2 && "ID" === (s = o[0]).type && 9 === t.nodeType && I && T.relative[o[1].type]) {
                    if (!(t = (T.find.ID(s.matches[0].replace(be, _e), t) || [])[0])) return n;
                    u && (t = t.parentNode), e = e.slice(o.shift().value.length)
                }
                for (r = he.needsContext.test(e) ? 0 : o.length; r-- && (s = o[r], !T.relative[a = s.type]);)
                    if ((l = T.find[a]) && (i = l(s.matches[0].replace(be, _e), ye.test(o[0].type) && f(t.parentNode) || t))) {
                        if (o.splice(r, 1), !(e = i.length && h(o))) return J.apply(n, i), n;
                        break
                    }
            }
            return (u || N(e, c))(i, t, !I, n, !t || ye.test(e) && f(t.parentNode) || t), n
        }, x.sortStable = F.split("").sort(V).join("") === F, x.detectDuplicates = !!P, R(), x.sortDetached = r(function(e) {
            return 1 & e.compareDocumentPosition(O.createElement("fieldset"))
        }), r(function(e) {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), x.attributes && r(function(e) {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
        }), r(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(te, function(e, t, n) {
            var i;
            if (!n) return !0 === e[t] ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
        }), t
    }(e);
    xe.find = Ee, xe.expr = Ee.selectors, xe.expr[":"] = xe.expr.pseudos, xe.uniqueSort = xe.unique = Ee.uniqueSort, xe.text = Ee.getText, xe.isXMLDoc = Ee.isXML, xe.contains = Ee.contains, xe.escapeSelector = Ee.escape;
    var Ce = function(e, t, n) {
            for (var i = [], r = n !== undefined;
                (e = e[t]) && 9 !== e.nodeType;)
                if (1 === e.nodeType) {
                    if (r && xe(e).is(n)) break;
                    i.push(e)
                }
            return i
        },
        Se = function(e, t) {
            for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
            return n
        },
        Ne = xe.expr.match.needsContext,
        ke = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    xe.filter = function(e, t, n) {
        var i = t[0];
        return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? xe.find.matchesSelector(i, e) ? [i] : [] : xe.find.matches(e, xe.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }, xe.fn.extend({
        find: function(e) {
            var t, n, i = this.length,
                r = this;
            if ("string" != typeof e) return this.pushStack(xe(e).filter(function() {
                for (t = 0; t < i; t++)
                    if (xe.contains(r[t], this)) return !0
            }));
            for (n = this.pushStack([]), t = 0; t < i; t++) xe.find(e, r[t], n);
            return i > 1 ? xe.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(s(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(s(this, e || [], !0))
        },
        is: function(e) {
            return !!s(this, "string" == typeof e && Ne.test(e) ? xe(e) : e || [], !1).length
        }
    });
    var De, Ae = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (xe.fn.init = function(e, t, n) {
        var i, r;
        if (!e) return this;
        if (n = n || De, "string" == typeof e) {
            if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : Ae.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (i[1]) {
                if (t = t instanceof xe ? t[0] : t, xe.merge(this, xe.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : se, !0)), ke.test(i[1]) && xe.isPlainObject(t))
                    for (i in t) ye(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                return this
            }
            return (r = se.getElementById(i[2])) && (this[0] = r, this.length = 1), this
        }
        return e.nodeType ? (this[0] = e, this.length = 1, this) : ye(e) ? n.ready !== undefined ? n.ready(e) : e(xe) : xe.makeArray(e, this)
    }).prototype = xe.fn, De = xe(se);
    var Pe = /^(?:parents|prev(?:Until|All))/,
        Re = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    xe.fn.extend({
        has: function(e) {
            var t = xe(e, this),
                n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (xe.contains(this, t[e])) return !0
            })
        },
        closest: function(e, t) {
            var n, i = 0,
                r = this.length,
                o = [],
                s = "string" != typeof e && xe(e);
            if (!Ne.test(e))
                for (; i < r; i++)
                    for (n = this[i]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (s ? s.index(n) > -1 : 1 === n.nodeType && xe.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(o.length > 1 ? xe.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? fe.call(xe(e), this[0]) : fe.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(xe.uniqueSort(xe.merge(this.get(), xe(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }), xe.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return Ce(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return Ce(e, "parentNode", n)
        },
        next: function(e) {
            return a(e, "nextSibling")
        },
        prev: function(e) {
            return a(e, "previousSibling")
        },
        nextAll: function(e) {
            return Ce(e, "nextSibling")
        },
        prevAll: function(e) {
            return Ce(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return Ce(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return Ce(e, "previousSibling", n)
        },
        siblings: function(e) {
            return Se((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return Se(e.firstChild)
        },
        contents: function(e) {
            return o(e, "iframe") ? e.contentDocument : (o(e, "template") && (e = e.content || e), xe.merge([], e.childNodes))
        }
    }, function(e, t) {
        xe.fn[e] = function(n, i) {
            var r = xe.map(this, t, n);
            return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (r = xe.filter(i, r)), this.length > 1 && (Re[e] || xe.uniqueSort(r), Pe.test(e) && r.reverse()), this.pushStack(r)
        }
    });
    var Oe = /[^\x20\t\r\n\f]+/g;
    xe.Callbacks = function(e) {
        e = "string" == typeof e ? l(e) : xe.extend({}, e);
        var t, n, r, o, s = [],
            a = [],
            u = -1,
            c = function() {
                for (o = o || e.once, r = t = !0; a.length; u = -1)
                    for (n = a.shift(); ++u < s.length;) !1 === s[u].apply(n[0], n[1]) && e.stopOnFalse && (u = s.length, n = !1);
                e.memory || (n = !1), t = !1, o && (s = n ? [] : "")
            },
            f = {
                add: function() {
                    return s && (n && !t && (u = s.length - 1, a.push(n)), function r(t) {
                        xe.each(t, function(t, n) {
                            ye(n) ? e.unique && f.has(n) || s.push(n) : n && n.length && "string" !== i(n) && r(n)
                        })
                    }(arguments), n && !t && c()), this
                },
                remove: function() {
                    return xe.each(arguments, function(e, t) {
                        for (var n;
                            (n = xe.inArray(t, s, n)) > -1;) s.splice(n, 1), n <= u && u--
                    }), this
                },
                has: function(e) {
                    return e ? xe.inArray(e, s) > -1 : s.length > 0
                },
                empty: function() {
                    return s && (s = []), this
                },
                disable: function() {
                    return o = a = [], s = n = "", this
                },
                disabled: function() {
                    return !s
                },
                lock: function() {
                    return o = a = [], n || t || (s = n = ""), this
                },
                locked: function() {
                    return !!o
                },
                fireWith: function(e, n) {
                    return o || (n = [e, (n = n || []).slice ? n.slice() : n], a.push(n), t || c()), this
                },
                fire: function() {
                    return f.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!r
                }
            };
        return f
    }, xe.extend({
        Deferred: function(t) {
            var n = [
                    ["notify", "progress", xe.Callbacks("memory"), xe.Callbacks("memory"), 2],
                    ["resolve", "done", xe.Callbacks("once memory"), xe.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", xe.Callbacks("once memory"), xe.Callbacks("once memory"), 1, "rejected"]
                ],
                i = "pending",
                r = {
                    state: function() {
                        return i
                    },
                    always: function() {
                        return o.done(arguments).fail(arguments), this
                    },
                    "catch": function(e) {
                        return r.then(null, e)
                    },
                    pipe: function() {
                        var e = arguments;
                        return xe.Deferred(function(t) {
                            xe.each(n, function(n, i) {
                                var r = ye(e[i[4]]) && e[i[4]];
                                o[i[1]](function() {
                                    var e = r && r.apply(this, arguments);
                                    e && ye(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[i[0] + "With"](this, r ? [e] : arguments)
                                })
                            }), e = null
                        }).promise()
                    },
                    then: function(t, i, r) {
                        function o(t, n, i, r) {
                            return function() {
                                var a = this,
                                    l = arguments,
                                    f = function() {
                                        var e, f;
                                        if (!(t < s)) {
                                            if ((e = i.apply(a, l)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                            f = e && ("object" == typeof e || "function" == typeof e) && e.then, ye(f) ? r ? f.call(e, o(s, n, u, r), o(s, n, c, r)) : (s++, f.call(e, o(s, n, u, r), o(s, n, c, r), o(s, n, u, n.notifyWith))) : (i !== u && (a = undefined, l = [e]), (r || n.resolveWith)(a, l))
                                        }
                                    },
                                    d = r ? f : function() {
                                        try {
                                            f()
                                        } catch (e) {
                                            xe.Deferred.exceptionHook && xe.Deferred.exceptionHook(e, d.stackTrace), t + 1 >= s && (i !== c && (a = undefined, l = [e]), n.rejectWith(a, l))
                                        }
                                    };
                                t ? d() : (xe.Deferred.getStackHook && (d.stackTrace = xe.Deferred.getStackHook()), e.setTimeout(d))
                            }
                        }
                        var s = 0;
                        return xe.Deferred(function(e) {
                            n[0][3].add(o(0, e, ye(r) ? r : u, e.notifyWith)), n[1][3].add(o(0, e, ye(t) ? t : u)), n[2][3].add(o(0, e, ye(i) ? i : c))
                        }).promise()
                    },
                    promise: function(e) {
                        return null != e ? xe.extend(e, r) : r
                    }
                },
                o = {};
            return xe.each(n, function(e, t) {
                var s = t[2],
                    a = t[5];
                r[t[1]] = s.add, a && s.add(function() {
                    i = a
                }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), s.add(t[3].fire), o[t[0]] = function() {
                    return o[t[0] + "With"](this === o ? undefined : this, arguments), this
                }, o[t[0] + "With"] = s.fireWith
            }), r.promise(o), t && t.call(o, o), o
        },
        when: function(e) {
            var t = arguments.length,
                n = t,
                i = Array(n),
                r = le.call(arguments),
                o = xe.Deferred(),
                s = function(e) {
                    return function(n) {
                        i[e] = this, r[e] = arguments.length > 1 ? le.call(arguments) : n, --t || o.resolveWith(i, r)
                    }
                };
            if (t <= 1 && (f(e, o.done(s(n)).resolve, o.reject, !t), "pending" === o.state() || ye(r[n] && r[n].then))) return o.then();
            for (; n--;) f(r[n], s(n), o.reject);
            return o.promise()
        }
    });
    var Le = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    xe.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && Le.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }, xe.readyException = function(t) {
        e.setTimeout(function() {
            throw t
        })
    };
    var Ie = xe.Deferred();
    xe.fn.ready = function(e) {
        return Ie.then(e)["catch"](function(e) {
            xe.readyException(e)
        }), this
    }, xe.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --xe.readyWait : xe.isReady) || (xe.isReady = !0, !0 !== e && --xe.readyWait > 0 || Ie.resolveWith(se, [xe]))
        }
    }), xe.ready.then = Ie.then, "complete" === se.readyState || "loading" !== se.readyState && !se.documentElement.doScroll ? e.setTimeout(xe.ready) : (se.addEventListener("DOMContentLoaded", d), e.addEventListener("load", d));
    var je = function(e, t, n, r, o, s, a) {
            var l = 0,
                u = e.length,
                c = null == n;
            if ("object" === i(n))
                for (l in o = !0, n) je(e, t, l, n[l], !0, s, a);
            else if (r !== undefined && (o = !0, ye(r) || (a = !0), c && (a ? (t.call(e, r), t = null) : (c = t, t = function(e, t, n) {
                    return c.call(xe(e), n)
                })), t))
                for (; l < u; l++) t(e[l], n, a ? r : r.call(e[l], l, t(e[l], n)));
            return o ? e : c ? t.call(e) : u ? t(e[0], n) : s
        },
        qe = /^-ms-/,
        He = /-([a-z])/g,
        $e = function(e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
        };
    g.uid = 1, g.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {}, $e(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function(e, t, n) {
            var i, r = this.cache(e);
            if ("string" == typeof t) r[p(t)] = n;
            else
                for (i in t) r[p(i)] = t[i];
            return r
        },
        get: function(e, t) {
            return t === undefined ? this.cache(e) : e[this.expando] && e[this.expando][p(t)]
        },
        access: function(e, t, n) {
            return t === undefined || t && "string" == typeof t && n === undefined ? this.get(e, t) : (this.set(e, t, n), n !== undefined ? n : t)
        },
        remove: function(e, t) {
            var n, i = e[this.expando];
            if (i !== undefined) {
                if (t !== undefined) {
                    n = (t = Array.isArray(t) ? t.map(p) : (t = p(t)) in i ? [t] : t.match(Oe) || []).length;
                    for (; n--;) delete i[t[n]]
                }(t === undefined || xe.isEmptyObject(i)) && (e.nodeType ? e[this.expando] = undefined : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return t !== undefined && !xe.isEmptyObject(t)
        }
    };
    var Fe = new g,
        Me = new g,
        Be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        We = /[A-Z]/g;
    xe.extend({
        hasData: function(e) {
            return Me.hasData(e) || Fe.hasData(e)
        },
        data: function(e, t, n) {
            return Me.access(e, t, n)
        },
        removeData: function(e, t) {
            Me.remove(e, t)
        },
        _data: function(e, t, n) {
            return Fe.access(e, t, n)
        },
        _removeData: function(e, t) {
            Fe.remove(e, t)
        }
    }), xe.fn.extend({
        data: function(e, t) {
            var n, i, r, o = this[0],
                s = o && o.attributes;
            if (e === undefined) {
                if (this.length && (r = Me.get(o), 1 === o.nodeType && !Fe.get(o, "hasDataAttrs"))) {
                    for (n = s.length; n--;) s[n] && 0 === (i = s[n].name).indexOf("data-") && (i = p(i.slice(5)), v(o, i, r[i]));
                    Fe.set(o, "hasDataAttrs", !0)
                }
                return r
            }
            return "object" == typeof e ? this.each(function() {
                Me.set(this, e)
            }) : je(this, function(t) {
                var n;
                if (o && t === undefined) return (n = Me.get(o, e)) !== undefined ? n : (n = v(o, e)) !== undefined ? n : void 0;
                this.each(function() {
                    Me.set(this, e, t)
                })
            }, null, t, arguments.length > 1, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                Me.remove(this, e)
            })
        }
    }), xe.extend({
        queue: function(e, t, n) {
            var i;
            if (e) return t = (t || "fx") + "queue", i = Fe.get(e, t), n && (!i || Array.isArray(n) ? i = Fe.access(e, t, xe.makeArray(n)) : i.push(n)), i || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = xe.queue(e, t),
                i = n.length,
                r = n.shift(),
                o = xe._queueHooks(e, t),
                s = function() {
                    xe.dequeue(e, t)
                };
            "inprogress" === r && (r = n.shift(), i--), r && ("fx" === t && n.unshift("inprogress"), delete o.stop, r.call(e, s, o)), !i && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return Fe.get(e, n) || Fe.access(e, n, {
                empty: xe.Callbacks("once memory").add(function() {
                    Fe.remove(e, [t + "queue", n])
                })
            })
        }
    }), xe.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? xe.queue(this[0], e) : t === undefined ? this : this.each(function() {
                var n = xe.queue(this, e, t);
                xe._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && xe.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                xe.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, i = 1,
                r = xe.Deferred(),
                o = this,
                s = this.length,
                a = function() {
                    --i || r.resolveWith(o, [o])
                };
            for ("string" != typeof e && (t = e, e = undefined), e = e || "fx"; s--;)(n = Fe.get(o[s], e + "queueHooks")) && n.empty && (i++, n.empty.add(a));
            return a(), r.promise(t)
        }
    });
    var Ue = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        ze = new RegExp("^(?:([+-])=|)(" + Ue + ")([a-z%]*)$", "i"),
        Qe = ["Top", "Right", "Bottom", "Left"],
        Ve = function(e, t) {
            return "none" === (e = t || e).style.display || "" === e.style.display && xe.contains(e.ownerDocument, e) && "none" === xe.css(e, "display")
        },
        Ye = function(e, t, n, i) {
            var r, o, s = {};
            for (o in t) s[o] = e.style[o], e.style[o] = t[o];
            for (o in r = n.apply(e, i || []), t) e.style[o] = s[o];
            return r
        },
        Xe = {};
    xe.fn.extend({
        show: function() {
            return _(this, !0)
        },
        hide: function() {
            return _(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Ve(this) ? xe(this).show() : xe(this).hide()
            })
        }
    });
    var Ke = /^(?:checkbox|radio)$/i,
        Ge = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i,
        Je = /^$|^module$|\/(?:java|ecma)script/i,
        Ze = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [0, "", ""]
        };
    Ze.optgroup = Ze.option, Ze.tbody = Ze.tfoot = Ze.colgroup = Ze.caption = Ze.thead, Ze.th = Ze.td;
    var et, tt, nt = /<|&#?\w+;/;
    et = se.createDocumentFragment().appendChild(se.createElement("div")), (tt = se.createElement("input")).setAttribute("type", "radio"), tt.setAttribute("checked", "checked"), tt.setAttribute("name", "t"), et.appendChild(tt), ve.checkClone = et.cloneNode(!0).cloneNode(!0).lastChild.checked, et.innerHTML = "<textarea>x</textarea>", ve.noCloneChecked = !!et.cloneNode(!0).lastChild.defaultValue;
    var it = se.documentElement,
        rt = /^key/,
        ot = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        st = /^([^.]*)(?:\.(.+)|)/;
    xe.event = {
        global: {},
        add: function(e, t, n, i, r) {
            var o, s, a, l, u, c, f, d, h, p, g, m = Fe.get(e);
            if (m)
                for (n.handler && (n = (o = n).handler, r = o.selector), r && xe.find.matchesSelector(it, r), n.guid || (n.guid = xe.guid++), (l = m.events) || (l = m.events = {}), (s = m.handle) || (s = m.handle = function(t) {
                        return void 0 !== xe && xe.event.triggered !== t.type ? xe.event.dispatch.apply(e, arguments) : undefined
                    }), u = (t = (t || "").match(Oe) || [""]).length; u--;) h = g = (a = st.exec(t[u]) || [])[1], p = (a[2] || "").split(".").sort(), h && (f = xe.event.special[h] || {}, h = (r ? f.delegateType : f.bindType) || h, f = xe.event.special[h] || {}, c = xe.extend({
                    type: h,
                    origType: g,
                    data: i,
                    handler: n,
                    guid: n.guid,
                    selector: r,
                    needsContext: r && xe.expr.match.needsContext.test(r),
                    namespace: p.join(".")
                }, o), (d = l[h]) || ((d = l[h] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(e, i, p, s) || e.addEventListener && e.addEventListener(h, s)), f.add && (f.add.call(e, c), c.handler.guid || (c.handler.guid = n.guid)), r ? d.splice(d.delegateCount++, 0, c) : d.push(c), xe.event.global[h] = !0)
        },
        remove: function(e, t, n, i, r) {
            var o, s, a, l, u, c, f, d, h, p, g, m = Fe.hasData(e) && Fe.get(e);
            if (m && (l = m.events)) {
                for (u = (t = (t || "").match(Oe) || [""]).length; u--;)
                    if (h = g = (a = st.exec(t[u]) || [])[1], p = (a[2] || "").split(".").sort(), h) {
                        for (f = xe.event.special[h] || {}, d = l[h = (i ? f.delegateType : f.bindType) || h] || [], a = a[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), s = o = d.length; o--;) c = d[o], !r && g !== c.origType || n && n.guid !== c.guid || a && !a.test(c.namespace) || i && i !== c.selector && ("**" !== i || !c.selector) || (d.splice(o, 1), c.selector && d.delegateCount--, f.remove && f.remove.call(e, c));
                        s && !d.length && (f.teardown && !1 !== f.teardown.call(e, p, m.handle) || xe.removeEvent(e, h, m.handle), delete l[h])
                    } else
                        for (h in l) xe.event.remove(e, h + t[u], n, i, !0);
                xe.isEmptyObject(l) && Fe.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, i, r, o, s, a = xe.event.fix(e),
                l = new Array(arguments.length),
                u = (Fe.get(this, "events") || {})[a.type] || [],
                c = xe.event.special[a.type] || {};
            for (l[0] = a, t = 1; t < arguments.length; t++) l[t] = arguments[t];
            if (a.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, a)) {
                for (s = xe.event.handlers.call(this, a, u), t = 0;
                    (r = s[t++]) && !a.isPropagationStopped();)
                    for (a.currentTarget = r.elem, n = 0;
                        (o = r.handlers[n++]) && !a.isImmediatePropagationStopped();) a.rnamespace && !a.rnamespace.test(o.namespace) || (a.handleObj = o, a.data = o.data, (i = ((xe.event.special[o.origType] || {}).handle || o.handler).apply(r.elem, l)) !== undefined && !1 === (a.result = i) && (a.preventDefault(), a.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, a), a.result
            }
        },
        handlers: function(e, t) {
            var n, i, r, o, s, a = [],
                l = t.delegateCount,
                u = e.target;
            if (l && u.nodeType && !("click" === e.type && e.button >= 1))
                for (; u !== this; u = u.parentNode || this)
                    if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
                        for (o = [], s = {}, n = 0; n < l; n++) s[r = (i = t[n]).selector + " "] === undefined && (s[r] = i.needsContext ? xe(r, this).index(u) > -1 : xe.find(r, this, null, [u]).length), s[r] && o.push(i);
                        o.length && a.push({
                            elem: u,
                            handlers: o
                        })
                    }
            return u = this, l < t.length && a.push({
                elem: u,
                handlers: t.slice(l)
            }), a
        },
        addProp: function(e, t) {
            Object.defineProperty(xe.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: ye(t) ? function() {
                    if (this.originalEvent) return t(this.originalEvent)
                } : function() {
                    if (this.originalEvent) return this.originalEvent[e]
                },
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[xe.expando] ? e : new xe.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            focus: {
                trigger: function() {
                    if (this !== S() && this.focus) return this.focus(), !1
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === S() && this.blur) return this.blur(), !1
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if ("checkbox" === this.type && this.click && o(this, "input")) return this.click(), !1
                },
                _default: function(e) {
                    return o(e.target, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    e.result !== undefined && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    }, xe.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }, xe.Event = function(e, t) {
        if (!(this instanceof xe.Event)) return new xe.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.defaultPrevented === undefined && !1 === e.returnValue ? E : C, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && xe.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[xe.expando] = !0
    }, xe.Event.prototype = {
        constructor: xe.Event,
        isDefaultPrevented: C,
        isPropagationStopped: C,
        isImmediatePropagationStopped: C,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = E, e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = E, e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = E, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
        }
    }, xe.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(e) {
            var t = e.button;
            return null == e.which && rt.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && t !== undefined && ot.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
        }
    }, xe.event.addProp), xe.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        xe.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, i = this,
                    r = e.relatedTarget,
                    o = e.handleObj;
                return r && (r === i || xe.contains(i, r)) || (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), xe.fn.extend({
        on: function(e, t, n, i) {
            return N(this, e, t, n, i)
        },
        one: function(e, t, n, i) {
            return N(this, e, t, n, i, 1)
        },
        off: function(e, t, n) {
            var i, r;
            if (e && e.preventDefault && e.handleObj) return i = e.handleObj, xe(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e) {
                for (r in e) this.off(r, t, e[r]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t, t = undefined), !1 === n && (n = C), this.each(function() {
                xe.event.remove(this, e, n, t)
            })
        }
    });
    var at = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
        lt = /<script|<style|<link/i,
        ut = /checked\s*(?:[^=]|=\s*.checked.)/i,
        ct = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    xe.extend({
        htmlPrefilter: function(e) {
            return e.replace(at, "<$1></$2>")
        },
        clone: function(e, t, n) {
            var i, r, o, s, a = e.cloneNode(!0),
                l = xe.contains(e.ownerDocument, e);
            if (!(ve.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || xe.isXMLDoc(e)))
                for (s = w(a), i = 0, r = (o = w(e)).length; i < r; i++) R(o[i], s[i]);
            if (t)
                if (n)
                    for (o = o || w(e), s = s || w(a), i = 0, r = o.length; i < r; i++) P(o[i], s[i]);
                else P(e, a);
            return (s = w(a, "script")).length > 0 && x(s, !l && w(e, "script")), a
        },
        cleanData: function(e) {
            for (var t, n, i, r = xe.event.special, o = 0;
                (n = e[o]) !== undefined; o++)
                if ($e(n)) {
                    if (t = n[Fe.expando]) {
                        if (t.events)
                            for (i in t.events) r[i] ? xe.event.remove(n, i) : xe.removeEvent(n, i, t.handle);
                        n[Fe.expando] = undefined
                    }
                    n[Me.expando] && (n[Me.expando] = undefined)
                }
        }
    }), xe.fn.extend({
        detach: function(e) {
            return L(this, e, !0)
        },
        remove: function(e) {
            return L(this, e)
        },
        text: function(e) {
            return je(this, function(e) {
                return e === undefined ? xe.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return O(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || k(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return O(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = k(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return O(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return O(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (xe.cleanData(w(e, !1)), e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e, t = null == t ? e : t, this.map(function() {
                return xe.clone(this, e, t)
            })
        },
        html: function(e) {
            return je(this, function(e) {
                var t = this[0] || {},
                    n = 0,
                    i = this.length;
                if (e === undefined && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof e && !lt.test(e) && !Ze[(Ge.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = xe.htmlPrefilter(e);
                    try {
                        for (; n < i; n++) 1 === (t = this[n] || {}).nodeType && (xe.cleanData(w(t, !1)), t.innerHTML = e);
                        t = 0
                    } catch (r) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return O(this, arguments, function(t) {
                var n = this.parentNode;
                xe.inArray(this, e) < 0 && (xe.cleanData(w(this)), n && n.replaceChild(t, this))
            }, e)
        }
    }), xe.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        xe.fn[e] = function(e) {
            for (var n, i = [], r = xe(e), o = r.length - 1, s = 0; s <= o; s++) n = s === o ? this : this.clone(!0), xe(r[s])[t](n), ce.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    var ft = new RegExp("^(" + Ue + ")(?!px)[a-z%]+$", "i"),
        dt = function(t) {
            var n = t.ownerDocument.defaultView;
            return n && n.opener || (n = e), n.getComputedStyle(t)
        },
        ht = new RegExp(Qe.join("|"), "i");
    ! function() {
        function t() {
            if (u) {
                l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", it.appendChild(l).appendChild(u);
                var t = e.getComputedStyle(u);
                i = "1%" !== t.top, a = 12 === n(t.marginLeft), u.style.right = "60%", s = 36 === n(t.right), r = 36 === n(t.width), u.style.position = "absolute", o = 36 === u.offsetWidth || "absolute", it.removeChild(l), u = null
            }
        }

        function n(e) {
            return Math.round(parseFloat(e))
        }
        var i, r, o, s, a, l = se.createElement("div"),
            u = se.createElement("div");
        u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", ve.clearCloneStyle = "content-box" === u.style.backgroundClip, xe.extend(ve, {
            boxSizingReliable: function() {
                return t(), r
            },
            pixelBoxStyles: function() {
                return t(), s
            },
            pixelPosition: function() {
                return t(), i
            },
            reliableMarginLeft: function() {
                return t(), a
            },
            scrollboxSize: function() {
                return t(), o
            }
        }))
    }();
    var pt = /^(none|table(?!-c[ea]).+)/,
        gt = /^--/,
        mt = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        vt = {
            letterSpacing: "0",
            fontWeight: "400"
        },
        yt = ["Webkit", "Moz", "ms"],
        bt = se.createElement("div").style;
    xe.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = I(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, i) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var r, o, s, a = p(t),
                    l = gt.test(t),
                    u = e.style;
                if (l || (t = H(a)), s = xe.cssHooks[t] || xe.cssHooks[a], n === undefined) return s && "get" in s && (r = s.get(e, !1, i)) !== undefined ? r : u[t];
                "string" === (o = typeof n) && (r = ze.exec(n)) && r[1] && (n = y(e, t, r), o = "number"), null != n && n == n && ("number" === o && (n += r && r[3] || (xe.cssNumber[a] ? "" : "px")), ve.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), s && "set" in s && (n = s.set(e, n, i)) === undefined || (l ? u.setProperty(t, n) : u[t] = n))
            }
        },
        css: function(e, t, n, i) {
            var r, o, s, a = p(t);
            return gt.test(t) || (t = H(a)), (s = xe.cssHooks[t] || xe.cssHooks[a]) && "get" in s && (r = s.get(e, !0, n)), r === undefined && (r = I(e, t, i)), "normal" === r && t in vt && (r = vt[t]), "" === n || n ? (o = parseFloat(r), !0 === n || isFinite(o) ? o || 0 : r) : r
        }
    }), xe.each(["height", "width"], function(e, t) {
        xe.cssHooks[t] = {
            get: function(e, n, i) {
                if (n) return !pt.test(xe.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? M(e, t, i) : Ye(e, mt, function() {
                    return M(e, t, i)
                })
            },
            set: function(e, n, i) {
                var r, o = dt(e),
                    s = "border-box" === xe.css(e, "boxSizing", !1, o),
                    a = i && F(e, t, i, s, o);
                return s && ve.scrollboxSize() === o.position && (a -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - F(e, t, "border", !1, o) - .5)), a && (r = ze.exec(n)) && "px" !== (r[3] || "px") && (e.style[t] = n, n = xe.css(e, t)), $(e, n, a)
            }
        }
    }), xe.cssHooks.marginLeft = j(ve.reliableMarginLeft, function(e, t) {
        if (t) return (parseFloat(I(e, "marginLeft")) || e.getBoundingClientRect().left - Ye(e, {
            marginLeft: 0
        }, function() {
            return e.getBoundingClientRect().left
        })) + "px"
    }), xe.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        xe.cssHooks[e + t] = {
            expand: function(n) {
                for (var i = 0, r = {}, o = "string" == typeof n ? n.split(" ") : [n]; i < 4; i++) r[e + Qe[i] + t] = o[i] || o[i - 2] || o[0];
                return r
            }
        }, "margin" !== e && (xe.cssHooks[e + t].set = $)
    }), xe.fn.extend({
        css: function(e, t) {
            return je(this, function(e, t, n) {
                var i, r, o = {},
                    s = 0;
                if (Array.isArray(t)) {
                    for (i = dt(e), r = t.length; s < r; s++) o[t[s]] = xe.css(e, t[s], !1, i);
                    return o
                }
                return n !== undefined ? xe.style(e, t, n) : xe.css(e, t)
            }, e, t, arguments.length > 1)
        }
    }), xe.Tween = B, B.prototype = {
        constructor: B,
        init: function(e, t, n, i, r, o) {
            this.elem = e, this.prop = n, this.easing = r || xe.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = o || (xe.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = B.propHooks[this.prop];
            return e && e.get ? e.get(this) : B.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = B.propHooks[this.prop];
            return this.options.duration ? this.pos = t = xe.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : B.propHooks._default.set(this), this
        }
    }, B.prototype.init.prototype = B.prototype, B.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = xe.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                xe.fx.step[e.prop] ? xe.fx.step[e.prop](e) : 1 !== e.elem.nodeType || null == e.elem.style[xe.cssProps[e.prop]] && !xe.cssHooks[e.prop] ? e.elem[e.prop] = e.now : xe.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }, B.propHooks.scrollTop = B.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, xe.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    }, xe.fx = B.prototype.init, xe.fx.step = {};
    var _t, wt, xt = /^(?:toggle|show|hide)$/,
        Tt = /queueHooks$/;
    xe.Animation = xe.extend(X, {
            tweeners: {
                "*": [function(e, t) {
                    var n = this.createTween(e, t);
                    return y(n.elem, e, ze.exec(t), n), n
                }]
            },
            tweener: function(e, t) {
                ye(e) ? (t = e, e = ["*"]) : e = e.match(Oe);
                for (var n, i = 0, r = e.length; i < r; i++) n = e[i], X.tweeners[n] = X.tweeners[n] || [], X.tweeners[n].unshift(t)
            },
            prefilters: [V],
            prefilter: function(e, t) {
                t ? X.prefilters.unshift(e) : X.prefilters.push(e)
            }
        }), xe.speed = function(e, t, n) {
            var i = e && "object" == typeof e ? xe.extend({}, e) : {
                complete: n || !n && t || ye(e) && e,
                duration: e,
                easing: n && t || t && !ye(t) && t
            };
            return xe.fx.off ? i.duration = 0 : "number" != typeof i.duration && (i.duration in xe.fx.speeds ? i.duration = xe.fx.speeds[i.duration] : i.duration = xe.fx.speeds._default), null != i.queue && !0 !== i.queue || (i.queue = "fx"), i.old = i.complete, i.complete = function() {
                ye(i.old) && i.old.call(this), i.queue && xe.dequeue(this, i.queue)
            }, i
        }, xe.fn.extend({
            fadeTo: function(e, t, n, i) {
                return this.filter(Ve).css("opacity", 0).show().end().animate({
                    opacity: t
                }, e, n, i)
            },
            animate: function(e, t, n, i) {
                var r = xe.isEmptyObject(e),
                    o = xe.speed(t, n, i),
                    s = function() {
                        var t = X(this, xe.extend({}, e), o);
                        (r || Fe.get(this, "finish")) && t.stop(!0)
                    };
                return s.finish = s, r || !1 === o.queue ? this.each(s) : this.queue(o.queue, s)
            },
            stop: function(e, t, n) {
                var i = function(e) {
                    var t = e.stop;
                    delete e.stop, t(n)
                };
                return "string" != typeof e && (n = t, t = e, e = undefined), t && !1 !== e && this.queue(e || "fx", []), this.each(function() {
                    var t = !0,
                        r = null != e && e + "queueHooks",
                        o = xe.timers,
                        s = Fe.get(this);
                    if (r) s[r] && s[r].stop && i(s[r]);
                    else
                        for (r in s) s[r] && s[r].stop && Tt.test(r) && i(s[r]);
                    for (r = o.length; r--;) o[r].elem !== this || null != e && o[r].queue !== e || (o[r].anim.stop(n), t = !1, o.splice(r, 1));
                    !t && n || xe.dequeue(this, e)
                })
            },
            finish: function(e) {
                return !1 !== e && (e = e || "fx"), this.each(function() {
                    var t, n = Fe.get(this),
                        i = n[e + "queue"],
                        r = n[e + "queueHooks"],
                        o = xe.timers,
                        s = i ? i.length : 0;
                    for (n.finish = !0, xe.queue(this, e, []), r && r.stop && r.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                    for (t = 0; t < s; t++) i[t] && i[t].finish && i[t].finish.call(this);
                    delete n.finish
                })
            }
        }), xe.each(["toggle", "show", "hide"], function(e, t) {
            var n = xe.fn[t];
            xe.fn[t] = function(e, i, r) {
                return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(z(t, !0), e, i, r)
            }
        }), xe.each({
            slideDown: z("show"),
            slideUp: z("hide"),
            slideToggle: z("toggle"),
            fadeIn: {
                opacity: "show"
            },
            fadeOut: {
                opacity: "hide"
            },
            fadeToggle: {
                opacity: "toggle"
            }
        }, function(e, t) {
            xe.fn[e] = function(e, n, i) {
                return this.animate(t, e, n, i)
            }
        }), xe.timers = [], xe.fx.tick = function() {
            var e, t = 0,
                n = xe.timers;
            for (_t = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
            n.length || xe.fx.stop(), _t = undefined
        }, xe.fx.timer = function(e) {
            xe.timers.push(e), xe.fx.start()
        }, xe.fx.interval = 13, xe.fx.start = function() {
            wt || (wt = !0, W())
        }, xe.fx.stop = function() {
            wt = null
        }, xe.fx.speeds = {
            slow: 600,
            fast: 200,
            _default: 400
        }, xe.fn.delay = function(t, n) {
            return t = xe.fx && xe.fx.speeds[t] || t, n = n || "fx", this.queue(n, function(n, i) {
                var r = e.setTimeout(n, t);
                i.stop = function() {
                    e.clearTimeout(r)
                }
            })
        },
        function() {
            var e = se.createElement("input"),
                t = se.createElement("select").appendChild(se.createElement("option"));
            e.type = "checkbox", ve.checkOn = "" !== e.value, ve.optSelected = t.selected, (e = se.createElement("input")).value = "t", e.type = "radio", ve.radioValue = "t" === e.value
        }();
    var Et, Ct = xe.expr.attrHandle;
    xe.fn.extend({
        attr: function(e, t) {
            return je(this, xe.attr, e, t, arguments.length > 1)
        },
        removeAttr: function(e) {
            return this.each(function() {
                xe.removeAttr(this, e)
            })
        }
    }), xe.extend({
        attr: function(e, t, n) {
            var i, r, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? xe.prop(e, t, n) : (1 === o && xe.isXMLDoc(e) || (r = xe.attrHooks[t.toLowerCase()] || (xe.expr.match.bool.test(t) ? Et : undefined)), n !== undefined ? null === n ? void xe.removeAttr(e, t) : r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : (e.setAttribute(t, n + ""), n) : r && "get" in r && null !== (i = r.get(e, t)) ? i : null == (i = xe.find.attr(e, t)) ? undefined : i)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!ve.radioValue && "radio" === t && o(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, i = 0,
                r = t && t.match(Oe);
            if (r && 1 === e.nodeType)
                for (; n = r[i++];) e.removeAttribute(n)
        }
    }), Et = {
        set: function(e, t, n) {
            return !1 === t ? xe.removeAttr(e, n) : e.setAttribute(n, n), n
        }
    }, xe.each(xe.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = Ct[t] || xe.find.attr;
        Ct[t] = function(e, t, i) {
            var r, o, s = t.toLowerCase();
            return i || (o = Ct[s], Ct[s] = r, r = null != n(e, t, i) ? s : null, Ct[s] = o), r
        }
    });
    var St = /^(?:input|select|textarea|button)$/i,
        Nt = /^(?:a|area)$/i;
    xe.fn.extend({
        prop: function(e, t) {
            return je(this, xe.prop, e, t, arguments.length > 1)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[xe.propFix[e] || e]
            })
        }
    }), xe.extend({
        prop: function(e, t, n) {
            var i, r, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o) return 1 === o && xe.isXMLDoc(e) || (t = xe.propFix[t] || t, r = xe.propHooks[t]), n !== undefined ? r && "set" in r && (i = r.set(e, n, t)) !== undefined ? i : e[t] = n : r && "get" in r && null !== (i = r.get(e, t)) ? i : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = xe.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : St.test(e.nodeName) || Nt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    }), ve.optSelected || (xe.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    }), xe.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        xe.propFix[this.toLowerCase()] = this
    }), xe.fn.extend({
        addClass: function(e) {
            var t, n, i, r, o, s, a, l = 0;
            if (ye(e)) return this.each(function(t) {
                xe(this).addClass(e.call(this, t, G(this)))
            });
            if ((t = J(e)).length)
                for (; n = this[l++];)
                    if (r = G(n), i = 1 === n.nodeType && " " + K(r) + " ") {
                        for (s = 0; o = t[s++];) i.indexOf(" " + o + " ") < 0 && (i += o + " ");
                        r !== (a = K(i)) && n.setAttribute("class", a)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, i, r, o, s, a, l = 0;
            if (ye(e)) return this.each(function(t) {
                xe(this).removeClass(e.call(this, t, G(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ((t = J(e)).length)
                for (; n = this[l++];)
                    if (r = G(n), i = 1 === n.nodeType && " " + K(r) + " ") {
                        for (s = 0; o = t[s++];)
                            for (; i.indexOf(" " + o + " ") > -1;) i = i.replace(" " + o + " ", " ");
                        r !== (a = K(i)) && n.setAttribute("class", a)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e,
                i = "string" === n || Array.isArray(e);
            return "boolean" == typeof t && i ? t ? this.addClass(e) : this.removeClass(e) : ye(e) ? this.each(function(n) {
                xe(this).toggleClass(e.call(this, n, G(this), t), t)
            }) : this.each(function() {
                var t, r, o, s;
                if (i)
                    for (r = 0, o = xe(this), s = J(e); t = s[r++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else e !== undefined && "boolean" !== n || ((t = G(this)) && Fe.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : Fe.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, i = 0;
            for (t = " " + e + " "; n = this[i++];)
                if (1 === n.nodeType && (" " + K(G(n)) + " ").indexOf(t) > -1) return !0;
            return !1
        }
    });
    var kt = /\r/g;
    xe.fn.extend({
        val: function(e) {
            var t, n, i, r = this[0];
            return arguments.length ? (i = ye(e), this.each(function(n) {
                var r;
                1 === this.nodeType && (null == (r = i ? e.call(this, n, xe(this).val()) : e) ? r = "" : "number" == typeof r ? r += "" : Array.isArray(r) && (r = xe.map(r, function(e) {
                    return null == e ? "" : e + ""
                })), (t = xe.valHooks[this.type] || xe.valHooks[this.nodeName.toLowerCase()]) && "set" in t && t.set(this, r, "value") !== undefined || (this.value = r))
            })) : r ? (t = xe.valHooks[r.type] || xe.valHooks[r.nodeName.toLowerCase()]) && "get" in t && (n = t.get(r, "value")) !== undefined ? n : "string" == typeof(n = r.value) ? n.replace(kt, "") : null == n ? "" : n : void 0
        }
    }), xe.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = xe.find.attr(e, "value");
                    return null != t ? t : K(xe.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, i, r = e.options,
                        s = e.selectedIndex,
                        a = "select-one" === e.type,
                        l = a ? null : [],
                        u = a ? s + 1 : r.length;
                    for (i = s < 0 ? u : a ? s : 0; i < u; i++)
                        if (((n = r[i]).selected || i === s) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                            if (t = xe(n).val(), a) return t;
                            l.push(t)
                        }
                    return l
                },
                set: function(e, t) {
                    for (var n, i, r = e.options, o = xe.makeArray(t), s = r.length; s--;)((i = r[s]).selected = xe.inArray(xe.valHooks.option.get(i), o) > -1) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }
    }), xe.each(["radio", "checkbox"], function() {
        xe.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t)) return e.checked = xe.inArray(xe(e).val(), t) > -1
            }
        }, ve.checkOn || (xe.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    }), ve.focusin = "onfocusin" in e;
    var Dt = /^(?:focusinfocus|focusoutblur)$/,
        At = function(e) {
            e.stopPropagation()
        };
    xe.extend(xe.event, {
        trigger: function(t, n, i, r) {
            var o, s, a, l, u, c, f, d, h = [i || se],
                p = pe.call(t, "type") ? t.type : t,
                g = pe.call(t, "namespace") ? t.namespace.split(".") : [];
            if (s = d = a = i = i || se, 3 !== i.nodeType && 8 !== i.nodeType && !Dt.test(p + xe.event.triggered) && (p.indexOf(".") > -1 && (p = (g = p.split(".")).shift(), g.sort()), u = p.indexOf(":") < 0 && "on" + p, (t = t[xe.expando] ? t : new xe.Event(p, "object" == typeof t && t)).isTrigger = r ? 2 : 3, t.namespace = g.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = undefined, t.target || (t.target = i), n = null == n ? [t] : xe.makeArray(n, [t]), f = xe.event.special[p] || {}, r || !f.trigger || !1 !== f.trigger.apply(i, n))) {
                if (!r && !f.noBubble && !be(i)) {
                    for (l = f.delegateType || p, Dt.test(l + p) || (s = s.parentNode); s; s = s.parentNode) h.push(s), a = s;
                    a === (i.ownerDocument || se) && h.push(a.defaultView || a.parentWindow || e)
                }
                for (o = 0;
                    (s = h[o++]) && !t.isPropagationStopped();) d = s, t.type = o > 1 ? l : f.bindType || p, (c = (Fe.get(s, "events") || {})[t.type] && Fe.get(s, "handle")) && c.apply(s, n), (c = u && s[u]) && c.apply && $e(s) && (t.result = c.apply(s, n), !1 === t.result && t.preventDefault());
                return t.type = p, r || t.isDefaultPrevented() || f._default && !1 !== f._default.apply(h.pop(), n) || !$e(i) || u && ye(i[p]) && !be(i) && ((a = i[u]) && (i[u] = null), xe.event.triggered = p, t.isPropagationStopped() && d.addEventListener(p, At), i[p](), t.isPropagationStopped() && d.removeEventListener(p, At), xe.event.triggered = undefined, a && (i[u] = a)), t.result
            }
        },
        simulate: function(e, t, n) {
            var i = xe.extend(new xe.Event, n, {
                type: e,
                isSimulated: !0
            });
            xe.event.trigger(i, null, t)
        }
    }), xe.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                xe.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n) return xe.event.trigger(e, t, n, !0)
        }
    }), ve.focusin || xe.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            xe.event.simulate(t, e.target, xe.event.fix(e))
        };
        xe.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this,
                    r = Fe.access(i, t);
                r || i.addEventListener(e, n, !0), Fe.access(i, t, (r || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this,
                    r = Fe.access(i, t) - 1;
                r ? Fe.access(i, t, r) : (i.removeEventListener(e, n, !0), Fe.remove(i, t))
            }
        }
    });
    var Pt = e.location,
        Rt = Date.now(),
        Ot = /\?/;
    xe.parseXML = function(t) {
        var n;
        if (!t || "string" != typeof t) return null;
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (i) {
            n = undefined
        }
        return n && !n.getElementsByTagName("parsererror").length || xe.error("Invalid XML: " + t), n
    };
    var Lt = /\[\]$/,
        It = /\r?\n/g,
        jt = /^(?:submit|button|image|reset|file)$/i,
        qt = /^(?:input|select|textarea|keygen)/i;
    xe.param = function(e, t) {
        var n, i = [],
            r = function(e, t) {
                var n = ye(t) ? t() : t;
                i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
            };
        if (Array.isArray(e) || e.jquery && !xe.isPlainObject(e)) xe.each(e, function() {
            r(this.name, this.value)
        });
        else
            for (n in e) Z(n, e[n], t, r);
        return i.join("&")
    }, xe.fn.extend({
        serialize: function() {
            return xe.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = xe.prop(this, "elements");
                return e ? xe.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !xe(this).is(":disabled") && qt.test(this.nodeName) && !jt.test(e) && (this.checked || !Ke.test(e))
            }).map(function(e, t) {
                var n = xe(this).val();
                return null == n ? null : Array.isArray(n) ? xe.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(It, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(It, "\r\n")
                }
            }).get()
        }
    });
    var Ht = /%20/g,
        $t = /#.*$/,
        Ft = /([?&])_=[^&]*/,
        Mt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        Bt = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
        Wt = /^(?:GET|HEAD)$/,
        Ut = /^\/\//,
        zt = {},
        Qt = {},
        Vt = "*/".concat("*"),
        Yt = se.createElement("a");
    Yt.href = Pt.href, xe.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Pt.href,
            type: "GET",
            isLocal: Bt.test(Pt.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Vt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": xe.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? ne(ne(e, xe.ajaxSettings), t) : ne(xe.ajaxSettings, e)
        },
        ajaxPrefilter: ee(zt),
        ajaxTransport: ee(Qt),
        ajax: function(t, n) {
            function i(t, n, i, a) {
                var u, d, h, _, w, x = n;
                c || (c = !0, l && e.clearTimeout(l), r = undefined, s = a || "", T.readyState = t > 0 ? 4 : 0, u = t >= 200 && t < 300 || 304 === t, i && (_ = ie(p, T, i)), _ = re(p, _, T, u), u ? (p.ifModified && ((w = T.getResponseHeader("Last-Modified")) && (xe.lastModified[o] = w), (w = T.getResponseHeader("etag")) && (xe.etag[o] = w)), 204 === t || "HEAD" === p.type ? x = "nocontent" : 304 === t ? x = "notmodified" : (x = _.state, d = _.data, u = !(h = _.error))) : (h = x, !t && x || (x = "error", t < 0 && (t = 0))), T.status = t, T.statusText = (n || x) + "", u ? v.resolveWith(g, [d, x, T]) : v.rejectWith(g, [T, x, h]), T.statusCode(b), b = undefined, f && m.trigger(u ? "ajaxSuccess" : "ajaxError", [T, p, u ? d : h]), y.fireWith(g, [T, x]), f && (m.trigger("ajaxComplete", [T, p]), --xe.active || xe.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t, t = undefined), n = n || {};
            var r, o, s, a, l, u, c, f, d, h, p = xe.ajaxSetup({}, n),
                g = p.context || p,
                m = p.context && (g.nodeType || g.jquery) ? xe(g) : xe.event,
                v = xe.Deferred(),
                y = xe.Callbacks("once memory"),
                b = p.statusCode || {},
                _ = {},
                w = {},
                x = "canceled",
                T = {
                    readyState: 0,
                    getResponseHeader: function(e) {
                        var t;
                        if (c) {
                            if (!a)
                                for (a = {}; t = Mt.exec(s);) a[t[1].toLowerCase()] = t[2];
                            t = a[e.toLowerCase()]
                        }
                        return null == t ? null : t
                    },
                    getAllResponseHeaders: function() {
                        return c ? s : null
                    },
                    setRequestHeader: function(e, t) {
                        return null == c && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e, _[e] = t), this
                    },
                    overrideMimeType: function(e) {
                        return null == c && (p.mimeType = e), this
                    },
                    statusCode: function(e) {
                        var t;
                        if (e)
                            if (c) T.always(e[T.status]);
                            else
                                for (t in e) b[t] = [b[t], e[t]];
                        return this
                    },
                    abort: function(e) {
                        var t = e || x;
                        return r && r.abort(t), i(0, t), this
                    }
                };
            if (v.promise(T), p.url = ((t || p.url || Pt.href) + "").replace(Ut, Pt.protocol + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = (p.dataType || "*").toLowerCase().match(Oe) || [""], null == p.crossDomain) {
                u = se.createElement("a");
                try {
                    u.href = p.url, u.href = u.href, p.crossDomain = Yt.protocol + "//" + Yt.host != u.protocol + "//" + u.host
                } catch (E) {
                    p.crossDomain = !0
                }
            }
            if (p.data && p.processData && "string" != typeof p.data && (p.data = xe.param(p.data, p.traditional)), te(zt, p, n, T), c) return T;
            for (d in (f = xe.event && p.global) && 0 == xe.active++ && xe.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Wt.test(p.type), o = p.url.replace($t, ""), p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(Ht, "+")) : (h = p.url.slice(o.length), p.data && (p.processData || "string" == typeof p.data) && (o += (Ot.test(o) ? "&" : "?") + p.data, delete p.data), !1 === p.cache && (o = o.replace(Ft, "$1"), h = (Ot.test(o) ? "&" : "?") + "_=" + Rt++ + h), p.url = o + h), p.ifModified && (xe.lastModified[o] && T.setRequestHeader("If-Modified-Since", xe.lastModified[o]), xe.etag[o] && T.setRequestHeader("If-None-Match", xe.etag[o])), (p.data && p.hasContent && !1 !== p.contentType || n.contentType) && T.setRequestHeader("Content-Type", p.contentType), T.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Vt + "; q=0.01" : "") : p.accepts["*"]), p.headers) T.setRequestHeader(d, p.headers[d]);
            if (p.beforeSend && (!1 === p.beforeSend.call(g, T, p) || c)) return T.abort();
            if (x = "abort", y.add(p.complete), T.done(p.success), T.fail(p.error), r = te(Qt, p, n, T)) {
                if (T.readyState = 1, f && m.trigger("ajaxSend", [T, p]), c) return T;
                p.async && p.timeout > 0 && (l = e.setTimeout(function() {
                    T.abort("timeout")
                }, p.timeout));
                try {
                    c = !1, r.send(_, i)
                } catch (E) {
                    if (c) throw E;
                    i(-1, E)
                }
            } else i(-1, "No Transport");
            return T
        },
        getJSON: function(e, t, n) {
            return xe.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return xe.get(e, undefined, t, "script")
        }
    }), xe.each(["get", "post"], function(e, t) {
        xe[t] = function(e, n, i, r) {
            return ye(n) && (r = r || i, i = n, n = undefined), xe.ajax(xe.extend({
                url: e,
                type: t,
                dataType: r,
                data: n,
                success: i
            }, xe.isPlainObject(e) && e))
        }
    }), xe._evalUrl = function(e) {
        return xe.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            throws: !0
        })
    }, xe.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (ye(e) && (e = e.call(this[0])), t = xe(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                return e
            }).append(this)), this
        },
        wrapInner: function(e) {
            return ye(e) ? this.each(function(t) {
                xe(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = xe(this),
                    n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = ye(e);
            return this.each(function(n) {
                xe(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                xe(this).replaceWith(this.childNodes)
            }), this
        }
    }), xe.expr.pseudos.hidden = function(e) {
        return !xe.expr.pseudos.visible(e)
    }, xe.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }, xe.ajaxSettings.xhr = function() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {}
    };
    var Xt = {
            0: 200,
            1223: 204
        },
        Kt = xe.ajaxSettings.xhr();
    ve.cors = !!Kt && "withCredentials" in Kt, ve.ajax = Kt = !!Kt, xe.ajaxTransport(function(t) {
        var n, i;
        if (ve.cors || Kt && !t.crossDomain) return {
            send: function(r, o) {
                var s, a = t.xhr();
                if (a.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (s in t.xhrFields) a[s] = t.xhrFields[s];
                for (s in t.mimeType && a.overrideMimeType && a.overrideMimeType(t.mimeType), t.crossDomain || r["X-Requested-With"] || (r["X-Requested-With"] = "XMLHttpRequest"), r) a.setRequestHeader(s, r[s]);
                n = function(e) {
                    return function() {
                        n && (n = i = a.onload = a.onerror = a.onabort = a.ontimeout = a.onreadystatechange = null, "abort" === e ? a.abort() : "error" === e ? "number" != typeof a.status ? o(0, "error") : o(a.status, a.statusText) : o(Xt[a.status] || a.status, a.statusText, "text" !== (a.responseType || "text") || "string" != typeof a.responseText ? {
                            binary: a.response
                        } : {
                            text: a.responseText
                        }, a.getAllResponseHeaders()))
                    }
                }, a.onload = n(), i = a.onerror = a.ontimeout = n("error"), a.onabort !== undefined ? a.onabort = i : a.onreadystatechange = function() {
                    4 === a.readyState && e.setTimeout(function() {
                        n && i()
                    })
                }, n = n("abort");
                try {
                    a.send(t.hasContent && t.data || null)
                } catch (l) {
                    if (n) throw l
                }
            },
            abort: function() {
                n && n()
            }
        }
    }), xe.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }), xe.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return xe.globalEval(e), e
            }
        }
    }), xe.ajaxPrefilter("script", function(e) {
        e.cache === undefined && (e.cache = !1), e.crossDomain && (e.type = "GET")
    }), xe.ajaxTransport("script", function(e) {
        var t, n;
        if (e.crossDomain) return {
            send: function(i, r) {
                t = xe("<script>").prop({
                    charset: e.scriptCharset,
                    src: e.url
                }).on("load error", n = function(e) {
                    t.remove(), n = null, e && r("error" === e.type ? 404 : 200, e.type)
                }), se.head.appendChild(t[0])
            },
            abort: function() {
                n && n()
            }
        }
    });
    var Gt, Jt = [],
        Zt = /(=)\?(?=&|$)|\?\?/;
    xe.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = Jt.pop() || xe.expando + "_" + Rt++;
            return this[e] = !0, e
        }
    }), xe.ajaxPrefilter("json jsonp", function(t, n, i) {
        var r, o, s, a = !1 !== t.jsonp && (Zt.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Zt.test(t.data) && "data");
        if (a || "jsonp" === t.dataTypes[0]) return r = t.jsonpCallback = ye(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, a ? t[a] = t[a].replace(Zt, "$1" + r) : !1 !== t.jsonp && (t.url += (Ot.test(t.url) ? "&" : "?") + t.jsonp + "=" + r), t.converters["script json"] = function() {
            return s || xe.error(r + " was not called"), s[0]
        }, t.dataTypes[0] = "json", o = e[r], e[r] = function() {
            s = arguments
        }, i.always(function() {
            o === undefined ? xe(e).removeProp(r) : e[r] = o, t[r] && (t.jsonpCallback = n.jsonpCallback, Jt.push(r)), s && ye(o) && o(s[0]), s = o = undefined
        }), "script"
    }), ve.createHTMLDocument = ((Gt = se.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === Gt.childNodes.length), xe.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (ve.createHTMLDocument ? ((i = (t = se.implementation.createHTMLDocument("")).createElement("base")).href = se.location.href, t.head.appendChild(i)) : t = se), o = !n && [], (r = ke.exec(e)) ? [t.createElement(r[1])] : (r = T([e], t, o), o && o.length && xe(o).remove(), xe.merge([], r.childNodes)));
        var i, r, o
    }, xe.fn.load = function(e, t, n) {
        var i, r, o, s = this,
            a = e.indexOf(" ");
        return a > -1 && (i = K(e.slice(a)), e = e.slice(0, a)), ye(t) ? (n = t, t = undefined) : t && "object" == typeof t && (r = "POST"), s.length > 0 && xe.ajax({
            url: e,
            type: r || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments, s.html(i ? xe("<div>").append(xe.parseHTML(e)).find(i) : e)
        }).always(n && function(e, t) {
            s.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }), this
    }, xe.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        xe.fn[t] = function(e) {
            return this.on(t, e)
        }
    }), xe.expr.pseudos.animated = function(e) {
        return xe.grep(xe.timers, function(t) {
            return e === t.elem
        }).length
    }, xe.offset = {
        setOffset: function(e, t, n) {
            var i, r, o, s, a, l, u = xe.css(e, "position"),
                c = xe(e),
                f = {};
            "static" === u && (e.style.position = "relative"), a = c.offset(), o = xe.css(e, "top"), l = xe.css(e, "left"), ("absolute" === u || "fixed" === u) && (o + l).indexOf("auto") > -1 ? (s = (i = c.position()).top, r = i.left) : (s = parseFloat(o) || 0, r = parseFloat(l) || 0), ye(t) && (t = t.call(e, n, xe.extend({}, a))), null != t.top && (f.top = t.top - a.top + s), null != t.left && (f.left = t.left - a.left + r), "using" in t ? t.using.call(e, f) : c.css(f)
        }
    }, xe.fn.extend({
        offset: function(e) {
            if (arguments.length) return e === undefined ? this : this.each(function(t) {
                xe.offset.setOffset(this, e, t)
            });
            var t, n, i = this[0];
            return i ? i.getClientRects().length ? (t = i.getBoundingClientRect(), n = i.ownerDocument.defaultView, {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, i = this[0],
                    r = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === xe.css(i, "position")) t = i.getBoundingClientRect();
                else {
                    for (t = this.offset(), n = i.ownerDocument, e = i.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === xe.css(e, "position");) e = e.parentNode;
                    e && e !== i && 1 === e.nodeType && ((r = xe(e).offset()).top += xe.css(e, "borderTopWidth", !0), r.left += xe.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - r.top - xe.css(i, "marginTop", !0),
                    left: t.left - r.left - xe.css(i, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === xe.css(e, "position");) e = e.offsetParent;
                return e || it
            })
        }
    }), xe.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = "pageYOffset" === t;
        xe.fn[e] = function(i) {
            return je(this, function(e, i, r) {
                var o;
                if (be(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), r === undefined) return o ? o[t] : e[i];
                o ? o.scrollTo(n ? o.pageXOffset : r, n ? r : o.pageYOffset) : e[i] = r
            }, e, i, arguments.length)
        }
    }), xe.each(["top", "left"], function(e, t) {
        xe.cssHooks[t] = j(ve.pixelPosition, function(e, n) {
            if (n) return n = I(e, t), ft.test(n) ? xe(e).position()[t] + "px" : n
        })
    }), xe.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        xe.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, i) {
            xe.fn[i] = function(r, o) {
                var s = arguments.length && (n || "boolean" != typeof r),
                    a = n || (!0 === r || !0 === o ? "margin" : "border");
                return je(this, function(t, n, r) {
                    var o;
                    return be(t) ? 0 === i.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : r === undefined ? xe.css(t, n, a) : xe.style(t, n, r, a)
                }, t, s ? r : undefined, s)
            }
        })
    }), xe.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
        xe.fn[t] = function(e, n) {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), xe.fn.extend({
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }), xe.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, i) {
            return this.on(t, e, n, i)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    }), xe.proxy = function(e, t) {
        var n, i, r;
        return "string" == typeof t && (n = e[t], t = e, e = n), ye(e) ? (i = le.call(arguments, 2), (r = function() {
            return e.apply(t || this, i.concat(le.call(arguments)))
        }).guid = e.guid = e.guid || xe.guid++, r) : undefined
    }, xe.holdReady = function(e) {
        e ? xe.readyWait++ : xe.ready(!0)
    }, xe.isArray = Array.isArray, xe.parseJSON = JSON.parse, xe.nodeName = o, xe.isFunction = ye, xe.isWindow = be, xe.camelCase = p, xe.type = i, xe.now = Date.now, xe.isNumeric = function(e) {
        var t = xe.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }, "function" == typeof define && define.amd && define("jquery", [], function() {
        return xe
    });
    var en = e.jQuery,
        tn = e.$;
    return xe.noConflict = function(t) {
        return e.$ === xe && (e.$ = tn), t && e.jQuery === xe && (e.jQuery = en), xe
    }, t || (e.jQuery = e.$ = xe), xe
}),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Popper = t()
}(this, function() {
    "use strict";

    function e(e) {
        return e && "[object Function]" === {}.toString.call(e)
    }

    function t(e, t) {
        if (1 !== e.nodeType) return [];
        var n = e.ownerDocument.defaultView.getComputedStyle(e, null);
        return t ? n[t] : n
    }

    function n(e) {
        return "HTML" === e.nodeName ? e : e.parentNode || e.host
    }

    function i(e) {
        if (!e) return document.body;
        switch (e.nodeName) {
            case "HTML":
            case "BODY":
                return e.ownerDocument.body;
            case "#document":
                return e.body
        }
        var r = t(e),
            o = r.overflow,
            s = r.overflowX,
            a = r.overflowY;
        return /(auto|scroll|overlay)/.test(o + a + s) ? e : i(n(e))
    }

    function r(e) {
        return e && e.referenceNode ? e.referenceNode : e
    }

    function o(e) {
        return 11 === e ? re : 10 === e ? oe : re || oe
    }

    function s(e) {
        if (!e) return document.documentElement;
        for (var n = o(10) ? document.body : null, i = e.offsetParent || null; i === n && e.nextElementSibling;) i = (e = e.nextElementSibling).offsetParent;
        var r = i && i.nodeName;
        return r && "BODY" !== r && "HTML" !== r ? -1 !== ["TH", "TD", "TABLE"].indexOf(i.nodeName) && "static" === t(i, "position") ? s(i) : i : e ? e.ownerDocument.documentElement : document.documentElement
    }

    function a(e) {
        var t = e.nodeName;
        return "BODY" !== t && ("HTML" === t || s(e.firstElementChild) === e)
    }

    function l(e) {
        return null === e.parentNode ? e : l(e.parentNode)
    }

    function u(e, t) {
        if (!(e && e.nodeType && t && t.nodeType)) return document.documentElement;
        var n = e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING,
            i = n ? e : t,
            r = n ? t : e,
            o = document.createRange();
        o.setStart(i, 0), o.setEnd(r, 0);
        var c = o.commonAncestorContainer;
        if (e !== c && t !== c || i.contains(r)) return a(c) ? c : s(c);
        var f = l(e);
        return f.host ? u(f.host, t) : u(e, l(t).host)
    }

    function c(e) {
        var t = "top" === (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : "top") ? "scrollTop" : "scrollLeft",
            n = e.nodeName;
        if ("BODY" === n || "HTML" === n) {
            var i = e.ownerDocument.documentElement;
            return (e.ownerDocument.scrollingElement || i)[t]
        }
        return e[t]
    }

    function f(e, t) {
        var n = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
            i = c(t, "top"),
            r = c(t, "left"),
            o = n ? -1 : 1;
        return e.top += i * o, e.bottom += i * o, e.left += r * o, e.right += r * o, e
    }

    function d(e, t) {
        var n = "x" === t ? "Left" : "Top",
            i = "Left" == n ? "Right" : "Bottom";
        return parseFloat(e["border" + n + "Width"], 10) + parseFloat(e["border" + i + "Width"], 10)
    }

    function h(e, t, n, i) {
        return ee(t["offset" + e], t["scroll" + e], n["client" + e], n["offset" + e], n["scroll" + e], o(10) ? parseInt(n["offset" + e]) + parseInt(i["margin" + ("Height" === e ? "Top" : "Left")]) + parseInt(i["margin" + ("Height" === e ? "Bottom" : "Right")]) : 0)
    }

    function p(e) {
        var t = e.body,
            n = e.documentElement,
            i = o(10) && getComputedStyle(n);
        return {
            height: h("Height", t, n, i),
            width: h("Width", t, n, i)
        }
    }

    function g(e) {
        return ue({}, e, {
            right: e.left + e.width,
            bottom: e.top + e.height
        })
    }

    function m(e) {
        var n = {};
        try {
            if (o(10)) {
                n = e.getBoundingClientRect();
                var i = c(e, "top"),
                    r = c(e, "left");
                n.top += i, n.left += r, n.bottom += i, n.right += r
            } else n = e.getBoundingClientRect()
        } catch (t) {}
        var s = {
                left: n.left,
                top: n.top,
                width: n.right - n.left,
                height: n.bottom - n.top
            },
            a = "HTML" === e.nodeName ? p(e.ownerDocument) : {},
            l = a.width || e.clientWidth || s.width,
            u = a.height || e.clientHeight || s.height,
            f = e.offsetWidth - l,
            h = e.offsetHeight - u;
        if (f || h) {
            var m = t(e);
            f -= d(m, "x"), h -= d(m, "y"), s.width -= f, s.height -= h
        }
        return g(s)
    }

    function v(e, n) {
        var r = 2 < arguments.length && void 0 !== arguments[2] && arguments[2],
            s = o(10),
            a = "HTML" === n.nodeName,
            l = m(e),
            u = m(n),
            c = i(e),
            d = t(n),
            h = parseFloat(d.borderTopWidth, 10),
            p = parseFloat(d.borderLeftWidth, 10);
        r && a && (u.top = ee(u.top, 0), u.left = ee(u.left, 0));
        var v = g({
            top: l.top - u.top - h,
            left: l.left - u.left - p,
            width: l.width,
            height: l.height
        });
        if (v.marginTop = 0, v.marginLeft = 0, !s && a) {
            var y = parseFloat(d.marginTop, 10),
                b = parseFloat(d.marginLeft, 10);
            v.top -= h - y, v.bottom -= h - y, v.left -= p - b, v.right -= p - b, v.marginTop = y, v.marginLeft = b
        }
        return (s && !r ? n.contains(c) : n === c && "BODY" !== c.nodeName) && (v = f(v, n)), v
    }

    function y(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
            n = e.ownerDocument.documentElement,
            i = v(e, n),
            r = ee(n.clientWidth, window.innerWidth || 0),
            o = ee(n.clientHeight, window.innerHeight || 0),
            s = t ? 0 : c(n),
            a = t ? 0 : c(n, "left");
        return g({
            top: s - i.top + i.marginTop,
            left: a - i.left + i.marginLeft,
            width: r,
            height: o
        })
    }

    function b(e) {
        var i = e.nodeName;
        if ("BODY" === i || "HTML" === i) return !1;
        if ("fixed" === t(e, "position")) return !0;
        var r = n(e);
        return !!r && b(r)
    }

    function _(e) {
        if (!e || !e.parentElement || o()) return document.documentElement;
        for (var n = e.parentElement; n && "none" === t(n, "transform");) n = n.parentElement;
        return n || document.documentElement
    }

    function w(e, t, o, s) {
        var a = 4 < arguments.length && void 0 !== arguments[4] && arguments[4],
            l = {
                top: 0,
                left: 0
            },
            c = a ? _(e) : u(e, r(t));
        if ("viewport" === s) l = y(c, a);
        else {
            var f;
            "scrollParent" === s ? "BODY" === (f = i(n(t))).nodeName && (f = e.ownerDocument.documentElement) : f = "window" === s ? e.ownerDocument.documentElement : s;
            var d = v(f, c, a);
            if ("HTML" !== f.nodeName || b(c)) l = d;
            else {
                var h = p(e.ownerDocument),
                    g = h.height,
                    m = h.width;
                l.top += d.top - d.marginTop, l.bottom = g + d.top, l.left += d.left - d.marginLeft, l.right = m + d.left
            }
        }
        var w = "number" == typeof(o = o || 0);
        return l.left += w ? o : o.left || 0, l.top += w ? o : o.top || 0, l.right -= w ? o : o.right || 0, l.bottom -= w ? o : o.bottom || 0, l
    }

    function x(e) {
        return e.width * e.height
    }

    function T(e, t, n, i, r) {
        var o = 5 < arguments.length && void 0 !== arguments[5] ? arguments[5] : 0;
        if (-1 === e.indexOf("auto")) return e;
        var s = w(n, i, o, r),
            a = {
                top: {
                    width: s.width,
                    height: t.top - s.top
                },
                right: {
                    width: s.right - t.right,
                    height: s.height
                },
                bottom: {
                    width: s.width,
                    height: s.bottom - t.bottom
                },
                left: {
                    width: t.left - s.left,
                    height: s.height
                }
            },
            l = Object.keys(a).map(function(e) {
                return ue({
                    key: e
                }, a[e], {
                    area: x(a[e])
                })
            }).sort(function(e, t) {
                return t.area - e.area
            }),
            u = l.filter(function(e) {
                var t = e.width,
                    i = e.height;
                return t >= n.clientWidth && i >= n.clientHeight
            }),
            c = 0 < u.length ? u[0].key : l[0].key,
            f = e.split("-")[1];
        return c + (f ? "-" + f : "")
    }

    function E(e, t, n) {
        var i = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
        return v(n, i ? _(t) : u(t, r(n)), i)
    }

    function C(e) {
        var t = e.ownerDocument.defaultView.getComputedStyle(e),
            n = parseFloat(t.marginTop || 0) + parseFloat(t.marginBottom || 0),
            i = parseFloat(t.marginLeft || 0) + parseFloat(t.marginRight || 0);
        return {
            width: e.offsetWidth + i,
            height: e.offsetHeight + n
        }
    }

    function S(e) {
        var t = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom"
        };
        return e.replace(/left|right|bottom|top/g, function(e) {
            return t[e]
        })
    }

    function N(e, t, n) {
        n = n.split("-")[0];
        var i = C(e),
            r = {
                width: i.width,
                height: i.height
            },
            o = -1 !== ["right", "left"].indexOf(n),
            s = o ? "top" : "left",
            a = o ? "left" : "top",
            l = o ? "height" : "width",
            u = o ? "width" : "height";
        return r[s] = t[s] + t[l] / 2 - i[l] / 2, r[a] = n === a ? t[a] - i[u] : t[S(a)], r
    }

    function k(e, t) {
        return Array.prototype.find ? e.find(t) : e.filter(t)[0]
    }

    function D(e, t, n) {
        if (Array.prototype.findIndex) return e.findIndex(function(e) {
            return e[t] === n
        });
        var i = k(e, function(e) {
            return e[t] === n
        });
        return e.indexOf(i)
    }

    function A(t, n, i) {
        return (void 0 === i ? t : t.slice(0, D(t, "name", i))).forEach(function(t) {
            t["function"] && console.warn("`modifier.function` is deprecated, use `modifier.fn`!");
            var i = t["function"] || t.fn;
            t.enabled && e(i) && (n.offsets.popper = g(n.offsets.popper), n.offsets.reference = g(n.offsets.reference), n = i(n, t))
        }), n
    }

    function P() {
        if (!this.state.isDestroyed) {
            var e = {
                instance: this,
                styles: {},
                arrowStyles: {},
                attributes: {},
                flipped: !1,
                offsets: {}
            };
            e.offsets.reference = E(this.state, this.popper, this.reference, this.options.positionFixed), e.placement = T(this.options.placement, e.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding), e.originalPlacement = e.placement, e.positionFixed = this.options.positionFixed, e.offsets.popper = N(this.popper, e.offsets.reference, e.placement), e.offsets.popper.position = this.options.positionFixed ? "fixed" : "absolute", e = A(this.modifiers, e), this.state.isCreated ? this.options.onUpdate(e) : (this.state.isCreated = !0, this.options.onCreate(e))
        }
    }

    function R(e, t) {
        return e.some(function(e) {
            var n = e.name;
            return e.enabled && n === t
        })
    }

    function O(e) {
        for (var t = [!1, "ms", "Webkit", "Moz", "O"], n = e.charAt(0).toUpperCase() + e.slice(1), i = 0; i < t.length; i++) {
            var r = t[i],
                o = r ? "" + r + n : e;
            if ("undefined" != typeof document.body.style[o]) return o
        }
        return null
    }

    function L() {
        return this.state.isDestroyed = !0, R(this.modifiers, "applyStyle") && (this.popper.removeAttribute("x-placement"), this.popper.style.position = "", this.popper.style.top = "", this.popper.style.left = "", this.popper.style.right = "", this.popper.style.bottom = "", this.popper.style.willChange = "", this.popper.style[O("transform")] = ""), this.disableEventListeners(), this.options.removeOnDestroy && this.popper.parentNode.removeChild(this.popper), this
    }

    function I(e) {
        var t = e.ownerDocument;
        return t ? t.defaultView : window
    }

    function j(e, t, n, r) {
        var o = "BODY" === e.nodeName,
            s = o ? e.ownerDocument.defaultView : e;
        s.addEventListener(t, n, {
            passive: !0
        }), o || j(i(s.parentNode), t, n, r), r.push(s)
    }

    function q(e, t, n, r) {
        n.updateBound = r, I(e).addEventListener("resize", n.updateBound, {
            passive: !0
        });
        var o = i(e);
        return j(o, "scroll", n.updateBound, n.scrollParents), n.scrollElement = o, n.eventsEnabled = !0, n
    }

    function H() {
        this.state.eventsEnabled || (this.state = q(this.reference, this.options, this.state, this.scheduleUpdate))
    }

    function $(e, t) {
        return I(e).removeEventListener("resize", t.updateBound), t.scrollParents.forEach(function(e) {
            e.removeEventListener("scroll", t.updateBound)
        }), t.updateBound = null, t.scrollParents = [], t.scrollElement = null, t.eventsEnabled = !1, t
    }

    function F() {
        this.state.eventsEnabled && (cancelAnimationFrame(this.scheduleUpdate), this.state = $(this.reference, this.state))
    }

    function M(e) {
        return "" !== e && !isNaN(parseFloat(e)) && isFinite(e)
    }

    function B(e, t) {
        Object.keys(t).forEach(function(n) {
            var i = ""; - 1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(n) && M(t[n]) && (i = "px"), e.style[n] = t[n] + i
        })
    }

    function W(e, t) {
        Object.keys(t).forEach(function(n) {
            !1 === t[n] ? e.removeAttribute(n) : e.setAttribute(n, t[n])
        })
    }

    function U(e, t) {
        var n = e.offsets,
            i = n.popper,
            r = n.reference,
            o = Z,
            s = function(e) {
                return e
            },
            a = o(r.width),
            l = o(i.width),
            u = -1 !== ["left", "right"].indexOf(e.placement),
            c = -1 !== e.placement.indexOf("-"),
            f = t ? u || c || a % 2 == l % 2 ? o : J : s,
            d = t ? o : s;
        return {
            left: f(1 == a % 2 && 1 == l % 2 && !c && t ? i.left - 1 : i.left),
            top: d(i.top),
            bottom: d(i.bottom),
            right: f(i.right)
        }
    }

    function z(e, t, n) {
        var i = k(e, function(e) {
                return e.name === t
            }),
            r = !!i && e.some(function(e) {
                return e.name === n && e.enabled && e.order < i.order
            });
        if (!r) {
            var o = "`" + t + "`";
            console.warn("`" + n + "` modifier is required by " + o + " modifier in order to work, be sure to include it before " + o + "!")
        }
        return r
    }

    function Q(e) {
        return "end" === e ? "start" : "start" === e ? "end" : e
    }

    function V(e) {
        var t = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
            n = de.indexOf(e),
            i = de.slice(n + 1).concat(de.slice(0, n));
        return t ? i.reverse() : i
    }

    function Y(e, t, n, i) {
        var r = e.match(/((?:\-|\+)?\d*\.?\d*)(.*)/),
            o = +r[1],
            s = r[2];
        if (!o) return e;
        if (0 === s.indexOf("%")) {
            var a;
            switch (s) {
                case "%p":
                    a = n;
                    break;
                case "%":
                case "%r":
                default:
                    a = i
            }
            return g(a)[t] / 100 * o
        }
        return "vh" === s || "vw" === s ? ("vh" === s ? ee(document.documentElement.clientHeight, window.innerHeight || 0) : ee(document.documentElement.clientWidth, window.innerWidth || 0)) / 100 * o : o
    }

    function X(e, t, n, i) {
        var r = [0, 0],
            o = -1 !== ["right", "left"].indexOf(i),
            s = e.split(/(\+|\-)/).map(function(e) {
                return e.trim()
            }),
            a = s.indexOf(k(s, function(e) {
                return -1 !== e.search(/,|\s/)
            }));
        s[a] && -1 === s[a].indexOf(",") && console.warn("Offsets separated by white space(s) are deprecated, use a comma (,) instead.");
        var l = /\s*,\s*|\s+/,
            u = -1 === a ? [s] : [s.slice(0, a).concat([s[a].split(l)[0]]), [s[a].split(l)[1]].concat(s.slice(a + 1))];
        return (u = u.map(function(e, i) {
            var r = (1 === i ? !o : o) ? "height" : "width",
                s = !1;
            return e.reduce(function(e, t) {
                return "" === e[e.length - 1] && -1 !== ["+", "-"].indexOf(t) ? (e[e.length - 1] = t, s = !0, e) : s ? (e[e.length - 1] += t, s = !1, e) : e.concat(t)
            }, []).map(function(e) {
                return Y(e, r, t, n)
            })
        })).forEach(function(e, t) {
            e.forEach(function(n, i) {
                M(n) && (r[t] += n * ("-" === e[i - 1] ? -1 : 1))
            })
        }), r
    }

    function K(e, t) {
        var n, i = t.offset,
            r = e.placement,
            o = e.offsets,
            s = o.popper,
            a = o.reference,
            l = r.split("-")[0];
        return n = M(+i) ? [+i, 0] : X(i, s, a, l), "left" === l ? (s.top += n[0], s.left -= n[1]) : "right" === l ? (s.top += n[0], s.left += n[1]) : "top" === l ? (s.left += n[0], s.top -= n[1]) : "bottom" === l && (s.left += n[0], s.top += n[1]), e.popper = s, e
    }
    var G = Math.min,
        J = Math.floor,
        Z = Math.round,
        ee = Math.max,
        te = "undefined" != typeof window && "undefined" != typeof document && "undefined" != typeof navigator,
        ne = function() {
            for (var e = ["Edge", "Trident", "Firefox"], t = 0; t < e.length; t += 1)
                if (te && 0 <= navigator.userAgent.indexOf(e[t])) return 1;
            return 0
        }(),
        ie = te && window.Promise ? function(e) {
            var t = !1;
            return function() {
                t || (t = !0, window.Promise.resolve().then(function() {
                    t = !1, e()
                }))
            }
        } : function(e) {
            var t = !1;
            return function() {
                t || (t = !0, setTimeout(function() {
                    t = !1, e()
                }, ne))
            }
        },
        re = te && !(!window.MSInputMethodContext || !document.documentMode),
        oe = te && /MSIE 10/.test(navigator.userAgent),
        se = function(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        },
        ae = function() {
            function e(e, t) {
                for (var n, i = 0; i < t.length; i++)(n = t[i]).enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
            }
            return function(t, n, i) {
                return n && e(t.prototype, n), i && e(t, i), t
            }
        }(),
        le = function(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e
        },
        ue = Object.assign || function(e) {
            for (var t, n = 1; n < arguments.length; n++)
                for (var i in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
            return e
        },
        ce = te && /Firefox/i.test(navigator.userAgent),
        fe = ["auto-start", "auto", "auto-end", "top-start", "top", "top-end", "right-start", "right", "right-end", "bottom-end", "bottom", "bottom-start", "left-end", "left", "left-start"],
        de = fe.slice(3),
        he = {
            FLIP: "flip",
            CLOCKWISE: "clockwise",
            COUNTERCLOCKWISE: "counterclockwise"
        },
        pe = function() {
            function t(n, i) {
                var r = this,
                    o = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                se(this, t), this.scheduleUpdate = function() {
                    return requestAnimationFrame(r.update)
                }, this.update = ie(this.update.bind(this)), this.options = ue({}, t.Defaults, o), this.state = {
                    isDestroyed: !1,
                    isCreated: !1,
                    scrollParents: []
                }, this.reference = n && n.jquery ? n[0] : n, this.popper = i && i.jquery ? i[0] : i, this.options.modifiers = {}, Object.keys(ue({}, t.Defaults.modifiers, o.modifiers)).forEach(function(e) {
                    r.options.modifiers[e] = ue({}, t.Defaults.modifiers[e] || {}, o.modifiers ? o.modifiers[e] : {})
                }), this.modifiers = Object.keys(this.options.modifiers).map(function(e) {
                    return ue({
                        name: e
                    }, r.options.modifiers[e])
                }).sort(function(e, t) {
                    return e.order - t.order
                }), this.modifiers.forEach(function(t) {
                    t.enabled && e(t.onLoad) && t.onLoad(r.reference, r.popper, r.options, t, r.state)
                }), this.update();
                var s = this.options.eventsEnabled;
                s && this.enableEventListeners(), this.state.eventsEnabled = s
            }
            return ae(t, [{
                key: "update",
                value: function() {
                    return P.call(this)
                }
            }, {
                key: "destroy",
                value: function() {
                    return L.call(this)
                }
            }, {
                key: "enableEventListeners",
                value: function() {
                    return H.call(this)
                }
            }, {
                key: "disableEventListeners",
                value: function() {
                    return F.call(this)
                }
            }]), t
        }();
    return pe.Utils = ("undefined" == typeof window ? global : window).PopperUtils, pe.placements = fe, pe.Defaults = {
        placement: "bottom",
        positionFixed: !1,
        eventsEnabled: !0,
        removeOnDestroy: !1,
        onCreate: function() {},
        onUpdate: function() {},
        modifiers: {
            shift: {
                order: 100,
                enabled: !0,
                fn: function(e) {
                    var t = e.placement,
                        n = t.split("-")[0],
                        i = t.split("-")[1];
                    if (i) {
                        var r = e.offsets,
                            o = r.reference,
                            s = r.popper,
                            a = -1 !== ["bottom", "top"].indexOf(n),
                            l = a ? "left" : "top",
                            u = a ? "width" : "height",
                            c = {
                                start: le({}, l, o[l]),
                                end: le({}, l, o[l] + o[u] - s[u])
                            };
                        e.offsets.popper = ue({}, s, c[i])
                    }
                    return e
                }
            },
            offset: {
                order: 200,
                enabled: !0,
                fn: K,
                offset: 0
            },
            preventOverflow: {
                order: 300,
                enabled: !0,
                fn: function(e, t) {
                    var n = t.boundariesElement || s(e.instance.popper);
                    e.instance.reference === n && (n = s(n));
                    var i = O("transform"),
                        r = e.instance.popper.style,
                        o = r.top,
                        a = r.left,
                        l = r[i];
                    r.top = "", r.left = "", r[i] = "";
                    var u = w(e.instance.popper, e.instance.reference, t.padding, n, e.positionFixed);
                    r.top = o, r.left = a, r[i] = l, t.boundaries = u;
                    var c = t.priority,
                        f = e.offsets.popper,
                        d = {
                            primary: function(e) {
                                var n = f[e];
                                return f[e] < u[e] && !t.escapeWithReference && (n = ee(f[e], u[e])), le({}, e, n)
                            },
                            secondary: function(e) {
                                var n = "right" === e ? "left" : "top",
                                    i = f[n];
                                return f[e] > u[e] && !t.escapeWithReference && (i = G(f[n], u[e] - ("right" === e ? f.width : f.height))), le({}, n, i)
                            }
                        };
                    return c.forEach(function(e) {
                        var t = -1 === ["left", "top"].indexOf(e) ? "secondary" : "primary";
                        f = ue({}, f, d[t](e))
                    }), e.offsets.popper = f, e
                },
                priority: ["left", "right", "top", "bottom"],
                padding: 5,
                boundariesElement: "scrollParent"
            },
            keepTogether: {
                order: 400,
                enabled: !0,
                fn: function(e) {
                    var t = e.offsets,
                        n = t.popper,
                        i = t.reference,
                        r = e.placement.split("-")[0],
                        o = J,
                        s = -1 !== ["top", "bottom"].indexOf(r),
                        a = s ? "right" : "bottom",
                        l = s ? "left" : "top",
                        u = s ? "width" : "height";
                    return n[a] < o(i[l]) && (e.offsets.popper[l] = o(i[l]) - n[u]), n[l] > o(i[a]) && (e.offsets.popper[l] = o(i[a])), e
                }
            },
            arrow: {
                order: 500,
                enabled: !0,
                fn: function(e, n) {
                    var i;
                    if (!z(e.instance.modifiers, "arrow", "keepTogether")) return e;
                    var r = n.element;
                    if ("string" == typeof r) {
                        if (!(r = e.instance.popper.querySelector(r))) return e
                    } else if (!e.instance.popper.contains(r)) return console.warn("WARNING: `arrow.element` must be child of its popper element!"), e;
                    var o = e.placement.split("-")[0],
                        s = e.offsets,
                        a = s.popper,
                        l = s.reference,
                        u = -1 !== ["left", "right"].indexOf(o),
                        c = u ? "height" : "width",
                        f = u ? "Top" : "Left",
                        d = f.toLowerCase(),
                        h = u ? "left" : "top",
                        p = u ? "bottom" : "right",
                        m = C(r)[c];
                    l[p] - m < a[d] && (e.offsets.popper[d] -= a[d] - (l[p] - m)), l[d] + m > a[p] && (e.offsets.popper[d] += l[d] + m - a[p]), e.offsets.popper = g(e.offsets.popper);
                    var v = l[d] + l[c] / 2 - m / 2,
                        y = t(e.instance.popper),
                        b = parseFloat(y["margin" + f], 10),
                        _ = parseFloat(y["border" + f + "Width"], 10),
                        w = v - e.offsets.popper[d] - b - _;
                    return w = ee(G(a[c] - m, w), 0), e.arrowElement = r, e.offsets.arrow = (le(i = {}, d, Z(w)), le(i, h, ""), i), e
                },
                element: "[x-arrow]"
            },
            flip: {
                order: 600,
                enabled: !0,
                fn: function(e, t) {
                    if (R(e.instance.modifiers, "inner")) return e;
                    if (e.flipped && e.placement === e.originalPlacement) return e;
                    var n = w(e.instance.popper, e.instance.reference, t.padding, t.boundariesElement, e.positionFixed),
                        i = e.placement.split("-")[0],
                        r = S(i),
                        o = e.placement.split("-")[1] || "",
                        s = [];
                    switch (t.behavior) {
                        case he.FLIP:
                            s = [i, r];
                            break;
                        case he.CLOCKWISE:
                            s = V(i);
                            break;
                        case he.COUNTERCLOCKWISE:
                            s = V(i, !0);
                            break;
                        default:
                            s = t.behavior
                    }
                    return s.forEach(function(a, l) {
                        if (i !== a || s.length === l + 1) return e;
                        i = e.placement.split("-")[0], r = S(i);
                        var u = e.offsets.popper,
                            c = e.offsets.reference,
                            f = J,
                            d = "left" === i && f(u.right) > f(c.left) || "right" === i && f(u.left) < f(c.right) || "top" === i && f(u.bottom) > f(c.top) || "bottom" === i && f(u.top) < f(c.bottom),
                            h = f(u.left) < f(n.left),
                            p = f(u.right) > f(n.right),
                            g = f(u.top) < f(n.top),
                            m = f(u.bottom) > f(n.bottom),
                            v = "left" === i && h || "right" === i && p || "top" === i && g || "bottom" === i && m,
                            y = -1 !== ["top", "bottom"].indexOf(i),
                            b = !!t.flipVariations && (y && "start" === o && h || y && "end" === o && p || !y && "start" === o && g || !y && "end" === o && m),
                            _ = !!t.flipVariationsByContent && (y && "start" === o && p || y && "end" === o && h || !y && "start" === o && m || !y && "end" === o && g),
                            w = b || _;
                        (d || v || w) && (e.flipped = !0, (d || v) && (i = s[l + 1]), w && (o = Q(o)), e.placement = i + (o ? "-" + o : ""), e.offsets.popper = ue({}, e.offsets.popper, N(e.instance.popper, e.offsets.reference, e.placement)), e = A(e.instance.modifiers, e, "flip"))
                    }), e
                },
                behavior: "flip",
                padding: 5,
                boundariesElement: "viewport",
                flipVariations: !1,
                flipVariationsByContent: !1
            },
            inner: {
                order: 700,
                enabled: !1,
                fn: function(e) {
                    var t = e.placement,
                        n = t.split("-")[0],
                        i = e.offsets,
                        r = i.popper,
                        o = i.reference,
                        s = -1 !== ["left", "right"].indexOf(n),
                        a = -1 === ["top", "left"].indexOf(n);
                    return r[s ? "left" : "top"] = o[n] - (a ? r[s ? "width" : "height"] : 0), e.placement = S(t), e.offsets.popper = g(r), e
                }
            },
            hide: {
                order: 800,
                enabled: !0,
                fn: function(e) {
                    if (!z(e.instance.modifiers, "hide", "preventOverflow")) return e;
                    var t = e.offsets.reference,
                        n = k(e.instance.modifiers, function(e) {
                            return "preventOverflow" === e.name
                        }).boundaries;
                    if (t.bottom < n.top || t.left > n.right || t.top > n.bottom || t.right < n.left) {
                        if (!0 === e.hide) return e;
                        e.hide = !0, e.attributes["x-out-of-boundaries"] = ""
                    } else {
                        if (!1 === e.hide) return e;
                        e.hide = !1, e.attributes["x-out-of-boundaries"] = !1
                    }
                    return e
                }
            },
            computeStyle: {
                order: 850,
                enabled: !0,
                fn: function(e, t) {
                    var n = t.x,
                        i = t.y,
                        r = e.offsets.popper,
                        o = k(e.instance.modifiers, function(e) {
                            return "applyStyle" === e.name
                        }).gpuAcceleration;
                    void 0 !== o && console.warn("WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!");
                    var a, l, u = void 0 === o ? t.gpuAcceleration : o,
                        c = s(e.instance.popper),
                        f = m(c),
                        d = {
                            position: r.position
                        },
                        h = U(e, 2 > window.devicePixelRatio || !ce),
                        p = "bottom" === n ? "top" : "bottom",
                        g = "right" === i ? "left" : "right",
                        v = O("transform");
                    if (l = "bottom" == p ? "HTML" === c.nodeName ? -c.clientHeight + h.bottom : -f.height + h.bottom : h.top, a = "right" == g ? "HTML" === c.nodeName ? -c.clientWidth + h.right : -f.width + h.right : h.left, u && v) d[v] = "translate3d(" + a + "px, " + l + "px, 0)", d[p] = 0, d[g] = 0, d.willChange = "transform";
                    else {
                        var y = "bottom" == p ? -1 : 1,
                            b = "right" == g ? -1 : 1;
                        d[p] = l * y, d[g] = a * b, d.willChange = p + ", " + g
                    }
                    var _ = {
                        "x-placement": e.placement
                    };
                    return e.attributes = ue({}, _, e.attributes), e.styles = ue({}, d, e.styles), e.arrowStyles = ue({}, e.offsets.arrow, e.arrowStyles), e
                },
                gpuAcceleration: !0,
                x: "bottom",
                y: "right"
            },
            applyStyle: {
                order: 900,
                enabled: !0,
                fn: function(e) {
                    return B(e.instance.popper, e.styles), W(e.instance.popper, e.attributes), e.arrowElement && Object.keys(e.arrowStyles).length && B(e.arrowElement, e.arrowStyles), e
                },
                onLoad: function(e, t, n, i, r) {
                    var o = E(r, t, e, n.positionFixed),
                        s = T(n.placement, o, t, e, n.modifiers.flip.boundariesElement, n.modifiers.flip.padding);
                    return t.setAttribute("x-placement", s), B(t, {
                        position: n.positionFixed ? "fixed" : "absolute"
                    }), n
                },
                gpuAcceleration: void 0
            }
        }
    }, pe
}),
function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? t(exports, require("jquery"), require("popper.js")) : "function" == typeof define && define.amd ? define(["exports", "jquery", "popper.js"], t) : t((e = "undefined" != typeof globalThis ? globalThis : e || self).bootstrap = {}, e.jQuery, e.Popper)
}(this, function(e, t, n) {
    "use strict";

    function i(e, t) {
        for (var n = 0; n < t.length; n++) {
            var i = t[n];
            i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
        }
    }

    function r(e, t, n) {
        return t && i(e.prototype, t), n && i(e, n), e
    }

    function o() {
        return (o = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
            }
            return e
        }).apply(this, arguments)
    }

    function s(e, t) {
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.__proto__ = t
    }

    function a(e) {
        return null == e ? "" + e : {}.toString.call(e).match(/\s([a-z]+)/i)[1].toLowerCase()
    }

    function l() {
        return {
            bindType: h,
            delegateType: h,
            handle: function(e) {
                return t(e.target).is(this) ? e.handleObj.handler.apply(this, arguments) : undefined
            }
        }
    }

    function u(e) {
        var n = this,
            i = !1;
        return t(this).one(m.TRANSITION_END, function() {
            i = !0
        }), setTimeout(function() {
            i || m.triggerTransitionEnd(n)
        }, e), this
    }

    function c() {
        t.fn.emulateTransitionEnd = u, t.event.special[m.TRANSITION_END] = l()
    }

    function f(e, t) {
        var n = e.nodeName.toLowerCase();
        if (-1 !== t.indexOf(n)) return -1 === jn.indexOf(n) || Boolean(e.nodeValue.match(Hn) || e.nodeValue.match($n));
        for (var i = t.filter(function(e) {
                return e instanceof RegExp
            }), r = 0, o = i.length; r < o; r++)
            if (n.match(i[r])) return !0;
        return !1
    }

    function d(e, t, n) {
        if (0 === e.length) return e;
        if (n && "function" == typeof n) return n(e);
        for (var i = (new window.DOMParser).parseFromString(e, "text/html"), r = Object.keys(t), o = [].slice.call(i.body.querySelectorAll("*")), s = function(e) {
                var n = o[e],
                    i = n.nodeName.toLowerCase();
                if (-1 === r.indexOf(n.nodeName.toLowerCase())) return n.parentNode.removeChild(n), "continue";
                var s = [].slice.call(n.attributes),
                    a = [].concat(t["*"] || [], t[i] || []);
                s.forEach(function(e) {
                    f(e, a) || n.removeAttribute(e.nodeName)
                })
            }, a = 0, l = o.length; a < l; a++) s(a);
        return i.body.innerHTML
    }
    t = t && Object.prototype.hasOwnProperty.call(t, "default") ? t["default"] : t, n = n && Object.prototype.hasOwnProperty.call(n, "default") ? n["default"] : n;
    var h = "transitionend",
        p = 1e6,
        g = 1e3,
        m = {
            TRANSITION_END: "bsTransitionEnd",
            getUID: function(e) {
                do {
                    e += ~~(Math.random() * p)
                } while (document.getElementById(e));
                return e
            },
            getSelectorFromElement: function(e) {
                var t = e.getAttribute("data-target");
                if (!t || "#" === t) {
                    var n = e.getAttribute("href");
                    t = n && "#" !== n ? n.trim() : ""
                }
                try {
                    return document.querySelector(t) ? t : null
                } catch (i) {
                    return null
                }
            },
            getTransitionDurationFromElement: function(e) {
                if (!e) return 0;
                var n = t(e).css("transition-duration"),
                    i = t(e).css("transition-delay"),
                    r = parseFloat(n),
                    o = parseFloat(i);
                return r || o ? (n = n.split(",")[0], i = i.split(",")[0], (parseFloat(n) + parseFloat(i)) * g) : 0
            },
            reflow: function(e) {
                return e.offsetHeight
            },
            triggerTransitionEnd: function(e) {
                t(e).trigger(h)
            },
            supportsTransitionEnd: function() {
                return Boolean(h)
            },
            isElement: function(e) {
                return (e[0] || e).nodeType
            },
            typeCheckConfig: function(e, t, n) {
                for (var i in n)
                    if (Object.prototype.hasOwnProperty.call(n, i)) {
                        var r = n[i],
                            o = t[i],
                            s = o && m.isElement(o) ? "element" : a(o);
                        if (!new RegExp(r).test(s)) throw new Error(e.toUpperCase() + ': Option "' + i + '" provided type "' + s + '" but expected type "' + r + '".')
                    }
            },
            findShadowRoot: function(e) {
                if (!document.documentElement.attachShadow) return null;
                if ("function" == typeof e.getRootNode) {
                    var t = e.getRootNode();
                    return t instanceof ShadowRoot ? t : null
                }
                return e instanceof ShadowRoot ? e : e.parentNode ? m.findShadowRoot(e.parentNode) : null
            },
            jQueryDetection: function() {
                if (void 0 === t) throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
                var e = t.fn.jquery.split(" ")[0].split("."),
                    n = 1,
                    i = 2,
                    r = 9,
                    o = 1,
                    s = 4;
                if (e[0] < i && e[1] < r || e[0] === n && e[1] === r && e[2] < o || e[0] >= s) throw new Error("Bootstrap's JavaScript requires at least jQuery v1.9.1 but less than v4.0.0")
            }
        };
    m.jQueryDetection(), c();
    var v = "alert",
        y = "4.5.2",
        b = "bs.alert",
        _ = "." + b,
        w = ".data-api",
        x = t.fn[v],
        T = '[data-dismiss="alert"]',
        E = "close" + _,
        C = "closed" + _,
        S = "click" + _ + w,
        N = "alert",
        k = "fade",
        D = "show",
        A = function() {
            function e(e) {
                this._element = e
            }
            var n = e.prototype;
            return n.close = function(e) {
                var t = this._element;
                e && (t = this._getRootElement(e)), this._triggerCloseEvent(t).isDefaultPrevented() || this._removeElement(t)
            }, n.dispose = function() {
                t.removeData(this._element, b), this._element = null
            }, n._getRootElement = function(e) {
                var n = m.getSelectorFromElement(e),
                    i = !1;
                return n && (i = document.querySelector(n)), i || (i = t(e).closest("." + N)[0]), i
            }, n._triggerCloseEvent = function(e) {
                var n = t.Event(E);
                return t(e).trigger(n), n
            }, n._removeElement = function(e) {
                var n = this;
                if (t(e).removeClass(D), t(e).hasClass(k)) {
                    var i = m.getTransitionDurationFromElement(e);
                    t(e).one(m.TRANSITION_END, function(t) {
                        return n._destroyElement(e, t)
                    }).emulateTransitionEnd(i)
                } else this._destroyElement(e)
            }, n._destroyElement = function(e) {
                t(e).detach().trigger(C).remove()
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this),
                        r = i.data(b);
                    r || (r = new e(this), i.data(b, r)), "close" === n && r[n](this)
                })
            }, e._handleDismiss = function(e) {
                return function(t) {
                    t && t.preventDefault(), e.close(this)
                }
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return y
                }
            }]), e
        }();
    t(document).on(S, T, A._handleDismiss(new A)), t.fn[v] = A._jQueryInterface, t.fn[v].Constructor = A, t.fn[v].noConflict = function() {
        return t.fn[v] = x, A._jQueryInterface
    };
    var P = "button",
        R = "4.5.2",
        O = "bs.button",
        L = "." + O,
        I = ".data-api",
        j = t.fn[P],
        q = "active",
        H = "btn",
        $ = "focus",
        F = '[data-toggle^="button"]',
        M = '[data-toggle="buttons"]',
        B = '[data-toggle="button"]',
        W = '[data-toggle="buttons"] .btn',
        U = 'input:not([type="hidden"])',
        z = ".active",
        Q = ".btn",
        V = "click" + L + I,
        Y = "focus" + L + I + " blur" + L + I,
        X = "load" + L + I,
        K = function() {
            function e(e) {
                this._element = e
            }
            var n = e.prototype;
            return n.toggle = function() {
                var e = !0,
                    n = !0,
                    i = t(this._element).closest(M)[0];
                if (i) {
                    var r = this._element.querySelector(U);
                    if (r) {
                        if ("radio" === r.type)
                            if (r.checked && this._element.classList.contains(q)) e = !1;
                            else {
                                var o = i.querySelector(z);
                                o && t(o).removeClass(q)
                            }
                        e && ("checkbox" !== r.type && "radio" !== r.type || (r.checked = !this._element.classList.contains(q)), t(r).trigger("change")), r.focus(), n = !1
                    }
                }
                this._element.hasAttribute("disabled") || this._element.classList.contains("disabled") || (n && this._element.setAttribute("aria-pressed", !this._element.classList.contains(q)), e && t(this._element).toggleClass(q))
            }, n.dispose = function() {
                t.removeData(this._element, O), this._element = null
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(O);
                    i || (i = new e(this), t(this).data(O, i)), "toggle" === n && i[n]()
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return R
                }
            }]), e
        }();
    t(document).on(V, F, function(e) {
        var n = e.target,
            i = n;
        if (t(n).hasClass(H) || (n = t(n).closest(Q)[0]), !n || n.hasAttribute("disabled") || n.classList.contains("disabled")) e.preventDefault();
        else {
            var r = n.querySelector(U);
            if (r && (r.hasAttribute("disabled") || r.classList.contains("disabled"))) return void e.preventDefault();
            ("LABEL" !== i.tagName || r && "checkbox" !== r.type) && K._jQueryInterface.call(t(n), "toggle")
        }
    }).on(Y, F, function(e) {
        var n = t(e.target).closest(Q)[0];
        t(n).toggleClass($, /^focus(in)?$/.test(e.type))
    }), t(window).on(X, function() {
        for (var e = [].slice.call(document.querySelectorAll(W)), t = 0, n = e.length; t < n; t++) {
            var i = e[t],
                r = i.querySelector(U);
            r.checked || r.hasAttribute("checked") ? i.classList.add(q) : i.classList.remove(q)
        }
        for (var o = 0, s = (e = [].slice.call(document.querySelectorAll(B))).length; o < s; o++) {
            var a = e[o];
            "true" === a.getAttribute("aria-pressed") ? a.classList.add(q) : a.classList.remove(q)
        }
    }), t.fn[P] = K._jQueryInterface, t.fn[P].Constructor = K, t.fn[P].noConflict = function() {
        return t.fn[P] = j, K._jQueryInterface
    };
    var G = "carousel",
        J = "4.5.2",
        Z = "bs.carousel",
        ee = "." + Z,
        te = ".data-api",
        ne = t.fn[G],
        ie = 37,
        re = 39,
        oe = 500,
        se = 40,
        ae = {
            interval: 5e3,
            keyboard: !0,
            slide: !1,
            pause: "hover",
            wrap: !0,
            touch: !0
        },
        le = {
            interval: "(number|boolean)",
            keyboard: "boolean",
            slide: "(boolean|string)",
            pause: "(string|boolean)",
            wrap: "boolean",
            touch: "boolean"
        },
        ue = "next",
        ce = "prev",
        fe = "left",
        de = "right",
        he = "slide" + ee,
        pe = "slid" + ee,
        ge = "keydown" + ee,
        me = "mouseenter" + ee,
        ve = "mouseleave" + ee,
        ye = "touchstart" + ee,
        be = "touchmove" + ee,
        _e = "touchend" + ee,
        we = "pointerdown" + ee,
        xe = "pointerup" + ee,
        Te = "dragstart" + ee,
        Ee = "load" + ee + te,
        Ce = "click" + ee + te,
        Se = "carousel",
        Ne = "active",
        ke = "slide",
        De = "carousel-item-right",
        Ae = "carousel-item-left",
        Pe = "carousel-item-next",
        Re = "carousel-item-prev",
        Oe = "pointer-event",
        Le = ".active",
        Ie = ".active.carousel-item",
        je = ".carousel-item",
        qe = ".carousel-item img",
        He = ".carousel-item-next, .carousel-item-prev",
        $e = ".carousel-indicators",
        Fe = "[data-slide], [data-slide-to]",
        Me = '[data-ride="carousel"]',
        Be = {
            TOUCH: "touch",
            PEN: "pen"
        },
        We = function() {
            function e(e, t) {
                this._items = null, this._interval = null, this._activeElement = null, this._isPaused = !1, this._isSliding = !1, this.touchTimeout = null, this.touchStartX = 0, this.touchDeltaX = 0, this._config = this._getConfig(t), this._element = e, this._indicatorsElement = this._element.querySelector($e), this._touchSupported = "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0, this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent), this._addEventListeners()
            }
            var n = e.prototype;
            return n.next = function() {
                this._isSliding || this._slide(ue)
            }, n.nextWhenVisible = function() {
                !document.hidden && t(this._element).is(":visible") && "hidden" !== t(this._element).css("visibility") && this.next()
            }, n.prev = function() {
                this._isSliding || this._slide(ce)
            }, n.pause = function(e) {
                e || (this._isPaused = !0), this._element.querySelector(He) && (m.triggerTransitionEnd(this._element), this.cycle(!0)), clearInterval(this._interval), this._interval = null
            }, n.cycle = function(e) {
                e || (this._isPaused = !1), this._interval && (clearInterval(this._interval), this._interval = null), this._config.interval && !this._isPaused && (this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval))
            }, n.to = function(e) {
                var n = this;
                this._activeElement = this._element.querySelector(Ie);
                var i = this._getItemIndex(this._activeElement);
                if (!(e > this._items.length - 1 || e < 0))
                    if (this._isSliding) t(this._element).one(pe, function() {
                        return n.to(e)
                    });
                    else {
                        if (i === e) return this.pause(), void this.cycle();
                        var r = e > i ? ue : ce;
                        this._slide(r, this._items[e])
                    }
            }, n.dispose = function() {
                t(this._element).off(ee), t.removeData(this._element, Z), this._items = null, this._config = null, this._element = null, this._interval = null, this._isPaused = null, this._isSliding = null, this._activeElement = null, this._indicatorsElement = null
            }, n._getConfig = function(e) {
                return e = o({}, ae, e), m.typeCheckConfig(G, e, le), e
            }, n._handleSwipe = function() {
                var e = Math.abs(this.touchDeltaX);
                if (!(e <= se)) {
                    var t = e / this.touchDeltaX;
                    this.touchDeltaX = 0, t > 0 && this.prev(), t < 0 && this.next()
                }
            }, n._addEventListeners = function() {
                var e = this;
                this._config.keyboard && t(this._element).on(ge, function(t) {
                    return e._keydown(t)
                }), "hover" === this._config.pause && t(this._element).on(me, function(t) {
                    return e.pause(t)
                }).on(ve, function(t) {
                    return e.cycle(t)
                }), this._config.touch && this._addTouchEventListeners()
            }, n._addTouchEventListeners = function() {
                var e = this;
                if (this._touchSupported) {
                    var n = function(t) {
                            e._pointerEvent && Be[t.originalEvent.pointerType.toUpperCase()] ? e.touchStartX = t.originalEvent.clientX : e._pointerEvent || (e.touchStartX = t.originalEvent.touches[0].clientX)
                        },
                        i = function(t) {
                            t.originalEvent.touches && t.originalEvent.touches.length > 1 ? e.touchDeltaX = 0 : e.touchDeltaX = t.originalEvent.touches[0].clientX - e.touchStartX
                        },
                        r = function(t) {
                            e._pointerEvent && Be[t.originalEvent.pointerType.toUpperCase()] && (e.touchDeltaX = t.originalEvent.clientX - e.touchStartX), e._handleSwipe(), "hover" === e._config.pause && (e.pause(), e.touchTimeout && clearTimeout(e.touchTimeout), e.touchTimeout = setTimeout(function(t) {
                                return e.cycle(t)
                            }, oe + e._config.interval))
                        };
                    t(this._element.querySelectorAll(qe)).on(Te, function(e) {
                        return e.preventDefault()
                    }), this._pointerEvent ? (t(this._element).on(we, function(e) {
                        return n(e)
                    }), t(this._element).on(xe, function(e) {
                        return r(e)
                    }), this._element.classList.add(Oe)) : (t(this._element).on(ye, function(e) {
                        return n(e)
                    }), t(this._element).on(be, function(e) {
                        return i(e)
                    }), t(this._element).on(_e, function(e) {
                        return r(e)
                    }))
                }
            }, n._keydown = function(e) {
                if (!/input|textarea/i.test(e.target.tagName)) switch (e.which) {
                    case ie:
                        e.preventDefault(), this.prev();
                        break;
                    case re:
                        e.preventDefault(), this.next()
                }
            }, n._getItemIndex = function(e) {
                return this._items = e && e.parentNode ? [].slice.call(e.parentNode.querySelectorAll(je)) : [], this._items.indexOf(e)
            }, n._getItemByDirection = function(e, t) {
                var n = e === ue,
                    i = e === ce,
                    r = this._getItemIndex(t),
                    o = this._items.length - 1;
                if ((i && 0 === r || n && r === o) && !this._config.wrap) return t;
                var s = (r + (e === ce ? -1 : 1)) % this._items.length;
                return -1 === s ? this._items[this._items.length - 1] : this._items[s]
            }, n._triggerSlideEvent = function(e, n) {
                var i = this._getItemIndex(e),
                    r = this._getItemIndex(this._element.querySelector(Ie)),
                    o = t.Event(he, {
                        relatedTarget: e,
                        direction: n,
                        from: r,
                        to: i
                    });
                return t(this._element).trigger(o), o
            }, n._setActiveIndicatorElement = function(e) {
                if (this._indicatorsElement) {
                    var n = [].slice.call(this._indicatorsElement.querySelectorAll(Le));
                    t(n).removeClass(Ne);
                    var i = this._indicatorsElement.children[this._getItemIndex(e)];
                    i && t(i).addClass(Ne)
                }
            }, n._slide = function(e, n) {
                var i, r, o, s = this,
                    a = this._element.querySelector(Ie),
                    l = this._getItemIndex(a),
                    u = n || a && this._getItemByDirection(e, a),
                    c = this._getItemIndex(u),
                    f = Boolean(this._interval);
                if (e === ue ? (i = Ae, r = Pe, o = fe) : (i = De, r = Re, o = de), u && t(u).hasClass(Ne)) this._isSliding = !1;
                else if (!this._triggerSlideEvent(u, o).isDefaultPrevented() && a && u) {
                    this._isSliding = !0, f && this.pause(), this._setActiveIndicatorElement(u);
                    var d = t.Event(pe, {
                        relatedTarget: u,
                        direction: o,
                        from: l,
                        to: c
                    });
                    if (t(this._element).hasClass(ke)) {
                        t(u).addClass(r), m.reflow(u), t(a).addClass(i), t(u).addClass(i);
                        var h = parseInt(u.getAttribute("data-interval"), 10);
                        h ? (this._config.defaultInterval = this._config.defaultInterval || this._config.interval, this._config.interval = h) : this._config.interval = this._config.defaultInterval || this._config.interval;
                        var p = m.getTransitionDurationFromElement(a);
                        t(a).one(m.TRANSITION_END, function() {
                            t(u).removeClass(i + " " + r).addClass(Ne), t(a).removeClass(Ne + " " + r + " " + i), s._isSliding = !1, setTimeout(function() {
                                return t(s._element).trigger(d)
                            }, 0)
                        }).emulateTransitionEnd(p)
                    } else t(a).removeClass(Ne), t(u).addClass(Ne), this._isSliding = !1, t(this._element).trigger(d);
                    f && this.cycle()
                }
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(Z),
                        r = o({}, ae, t(this).data());
                    "object" == typeof n && (r = o({}, r, n));
                    var s = "string" == typeof n ? n : r.slide;
                    if (i || (i = new e(this, r), t(this).data(Z, i)), "number" == typeof n) i.to(n);
                    else if ("string" == typeof s) {
                        if ("undefined" == typeof i[s]) throw new TypeError('No method named "' + s + '"');
                        i[s]()
                    } else r.interval && r.ride && (i.pause(), i.cycle())
                })
            }, e._dataApiClickHandler = function(n) {
                var i = m.getSelectorFromElement(this);
                if (i) {
                    var r = t(i)[0];
                    if (r && t(r).hasClass(Se)) {
                        var s = o({}, t(r).data(), t(this).data()),
                            a = this.getAttribute("data-slide-to");
                        a && (s.interval = !1), e._jQueryInterface.call(t(r), s), a && t(r).data(Z).to(a), n.preventDefault()
                    }
                }
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return J
                }
            }, {
                key: "Default",
                get: function() {
                    return ae
                }
            }]), e
        }();
    t(document).on(Ce, Fe, We._dataApiClickHandler), t(window).on(Ee, function() {
        for (var e = [].slice.call(document.querySelectorAll(Me)), n = 0, i = e.length; n < i; n++) {
            var r = t(e[n]);
            We._jQueryInterface.call(r, r.data())
        }
    }), t.fn[G] = We._jQueryInterface, t.fn[G].Constructor = We, t.fn[G].noConflict = function() {
        return t.fn[G] = ne, We._jQueryInterface
    };
    var Ue = "collapse",
        ze = "4.5.2",
        Qe = "bs.collapse",
        Ve = "." + Qe,
        Ye = ".data-api",
        Xe = t.fn[Ue],
        Ke = {
            toggle: !0,
            parent: ""
        },
        Ge = {
            toggle: "boolean",
            parent: "(string|element)"
        },
        Je = "show" + Ve,
        Ze = "shown" + Ve,
        et = "hide" + Ve,
        tt = "hidden" + Ve,
        nt = "click" + Ve + Ye,
        it = "show",
        rt = "collapse",
        ot = "collapsing",
        st = "collapsed",
        at = "width",
        lt = "height",
        ut = ".show, .collapsing",
        ct = '[data-toggle="collapse"]',
        ft = function() {
            function e(e, t) {
                this._isTransitioning = !1, this._element = e, this._config = this._getConfig(t), this._triggerArray = [].slice.call(document.querySelectorAll('[data-toggle="collapse"][href="#' + e.id + '"],[data-toggle="collapse"][data-target="#' + e.id + '"]'));
                for (var n = [].slice.call(document.querySelectorAll(ct)), i = 0, r = n.length; i < r; i++) {
                    var o = n[i],
                        s = m.getSelectorFromElement(o),
                        a = [].slice.call(document.querySelectorAll(s)).filter(function(t) {
                            return t === e
                        });
                    null !== s && a.length > 0 && (this._selector = s, this._triggerArray.push(o))
                }
                this._parent = this._config.parent ? this._getParent() : null, this._config.parent || this._addAriaAndCollapsedClass(this._element, this._triggerArray), this._config.toggle && this.toggle()
            }
            var n = e.prototype;
            return n.toggle = function() {
                t(this._element).hasClass(it) ? this.hide() : this.show()
            }, n.show = function() {
                var n, i, r = this;
                if (!this._isTransitioning && !t(this._element).hasClass(it) && (this._parent && 0 === (n = [].slice.call(this._parent.querySelectorAll(ut)).filter(function(e) {
                        return "string" == typeof r._config.parent ? e.getAttribute("data-parent") === r._config.parent : e.classList.contains(rt)
                    })).length && (n = null), !(n && (i = t(n).not(this._selector).data(Qe)) && i._isTransitioning))) {
                    var o = t.Event(Je);
                    if (t(this._element).trigger(o), !o.isDefaultPrevented()) {
                        n && (e._jQueryInterface.call(t(n).not(this._selector), "hide"), i || t(n).data(Qe, null));
                        var s = this._getDimension();
                        t(this._element).removeClass(rt).addClass(ot), this._element.style[s] = 0, this._triggerArray.length && t(this._triggerArray).removeClass(st).attr("aria-expanded", !0), this.setTransitioning(!0);
                        var a = function() {
                                t(r._element).removeClass(ot).addClass(rt + " " + it), r._element.style[s] = "", r.setTransitioning(!1), t(r._element).trigger(Ze)
                            },
                            l = "scroll" + (s[0].toUpperCase() + s.slice(1)),
                            u = m.getTransitionDurationFromElement(this._element);
                        t(this._element).one(m.TRANSITION_END, a).emulateTransitionEnd(u), this._element.style[s] = this._element[l] + "px"
                    }
                }
            }, n.hide = function() {
                var e = this;
                if (!this._isTransitioning && t(this._element).hasClass(it)) {
                    var n = t.Event(et);
                    if (t(this._element).trigger(n), !n.isDefaultPrevented()) {
                        var i = this._getDimension();
                        this._element.style[i] = this._element.getBoundingClientRect()[i] + "px", m.reflow(this._element), t(this._element).addClass(ot).removeClass(rt + " " + it);
                        var r = this._triggerArray.length;
                        if (r > 0)
                            for (var o = 0; o < r; o++) {
                                var s = this._triggerArray[o],
                                    a = m.getSelectorFromElement(s);
                                if (null !== a) t([].slice.call(document.querySelectorAll(a))).hasClass(it) || t(s).addClass(st).attr("aria-expanded", !1)
                            }
                        this.setTransitioning(!0);
                        var l = function() {
                            e.setTransitioning(!1), t(e._element).removeClass(ot).addClass(rt).trigger(tt)
                        };
                        this._element.style[i] = "";
                        var u = m.getTransitionDurationFromElement(this._element);
                        t(this._element).one(m.TRANSITION_END, l).emulateTransitionEnd(u)
                    }
                }
            }, n.setTransitioning = function(e) {
                this._isTransitioning = e
            }, n.dispose = function() {
                t.removeData(this._element, Qe), this._config = null, this._parent = null, this._element = null, this._triggerArray = null, this._isTransitioning = null
            }, n._getConfig = function(e) {
                return (e = o({}, Ke, e)).toggle = Boolean(e.toggle), m.typeCheckConfig(Ue, e, Ge), e
            }, n._getDimension = function() {
                return t(this._element).hasClass(at) ? at : lt
            }, n._getParent = function() {
                var n, i = this;
                m.isElement(this._config.parent) ? (n = this._config.parent, "undefined" != typeof this._config.parent.jquery && (n = this._config.parent[0])) : n = document.querySelector(this._config.parent);
                var r = '[data-toggle="collapse"][data-parent="' + this._config.parent + '"]',
                    o = [].slice.call(n.querySelectorAll(r));
                return t(o).each(function(t, n) {
                    i._addAriaAndCollapsedClass(e._getTargetFromElement(n), [n])
                }), n
            }, n._addAriaAndCollapsedClass = function(e, n) {
                var i = t(e).hasClass(it);
                n.length && t(n).toggleClass(st, !i).attr("aria-expanded", i)
            }, e._getTargetFromElement = function(e) {
                var t = m.getSelectorFromElement(e);
                return t ? document.querySelector(t) : null
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this),
                        r = i.data(Qe),
                        s = o({}, Ke, i.data(), "object" == typeof n && n ? n : {});
                    if (!r && s.toggle && "string" == typeof n && /show|hide/.test(n) && (s.toggle = !1), r || (r = new e(this, s), i.data(Qe, r)), "string" == typeof n) {
                        if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
                        r[n]()
                    }
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return ze
                }
            }, {
                key: "Default",
                get: function() {
                    return Ke
                }
            }]), e
        }();
    t(document).on(nt, ct, function(e) {
        "A" === e.currentTarget.tagName && e.preventDefault();
        var n = t(this),
            i = m.getSelectorFromElement(this),
            r = [].slice.call(document.querySelectorAll(i));
        t(r).each(function() {
            var e = t(this),
                i = e.data(Qe) ? "toggle" : n.data();
            ft._jQueryInterface.call(e, i)
        })
    }), t.fn[Ue] = ft._jQueryInterface, t.fn[Ue].Constructor = ft, t.fn[Ue].noConflict = function() {
        return t.fn[Ue] = Xe, ft._jQueryInterface
    };
    var dt = "dropdown",
        ht = "4.5.2",
        pt = "bs.dropdown",
        gt = "." + pt,
        mt = ".data-api",
        vt = t.fn[dt],
        yt = 27,
        bt = 32,
        _t = 9,
        wt = 38,
        xt = 40,
        Tt = 3,
        Et = new RegExp(wt + "|" + xt + "|" + yt),
        Ct = "hide" + gt,
        St = "hidden" + gt,
        Nt = "show" + gt,
        kt = "shown" + gt,
        Dt = "click" + gt,
        At = "click" + gt + mt,
        Pt = "keydown" + gt + mt,
        Rt = "keyup" + gt + mt,
        Ot = "disabled",
        Lt = "show",
        It = "dropup",
        jt = "dropright",
        qt = "dropleft",
        Ht = "dropdown-menu-right",
        $t = "position-static",
        Ft = '[data-toggle="dropdown"]',
        Mt = ".dropdown form",
        Bt = ".dropdown-menu",
        Wt = ".navbar-nav",
        Ut = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",
        zt = "top-start",
        Qt = "top-end",
        Vt = "bottom-start",
        Yt = "bottom-end",
        Xt = "right-start",
        Kt = "left-start",
        Gt = {
            offset: 0,
            flip: !0,
            boundary: "scrollParent",
            reference: "toggle",
            display: "dynamic",
            popperConfig: null
        },
        Jt = {
            offset: "(number|string|function)",
            flip: "boolean",
            boundary: "(string|element)",
            reference: "(string|element)",
            display: "string",
            popperConfig: "(null|object)"
        },
        Zt = function() {
            function e(e, t) {
                this._element = e, this._popper = null, this._config = this._getConfig(t), this._menu = this._getMenuElement(), this._inNavbar = this._detectNavbar(), this._addEventListeners()
            }
            var i = e.prototype;
            return i.toggle = function() {
                if (!this._element.disabled && !t(this._element).hasClass(Ot)) {
                    var n = t(this._menu).hasClass(Lt);
                    e._clearMenus(), n || this.show(!0)
                }
            }, i.show = function(i) {
                if (void 0 === i && (i = !1), !(this._element.disabled || t(this._element).hasClass(Ot) || t(this._menu).hasClass(Lt))) {
                    var r = {
                            relatedTarget: this._element
                        },
                        o = t.Event(Nt, r),
                        s = e._getParentFromElement(this._element);
                    if (t(s).trigger(o), !o.isDefaultPrevented()) {
                        if (!this._inNavbar && i) {
                            if (void 0 === n) throw new TypeError("Bootstrap's dropdowns require Popper.js (https://popper.js.org/)");
                            var a = this._element;
                            "parent" === this._config.reference ? a = s : m.isElement(this._config.reference) && (a = this._config.reference, "undefined" != typeof this._config.reference.jquery && (a = this._config.reference[0])), "scrollParent" !== this._config.boundary && t(s).addClass($t), this._popper = new n(a, this._menu, this._getPopperConfig())
                        }
                        "ontouchstart" in document.documentElement && 0 === t(s).closest(Wt).length && t(document.body).children().on("mouseover", null, t.noop), this._element.focus(), this._element.setAttribute("aria-expanded", !0), t(this._menu).toggleClass(Lt), t(s).toggleClass(Lt).trigger(t.Event(kt, r))
                    }
                }
            }, i.hide = function() {
                if (!this._element.disabled && !t(this._element).hasClass(Ot) && t(this._menu).hasClass(Lt)) {
                    var n = {
                            relatedTarget: this._element
                        },
                        i = t.Event(Ct, n),
                        r = e._getParentFromElement(this._element);
                    t(r).trigger(i), i.isDefaultPrevented() || (this._popper && this._popper.destroy(), t(this._menu).toggleClass(Lt), t(r).toggleClass(Lt).trigger(t.Event(St, n)))
                }
            }, i.dispose = function() {
                t.removeData(this._element, pt), t(this._element).off(gt), this._element = null, this._menu = null, null !== this._popper && (this._popper.destroy(), this._popper = null)
            }, i.update = function() {
                this._inNavbar = this._detectNavbar(), null !== this._popper && this._popper.scheduleUpdate()
            }, i._addEventListeners = function() {
                var e = this;
                t(this._element).on(Dt, function(t) {
                    t.preventDefault(), t.stopPropagation(), e.toggle()
                })
            }, i._getConfig = function(e) {
                return e = o({}, this.constructor.Default, t(this._element).data(), e), m.typeCheckConfig(dt, e, this.constructor.DefaultType), e
            }, i._getMenuElement = function() {
                if (!this._menu) {
                    var t = e._getParentFromElement(this._element);
                    t && (this._menu = t.querySelector(Bt))
                }
                return this._menu
            }, i._getPlacement = function() {
                var e = t(this._element.parentNode),
                    n = Vt;
                return e.hasClass(It) ? n = t(this._menu).hasClass(Ht) ? Qt : zt : e.hasClass(jt) ? n = Xt : e.hasClass(qt) ? n = Kt : t(this._menu).hasClass(Ht) && (n = Yt), n
            }, i._detectNavbar = function() {
                return t(this._element).closest(".navbar").length > 0
            }, i._getOffset = function() {
                var e = this,
                    t = {};
                return "function" == typeof this._config.offset ? t.fn = function(t) {
                    return t.offsets = o({}, t.offsets, e._config.offset(t.offsets, e._element) || {}), t
                } : t.offset = this._config.offset, t
            }, i._getPopperConfig = function() {
                var e = {
                    placement: this._getPlacement(),
                    modifiers: {
                        offset: this._getOffset(),
                        flip: {
                            enabled: this._config.flip
                        },
                        preventOverflow: {
                            boundariesElement: this._config.boundary
                        }
                    }
                };
                return "static" === this._config.display && (e.modifiers.applyStyle = {
                    enabled: !1
                }), o({}, e, this._config.popperConfig)
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(pt);
                    if (i || (i = new e(this, "object" == typeof n ? n : null), t(this).data(pt, i)), "string" == typeof n) {
                        if ("undefined" == typeof i[n]) throw new TypeError('No method named "' + n + '"');
                        i[n]()
                    }
                })
            }, e._clearMenus = function(n) {
                if (!n || n.which !== Tt && ("keyup" !== n.type || n.which === _t))
                    for (var i = [].slice.call(document.querySelectorAll(Ft)), r = 0, o = i.length; r < o; r++) {
                        var s = e._getParentFromElement(i[r]),
                            a = t(i[r]).data(pt),
                            l = {
                                relatedTarget: i[r]
                            };
                        if (n && "click" === n.type && (l.clickEvent = n), a) {
                            var u = a._menu;
                            if (t(s).hasClass(Lt) && !(n && ("click" === n.type && /input|textarea/i.test(n.target.tagName) || "keyup" === n.type && n.which === _t) && t.contains(s, n.target))) {
                                var c = t.Event(Ct, l);
                                t(s).trigger(c), c.isDefaultPrevented() || ("ontouchstart" in document.documentElement && t(document.body).children().off("mouseover", null, t.noop), i[r].setAttribute("aria-expanded", "false"), a._popper && a._popper.destroy(), t(u).removeClass(Lt), t(s).removeClass(Lt).trigger(t.Event(St, l)))
                            }
                        }
                    }
            }, e._getParentFromElement = function(e) {
                var t, n = m.getSelectorFromElement(e);
                return n && (t = document.querySelector(n)), t || e.parentNode
            }, e._dataApiKeydownHandler = function(n) {
                if ((/input|textarea/i.test(n.target.tagName) ? !(n.which === bt || n.which !== yt && (n.which !== xt && n.which !== wt || t(n.target).closest(Bt).length)) : Et.test(n.which)) && !this.disabled && !t(this).hasClass(Ot)) {
                    var i = e._getParentFromElement(this),
                        r = t(i).hasClass(Lt);
                    if (r || n.which !== yt) {
                        if (n.preventDefault(), n.stopPropagation(), !r || r && (n.which === yt || n.which === bt)) return n.which === yt && t(i.querySelector(Ft)).trigger("focus"), void t(this).trigger("click");
                        var o = [].slice.call(i.querySelectorAll(Ut)).filter(function(e) {
                            return t(e).is(":visible")
                        });
                        if (0 !== o.length) {
                            var s = o.indexOf(n.target);
                            n.which === wt && s > 0 && s--, n.which === xt && s < o.length - 1 && s++, s < 0 && (s = 0), o[s].focus()
                        }
                    }
                }
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return ht
                }
            }, {
                key: "Default",
                get: function() {
                    return Gt
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return Jt
                }
            }]), e
        }();
    t(document).on(Pt, Ft, Zt._dataApiKeydownHandler).on(Pt, Bt, Zt._dataApiKeydownHandler).on(At + " " + Rt, Zt._clearMenus).on(At, Ft, function(e) {
        e.preventDefault(), e.stopPropagation(), Zt._jQueryInterface.call(t(this), "toggle")
    }).on(At, Mt, function(e) {
        e.stopPropagation()
    }), t.fn[dt] = Zt._jQueryInterface, t.fn[dt].Constructor = Zt, t.fn[dt].noConflict = function() {
        return t.fn[dt] = vt, Zt._jQueryInterface
    };
    var en = "modal",
        tn = "4.5.2",
        nn = "bs.modal",
        rn = "." + nn,
        on = ".data-api",
        sn = t.fn[en],
        an = 27,
        ln = {
            backdrop: !0,
            keyboard: !0,
            focus: !0,
            show: !0
        },
        un = {
            backdrop: "(boolean|string)",
            keyboard: "boolean",
            focus: "boolean",
            show: "boolean"
        },
        cn = "hide" + rn,
        fn = "hidePrevented" + rn,
        dn = "hidden" + rn,
        hn = "show" + rn,
        pn = "shown" + rn,
        gn = "focusin" + rn,
        mn = "resize" + rn,
        vn = "click.dismiss" + rn,
        yn = "keydown.dismiss" + rn,
        bn = "mouseup.dismiss" + rn,
        _n = "mousedown.dismiss" + rn,
        wn = "click" + rn + on,
        xn = "modal-dialog-scrollable",
        Tn = "modal-scrollbar-measure",
        En = "modal-backdrop",
        Cn = "modal-open",
        Sn = "fade",
        Nn = "show",
        kn = "modal-static",
        Dn = ".modal-dialog",
        An = ".modal-body",
        Pn = '[data-toggle="modal"]',
        Rn = '[data-dismiss="modal"]',
        On = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
        Ln = ".sticky-top",
        In = function() {
            function e(e, t) {
                this._config = this._getConfig(t), this._element = e, this._dialog = e.querySelector(Dn), this._backdrop = null, this._isShown = !1, this._isBodyOverflowing = !1, this._ignoreBackdropClick = !1, this._isTransitioning = !1, this._scrollbarWidth = 0
            }
            var n = e.prototype;
            return n.toggle = function(e) {
                return this._isShown ? this.hide() : this.show(e)
            }, n.show = function(e) {
                var n = this;
                if (!this._isShown && !this._isTransitioning) {
                    t(this._element).hasClass(Sn) && (this._isTransitioning = !0);
                    var i = t.Event(hn, {
                        relatedTarget: e
                    });
                    t(this._element).trigger(i), this._isShown || i.isDefaultPrevented() || (this._isShown = !0, this._checkScrollbar(), this._setScrollbar(), this._adjustDialog(), this._setEscapeEvent(), this._setResizeEvent(), t(this._element).on(vn, Rn, function(e) {
                        return n.hide(e)
                    }), t(this._dialog).on(_n, function() {
                        t(n._element).one(bn, function(e) {
                            t(e.target).is(n._element) && (n._ignoreBackdropClick = !0)
                        })
                    }), this._showBackdrop(function() {
                        return n._showElement(e)
                    }))
                }
            }, n.hide = function(e) {
                var n = this;
                if (e && e.preventDefault(), this._isShown && !this._isTransitioning) {
                    var i = t.Event(cn);
                    if (t(this._element).trigger(i), this._isShown && !i.isDefaultPrevented()) {
                        this._isShown = !1;
                        var r = t(this._element).hasClass(Sn);
                        if (r && (this._isTransitioning = !0), this._setEscapeEvent(), this._setResizeEvent(), t(document).off(gn), t(this._element).removeClass(Nn), t(this._element).off(vn), t(this._dialog).off(_n), r) {
                            var o = m.getTransitionDurationFromElement(this._element);
                            t(this._element).one(m.TRANSITION_END, function(e) {
                                return n._hideModal(e)
                            }).emulateTransitionEnd(o)
                        } else this._hideModal()
                    }
                }
            }, n.dispose = function() {
                [window, this._element, this._dialog].forEach(function(e) {
                    return t(e).off(rn)
                }), t(document).off(gn), t.removeData(this._element, nn), this._config = null, this._element = null, this._dialog = null, this._backdrop = null, this._isShown = null, this._isBodyOverflowing = null, this._ignoreBackdropClick = null, this._isTransitioning = null, this._scrollbarWidth = null
            }, n.handleUpdate = function() {
                this._adjustDialog()
            }, n._getConfig = function(e) {
                return e = o({}, ln, e), m.typeCheckConfig(en, e, un), e
            }, n._triggerBackdropTransition = function() {
                var e = this;
                if ("static" === this._config.backdrop) {
                    var n = t.Event(fn);
                    if (t(this._element).trigger(n), n.defaultPrevented) return;
                    var i = this._element.scrollHeight > document.documentElement.clientHeight;
                    i || (this._element.style.overflowY = "hidden"), this._element.classList.add(kn);
                    var r = m.getTransitionDurationFromElement(this._dialog);
                    t(this._element).off(m.TRANSITION_END), t(this._element).one(m.TRANSITION_END, function() {
                        e._element.classList.remove(kn), i || t(e._element).one(m.TRANSITION_END, function() {
                            e._element.style.overflowY = ""
                        }).emulateTransitionEnd(e._element, r)
                    }).emulateTransitionEnd(r), this._element.focus()
                } else this.hide()
            }, n._showElement = function(e) {
                var n = this,
                    i = t(this._element).hasClass(Sn),
                    r = this._dialog ? this._dialog.querySelector(An) : null;
                this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE || document.body.appendChild(this._element), this._element.style.display = "block", this._element.removeAttribute("aria-hidden"), this._element.setAttribute("aria-modal", !0), this._element.setAttribute("role", "dialog"), t(this._dialog).hasClass(xn) && r ? r.scrollTop = 0 : this._element.scrollTop = 0, i && m.reflow(this._element), t(this._element).addClass(Nn), this._config.focus && this._enforceFocus();
                var o = t.Event(pn, {
                        relatedTarget: e
                    }),
                    s = function() {
                        n._config.focus && n._element.focus(), n._isTransitioning = !1, t(n._element).trigger(o)
                    };
                if (i) {
                    var a = m.getTransitionDurationFromElement(this._dialog);
                    t(this._dialog).one(m.TRANSITION_END, s).emulateTransitionEnd(a)
                } else s()
            }, n._enforceFocus = function() {
                var e = this;
                t(document).off(gn).on(gn, function(n) {
                    document !== n.target && e._element !== n.target && 0 === t(e._element).has(n.target).length && e._element.focus()
                })
            }, n._setEscapeEvent = function() {
                var e = this;
                this._isShown ? t(this._element).on(yn, function(t) {
                    e._config.keyboard && t.which === an ? (t.preventDefault(), e.hide()) : e._config.keyboard || t.which !== an || e._triggerBackdropTransition()
                }) : this._isShown || t(this._element).off(yn)
            }, n._setResizeEvent = function() {
                var e = this;
                this._isShown ? t(window).on(mn, function(t) {
                    return e.handleUpdate(t)
                }) : t(window).off(mn)
            }, n._hideModal = function() {
                var e = this;
                this._element.style.display = "none", this._element.setAttribute("aria-hidden", !0), this._element.removeAttribute("aria-modal"), this._element.removeAttribute("role"), this._isTransitioning = !1, this._showBackdrop(function() {
                    t(document.body).removeClass(Cn), e._resetAdjustments(), e._resetScrollbar(), t(e._element).trigger(dn)
                })
            }, n._removeBackdrop = function() {
                this._backdrop && (t(this._backdrop).remove(), this._backdrop = null)
            }, n._showBackdrop = function(e) {
                var n = this,
                    i = t(this._element).hasClass(Sn) ? Sn : "";
                if (this._isShown && this._config.backdrop) {
                    if (this._backdrop = document.createElement("div"), this._backdrop.className = En, i && this._backdrop.classList.add(i), t(this._backdrop).appendTo(document.body), t(this._element).on(vn, function(e) {
                            n._ignoreBackdropClick ? n._ignoreBackdropClick = !1 : e.target === e.currentTarget && n._triggerBackdropTransition()
                        }), i && m.reflow(this._backdrop), t(this._backdrop).addClass(Nn), !e) return;
                    if (!i) return void e();
                    var r = m.getTransitionDurationFromElement(this._backdrop);
                    t(this._backdrop).one(m.TRANSITION_END, e).emulateTransitionEnd(r)
                } else if (!this._isShown && this._backdrop) {
                    t(this._backdrop).removeClass(Nn);
                    var o = function() {
                        n._removeBackdrop(), e && e()
                    };
                    if (t(this._element).hasClass(Sn)) {
                        var s = m.getTransitionDurationFromElement(this._backdrop);
                        t(this._backdrop).one(m.TRANSITION_END, o).emulateTransitionEnd(s)
                    } else o()
                } else e && e()
            }, n._adjustDialog = function() {
                var e = this._element.scrollHeight > document.documentElement.clientHeight;
                !this._isBodyOverflowing && e && (this._element.style.paddingLeft = this._scrollbarWidth + "px"), this._isBodyOverflowing && !e && (this._element.style.paddingRight = this._scrollbarWidth + "px")
            }, n._resetAdjustments = function() {
                this._element.style.paddingLeft = "", this._element.style.paddingRight = ""
            }, n._checkScrollbar = function() {
                var e = document.body.getBoundingClientRect();
                this._isBodyOverflowing = Math.round(e.left + e.right) < window.innerWidth, this._scrollbarWidth = this._getScrollbarWidth()
            }, n._setScrollbar = function() {
                var e = this;
                if (this._isBodyOverflowing) {
                    var n = [].slice.call(document.querySelectorAll(On)),
                        i = [].slice.call(document.querySelectorAll(Ln));
                    t(n).each(function(n, i) {
                        var r = i.style.paddingRight,
                            o = t(i).css("padding-right");
                        t(i).data("padding-right", r).css("padding-right", parseFloat(o) + e._scrollbarWidth + "px")
                    }), t(i).each(function(n, i) {
                        var r = i.style.marginRight,
                            o = t(i).css("margin-right");
                        t(i).data("margin-right", r).css("margin-right", parseFloat(o) - e._scrollbarWidth + "px")
                    });
                    var r = document.body.style.paddingRight,
                        o = t(document.body).css("padding-right");
                    t(document.body).data("padding-right", r).css("padding-right", parseFloat(o) + this._scrollbarWidth + "px")
                }
                t(document.body).addClass(Cn)
            }, n._resetScrollbar = function() {
                var e = [].slice.call(document.querySelectorAll(On));
                t(e).each(function(e, n) {
                    var i = t(n).data("padding-right");
                    t(n).removeData("padding-right"), n.style.paddingRight = i || ""
                });
                var n = [].slice.call(document.querySelectorAll("" + Ln));
                t(n).each(function(e, n) {
                    var i = t(n).data("margin-right");
                    void 0 !== i && t(n).css("margin-right", i).removeData("margin-right")
                });
                var i = t(document.body).data("padding-right");
                t(document.body).removeData("padding-right"), document.body.style.paddingRight = i || ""
            }, n._getScrollbarWidth = function() {
                var e = document.createElement("div");
                e.className = Tn, document.body.appendChild(e);
                var t = e.getBoundingClientRect().width - e.clientWidth;
                return document.body.removeChild(e), t
            }, e._jQueryInterface = function(n, i) {
                return this.each(function() {
                    var r = t(this).data(nn),
                        s = o({}, ln, t(this).data(), "object" == typeof n && n ? n : {});
                    if (r || (r = new e(this, s), t(this).data(nn, r)), "string" == typeof n) {
                        if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
                        r[n](i)
                    } else s.show && r.show(i)
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return tn
                }
            }, {
                key: "Default",
                get: function() {
                    return ln
                }
            }]), e
        }();
    t(document).on(wn, Pn, function(e) {
        var n, i = this,
            r = m.getSelectorFromElement(this);
        r && (n = document.querySelector(r));
        var s = t(n).data(nn) ? "toggle" : o({}, t(n).data(), t(this).data());
        "A" !== this.tagName && "AREA" !== this.tagName || e.preventDefault();
        var a = t(n).one(hn, function(e) {
            e.isDefaultPrevented() || a.one(dn, function() {
                t(i).is(":visible") && i.focus()
            })
        });
        In._jQueryInterface.call(t(n), s, this)
    }), t.fn[en] = In._jQueryInterface, t.fn[en].Constructor = In, t.fn[en].noConflict = function() {
        return t.fn[en] = sn, In._jQueryInterface
    };
    var jn = ["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"],
        qn = {
            "*": ["class", "dir", "id", "lang", "role", /^aria-[\w-]*$/i],
            a: ["target", "href", "title", "rel"],
            area: [],
            b: [],
            br: [],
            col: [],
            code: [],
            div: [],
            em: [],
            hr: [],
            h1: [],
            h2: [],
            h3: [],
            h4: [],
            h5: [],
            h6: [],
            i: [],
            img: ["src", "srcset", "alt", "title", "width", "height"],
            li: [],
            ol: [],
            p: [],
            pre: [],
            s: [],
            small: [],
            span: [],
            sub: [],
            sup: [],
            strong: [],
            u: [],
            ul: []
        },
        Hn = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi,
        $n = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i,
        Fn = "tooltip",
        Mn = "4.5.2",
        Bn = "bs.tooltip",
        Wn = "." + Bn,
        Un = t.fn[Fn],
        zn = "bs-tooltip",
        Qn = new RegExp("(^|\\s)" + zn + "\\S+", "g"),
        Vn = ["sanitize", "whiteList", "sanitizeFn"],
        Yn = {
            animation: "boolean",
            template: "string",
            title: "(string|element|function)",
            trigger: "string",
            delay: "(number|object)",
            html: "boolean",
            selector: "(string|boolean)",
            placement: "(string|function)",
            offset: "(number|string|function)",
            container: "(string|element|boolean)",
            fallbackPlacement: "(string|array)",
            boundary: "(string|element)",
            sanitize: "boolean",
            sanitizeFn: "(null|function)",
            whiteList: "object",
            popperConfig: "(null|object)"
        },
        Xn = {
            AUTO: "auto",
            TOP: "top",
            RIGHT: "right",
            BOTTOM: "bottom",
            LEFT: "left"
        },
        Kn = {
            animation: !0,
            template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
            trigger: "hover focus",
            title: "",
            delay: 0,
            html: !1,
            selector: !1,
            placement: "top",
            offset: 0,
            container: !1,
            fallbackPlacement: "flip",
            boundary: "scrollParent",
            sanitize: !0,
            sanitizeFn: null,
            whiteList: qn,
            popperConfig: null
        },
        Gn = "show",
        Jn = "out",
        Zn = {
            HIDE: "hide" + Wn,
            HIDDEN: "hidden" + Wn,
            SHOW: "show" + Wn,
            SHOWN: "shown" + Wn,
            INSERTED: "inserted" + Wn,
            CLICK: "click" + Wn,
            FOCUSIN: "focusin" + Wn,
            FOCUSOUT: "focusout" + Wn,
            MOUSEENTER: "mouseenter" + Wn,
            MOUSELEAVE: "mouseleave" + Wn
        },
        ei = "fade",
        ti = "show",
        ni = ".tooltip-inner",
        ii = ".arrow",
        ri = "hover",
        oi = "focus",
        si = "click",
        ai = "manual",
        li = function() {
            function e(e, t) {
                if (void 0 === n) throw new TypeError("Bootstrap's tooltips require Popper.js (https://popper.js.org/)");
                this._isEnabled = !0, this._timeout = 0, this._hoverState = "", this._activeTrigger = {}, this._popper = null, this.element = e, this.config = this._getConfig(t), this.tip = null, this._setListeners()
            }
            var i = e.prototype;
            return i.enable = function() {
                this._isEnabled = !0
            }, i.disable = function() {
                this._isEnabled = !1
            }, i.toggleEnabled = function() {
                this._isEnabled = !this._isEnabled
            }, i.toggle = function(e) {
                if (this._isEnabled)
                    if (e) {
                        var n = this.constructor.DATA_KEY,
                            i = t(e.currentTarget).data(n);
                        i || (i = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(n, i)), i._activeTrigger.click = !i._activeTrigger.click, i._isWithActiveTrigger() ? i._enter(null, i) : i._leave(null, i)
                    } else {
                        if (t(this.getTipElement()).hasClass(ti)) return void this._leave(null, this);
                        this._enter(null, this)
                    }
            }, i.dispose = function() {
                clearTimeout(this._timeout), t.removeData(this.element, this.constructor.DATA_KEY), t(this.element).off(this.constructor.EVENT_KEY), t(this.element).closest(".modal").off("hide.bs.modal", this._hideModalHandler), this.tip && t(this.tip).remove(), this._isEnabled = null, this._timeout = null, this._hoverState = null, this._activeTrigger = null, this._popper && this._popper.destroy(), this._popper = null, this.element = null, this.config = null, this.tip = null
            }, i.show = function() {
                var e = this;
                if ("none" === t(this.element).css("display")) throw new Error("Please use show on visible elements");
                var i = t.Event(this.constructor.Event.SHOW);
                if (this.isWithContent() && this._isEnabled) {
                    t(this.element).trigger(i);
                    var r = m.findShadowRoot(this.element),
                        o = t.contains(null !== r ? r : this.element.ownerDocument.documentElement, this.element);
                    if (i.isDefaultPrevented() || !o) return;
                    var s = this.getTipElement(),
                        a = m.getUID(this.constructor.NAME);
                    s.setAttribute("id", a), this.element.setAttribute("aria-describedby", a), this.setContent(), this.config.animation && t(s).addClass(ei);
                    var l = "function" == typeof this.config.placement ? this.config.placement.call(this, s, this.element) : this.config.placement,
                        u = this._getAttachment(l);
                    this.addAttachmentClass(u);
                    var c = this._getContainer();
                    t(s).data(this.constructor.DATA_KEY, this), t.contains(this.element.ownerDocument.documentElement, this.tip) || t(s).appendTo(c), t(this.element).trigger(this.constructor.Event.INSERTED), this._popper = new n(this.element, s, this._getPopperConfig(u)), t(s).addClass(ti), "ontouchstart" in document.documentElement && t(document.body).children().on("mouseover", null, t.noop);
                    var f = function() {
                        e.config.animation && e._fixTransition();
                        var n = e._hoverState;
                        e._hoverState = null, t(e.element).trigger(e.constructor.Event.SHOWN), n === Jn && e._leave(null, e)
                    };
                    if (t(this.tip).hasClass(ei)) {
                        var d = m.getTransitionDurationFromElement(this.tip);
                        t(this.tip).one(m.TRANSITION_END, f).emulateTransitionEnd(d)
                    } else f()
                }
            }, i.hide = function(e) {
                var n = this,
                    i = this.getTipElement(),
                    r = t.Event(this.constructor.Event.HIDE),
                    o = function() {
                        n._hoverState !== Gn && i.parentNode && i.parentNode.removeChild(i), n._cleanTipClass(), n.element.removeAttribute("aria-describedby"), t(n.element).trigger(n.constructor.Event.HIDDEN), null !== n._popper && n._popper.destroy(), e && e()
                    };
                if (t(this.element).trigger(r), !r.isDefaultPrevented()) {
                    if (t(i).removeClass(ti), "ontouchstart" in document.documentElement && t(document.body).children().off("mouseover", null, t.noop), this._activeTrigger[si] = !1, this._activeTrigger[oi] = !1, this._activeTrigger[ri] = !1, t(this.tip).hasClass(ei)) {
                        var s = m.getTransitionDurationFromElement(i);
                        t(i).one(m.TRANSITION_END, o).emulateTransitionEnd(s)
                    } else o();
                    this._hoverState = ""
                }
            }, i.update = function() {
                null !== this._popper && this._popper.scheduleUpdate()
            }, i.isWithContent = function() {
                return Boolean(this.getTitle())
            }, i.addAttachmentClass = function(e) {
                t(this.getTipElement()).addClass(zn + "-" + e)
            }, i.getTipElement = function() {
                return this.tip = this.tip || t(this.config.template)[0], this.tip
            }, i.setContent = function() {
                var e = this.getTipElement();
                this.setElementContent(t(e.querySelectorAll(ni)), this.getTitle()), t(e).removeClass(ei + " " + ti)
            }, i.setElementContent = function(e, n) {
                "object" != typeof n || !n.nodeType && !n.jquery ? this.config.html ? (this.config.sanitize && (n = d(n, this.config.whiteList, this.config.sanitizeFn)), e.html(n)) : e.text(n) : this.config.html ? t(n).parent().is(e) || e.empty().append(n) : e.text(t(n).text())
            }, i.getTitle = function() {
                var e = this.element.getAttribute("data-original-title");
                return e || (e = "function" == typeof this.config.title ? this.config.title.call(this.element) : this.config.title), e
            }, i._getPopperConfig = function(e) {
                var t = this;
                return o({}, {
                    placement: e,
                    modifiers: {
                        offset: this._getOffset(),
                        flip: {
                            behavior: this.config.fallbackPlacement
                        },
                        arrow: {
                            element: ii
                        },
                        preventOverflow: {
                            boundariesElement: this.config.boundary
                        }
                    },
                    onCreate: function(e) {
                        e.originalPlacement !== e.placement && t._handlePopperPlacementChange(e)
                    },
                    onUpdate: function(e) {
                        return t._handlePopperPlacementChange(e)
                    }
                }, this.config.popperConfig)
            }, i._getOffset = function() {
                var e = this,
                    t = {};
                return "function" == typeof this.config.offset ? t.fn = function(t) {
                    return t.offsets = o({}, t.offsets, e.config.offset(t.offsets, e.element) || {}), t
                } : t.offset = this.config.offset, t
            }, i._getContainer = function() {
                return !1 === this.config.container ? document.body : m.isElement(this.config.container) ? t(this.config.container) : t(document).find(this.config.container)
            }, i._getAttachment = function(e) {
                return Xn[e.toUpperCase()]
            }, i._setListeners = function() {
                var e = this;
                this.config.trigger.split(" ").forEach(function(n) {
                    if ("click" === n) t(e.element).on(e.constructor.Event.CLICK, e.config.selector, function(t) {
                        return e.toggle(t)
                    });
                    else if (n !== ai) {
                        var i = n === ri ? e.constructor.Event.MOUSEENTER : e.constructor.Event.FOCUSIN,
                            r = n === ri ? e.constructor.Event.MOUSELEAVE : e.constructor.Event.FOCUSOUT;
                        t(e.element).on(i, e.config.selector, function(t) {
                            return e._enter(t)
                        }).on(r, e.config.selector, function(t) {
                            return e._leave(t)
                        })
                    }
                }), this._hideModalHandler = function() {
                    e.element && e.hide()
                }, t(this.element).closest(".modal").on("hide.bs.modal", this._hideModalHandler), this.config.selector ? this.config = o({}, this.config, {
                    trigger: "manual",
                    selector: ""
                }) : this._fixTitle()
            }, i._fixTitle = function() {
                var e = typeof this.element.getAttribute("data-original-title");
                (this.element.getAttribute("title") || "string" !== e) && (this.element.setAttribute("data-original-title", this.element.getAttribute("title") || ""), this.element.setAttribute("title", ""))
            }, i._enter = function(e, n) {
                var i = this.constructor.DATA_KEY;
                (n = n || t(e.currentTarget).data(i)) || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(i, n)), e && (n._activeTrigger["focusin" === e.type ? oi : ri] = !0), t(n.getTipElement()).hasClass(ti) || n._hoverState === Gn ? n._hoverState = Gn : (clearTimeout(n._timeout), n._hoverState = Gn, n.config.delay && n.config.delay.show ? n._timeout = setTimeout(function() {
                    n._hoverState === Gn && n.show()
                }, n.config.delay.show) : n.show())
            }, i._leave = function(e, n) {
                var i = this.constructor.DATA_KEY;
                (n = n || t(e.currentTarget).data(i)) || (n = new this.constructor(e.currentTarget, this._getDelegateConfig()), t(e.currentTarget).data(i, n)), e && (n._activeTrigger["focusout" === e.type ? oi : ri] = !1), n._isWithActiveTrigger() || (clearTimeout(n._timeout), n._hoverState = Jn, n.config.delay && n.config.delay.hide ? n._timeout = setTimeout(function() {
                    n._hoverState === Jn && n.hide()
                }, n.config.delay.hide) : n.hide())
            }, i._isWithActiveTrigger = function() {
                for (var e in this._activeTrigger)
                    if (this._activeTrigger[e]) return !0;
                return !1
            }, i._getConfig = function(e) {
                var n = t(this.element).data();
                return Object.keys(n).forEach(function(e) {
                    -1 !== Vn.indexOf(e) && delete n[e]
                }), "number" == typeof(e = o({}, this.constructor.Default, n, "object" == typeof e && e ? e : {})).delay && (e.delay = {
                    show: e.delay,
                    hide: e.delay
                }), "number" == typeof e.title && (e.title = e.title.toString()), "number" == typeof e.content && (e.content = e.content.toString()), m.typeCheckConfig(Fn, e, this.constructor.DefaultType), e.sanitize && (e.template = d(e.template, e.whiteList, e.sanitizeFn)), e
            }, i._getDelegateConfig = function() {
                var e = {};
                if (this.config)
                    for (var t in this.config) this.constructor.Default[t] !== this.config[t] && (e[t] = this.config[t]);
                return e
            }, i._cleanTipClass = function() {
                var e = t(this.getTipElement()),
                    n = e.attr("class").match(Qn);
                null !== n && n.length && e.removeClass(n.join(""))
            }, i._handlePopperPlacementChange = function(e) {
                this.tip = e.instance.popper, this._cleanTipClass(), this.addAttachmentClass(this._getAttachment(e.placement))
            }, i._fixTransition = function() {
                var e = this.getTipElement(),
                    n = this.config.animation;
                null === e.getAttribute("x-placement") && (t(e).removeClass(ei), this.config.animation = !1, this.hide(), this.show(), this.config.animation = n)
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(Bn),
                        r = "object" == typeof n && n;
                    if ((i || !/dispose|hide/.test(n)) && (i || (i = new e(this, r), t(this).data(Bn, i)), "string" == typeof n)) {
                        if ("undefined" == typeof i[n]) throw new TypeError('No method named "' + n + '"');
                        i[n]()
                    }
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return Mn
                }
            }, {
                key: "Default",
                get: function() {
                    return Kn
                }
            }, {
                key: "NAME",
                get: function() {
                    return Fn
                }
            }, {
                key: "DATA_KEY",
                get: function() {
                    return Bn
                }
            }, {
                key: "Event",
                get: function() {
                    return Zn
                }
            }, {
                key: "EVENT_KEY",
                get: function() {
                    return Wn
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return Yn
                }
            }]), e
        }();
    t.fn[Fn] = li._jQueryInterface, t.fn[Fn].Constructor = li, t.fn[Fn].noConflict = function() {
        return t.fn[Fn] = Un, li._jQueryInterface
    };
    var ui = "popover",
        ci = "4.5.2",
        fi = "bs.popover",
        di = "." + fi,
        hi = t.fn[ui],
        pi = "bs-popover",
        gi = new RegExp("(^|\\s)" + pi + "\\S+", "g"),
        mi = o({}, li.Default, {
            placement: "right",
            trigger: "click",
            content: "",
            template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
        }),
        vi = o({}, li.DefaultType, {
            content: "(string|element|function)"
        }),
        yi = "fade",
        bi = "show",
        _i = ".popover-header",
        wi = ".popover-body",
        xi = {
            HIDE: "hide" + di,
            HIDDEN: "hidden" + di,
            SHOW: "show" + di,
            SHOWN: "shown" + di,
            INSERTED: "inserted" + di,
            CLICK: "click" + di,
            FOCUSIN: "focusin" + di,
            FOCUSOUT: "focusout" + di,
            MOUSEENTER: "mouseenter" + di,
            MOUSELEAVE: "mouseleave" + di
        },
        Ti = function(e) {
            function n() {
                return e.apply(this, arguments) || this
            }
            s(n, e);
            var i = n.prototype;
            return i.isWithContent = function() {
                return this.getTitle() || this._getContent()
            }, i.addAttachmentClass = function(e) {
                t(this.getTipElement()).addClass(pi + "-" + e)
            }, i.getTipElement = function() {
                return this.tip = this.tip || t(this.config.template)[0], this.tip
            }, i.setContent = function() {
                var e = t(this.getTipElement());
                this.setElementContent(e.find(_i), this.getTitle());
                var n = this._getContent();
                "function" == typeof n && (n = n.call(this.element)), this.setElementContent(e.find(wi), n), e.removeClass(yi + " " + bi)
            }, i._getContent = function() {
                return this.element.getAttribute("data-content") || this.config.content
            }, i._cleanTipClass = function() {
                var e = t(this.getTipElement()),
                    n = e.attr("class").match(gi);
                null !== n && n.length > 0 && e.removeClass(n.join(""))
            }, n._jQueryInterface = function(e) {
                return this.each(function() {
                    var i = t(this).data(fi),
                        r = "object" == typeof e ? e : null;
                    if ((i || !/dispose|hide/.test(e)) && (i || (i = new n(this, r), t(this).data(fi, i)), "string" == typeof e)) {
                        if ("undefined" == typeof i[e]) throw new TypeError('No method named "' + e + '"');
                        i[e]()
                    }
                })
            }, r(n, null, [{
                key: "VERSION",
                get: function() {
                    return ci
                }
            }, {
                key: "Default",
                get: function() {
                    return mi
                }
            }, {
                key: "NAME",
                get: function() {
                    return ui
                }
            }, {
                key: "DATA_KEY",
                get: function() {
                    return fi
                }
            }, {
                key: "Event",
                get: function() {
                    return xi
                }
            }, {
                key: "EVENT_KEY",
                get: function() {
                    return di
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return vi
                }
            }]), n
        }(li);
    t.fn[ui] = Ti._jQueryInterface, t.fn[ui].Constructor = Ti, t.fn[ui].noConflict = function() {
        return t.fn[ui] = hi, Ti._jQueryInterface
    };
    var Ei = "scrollspy",
        Ci = "4.5.2",
        Si = "bs.scrollspy",
        Ni = "." + Si,
        ki = ".data-api",
        Di = t.fn[Ei],
        Ai = {
            offset: 10,
            method: "auto",
            target: ""
        },
        Pi = {
            offset: "number",
            method: "string",
            target: "(string|element)"
        },
        Ri = "activate" + Ni,
        Oi = "scroll" + Ni,
        Li = "load" + Ni + ki,
        Ii = "dropdown-item",
        ji = "active",
        qi = '[data-spy="scroll"]',
        Hi = ".nav, .list-group",
        $i = ".nav-link",
        Fi = ".nav-item",
        Mi = ".list-group-item",
        Bi = ".dropdown",
        Wi = ".dropdown-item",
        Ui = ".dropdown-toggle",
        zi = "offset",
        Qi = "position",
        Vi = function() {
            function e(e, n) {
                var i = this;
                this._element = e, this._scrollElement = "BODY" === e.tagName ? window : e, this._config = this._getConfig(n), this._selector = this._config.target + " " + $i + "," + this._config.target + " " + Mi + "," + this._config.target + " " + Wi, this._offsets = [], this._targets = [], this._activeTarget = null, this._scrollHeight = 0, t(this._scrollElement).on(Oi, function(e) {
                    return i._process(e)
                }), this.refresh(), this._process()
            }
            var n = e.prototype;
            return n.refresh = function() {
                var e = this,
                    n = this._scrollElement === this._scrollElement.window ? zi : Qi,
                    i = "auto" === this._config.method ? n : this._config.method,
                    r = i === Qi ? this._getScrollTop() : 0;
                this._offsets = [], this._targets = [], this._scrollHeight = this._getScrollHeight(), [].slice.call(document.querySelectorAll(this._selector)).map(function(e) {
                    var n, o = m.getSelectorFromElement(e);
                    if (o && (n = document.querySelector(o)), n) {
                        var s = n.getBoundingClientRect();
                        if (s.width || s.height) return [t(n)[i]().top + r, o]
                    }
                    return null
                }).filter(function(e) {
                    return e
                }).sort(function(e, t) {
                    return e[0] - t[0]
                }).forEach(function(t) {
                    e._offsets.push(t[0]), e._targets.push(t[1])
                })
            }, n.dispose = function() {
                t.removeData(this._element, Si), t(this._scrollElement).off(Ni), this._element = null, this._scrollElement = null, this._config = null, this._selector = null, this._offsets = null, this._targets = null, this._activeTarget = null, this._scrollHeight = null
            }, n._getConfig = function(e) {
                if ("string" != typeof(e = o({}, Ai, "object" == typeof e && e ? e : {})).target && m.isElement(e.target)) {
                    var n = t(e.target).attr("id");
                    n || (n = m.getUID(Ei), t(e.target).attr("id", n)), e.target = "#" + n
                }
                return m.typeCheckConfig(Ei, e, Pi), e
            }, n._getScrollTop = function() {
                return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop
            }, n._getScrollHeight = function() {
                return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
            }, n._getOffsetHeight = function() {
                return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height
            }, n._process = function() {
                var e = this._getScrollTop() + this._config.offset,
                    t = this._getScrollHeight(),
                    n = this._config.offset + t - this._getOffsetHeight();
                if (this._scrollHeight !== t && this.refresh(), e >= n) {
                    var i = this._targets[this._targets.length - 1];
                    this._activeTarget !== i && this._activate(i)
                } else {
                    if (this._activeTarget && e < this._offsets[0] && this._offsets[0] > 0) return this._activeTarget = null, void this._clear();
                    for (var r = this._offsets.length; r--;) {
                        this._activeTarget !== this._targets[r] && e >= this._offsets[r] && ("undefined" == typeof this._offsets[r + 1] || e < this._offsets[r + 1]) && this._activate(this._targets[r])
                    }
                }
            }, n._activate = function(e) {
                this._activeTarget = e, this._clear();
                var n = this._selector.split(",").map(function(t) {
                        return t + '[data-target="' + e + '"],' + t + '[href="' + e + '"]'
                    }),
                    i = t([].slice.call(document.querySelectorAll(n.join(","))));
                i.hasClass(Ii) ? (i.closest(Bi).find(Ui).addClass(ji), i.addClass(ji)) : (i.addClass(ji), i.parents(Hi).prev($i + ", " + Mi).addClass(ji), i.parents(Hi).prev(Fi).children($i).addClass(ji)), t(this._scrollElement).trigger(Ri, {
                    relatedTarget: e
                })
            }, n._clear = function() {
                [].slice.call(document.querySelectorAll(this._selector)).filter(function(e) {
                    return e.classList.contains(ji)
                }).forEach(function(e) {
                    return e.classList.remove(ji)
                })
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this).data(Si);
                    if (i || (i = new e(this, "object" == typeof n && n), t(this).data(Si, i)), "string" == typeof n) {
                        if ("undefined" == typeof i[n]) throw new TypeError('No method named "' + n + '"');
                        i[n]()
                    }
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return Ci
                }
            }, {
                key: "Default",
                get: function() {
                    return Ai
                }
            }]), e
        }();
    t(window).on(Li, function() {
        for (var e = [].slice.call(document.querySelectorAll(qi)), n = e.length; n--;) {
            var i = t(e[n]);
            Vi._jQueryInterface.call(i, i.data())
        }
    }), t.fn[Ei] = Vi._jQueryInterface, t.fn[Ei].Constructor = Vi, t.fn[Ei].noConflict = function() {
        return t.fn[Ei] = Di, Vi._jQueryInterface
    };
    var Yi = "tab",
        Xi = "4.5.2",
        Ki = "bs.tab",
        Gi = "." + Ki,
        Ji = ".data-api",
        Zi = t.fn[Yi],
        er = "hide" + Gi,
        tr = "hidden" + Gi,
        nr = "show" + Gi,
        ir = "shown" + Gi,
        rr = "click" + Gi + Ji,
        or = "dropdown-menu",
        sr = "active",
        ar = "disabled",
        lr = "fade",
        ur = "show",
        cr = ".dropdown",
        fr = ".nav, .list-group",
        dr = ".active",
        hr = "> li > .active",
        pr = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
        gr = ".dropdown-toggle",
        mr = "> .dropdown-menu .active",
        vr = function() {
            function e(e) {
                this._element = e
            }
            var n = e.prototype;
            return n.show = function() {
                var e = this;
                if (!(this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && t(this._element).hasClass(sr) || t(this._element).hasClass(ar))) {
                    var n, i, r = t(this._element).closest(fr)[0],
                        o = m.getSelectorFromElement(this._element);
                    if (r) {
                        var s = "UL" === r.nodeName || "OL" === r.nodeName ? hr : dr;
                        i = (i = t.makeArray(t(r).find(s)))[i.length - 1]
                    }
                    var a = t.Event(er, {
                            relatedTarget: this._element
                        }),
                        l = t.Event(nr, {
                            relatedTarget: i
                        });
                    if (i && t(i).trigger(a), t(this._element).trigger(l), !l.isDefaultPrevented() && !a.isDefaultPrevented()) {
                        o && (n = document.querySelector(o)), this._activate(this._element, r);
                        var u = function() {
                            var n = t.Event(tr, {
                                    relatedTarget: e._element
                                }),
                                r = t.Event(ir, {
                                    relatedTarget: i
                                });
                            t(i).trigger(n), t(e._element).trigger(r)
                        };
                        n ? this._activate(n, n.parentNode, u) : u()
                    }
                }
            }, n.dispose = function() {
                t.removeData(this._element, Ki), this._element = null
            }, n._activate = function(e, n, i) {
                var r = this,
                    o = (!n || "UL" !== n.nodeName && "OL" !== n.nodeName ? t(n).children(dr) : t(n).find(hr))[0],
                    s = i && o && t(o).hasClass(lr),
                    a = function() {
                        return r._transitionComplete(e, o, i)
                    };
                if (o && s) {
                    var l = m.getTransitionDurationFromElement(o);
                    t(o).removeClass(ur).one(m.TRANSITION_END, a).emulateTransitionEnd(l)
                } else a()
            }, n._transitionComplete = function(e, n, i) {
                if (n) {
                    t(n).removeClass(sr);
                    var r = t(n.parentNode).find(mr)[0];
                    r && t(r).removeClass(sr), "tab" === n.getAttribute("role") && n.setAttribute("aria-selected", !1)
                }
                if (t(e).addClass(sr), "tab" === e.getAttribute("role") && e.setAttribute("aria-selected", !0), m.reflow(e), e.classList.contains(lr) && e.classList.add(ur), e.parentNode && t(e.parentNode).hasClass(or)) {
                    var o = t(e).closest(cr)[0];
                    if (o) {
                        var s = [].slice.call(o.querySelectorAll(gr));
                        t(s).addClass(sr)
                    }
                    e.setAttribute("aria-expanded", !0)
                }
                i && i()
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this),
                        r = i.data(Ki);
                    if (r || (r = new e(this), i.data(Ki, r)), "string" == typeof n) {
                        if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
                        r[n]()
                    }
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return Xi
                }
            }]), e
        }();
    t(document).on(rr, pr, function(e) {
        e.preventDefault(), vr._jQueryInterface.call(t(this), "show")
    }), t.fn[Yi] = vr._jQueryInterface, t.fn[Yi].Constructor = vr, t.fn[Yi].noConflict = function() {
        return t.fn[Yi] = Zi, vr._jQueryInterface
    };
    var yr = "toast",
        br = "4.5.2",
        _r = "bs.toast",
        wr = "." + _r,
        xr = t.fn[yr],
        Tr = "click.dismiss" + wr,
        Er = "hide" + wr,
        Cr = "hidden" + wr,
        Sr = "show" + wr,
        Nr = "shown" + wr,
        kr = "fade",
        Dr = "hide",
        Ar = "show",
        Pr = "showing",
        Rr = {
            animation: "boolean",
            autohide: "boolean",
            delay: "number"
        },
        Or = {
            animation: !0,
            autohide: !0,
            delay: 500
        },
        Lr = '[data-dismiss="toast"]',
        Ir = function() {
            function e(e, t) {
                this._element = e, this._config = this._getConfig(t), this._timeout = null, this._setListeners()
            }
            var n = e.prototype;
            return n.show = function() {
                var e = this,
                    n = t.Event(Sr);
                if (t(this._element).trigger(n), !n.isDefaultPrevented()) {
                    this._clearTimeout(), this._config.animation && this._element.classList.add(kr);
                    var i = function() {
                        e._element.classList.remove(Pr), e._element.classList.add(Ar), t(e._element).trigger(Nr), e._config.autohide && (e._timeout = setTimeout(function() {
                            e.hide()
                        }, e._config.delay))
                    };
                    if (this._element.classList.remove(Dr), m.reflow(this._element), this._element.classList.add(Pr), this._config.animation) {
                        var r = m.getTransitionDurationFromElement(this._element);
                        t(this._element).one(m.TRANSITION_END, i).emulateTransitionEnd(r)
                    } else i()
                }
            }, n.hide = function() {
                if (this._element.classList.contains(Ar)) {
                    var e = t.Event(Er);
                    t(this._element).trigger(e), e.isDefaultPrevented() || this._close()
                }
            }, n.dispose = function() {
                this._clearTimeout(), this._element.classList.contains(Ar) && this._element.classList.remove(Ar), t(this._element).off(Tr), t.removeData(this._element, _r), this._element = null, this._config = null
            }, n._getConfig = function(e) {
                return e = o({}, Or, t(this._element).data(), "object" == typeof e && e ? e : {}), m.typeCheckConfig(yr, e, this.constructor.DefaultType), e
            }, n._setListeners = function() {
                var e = this;
                t(this._element).on(Tr, Lr, function() {
                    return e.hide()
                })
            }, n._close = function() {
                var e = this,
                    n = function() {
                        e._element.classList.add(Dr), t(e._element).trigger(Cr)
                    };
                if (this._element.classList.remove(Ar), this._config.animation) {
                    var i = m.getTransitionDurationFromElement(this._element);
                    t(this._element).one(m.TRANSITION_END, n).emulateTransitionEnd(i)
                } else n()
            }, n._clearTimeout = function() {
                clearTimeout(this._timeout), this._timeout = null
            }, e._jQueryInterface = function(n) {
                return this.each(function() {
                    var i = t(this),
                        r = i.data(_r);
                    if (r || (r = new e(this, "object" == typeof n && n), i.data(_r, r)), "string" == typeof n) {
                        if ("undefined" == typeof r[n]) throw new TypeError('No method named "' + n + '"');
                        r[n](this)
                    }
                })
            }, r(e, null, [{
                key: "VERSION",
                get: function() {
                    return br
                }
            }, {
                key: "DefaultType",
                get: function() {
                    return Rr
                }
            }, {
                key: "Default",
                get: function() {
                    return Or
                }
            }]), e
        }();
    t.fn[yr] = Ir._jQueryInterface, t.fn[yr].Constructor = Ir, t.fn[yr].noConflict = function() {
        return t.fn[yr] = xr, Ir._jQueryInterface
    }, e.Alert = A, e.Button = K, e.Carousel = We, e.Collapse = ft, e.Dropdown = Zt, e.Modal = In, e.Popover = Ti, e.Scrollspy = Vi, e.Tab = vr, e.Toast = Ir, e.Tooltip = li, e.Util = m, Object.defineProperty(e, "__esModule", {
        value: !0
    })
});
var DecorationsT, JobT, SourceSpansT, releasesToShow = 99999,
    fetchFlutterReleases = function(e, t, n) {
        var i = "https://storage.googleapis.com/flutter_infra_release/releases/releases_" + e + ".json";
        $.ajax({
            type: "GET",
            url: i,
            dataType: "json",
            success: function(n) {
                t(n, e)
            },
            error: function() {
                n && n(e)
            }
        })
    };
$(function() {
    $("#sdk-archives").length && (fetchFlutterReleases("windows", updateTable, updateTableFailed), fetchFlutterReleases("macos", updateTable, updateTableFailed), fetchFlutterReleases("linux", updateTable, updateTableFailed)), $(".download-latest-link-windows").length && fetchFlutterReleases("windows", updateDownloadLink, updateDownloadLinkFailed), $(".download-latest-link-macos").length && fetchFlutterReleases("macos", updateDownloadLink, updateDownloadLinkFailed), $(".download-latest-link-linux").length && fetchFlutterReleases("linux", updateDownloadLink, updateDownloadLinkFailed)
});
var PR, prettyPrintOne, prettyPrint, IN_GLOBAL_SCOPE = !0,
    PR_SHOULD_USE_CONTINUATION = !0;
"undefined" != typeof window && (window.PR_SHOULD_USE_CONTINUATION = PR_SHOULD_USE_CONTINUATION),
    function() {
        function e(e) {
            function t(e) {
                var t = e.charCodeAt(0);
                if (92 !== t) return t;
                var n = e.charAt(1);
                return (t = c[n]) || ("0" <= n && n <= "7" ? parseInt(e.substring(1), 8) : "u" === n || "x" === n ? parseInt(e.substring(2), 16) : e.charCodeAt(1))
            }

            function n(e) {
                if (e < 32) return (e < 16 ? "\\x0" : "\\x") + e.toString(16);
                var t = String.fromCharCode(e);
                return "\\" === t || "-" === t || "]" === t || "^" === t ? "\\" + t : t
            }

            function i(e) {
                var i = e.substring(1, e.length - 1).match(new RegExp("\\\\u[0-9A-Fa-f]{4}|\\\\x[0-9A-Fa-f]{2}|\\\\[0-3][0-7]{0,2}|\\\\[0-7]{1,2}|\\\\[\\s\\S]|-|[^-\\\\]", "g")),
                    r = [],
                    o = "^" === i[0],
                    s = ["["];
                o && s.push("^");
                for (var a = o ? 1 : 0, l = i.length; a < l; ++a) {
                    var u = i[a];
                    if (/\\[bdsw]/i.test(u)) s.push(u);
                    else {
                        var c, f = t(u);
                        a + 2 < l && "-" === i[a + 1] ? (c = t(i[a + 2]), a += 2) : c = f, r.push([f, c]), c < 65 || f > 122 || (c < 65 || f > 90 || r.push([32 | Math.max(65, f), 32 | Math.min(c, 90)]), c < 97 || f > 122 || r.push([-33 & Math.max(97, f), -33 & Math.min(c, 122)]))
                    }
                }
                r.sort(function(e, t) {
                    return e[0] - t[0] || t[1] - e[1]
                });
                var d = [],
                    h = [];
                for (a = 0; a < r.length; ++a) {
                    (p = r[a])[0] <= h[1] + 1 ? h[1] = Math.max(h[1], p[1]) : d.push(h = p)
                }
                for (a = 0; a < d.length; ++a) {
                    var p = d[a];
                    s.push(n(p[0])), p[1] > p[0] && (p[1] + 1 > p[0] && s.push("-"), s.push(n(p[1])))
                }
                return s.push("]"), s.join("")
            }

            function r(e) {
                for (var t = e.source.match(new RegExp("(?:\\[(?:[^\\x5C\\x5D]|\\\\[\\s\\S])*\\]|\\\\u[A-Fa-f0-9]{4}|\\\\x[A-Fa-f0-9]{2}|\\\\[0-9]+|\\\\[^ux0-9]|\\(\\?[:!=]|[\\(\\)\\^]|[^\\x5B\\x5C\\(\\)\\^]+)", "g")), r = t.length, a = [], l = 0, u = 0; l < r; ++l) {
                    if ("(" === (f = t[l])) ++u;
                    else if ("\\" === f.charAt(0)) {
                        (c = +f.substring(1)) && (c <= u ? a[c] = -1 : t[l] = n(c))
                    }
                }
                for (l = 1; l < a.length; ++l) - 1 === a[l] && (a[l] = ++o);
                for (l = 0, u = 0; l < r; ++l) {
                    if ("(" === (f = t[l])) a[++u] || (t[l] = "(?:");
                    else if ("\\" === f.charAt(0)) {
                        var c;
                        (c = +f.substring(1)) && c <= u && (t[l] = "\\" + a[c])
                    }
                }
                for (l = 0; l < r; ++l) "^" === t[l] && "^" !== t[l + 1] && (t[l] = "");
                if (e.ignoreCase && s)
                    for (l = 0; l < r; ++l) {
                        var f, d = (f = t[l]).charAt(0);
                        f.length >= 2 && "[" === d ? t[l] = i(f) : "\\" !== d && (t[l] = f.replace(/[a-zA-Z]/g, function(e) {
                            var t = e.charCodeAt(0);
                            return "[" + String.fromCharCode(-33 & t, 32 | t) + "]"
                        }))
                    }
                return t.join("")
            }
            for (var o = 0, s = !1, a = !1, l = 0, u = e.length; l < u; ++l) {
                if ((d = e[l]).ignoreCase) a = !0;
                else if (/[a-z]/i.test(d.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi, ""))) {
                    s = !0, a = !1;
                    break
                }
            }
            var c = {
                    b: 8,
                    t: 9,
                    n: 10,
                    v: 11,
                    f: 12,
                    r: 13
                },
                f = [];
            for (l = 0, u = e.length; l < u; ++l) {
                var d;
                if ((d = e[l]).global || d.multiline) throw new Error("" + d);
                f.push("(?:" + r(d) + ")")
            }
            return new RegExp(f.join("|"), a ? "gi" : "g")
        }

        function t(e, t) {
            function n(e) {
                var l = e.nodeType;
                if (1 == l) {
                    if (i.test(e.className)) return;
                    for (var u = e.firstChild; u; u = u.nextSibling) n(u);
                    var c = e.nodeName.toLowerCase();
                    "br" !== c && "li" !== c || (r[a] = "\n", s[a << 1] = o++, s[a++ << 1 | 1] = e)
                } else if (3 == l || 4 == l) {
                    var f = e.nodeValue;
                    f.length && (f = t ? f.replace(/\r\n?/g, "\n") : f.replace(/[ \t\r\n]+/g, " "), r[a] = f, s[a << 1] = o, o += f.length, s[a++ << 1 | 1] = e)
                }
            }
            var i = /(?:^|\s)nocode(?:\s|$)/,
                r = [],
                o = 0,
                s = [],
                a = 0;
            return n(e), {
                sourceCode: r.join("").replace(/\n$/, ""),
                spans: s
            }
        }

        function n(e, t, n, i, r) {
            if (n) {
                var o = {
                    sourceNode: e,
                    pre: 1,
                    langExtension: null,
                    numberLines: null,
                    sourceCode: n,
                    spans: null,
                    basePos: t,
                    decorations: null
                };
                i(o), r.push.apply(r, o.decorations)
            }
        }

        function i(e) {
            for (var t = undefined, n = e.firstChild; n; n = n.nextSibling) {
                var i = n.nodeType;
                t = 1 === i ? t ? e : n : 3 === i && F.test(n.nodeValue) ? e : t
            }
            return t === e ? undefined : t
        }

        function r(t, i) {
            var r, o = {};
            ! function() {
                for (var n = t.concat(i), s = [], a = {}, l = 0, u = n.length; l < u; ++l) {
                    var c = n[l],
                        f = c[3];
                    if (f)
                        for (var d = f.length; --d >= 0;) o[f.charAt(d)] = c;
                    var h = c[1],
                        p = "" + h;
                    a.hasOwnProperty(p) || (s.push(h), a[p] = null)
                }
                s.push(/[\0-\uffff]/), r = e(s)
            }();
            var s = i.length,
                a = function(e) {
                    for (var t = e.sourceCode, l = e.basePos, c = e.sourceNode, f = [l, R], d = 0, h = t.match(r) || [], p = {}, g = 0, m = h.length; g < m; ++g) {
                        var v, y = h[g],
                            b = p[y],
                            _ = void 0;
                        if ("string" == typeof b) v = !1;
                        else {
                            var w = o[y.charAt(0)];
                            if (w) _ = y.match(w[1]), b = w[0];
                            else {
                                for (var x = 0; x < s; ++x)
                                    if (w = i[x], _ = y.match(w[1])) {
                                        b = w[0];
                                        break
                                    }
                                _ || (b = R)
                            }!(v = b.length >= 5 && "lang-" === b.substring(0, 5)) || _ && "string" == typeof _[1] || (v = !1, b = I), v || (p[y] = b)
                        }
                        var T = d;
                        if (d += y.length, v) {
                            var E = _[1],
                                C = y.indexOf(E),
                                S = C + E.length;
                            _[2] && (C = (S = y.length - _[2].length) - E.length);
                            var N = b.substring(5);
                            n(c, l + T, y.substring(0, C), a, f), n(c, l + T + C, E, u(N, E), f), n(c, l + T + S, y.substring(S), a, f)
                        } else f.push(l + T, b)
                    }
                    e.decorations = f
                };
            return a
        }

        function o(e) {
            var t = [],
                n = [];
            e.tripleQuotedStrings ? t.push([S, /^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/, null, "'\""]) : e.multiLineStrings ? t.push([S, /^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/, null, "'\"`"]) : t.push([S, /^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/, null, "\"'"]), e.verbatimStrings && n.push([S, /^@\"(?:[^\"]|\"\")*(?:\"|$)/, null]);
            var i = e.hashComments;
            i && (e.cStyleComments ? (i > 1 ? t.push([k, /^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/, null, "#"]) : t.push([k, /^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/, null, "#"]), n.push([S, /^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/, null])) : t.push([k, /^#[^\r\n]*/, null, "#"])), e.cStyleComments && (n.push([k, /^\/\/[^\r\n]*/, null]), n.push([k, /^\/\*[\s\S]*?(?:\*\/|$)/, null]));
            var o = e.regexLiterals;
            if (o) {
                var s = o > 1 ? "" : "\n\r",
                    a = s ? "." : "[\\S\\s]",
                    l = "/(?=[^/*" + s + "])(?:[^/\\x5B\\x5C" + s + "]|\\x5C" + a + "|\\x5B(?:[^\\x5C\\x5D" + s + "]|\\x5C" + a + ")*(?:\\x5D|$))+/";
                n.push(["lang-regex", RegExp("^" + $ + "(" + l + ")")])
            }
            var u = e.types;
            u && n.push([D, u]);
            var c = ("" + e.keywords).replace(/^ | $/g, "");
            c.length && n.push([N, new RegExp("^(?:" + c.replace(/[\s,]+/g, "|") + ")\\b"), null]), t.push([R, /^\s+/, null, " \r\n\t\xa0"]);
            var f = "^.[^\\s\\w.$@'\"`/\\\\]*";
            return e.regexLiterals && (f += "(?!s*/)"), n.push([A, /^@[a-z_$][a-z_$@0-9]*/i, null], [D, /^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/, null], [R, /^[a-z_$][a-z_$@0-9]*/i, null], [A, new RegExp("^(?:0x[a-f0-9]+|(?:\\d(?:_\\d+)*\\d*(?:\\.\\d*)?|\\.\\d\\+)(?:e[+\\-]?\\d+)?)[a-z]*", "i"), null, "0123456789"], [R, /^\\[\s\S]?/, null], [P, new RegExp(f), null]), r(t, n)
        }

        function s(e, t, n) {
            function i(e) {
                var t = e.nodeType;
                if (1 != t || o.test(e.className)) {
                    if ((3 == t || 4 == t) && n) {
                        var l = e.nodeValue,
                            u = l.match(s);
                        if (u) {
                            var c = l.substring(0, u.index);
                            e.nodeValue = c;
                            var f = l.substring(u.index + u[0].length);
                            if (f) e.parentNode.insertBefore(a.createTextNode(f), e.nextSibling);
                            r(e), c || e.parentNode.removeChild(e)
                        }
                    }
                } else if ("br" === e.nodeName.toLowerCase()) r(e), e.parentNode && e.parentNode.removeChild(e);
                else
                    for (var d = e.firstChild; d; d = d.nextSibling) i(d)
            }

            function r(e) {
                function t(e, n) {
                    var i = n ? e.cloneNode(!1) : e,
                        r = e.parentNode;
                    if (r) {
                        var o = t(r, 1),
                            s = e.nextSibling;
                        o.appendChild(i);
                        for (var a = s; a; a = s) s = a.nextSibling, o.appendChild(a)
                    }
                    return i
                }
                for (; !e.nextSibling;)
                    if (!(e = e.parentNode)) return;
                for (var n, i = t(e.nextSibling, 0);
                    (n = i.parentNode) && 1 === n.nodeType;) i = n;
                u.push(i)
            }
            for (var o = /(?:^|\s)nocode(?:\s|$)/, s = /\r\n?|\n/, a = e.ownerDocument, l = a.createElement("li"); e.firstChild;) l.appendChild(e.firstChild);
            for (var u = [l], c = 0; c < u.length; ++c) i(u[c]);
            t === (0 | t) && u[0].setAttribute("value", t);
            var f = a.createElement("ol");
            f.className = "linenums";
            for (var d = Math.max(0, t - 1 | 0) || 0, h = (c = 0, u.length); c < h; ++c)(l = u[c]).className = "L" + (c + d) % 10, l.firstChild || l.appendChild(a.createTextNode("\xa0")), f.appendChild(l);
            e.appendChild(f)
        }

        function a(e) {
            var t = /\bMSIE\s(\d+)/.exec(navigator.userAgent);
            t = t && +t[1] <= 8;
            var n, i, r = /\n/g,
                o = e.sourceCode,
                s = o.length,
                a = 0,
                l = e.spans,
                u = l.length,
                c = 0,
                f = e.decorations,
                d = f.length,
                h = 0;
            for (f[d] = s, i = n = 0; i < d;) f[i] !== f[i + 2] ? (f[n++] = f[i++], f[n++] = f[i++]) : i += 2;
            for (d = n, i = n = 0; i < d;) {
                for (var p = f[i], g = f[i + 1], m = i + 2; m + 2 <= d && f[m + 1] === g;) m += 2;
                f[n++] = p, f[n++] = g, i = m
            }
            d = f.length = n;
            var v = e.sourceNode,
                y = "";
            v && (y = v.style.display, v.style.display = "none");
            try {
                for (; c < u;) {
                    l[c];
                    var b, _ = l[c + 2] || s,
                        w = f[h + 2] || s,
                        x = (m = Math.min(_, w), l[c + 1]);
                    if (1 !== x.nodeType && (b = o.substring(a, m))) {
                        t && (b = b.replace(r, "\r")), x.nodeValue = b;
                        var T = x.ownerDocument,
                            E = T.createElement("span");
                        E.className = f[h + 1];
                        var C = x.parentNode;
                        C.replaceChild(E, x), E.appendChild(x), a < _ && (l[c + 1] = x = T.createTextNode(o.substring(m, _)), C.insertBefore(x, E.nextSibling))
                    }(a = m) >= _ && (c += 2), a >= w && (h += 2)
                }
            } finally {
                v && (v.style.display = y)
            }
        }

        function l(e, t) {
            for (var n = t.length; --n >= 0;) {
                var i = t[n];
                B.hasOwnProperty(i) ? h.console && console.warn("cannot override language handler %s", i) : B[i] = e
            }
        }

        function u(e, t) {
            return e && B.hasOwnProperty(e) || (e = /^\s*</.test(t) ? "default-markup" : "default-code"), B[e]
        }

        function c(e) {
            var n = e.langExtension;
            try {
                var i = t(e.sourceNode, e.pre),
                    r = i.sourceCode;
                e.sourceCode = r, e.spans = i.spans, e.basePos = 0, u(n, r)(e), a(e)
            } catch (o) {
                h.console && console.log(o && o.stack || o)
            }
        }

        function f(e, t, n) {
            var i = n || !1,
                r = t || null,
                o = document.createElement("div");
            return o.innerHTML = "<pre>" + e + "</pre>", o = o.firstChild, i && s(o, i, !0), c({
                langExtension: r,
                numberLines: i,
                sourceNode: o,
                pre: 1,
                sourceCode: null,
                basePos: null,
                spans: null,
                decorations: null
            }), o.innerHTML
        }

        function d(e, t) {
            function n(e) {
                return o.getElementsByTagName(e)
            }

            function r() {
                for (var t = h.PR_SHOULD_USE_CONTINUATION ? g.now() + 250 : Infinity; m < u.length && g.now() < t; m++) {
                    for (var n = u[m], o = T, l = n; l = l.previousSibling;) {
                        var f = l.nodeType,
                            d = (7 === f || 8 === f) && l.nodeValue;
                        if (d ? !/^\??prettify\b/.test(d) : 3 !== f || /\S/.test(l.nodeValue)) break;
                        if (d) {
                            o = {}, d.replace(/\b(\w+)=([\w:.%+-]+)/g, function(e, t, n) {
                                o[t] = n
                            });
                            break
                        }
                    }
                    var p = n.className;
                    if ((o !== T || y.test(p)) && !b.test(p)) {
                        for (var E = !1, C = n.parentNode; C; C = C.parentNode) {
                            var S = C.tagName;
                            if (x.test(S) && C.className && y.test(C.className)) {
                                E = !0;
                                break
                            }
                        }
                        if (!E) {
                            n.className += " prettyprinted";
                            var N, k, D = o.lang;
                            if (!D) !(D = p.match(v)) && (N = i(n)) && w.test(N.tagName) && (D = N.className.match(v)), D && (D = D[1]);
                            if (_.test(n.tagName)) k = 1;
                            else {
                                var A = n.currentStyle,
                                    P = a.defaultView,
                                    R = A ? A.whiteSpace : P && P.getComputedStyle ? P.getComputedStyle(n, null).getPropertyValue("white-space") : 0;
                                k = R && "pre" === R.substring(0, 3)
                            }
                            var O = o.linenums;
                            (O = "true" === O || +O) || (O = !!(O = p.match(/\blinenums\b(?::(\d+))?/)) && (!O[1] || !O[1].length || +O[1])), O && s(n, O, k), c({
                                langExtension: D,
                                sourceNode: n,
                                numberLines: O,
                                pre: k,
                                sourceCode: null,
                                basePos: null,
                                spans: null,
                                decorations: null
                            })
                        }
                    }
                }
                m < u.length ? h.setTimeout(r, 250) : "function" == typeof e && e()
            }
            for (var o = t || document.body, a = o.ownerDocument || document, l = [n("pre"), n("code"), n("xmp")], u = [], f = 0; f < l.length; ++f)
                for (var d = 0, p = l[f].length; d < p; ++d) u.push(l[f][d]);
            l = null;
            var g = Date;
            g.now || (g = {
                now: function() {
                    return +new Date
                }
            });
            var m = 0,
                v = /\blang(?:uage)?-([\w.]+)(?!\S)/,
                y = /\bprettyprint\b/,
                b = /\bprettyprinted\b/,
                _ = /pre|xmp/i,
                w = /^code$/i,
                x = /^(?:pre|code|xmp)$/i,
                T = {};
            r()
        }
        var h = "undefined" != typeof window ? window : {},
            p = ["break,continue,do,else,for,if,return,while"],
            g = [
                [p, "auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"], "catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"
            ],
            m = [g, "alignas,alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],
            v = [g, "abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],
            y = [g, "abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface,internal,into,is,join,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,value,var,virtual,where,yield"],
            b = "all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",
            _ = [g, "abstract,async,await,constructor,debugger,enum,eval,export,from,function,get,import,implements,instanceof,interface,let,null,of,set,undefined,var,with,yield,Infinity,NaN"],
            w = "caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",
            x = [p, "and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],
            T = [p, "alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],
            E = [p, "case,done,elif,esac,eval,fi,function,in,local,set,then,until"],
            C = /^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,
            S = "str",
            N = "kwd",
            k = "com",
            D = "typ",
            A = "lit",
            P = "pun",
            R = "pln",
            O = "tag",
            L = "dec",
            I = "src",
            j = "atn",
            q = "atv",
            H = "nocode",
            $ = "(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*",
            F = /\S/,
            M = o({
                keywords: [m, y, v, _, w, x, T, E],
                hashComments: !0,
                cStyleComments: !0,
                multiLineStrings: !0,
                regexLiterals: !0
            }),
            B = {};
        l(M, ["default-code"]), l(r([], [
            [R, /^[^<?]+/],
            [L, /^<!\w[^>]*(?:>|$)/],
            [k, /^<\!--[\s\S]*?(?:-\->|$)/],
            ["lang-", /^<\?([\s\S]+?)(?:\?>|$)/],
            ["lang-", /^<%([\s\S]+?)(?:%>|$)/],
            [P, /^(?:<[%?]|[%?]>)/],
            ["lang-", /^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],
            ["lang-js", /^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],
            ["lang-css", /^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],
            ["lang-in.tag", /^(<\/?[a-z][^<>]*>)/i]
        ]), ["default-markup", "htm", "html", "mxml", "xhtml", "xml", "xsl"]), l(r([
            [R, /^[\s]+/, null, " \t\r\n"],
            [q, /^(?:\"[^\"]*\"?|\'[^\']*\'?)/, null, "\"'"]
        ], [
            [O, /^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],
            [j, /^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],
            ["lang-uq.val", /^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],
            [P, /^[=<>\/]+/],
            ["lang-js", /^on\w+\s*=\s*\"([^\"]+)\"/i],
            ["lang-js", /^on\w+\s*=\s*\'([^\']+)\'/i],
            ["lang-js", /^on\w+\s*=\s*([^\"\'>\s]+)/i],
            ["lang-css", /^style\s*=\s*\"([^\"]+)\"/i],
            ["lang-css", /^style\s*=\s*\'([^\']+)\'/i],
            ["lang-css", /^style\s*=\s*([^\"\'>\s]+)/i]
        ]), ["in.tag"]), l(r([], [
            [q, /^[\s\S]+/]
        ]), ["uq.val"]), l(o({
            keywords: m,
            hashComments: !0,
            cStyleComments: !0,
            types: C
        }), ["c", "cc", "cpp", "cxx", "cyc", "m"]), l(o({
            keywords: "null,true,false"
        }), ["json"]), l(o({
            keywords: y,
            hashComments: !0,
            cStyleComments: !0,
            verbatimStrings: !0,
            types: C
        }), ["cs"]), l(o({
            keywords: v,
            cStyleComments: !0
        }), ["java"]), l(o({
            keywords: E,
            hashComments: !0,
            multiLineStrings: !0
        }), ["bash", "bsh", "csh", "sh"]), l(o({
            keywords: x,
            hashComments: !0,
            multiLineStrings: !0,
            tripleQuotedStrings: !0
        }), ["cv", "py", "python"]), l(o({
            keywords: w,
            hashComments: !0,
            multiLineStrings: !0,
            regexLiterals: 2
        }), ["perl", "pl", "pm"]), l(o({
            keywords: T,
            hashComments: !0,
            multiLineStrings: !0,
            regexLiterals: !0
        }), ["rb", "ruby"]), l(o({
            keywords: _,
            cStyleComments: !0,
            regexLiterals: !0
        }), ["javascript", "js", "ts", "typescript"]), l(o({
            keywords: b,
            hashComments: 3,
            cStyleComments: !0,
            multilineStrings: !0,
            tripleQuotedStrings: !0,
            regexLiterals: !0
        }), ["coffee"]), l(r([], [
            [S, /^[\s\S]+/]
        ]), ["regex"]);
        var W = h.PR = {
                createSimpleLexer: r,
                registerLangHandler: l,
                sourceDecorator: o,
                PR_ATTRIB_NAME: j,
                PR_ATTRIB_VALUE: q,
                PR_COMMENT: k,
                PR_DECLARATION: L,
                PR_KEYWORD: N,
                PR_LITERAL: A,
                PR_NOCODE: H,
                PR_PLAIN: R,
                PR_PUNCTUATION: P,
                PR_SOURCE: I,
                PR_STRING: S,
                PR_TAG: O,
                PR_TYPE: D,
                prettyPrintOne: IN_GLOBAL_SCOPE ? h.prettyPrintOne = f : prettyPrintOne = f,
                prettyPrint: IN_GLOBAL_SCOPE ? h.prettyPrint = d : prettyPrint = d
            },
            U = h.define;
        "function" == typeof U && U.amd && U("google-code-prettify", [], function() {
            return W
        })
    }(), PR.registerLangHandler(PR.createSimpleLexer([
        [PR.PR_PLAIN, /^[ \t\r\n\f]+/, null, " \t\r\n\f"]
    ], [
        [PR.PR_STRING, /^\"(?:[^\n\r\f\\\"]|\\(?:\r\n?|\n|\f)|\\[\s\S])*\"/, null],
        [PR.PR_STRING, /^\'(?:[^\n\r\f\\\']|\\(?:\r\n?|\n|\f)|\\[\s\S])*\'/, null],
        ["lang-css-str", /^url\(([^\)\"\']+)\)/i],
        [PR.PR_KEYWORD, /^(?:url|rgb|\!important|@import|@page|@media|@charset|inherit)(?=[^\-\w]|$)/i, null],
        ["lang-css-kw", /^(-?(?:[_a-z]|(?:\\[0-9a-f]+ ?))(?:[_a-z0-9\-]|\\(?:\\[0-9a-f]+ ?))*)\s*:/i],
        [PR.PR_COMMENT, /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],
        [PR.PR_COMMENT, /^(?:<!--|-->)/],
        [PR.PR_LITERAL, /^(?:\d+|\d*\.\d+)(?:%|[a-z]+)?/i],
        [PR.PR_LITERAL, /^#(?:[0-9a-f]{3}){1,2}\b/i],
        [PR.PR_PLAIN, /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i],
        [PR.PR_PUNCTUATION, /^[^\s\w\'\"]+/]
    ]), ["css"]), PR.registerLangHandler(PR.createSimpleLexer([], [
        [PR.PR_KEYWORD, /^-?(?:[_a-z]|(?:\\[\da-f]+ ?))(?:[_a-z\d\-]|\\(?:\\[\da-f]+ ?))*/i]
    ]), ["css-kw"]), PR.registerLangHandler(PR.createSimpleLexer([], [
        [PR.PR_STRING, /^[^\)\"\']+/]
    ]), ["css-str"]), PR.registerLangHandler(PR.createSimpleLexer([
        [PR.PR_PLAIN, /^[\t\n\r \xA0]+/, null, "\t\n\r \xa0"]
    ], [
        [PR.PR_COMMENT, /^#!(?:.*)/],
        [PR.PR_KEYWORD, /^\b(?:deferred|export|import|library|part of|part|as|show|hide)\b/i],
        [PR.PR_COMMENT, /^\/\/(?:.*)/],
        [PR.PR_COMMENT, /^\/\*[^*]*\*+(?:[^\/*][^*]*\*+)*\//],
        [PR.PR_KEYWORD, /^\b(?:class|enum|interface|mixin)\b/i],
        [PR.PR_KEYWORD, /^\b(?:assert|async|await|break|case|catch|continue|default|do|else|finally|for|if|in|is|new|on|rethrow|return|super|switch|sync|this|throw|try|while|yield)\b/i],
        [PR.PR_KEYWORD, /^\b(?:abstract|const|covariant|extends|external|factory|final|get|implements|late|native|operator|required|set|static|typedef|var|with)\b/i],
        [PR.PR_TYPE, /^\b(?:bool|double|dynamic|Function|int|Never|Null|num|Object|String|Symbol|Type|void)\b/i],
        [PR.PR_KEYWORD, /^\b(?:false|null|true)\b/i],
        [PR.PR_STRING, /^r?[\']{3}[\s|\S]*?[^\\][\']{3}/],
        [PR.PR_STRING, /^r?[\"]{3}[\s|\S]*?[^\\][\"]{3}/],
        [PR.PR_STRING, /^r?\'(\'|(?:[^\n\r\f])*?[^\\]\')/],
        [PR.PR_STRING, /^r?\"(\"|(?:[^\n\r\f])*?[^\\]\")/],
        [PR.PR_TYPE, /^[A-Z]\w*/],
        [PR.PR_PLAIN, /^[a-z_$][a-z0-9_]*/i],
        [PR.PR_PUNCTUATION, /^[~!%^&*+=|?:<>/-]/],
        [PR.PR_LITERAL, /^\b0x[0-9a-f]+/i],
        [PR.PR_LITERAL, /^\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i],
        [PR.PR_LITERAL, /^\b\.\d+(?:e[+-]?\d+)?/i],
        [PR.PR_PUNCTUATION, /^[(){}\[\],.;?!]/]
    ]), ["dart"]), PR.registerLangHandler(PR.createSimpleLexer([
        [PR.PR_PUNCTUATION, /^[:|>?]+/, null, ":|>?"],
        [PR.PR_DECLARATION, /^%(?:YAML|TAG)[^#\r\n]+/, null, "%"],
        [PR.PR_TYPE, /^[&]\S+/, null, "&"],
        [PR.PR_TYPE, /^!\S*/, null, "!"],
        [PR.PR_STRING, /^"(?:[^\\"]|\\.)*(?:"|$)/, null, '"'],
        [PR.PR_STRING, /^'(?:[^']|'')*(?:'|$)/, null, "'"],
        [PR.PR_COMMENT, /^#[^\r\n]*/, null, "#"],
        [PR.PR_PLAIN, /^\s+/, null, " \t\r\n"]
    ], [
        [PR.PR_DECLARATION, /^(?:---|\.\.\.)(?:[\r\n]|$)/],
        [PR.PR_PUNCTUATION, /^-/],
        [PR.PR_KEYWORD, /^[\w-]+:[ \r\n]/],
        [PR.PR_PLAIN, /^\w+/]
    ]), ["yaml", "yml"]), $(function() {
        adjustToc(), initFixedColumns(), initVideoModal(), initCarousel(), initSnackbar(), addCopyCodeButtonsEverywhere(), $('[data-toggle="tooltip"]').tooltip(), setupClipboardJS(), setupTabs($("#editor-setup"), "io.flutter.tool-id"), setupTabs($(".sample-code-tabs"), "io.flutter.tool-id"), setupToolsTabs($("#tab-set-install"), "tab-install-", "io.flutter.tool-id"), setupToolsTabs($("#tab-set-os"), "tab-os-", null, getOS()), prettyPrint()
    });
//# sourceMappingURL=/assets/source-maps/main.js.map
//# sourceURL=_assets/js/main.js