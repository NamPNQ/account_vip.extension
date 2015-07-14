var SERVER_URL = 'http://localhost:5000',
    SITE_DOMAIN, TAB_ID, TAB_URL,
    cookies = {};
chrome.tabs.getSelected(null, function(tab) {
    TAB_URL = tab.url;
    TAB_ID = tab.id;
    SITE_DOMAIN = new URL(TAB_URL).hostname;
    getCookies();
});
function getCookies(){
    chrome.cookies.getAll({'url': TAB_URL}, function(cks) {
        var currentC;
        for (var i = 0; i < cks.length; i++) {
            currentC = cks[i];
            cookies[currentC.name] = currentC.value;
        }
    });
}
$('#clearads-btn').click(function() {
    if (!SITE_DOMAIN || !TAB_ID) {
        return;
    }
    $.get(SERVER_URL + '/get_script_clear_ads?site=' + SITE_DOMAIN).success(function(data) {
        if (data.ok) {
            chrome.tabs.sendRequest(TAB_ID, {
                action: "addScript",
                url: data.data.url
            }, function() {});
        } else {
            alert(data.error);
        }
    })
});
$('#login-btn').click(function(e) {
    if (!SITE_DOMAIN || !TAB_ID) {
        return;
    }
    $.ajax({
        method: 'POST',
        url: SERVER_URL + '/login?site=' + SITE_DOMAIN,
        data: JSON.stringify({
            'cookies': cookies
        }),
        contentType: 'application/json'
    }).success(function(data) {
        if (data.ok) {
            chrome.tabs.reload(TAB_ID);
        } else {
            alert(data.error)
        }
    }).error(function() {

    });
});
