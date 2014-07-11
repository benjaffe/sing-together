define(function(){
    var interval;
    var maxScrollSpeed = 60;
    var scrollDisabled = false;
    var scrollDestination;

    return {

        animateScrollTo: function(x,y) {
            var scrollNextTick = {x: window.scrollX, y: window.scrollY};
            scrollDestination = {x: x, y: y};
            scrollDisabled = true;

            var offset = {};
            var lead = 1;

            // console.log('scrolling from ' + window.scrollY + ' to ' + scrollDestination.y);

            if (interval) return false;

            interval = setInterval(function(){
                offset = scrollDestination.y - scrollNextTick.y;
                // console.log('animating from ' + window.scrollY + ' to ' + scrollDestination.y);
                var offsetSign = Math.pow(offset,0);

                if (Math.abs(offset) >= 1) {
                    scrollNextTick.y = scrollNextTick.y + offset/10;
                    window.scrollTo(window.scrollX, scrollNextTick.y);
                } else {
                    clearInterval(interval);
                    interval = null;
                    scrollDisabled = false;
                }
            },16);
        },

        scrollDisabled: function(value) {
            if (value)
                scrollDisabled = value;
            return scrollDisabled;
        }

    };
});

