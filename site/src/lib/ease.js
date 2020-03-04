!(function (e, t) {
    typeof exports === 'object' && typeof module !== 'undefined' ? t(exports, require('pixi.js')) : typeof define === 'function' && define.amd ? define(['exports', 'pixi.js'], t) : t((e = e || self).Ease = {}, e.PIXI)
}(this, function (e, t) {
    'use strict';
    var s = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function n(e, t) {
        return e(t = {exports: {}}, t.exports), t.exports
    }

    var i = n(function (e, t) {
        (function () {
            var t;
            (function (t) {
                e.exports = t
            })(t = {
                linear: function (e, t, s, n) {
                    return s * e / n + t
                }, easeInQuad: function (e, t, s, n) {
                    return s * (e /= n) * e + t
                }, easeOutQuad: function (e, t, s, n) {
                    return -s * (e /= n) * (e - 2) + t
                }, easeInOutQuad: function (e, t, s, n) {
                    return (e /= n / 2) < 1 ? s / 2 * e * e + t : -s / 2 * (--e * (e - 2) - 1) + t
                }, easeInCubic: function (e, t, s, n) {
                    return s * (e /= n) * e * e + t
                }, easeOutCubic: function (e, t, s, n) {
                    return s * ((e = e / n - 1) * e * e + 1) + t
                }, easeInOutCubic: function (e, t, s, n) {
                    return (e /= n / 2) < 1 ? s / 2 * e * e * e + t : s / 2 * ((e -= 2) * e * e + 2) + t
                }, easeInQuart: function (e, t, s, n) {
                    return s * (e /= n) * e * e * e + t
                }, easeOutQuart: function (e, t, s, n) {
                    return -s * ((e = e / n - 1) * e * e * e - 1) + t
                }, easeInOutQuart: function (e, t, s, n) {
                    return (e /= n / 2) < 1 ? s / 2 * e * e * e * e + t : -s / 2 * ((e -= 2) * e * e * e - 2) + t
                }, easeInQuint: function (e, t, s, n) {
                    return s * (e /= n) * e * e * e * e + t
                }, easeOutQuint: function (e, t, s, n) {
                    return s * ((e = e / n - 1) * e * e * e * e + 1) + t
                }, easeInOutQuint: function (e, t, s, n) {
                    return (e /= n / 2) < 1 ? s / 2 * e * e * e * e * e + t : s / 2 * ((e -= 2) * e * e * e * e + 2) + t
                }, easeInSine: function (e, t, s, n) {
                    return -s * Math.cos(e / n * (Math.PI / 2)) + s + t
                }, easeOutSine: function (e, t, s, n) {
                    return s * Math.sin(e / n * (Math.PI / 2)) + t
                }, easeInOutSine: function (e, t, s, n) {
                    return -s / 2 * (Math.cos(Math.PI * e / n) - 1) + t
                }, easeInExpo: function (e, t, s, n) {
                    return e === 0 ? t : s * Math.pow(2, 10 * (e / n - 1)) + t
                }, easeOutExpo: function (e, t, s, n) {
                    return e === n ? t + s : s * (1 - Math.pow(2, -10 * e / n)) + t
                }, easeInOutExpo: function (e, t, s, n) {
                    return (e /= n / 2) < 1 ? s / 2 * Math.pow(2, 10 * (e - 1)) + t : s / 2 * (2 - Math.pow(2, -10 * --e)) + t
                }, easeInCirc: function (e, t, s, n) {
                    return -s * (Math.sqrt(1 - (e /= n) * e) - 1) + t
                }, easeOutCirc: function (e, t, s, n) {
                    return s * Math.sqrt(1 - (e = e / n - 1) * e) + t
                }, easeInOutCirc: function (e, t, s, n) {
                    return (e /= n / 2) < 1 ? -s / 2 * (Math.sqrt(1 - e * e) - 1) + t : s / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + t
                }, easeInElastic: function (e, t, s, n) {
                    var i, a, r;
                    return r = 1.70158, e === 0 || (e /= n), (a = 0) || (a = 0.3 * n), (i = s) < Math.abs(s) ? (i = s, r = a / 4) : r = a / (2 * Math.PI) * Math.asin(s / i), -i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * n - r) * (2 * Math.PI) / a) + t
                }, easeOutElastic: function (e, t, s, n) {
                    var i, a, r;
                    return r = 1.70158, e === 0 || (e /= n), (a = 0) || (a = 0.3 * n), (i = s) < Math.abs(s) ? (i = s, r = a / 4) : r = a / (2 * Math.PI) * Math.asin(s / i), i * Math.pow(2, -10 * e) * Math.sin((e * n - r) * (2 * Math.PI) / a) + s + t
                }, easeInOutElastic: function (e, t, s, n) {
                    var i, a, r;
                    return r = 1.70158, e === 0 || (e /= n / 2), (a = 0) || (a = n * (0.3 * 1.5)), (i = s) < Math.abs(s) ? (i = s, r = a / 4) : r = a / (2 * Math.PI) * Math.asin(s / i), e < 1 ? i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * n - r) * (2 * Math.PI) / a) * -0.5 + t : i * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * n - r) * (2 * Math.PI) / a) * 0.5 + s + t
                }, easeInBack: function (e, t, s, n, i) {
                    return void 0 === i && (i = 1.70158), s * (e /= n) * e * ((i + 1) * e - i) + t
                }, easeOutBack: function (e, t, s, n, i) {
                    return void 0 === i && (i = 1.70158), s * ((e = e / n - 1) * e * ((i + 1) * e + i) + 1) + t
                }, easeInOutBack: function (e, t, s, n, i) {
                    return void 0 === i && (i = 1.70158), (e /= n / 2) < 1 ? s / 2 * (e * e * ((1 + (i *= 1.525)) * e - i)) + t : s / 2 * ((e -= 2) * e * ((1 + (i *= 1.525)) * e + i) + 2) + t
                }, easeInBounce: function (e, s, n, i) {
                    return n - t.easeOutBounce(i - e, 0, n, i) + s
                }, easeOutBounce: function (e, t, s, n) {
                    return (e /= n) < 1 / 2.75 ? s * (7.5625 * e * e) + t : e < 2 / 2.75 ? s * (7.5625 * (e -= 1.5 / 2.75) * e + 0.75) + t : e < 2.5 / 2.75 ? s * (7.5625 * (e -= 2.25 / 2.75) * e + 0.9375) + t : s * (7.5625 * (e -= 2.625 / 2.75) * e + 0.984375) + t
                }, easeInOutBounce: function (e, s, n, i) {
                    return e < i / 2 ? 0.5 * t.easeInBounce(2 * e, 0, n, i) + s : 0.5 * t.easeOutBounce(2 * e - i, 0, n, i) + 0.5 * n + s
                }
            })
        }).call(s)
    });
    var a = n(function (e) {
        var t = Object.prototype.hasOwnProperty;
        var s = '~';

        function n() {
        }

        function i(e, t, s) {
            this.fn = e, this.context = t, this.once = s || !1
        }

        function a(e, t, n, a, r) {
            if (typeof n !== 'function') throw new TypeError('The listener must be a function');
            var o = new i(n, a || e, r);
            var h = s ? s + t : t;
            return e._events[h] ? e._events[h].fn ? e._events[h] = [e._events[h], o] : e._events[h].push(o) : (e._events[h] = o, e._eventsCount++), e
        }

        function r(e, t) {
            --e._eventsCount == 0 ? e._events = new n() : delete e._events[t]
        }

        function o() {
            this._events = new n(), this._eventsCount = 0
        }

        Object.create && (n.prototype = Object.create(null), (new n()).__proto__ || (s = !1)), o.prototype.eventNames = function () {
            var e;
            var n;
            var i = [];
            if (this._eventsCount === 0) return i;
            for (n in e = this._events) t.call(e, n) && i.push(s ? n.slice(1) : n);
            return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(e)) : i
        }, o.prototype.listeners = function (e) {
            var t = s ? s + e : e;
            var n = this._events[t];
            if (!n) return [];
            if (n.fn) return [n.fn];
            for (var i = 0, a = n.length, r = new Array(a); i < a; i++) r[i] = n[i].fn;
            return r
        }, o.prototype.listenerCount = function (e) {
            var t = s ? s + e : e;
            var n = this._events[t];
            return n ? n.fn ? 1 : n.length : 0
        }, o.prototype.emit = function (e, t, n, i, a, r) {
            var o = s ? s + e : e;
            if (!this._events[o]) return !1;
            var h;
            var u;
            var c = this._events[o];
            var l = arguments.length;
            if (c.fn) {
                switch (c.once && this.removeListener(e, c.fn, void 0, !0), l) {
                    case 1:
                        return c.fn.call(c.context), !0;
                    case 2:
                        return c.fn.call(c.context, t), !0;
                    case 3:
                        return c.fn.call(c.context, t, n), !0;
                    case 4:
                        return c.fn.call(c.context, t, n, i), !0;
                    case 5:
                        return c.fn.call(c.context, t, n, i, a), !0;
                    case 6:
                        return c.fn.call(c.context, t, n, i, a, r), !0
                }
                for (u = 1, h = new Array(l - 1); u < l; u++) h[u - 1] = arguments[u];
                c.fn.apply(c.context, h)
            } else {
                var p;
                var f = c.length;
                for (u = 0; u < f; u++) switch (c[u].once && this.removeListener(e, c[u].fn, void 0, !0), l) {
                    case 1:
                        c[u].fn.call(c[u].context);
                        break;
                    case 2:
                        c[u].fn.call(c[u].context, t);
                        break;
                    case 3:
                        c[u].fn.call(c[u].context, t, n);
                        break;
                    case 4:
                        c[u].fn.call(c[u].context, t, n, i);
                        break;
                    default:
                        if (!h) for (p = 1, h = new Array(l - 1); p < l; p++) h[p - 1] = arguments[p];
                        c[u].fn.apply(c[u].context, h)
                }
            }
            return !0
        }, o.prototype.on = function (e, t, s) {
            return a(this, e, t, s, !1)
        }, o.prototype.once = function (e, t, s) {
            return a(this, e, t, s, !0)
        }, o.prototype.removeListener = function (e, t, n, i) {
            var a = s ? s + e : e;
            if (!this._events[a]) return this;
            if (!t) return r(this, a), this;
            var o = this._events[a];
            if (o.fn) o.fn !== t || i && !o.once || n && o.context !== n || r(this, a); else {
                for (var h = 0, u = [], c = o.length; h < c; h++) (o[h].fn !== t || i && !o[h].once || n && o[h].context !== n) && u.push(o[h]);
                u.length ? this._events[a] = u.length === 1 ? u[0] : u : r(this, a)
            }
            return this
        }, o.prototype.removeAllListeners = function (e) {
            var t;
            return e ? (t = s ? s + e : e, this._events[t] && r(this, t)) : (this._events = new n(), this._eventsCount = 0), this
        }, o.prototype.off = o.prototype.removeListener, o.prototype.addListener = o.prototype.on, o.prefixed = s, o.EventEmitter = o, e.exports = o
    });

    class r extends a {
        constructor(e, t) {
            super(), this.element = e, this.ease = t, this.eases = [], this.connected = !0
        }

        addParam(e, t, s) {
            let n;
            let i;
            let a;
            let r;
            let o = e;
            switch (e) {
                case 'scaleX':
                case 'skewX':
                    o = e.substr(0, e.length - 1), i = t, a = t - (n = this.element[o].x), r = t => this.updateCoord(t, e, o, 'x');
                    break;
                case 'scaleY':
                case 'skewY':
                    o = e.substr(0, e.length - 1), i = t, a = t - (n = this.element[o].y), r = t => this.updateCoord(t, e, o, 'y');
                    break;
                case 'tint':
                case 'blend':
                    const s = Array.isArray(t) ? t : [this.element.tint, t];
                    n = 0, a = i = s.length, r = e === 'tint' ? t => this.updateTint(t, e, s) : t => this.updateBlend(t, e, s);
                    break;
                case 'shake':
                    n = {x: this.element.x, y: this.element.y}, i = t, r = e => this.updateShake(e);
                    break;
                case 'position':
                    n = {x: this.element.x, y: this.element.y}, a = {
                        x: (i = {x: t.x, y: t.y}).x - n.x,
                        y: i.y - n.y
                    }, r = e => this.updatePosition(e);
                    break;
                case 'skew':
                case 'scale':
                    i = t, a = t - (n = this.element[e].x), r = t => this.updatePoint(t, e);
                    break;
                case 'face':
                    n = this.element.rotation, a = (i = Math.atan2(t.y - this.element.y, t.x - this.element.x)) - n, r = e => this.updateOne(e, 'rotation');
                    break;
                default:
                    i = t, a = t - (n = this.element[e]), r = t => this.updateOne(t, e)
            }
            this.eases.push({entry: e, options: s, update: r, start: n, to: i, delta: a, time: 0, wait: s.wait})
        }

        remove(e) {
            e = typeof e === 'string' ? [e] : e;
            for (let t = 0; t < this.eases.length; t++) e.indexOf(this.eases[t].entry) !== -1 && (this.eases.splice(t, 1), t--)
        }

        add(e, t) {
            if (t.removeExisting) {
                const t = ['skewX', 'skewY', 'skew'];
                const s = ['scaleX', 'scaleY', 'scale'];
                const n = ['position', 'x', 'y'];
                for (let i in e) t.indexOf(i) !== -1 ? this.remove(t) : s.indexOf(i) !== -1 ? this.remove(s) : i === 'position' ? this.remove(n) : i === 'x' ? this.remove(['x', 'position']) : i === 'y' ? this.remove(['y', 'position']) : this.remove(i)
            }
            for (let s in e) {
                const n = {ease: t.ease, duration: t.duration, repeat: t.repeat, reverse: t.reverse, wait: t.wait};
                this.addParam(s, e[s], n)
            }
        }

        updateOne(e, t) {
            this.element[t] = e.options.ease(e.time, e.start, e.delta, e.options.duration)
        }

        updatePoint(e, t) {
            this.element[t].x = this.element[t].y = e.options.ease(e.time, e.start, e.delta, e.options.duration)
        }

        updatePosition(e) {
            this.element.x = e.options.ease(e.time, e.start.x, e.delta.x, e.options.duration), this.element.y = e.options.ease(e.time, e.start.y, e.delta.y, e.options.duration)
        }

        updateCoord(e, t, s, n) {
            this.element[s][n] = e.options.ease(e.time, e.start, e.delta, e.options.duration)
        }

        updateTint(e, t, s) {
            const n = Math.floor(e.options.ease(e.time, e.start, e.delta, e.options.duration));
            this.element.tint = s[n]
        }

        updateBlend(e, t, s) {
            const n = e.options.ease(e.time, e.start, e.delta, e.options.duration);
            const i = Math.floor(n);
            let a = i + 1;
            a === s.length && (a = e.options.reverse ? i - 1 : e.options.repeat ? 0 : i);
            const r = n - i;
            const o = s[i];
            const h = s[a];
            const u = 1 - r;
            const c = u * (o >> 16) + r * (h >> 16);
            const l = u * (o >> 8 & 255) + r * (h >> 8 & 255);
            const p = u * (255 & o) + r * (255 & h);
            this.element.tint = c << 16 | l << 8 | p
        }

        updateShake(e) {
            function t(e) {
                return Math.floor(Math.random() * e) - Math.floor(e / 2)
            }

            this.element.x = e.start.x + t(e.to), this.element.y = e.start.y + t(e.to)
        }

        complete(e) {
            e.entry === 'shake' && (this.element.x = e.start.x, this.element.y = e.start.y)
        }

        reverse(e) {
            if (e.entry === 'position') {
                const t = e.to.x;
                const s = e.to.y;
                e.to.x = e.start.x, e.to.y = e.start.y, e.start.x = t, e.start.y = s, e.delta.x = -e.delta.x, e.delta.y = -e.delta.y
            } else {
                const t = e.to;
                e.to = e.start, e.start = t, e.delta = -e.delta
            }
        }

        repeat(e) {
            switch (e.entry) {
                case 'skewX':
                    this.element.skew.x = e.start;
                    break;
                case 'skewY':
                    this.element.skew.y = e.start;
                    break;
                case 'skew':
                    this.element.skew.x = e.start, this.element.skew.y = e.start;
                    break;
                case 'scaleX':
                    this.element.scale.x = e.start;
                    break;
                case 'scaleY':
                    this.element.scale.y = e.start;
                    break;
                case 'scale':
                    this.element.scale.x = e.start, this.element.scale.y = e.start;
                    break;
                case 'position':
                    this.element.x = e.start.x, this.element.y = e.start.y;
                    break;
                default:
                    this.element[e.entry] = e.start
            }
        }

        update(e) {
            if (this.element._destroyed) return delete this.element[this.key], !0;
            const t = this.eases;
            for (let s = 0, n = t.length; s < n; s++) {
                let i = e;
                const a = t[s];
                if (a.wait) {
                    if (a.wait -= e, !(a.wait <= 0)) {
                        this.emit(`wait-${a.entry}`, {element: this.element, wait: a.wait});
                        continue
                    }
                    i += a.wait, a.wait = 0, this.emit(`wait-end-${a.entry}`, a.element)
                }
                const r = a.options.duration;
                let o = 0;
                if (a.time + i > r ? (o = a.time + i - r, a.time = r) : a.time += i, a.update(a), a.time >= a.options.duration) {
                    const e = a.options;
                    e.reverse ? (this.reverse(a), a.time = o, o && a.update(a), this.emit(`reverse-${a.entry}`, a.element), e.repeat ? !0 !== e.repeat && e.repeat-- : e.reverse = !1) : e.repeat ? (this.repeat(a), a.time = o, o && a.update(a), !0 !== e.repeat && e.repeat--, this.emit(`repeat-${a.entry}`, a.element)) : (this.complete(a), this.emit(`complete-${a.entry}`, this.element), t.splice(s, 1), s--, n--)
                }
                this.emit(`each-${a.entry}`, {element: this.element, time: a.time})
            }
            return this.emit('each', this), Object.keys(t).length === 0 ? (this.emit('complete', this), this.connected = !1, !0) : void 0
        }

        get count() {
            return this.eases.length
        }
    }

    const o = {duration: 1e3, ease: i.easeInOutSine, useTicker: !0, maxFrame: 1e3 / 60};

    class h extends a {
        constructor(e) {
            if (super(), this.options = Object.assign({}, o, e), this.list = [], this.waitRemoveEase = [], this.waitRemoveAllEases = [], this.empty = !0, !0 === this.options.useTicker) {
                if (this.options.ticker) this.ticker = this.options.ticker; else {
                    const e = t;
                    parseInt(/^(\d+)\./.exec(t.VERSION)[1]) < 5 ? this.ticker = e.ticker.shared : this.ticker = e.Ticker.shared
                }
                this.ticker.add(this.update, this)
            }
            this.key = `__ease_${h.id++}`
        }

        destroy() {
            this.removeAll(!0), !0 === this.options.useTicker && this.ticker.remove(this.update, this)
        }

        add(e, t, s) {
            if (Array.isArray(e)) {
                const n = [];
                for (let i = 0; i < e.length; i++) e.length, n.push(this.add(e[i], t, s));
                return n
            }
            (s = s || {}).duration = void 0 !== s.duration ? s.duration : this.options.duration, s.ease = s.ease || this.options.ease, typeof s.ease === 'string' && (s.ease = i[s.ease]);
            let n = e[this.key];
            return n ? n.connected || this.list.push(e) : (n = e[this.key] = new r(e, this), this.list.push(n)), n.add(t, s), this.empty = !1, n
        }

        removeAllEases(e) {
            if (this.inUpdate) this.waitRemoveAllEases.push(e); else if (e[this.key]) {
                const t = this.list.indexOf(e[this.key]);
                t !== -1 && this.list.splice(t, 1), delete e[this.key]
            }
        }

        removeEase(e, t) {
            if (this.inUpdate) this.waitRemoveEase.push({object: e, param: t}); else {
                const s = e[this.key];
                s && (Array.isArray(t) ? t.forEach(e => s.remove(e)) : s.remove(t))
            }
        }

        removeAll(e) {
            if (!e && this.inUpdate) this.waitRemoveAll = !0; else for (; this.list.length;) {
                const e = this.list.pop();
                e.element[this.key] && delete e.element[this.key]
            }
        }

        update() {
            if (!this.empty) {
                this.inUpdate = !0;
                const e = Math.max(this.ticker.elapsedMS, this.options.maxFrame);
                for (let t = 0, s = this.list.length; t < s; t++) this.list[t].update(e) && (this.list.splice(t, 1), t--, s--);
                for (this.emit('each', this), this.list.length === 0 && (this.empty = !0, this.emit('complete', this)), this.inUpdate = !1; this.waitRemoveEase.length;) {
                    const e = this.waitRemoveEase.pop();
                    this.removeEase(e.object, e.param)
                }
                for (; this.waitRemoveAllEases.length;) this.removeAllEases(this.waitRemoveAllEases.pop());
                this.waitRemoveAll && (this.removeAll(), this.waitRemoveAll = !1)
            }
        }

        countElements() {
            return this.list.length
        }

        countRunning() {
            let e = 0;
            for (let t of this.list) e += t.count;
            return e
        }

        set duration(e) {
            this.options.duration = e
        }

        get duration() {
            return this.options.duration
        }

        set ease(e) {
            this.options.ease = e
        }

        get ease() {
            return this.options.ease
        }
    }

    h.id = 0;
    let u = new h();
    h.ease = u;
    e.Ease = h, e.List = class {
        constructor() {
            console.warn('Ease.List was deprecated. Use new Ease() instead.')
        }
    }, e.ease = u, Object.defineProperty(e, '__esModule', {value: !0})
}));
// # sourceMappingURL=ease.js.map
