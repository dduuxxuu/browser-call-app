/**
 * call up app on the browser
 * @author dduuxxuu
 */

export default (function () {
    'use strict'

    const ua = window.navigator.userAgent || navigator.userAgent;
    // UA
    const browser = {
        isAndroid: !!ua.match(/Android/i),
        isMobileQQ: /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(ua) || /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(ua),
        isIOS: !!ua.match(/iPhone|iPad|iPod/i),
        isWx: !!ua.match(/micromessenger/i),
        isWeiBo: !!ua.match(/Weibo/i)
    }

    //Android's chrome need 'intent' to call up native
    const isAndroidChrome = (ua.match(/chrome\/([\d.]+)/) || ua.match(/crios\/([\d.]+)/)) && browser.isAndroid && !browser.isMobileQQ

    return {

        // get the final schema for the current environment
        getFinalSchema: function (appConfig) {
            const { PROTOCAL, HOME, FAILBACK, APK_INFO } = appConfig
            // use 'intent'
            if (isAndroidChrome) {
                return `intent://${HOME}#Intent;scheme=${PROTOCAL};package=${APK_INFO.PKG};category=${APK_INFO.CATEGORY};action=${APK_INFO.ACTION};S.browser_fallback_url=${FAILBACK};`
            }
            // normal ways
            return `${PROTOCAL}://${HOME}`
        },

            // call up app or jump to the FAILBACK
        callUpApp: function (schemaUrl, appConfig) {
            const iframe = document.createElement('iframe')
            const aLink = document.createElement('a')
            const body = document.body
            aLink.style.cssText = iframe.style.cssText = "display:none;width:0px;height:0px;"

            return new Promise(function (resolve, reject) {
                // wechat or weibo can't call up app, jump to the FAILBACK
                if (browser.isWx|| browser.isWeiBo) {
                    window.location.href = appConfig.FAILBACK
                    return
                } else if (browser.isIOS || isAndroidChrome) {
                    aLink.href = schemaUrl
                    body.appendChild(aLink)
                    aLink.click()
                } else {
                    body.appendChild(iframe)
                    iframe.src = schemaUrl
                }

                const loadTimer = setTimeout(function () {
                    if (document.hidden || document.webkitHidden) {
                        resolve()
                    } else {
                        reject()
                    }
                }, appConfig.LOAD_WAITING)

                // when call up , trigger the pagehide or visibilitychange
                const visibilitychange = function () {
                    const tag = document.hidden || document.webkitHidden
                    tag && clearTimeout(loadTimer)
                }
                document.addEventListener('visibilitychange', visibilitychange, false);
                document.addEventListener('webkitvisibilitychange', visibilitychange, false);
                window.addEventListener('pagehide', function() {
                    clearTimeout(loadTimer);
                }, false);

            })
        },

        /* init */
        init: function (config) {
            const appConfig = Object.assign({
                PROTOCAL: '', // Protocol
                HOME: '', // home page
                FAILBACK: '', // fail link
                APK_INFO: { // apk info
                    PKG: '',
                    CATEGORY: 'android.intent.category.DEFAULT',
                    ACTION: 'android.intent.action.VIEW'
                },
                LOAD_WAITING: 2000 // timeout
            }, config)
            const schemaUrl = this.getFinalSchema(appConfig)
            return this.callUpApp(schemaUrl, appConfig)
        }
    }
})()