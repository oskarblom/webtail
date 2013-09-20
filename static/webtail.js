(function() {
    var MAX_MESSAGES = 10000;

    var $messageContainer = $("#messagecontainer"),
        $filter = $("#filter"),
        $form = $("#controlpanelform"),
        $grepToggle = $("#greptoggle"),
        $hilightToggle = $("#hilighttoggle"),
        currentMessages = 0,
        autoScroll = true,
        filter = null,
        hilight = false,
        grep = false;

    var filterMessage = function(msg) {
        var match = msg.match(filter);
        if (!match) {
            if (grep) {
                return null;
            }
            return msg;
        } 
        if (hilight) {
            var m = match[0];
            var i = match["index"];

            return msg.substr(0, i) + 
                   "<span class='hilight'>" + m + "</span>" +
                   msg.substr(i + m.length, msg.length - (i + m.length));
        }
        return msg;
    };

    var onError = function(error) { console.log("Sse error occured", e); };
    var onMessage = function(msg) {
        var output = msg.data

        if (hilight || grep) {
            output = filterMessage(msg.data)
            if (!output) {
                return;
            }
        } 

        if (currentMessages === MAX_MESSAGES) {
            $messageContainer.find(":first").remove();
        } else {
            currentMessages++;
        }

        output = "<div class='message'>" + output + "</div>";
        $messageContainer.append(output);

        if (autoScroll) {
            window.scrollTo(0, document.body.scrollHeight);
        }
    };

    var onGrepToggle = function() { grep = !grep; };
    var onHilightToggle = function() { hilight = !hilight; };

    var onSubmit = function(event) {
        event.preventDefault();
        filter = new RegExp($("#filter").val());
        if (!hilight && !grep) {
            hilight = true;
            $hilightToggle.prop("checked", true);
        }
    };

    var onKeyPress = function(event) {
        if ($filter.is(":focus")) {
            return;
        }
        if (event.keyCode === 32 || event.keyCode === 27) {
            autoScroll = !autoScroll;
        }
    }

    
    $grepToggle.on("click", onGrepToggle);
    $hilightToggle.on("click", onHilightToggle);
    $form.on("submit", onSubmit);
    window.onkeypress = onKeyPress;

    if (!window.DEBUG) {
        var evtSrc = new EventSource("/subscribe");
        evtSrc.onmessage = onMessage;
        evtSrc.onerror = onError;
    } else {
        var baconIpsum = ["adipisicing", "beef"];
        //var baconIpsum = ["adipisicing", "beef", "chuck", "shank", "tongue", "fugiat", "meatball", "sunt", "incididunt", "short", "loin", "sint", "beef", "aliqua", "tri-tip", "nisi", "deserunt", "shoulder", "frankfurter", "turducken", "biltong", "meatball", "adipisicing", "esse", "dolore", "rump", "tongue", "duis", "swine", "salami", "fatback", "chicken", "laborum", "pariatur", "rump", "swine", "salami", "shank", "boudin", "voluptate", "aliqua", "turkey", "drumstick", "magna", "short", "ribs", "sirloin", "frankfurter", "veniam", "sed", "enim", "dolore", "ut", "venison", "nisi", "est", "bacon", "salami", "tongue", "nulla", "beef", "corned", "beef", "consequat", "short", "ribs", "prosciutto", "qui", "officia", "doner", "sed"];
        (function debug() {
            var baconIndex = Math.floor(Math.random() * baconIpsum.length);
            onMessage({ data: baconIpsum[baconIndex]});
            setTimeout(debug, Math.floor(Math.random() * 2000));
        }());
    }

}());
