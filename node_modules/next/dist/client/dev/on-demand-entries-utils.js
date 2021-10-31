"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.closePing = closePing;
exports.setupPing = setupPing;
exports.currentPage = void 0;
var _eventsource = require("./error-overlay/eventsource");
let evtSource;
let currentPage;
exports.currentPage = currentPage;
function closePing() {
    if (evtSource) evtSource.close();
    evtSource = null;
}
function setupPing(assetPrefix, pathnameFn, retry) {
    const pathname = pathnameFn();
    // Make sure to only create new EventSource request if page has changed
    if (pathname === currentPage && !retry) return;
    exports.currentPage = currentPage = pathname;
    // close current EventSource connection
    closePing();
    evtSource = (0, _eventsource).getEventSourceWrapper({
        path: `${assetPrefix}/_next/webpack-hmr?page=${encodeURIComponent(currentPage)}`,
        timeout: 5000
    });
    evtSource.addMessageListener((event)=>{
        if (event.data.indexOf('{') === -1) return;
        try {
            const payload = JSON.parse(event.data);
            // don't attempt fetching the page if we're already showing
            // the dev overlay as this can cause the error to be triggered
            // repeatedly
            if (payload.invalid && !self.__NEXT_DATA__.err) {
                // Payload can be invalid even if the page does not exist.
                // So, we need to make sure it exists before reloading.
                fetch(location.href, {
                    credentials: 'same-origin'
                }).then((pageRes)=>{
                    if (pageRes.status === 200) {
                        location.reload();
                    }
                });
            }
        } catch (err) {
            console.error('on-demand-entries failed to parse response', err);
        }
    });
}

//# sourceMappingURL=on-demand-entries-utils.js.map