chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "addScript") {
        var s = document.createElement('script');
        s.src = request.url;
        s.onload = function() {
            this.parentNode.removeChild(this);
        };
        (document.head || document.documentElement).appendChild(s);
    }
    sendResponse({});
});
