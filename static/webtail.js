(function() {
    var messageContainer = $("#messagecontainer");
    var onMessage = function(msg) {
        console.log(msg);
    };

    if (!window.DEBUG) {
        var evtSrc = new EventSource("/subscribe");
        evtSrc.onmessage = onMessage;
    } else {
        var baconIpsum = ["adipisicing", "beef", "chuck", "shank", "tongue", "fugiat", "meatball", "sunt", "incididunt", "short", "loin", "sint", "beef", "aliqua", "tri-tip", "nisi", "deserunt", "shoulder", "frankfurter", "turducken", "biltong", "meatball", "adipisicing", "esse", "dolore", "rump", "tongue", "duis", "swine", "salami", "fatback", "chicken", "laborum", "pariatur", "rump", "swine", "salami", "shank", "boudin", "voluptate", "aliqua", "turkey", "drumstick", "magna", "short", "ribs", "sirloin", "frankfurter", "veniam", "sed", "enim", "dolore", "ut", "venison", "nisi", "est", "bacon", "salami", "tongue", "nulla", "beef", "corned", "beef", "consequat", "short", "ribs", "prosciutto", "qui", "officia", "doner", "sed"];
        (function debug() {
            var baconIndex = Math.floor(Math.random() * baconIpsum.length);
            onMessage({ data: baconIpsum[baconIndex]});
            setTimeout(debug, Math.floor(Math.random() * 2000));
        }());
    }

}());
