(function() {
    var MAX_MESSAGES = 10000;

    var $messageContainer = $("#messagecontainer");
    var currentMessages = 0;
    var autoScroll = true;

    var onMessage = function(msg) {
        //TODO: Highligt || filter
        if (currentMessages === MAX_MESSAGES) {
            $messageContainer.find(":first").remove();
        } else {
            currentMessages++;
        }
        $messageContainer.append("<div class='message'>" + msg.data + "</div>");

        if (autoScroll) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    };

    /*
    var onScroll = function(event) {
        //console.log(event);
        console.log(window.scrollX);
        console.log(window.scrollY);
        if (autoScroll) {
            autoScroll = false;
        }
    };
    */

    var onKeyPress = function(event) {
        console.log(event);
        if (!event.keyCode === 32) {
            return;
        }
        autoScroll = !autoScroll;
    }

    window.onkeypress = onKeyPress;
    //window.onscroll = onScroll;


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
