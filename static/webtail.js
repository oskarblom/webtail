(function() {
    var MAX_MESSAGES = 10000;

    var $messageContainer = $("#messagecontainer");
    var $filter = $("#filter");
    var $form = $("#controlpanelform");
    var $filterToggle = $("#filtertoggle");
    var currentMessages = 0;
    var autoScroll = true;
    var runFilter = false;
    var filter = null;

    var filterMessage = function(msg) {
        if (!filter) {
            return msg;
        }

        var match = msg.match(filter);
        if (!match) {
            return msg;
        }
        var m = match[0];
        var i = match["index"];

        return msg.substr(0, i) + 
               "<span class='hilight'>" + m + "</span>" +
               msg.substr(i + m.length, msg.length - (i + m.length));
    };

    var onMessage = function(msg) {
        if (currentMessages === MAX_MESSAGES) {
            $messageContainer.find(":first").remove();
        } else {
            currentMessages++;
        }

        var output = msg.data
        if (runFilter) {
            output = filterMessage(msg.data)
        } 
        output = "<div class='message'>" + output + "</div>";

        $messageContainer.append(output);

        if (autoScroll) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    };

    var onFilterToggle = function(event) { 
        runFilter = !runFilter;
        if (runFilter) {
            filter = new RegExp($("#filter").val());
        }
    };

    var onSubmit = function(event) {
        event.preventDefault();
        runFilter = true;
        filter = new RegExp($("#filter").val());
        console.log($filterToggle);
        $filterToggle.prop("checked", true);
    };

    var onError = function(error) {
        console.log("Sse error occured", e);
    };

    var onKeyPress = function(event) {
        if (event.keyCode !== 32 && event.keyCode !== 27) {
            return;
        }
        autoScroll = !autoScroll;
    }

    // Main
    
    $filterToggle.on("click", onFilterToggle);
    $form.on("submit", onSubmit);
    window.onkeypress = onKeyPress;

    if (!window.DEBUG) {
        var evtSrc = new EventSource("/subscribe");
        evtSrc.onmessage = onMessage;
        evtSrc.onerror = onError;
    } else {
        //var baconIpsum = ["error when doing stuff with error"];
        var baconIpsum = ["adipisicing", "beef", "chuck", "shank", "tongue", "fugiat", "meatball", "sunt", "incididunt", "short", "loin", "sint", "beef", "aliqua", "tri-tip", "nisi", "deserunt", "shoulder", "frankfurter", "turducken", "biltong", "meatball", "adipisicing", "esse", "dolore", "rump", "tongue", "duis", "swine", "salami", "fatback", "chicken", "laborum", "pariatur", "rump", "swine", "salami", "shank", "boudin", "voluptate", "aliqua", "turkey", "drumstick", "magna", "short", "ribs", "sirloin", "frankfurter", "veniam", "sed", "enim", "dolore", "ut", "venison", "nisi", "est", "bacon", "salami", "tongue", "nulla", "beef", "corned", "beef", "consequat", "short", "ribs", "prosciutto", "qui", "officia", "doner", "sed"];
        (function debug() {
            var baconIndex = Math.floor(Math.random() * baconIpsum.length);
            onMessage({ data: baconIpsum[baconIndex]});
            setTimeout(debug, Math.floor(Math.random() * 2000));
        }());
    }

}());
