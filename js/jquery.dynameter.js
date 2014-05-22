(function ( $ ) {
 
    $.fn.dynameter = function ( options ) {
        var defaults = {
            width: 200,
            label: 'DynaMeter',
            value: 50,
            newValue: null,
            min: 0,
            max: 100,
            regions: {  // Value-keys and color-refs.  E.g., value: 'normal'|'warn|'error', etc.
                0: 'normal'
            },

            _colors: {
                normal: '#228B22',  // green.
                warn: '#DAA520',  // yellow.
                error: '#FF0000'  // red.
            }
        };

        var settings = $.extend( {}, defaults, options) ;

        settings._range = settings.max - settings.min;
        settings._indicatorWidth = 20 * (settings.width / 200);  // Width of the indicator's color-band.

        this.changeValue =  function ( myVal )  { 
            var $this = $(this);
            var myMin = $this.data('dm-min');
            var myRange = $this.data('dm-range');
            // Update value text.
            $this.find('.dm-innerDiv .dm-valueP').html(myVal);
            // Rotate mask div.
            var myRelVal = myVal - myMin;
            var myDeg = myRelVal / myRange * 180;
            $this.find('.dm-maskDiv').css({
                '-webkit-transform': 'rotate(' + myDeg + 'deg)',
                '-moz-border-radius': 'rotate(' + myDeg + 'deg)',
                'border-radius': 'rotate(' + myDeg + 'deg)'
            });
            // Set/update dm-value attr.
            $this.data('dm-value', myVal);
            // console.log('[dynameter.changeValue] Method called.  myVal = ' + myVal);
        };

        // Greenify the collection based on the settings variable.
        return this.each(function () {
            var $this = $(this);  // Div that's getting DynaMeter-ized.

            function updateValue (myVal) {
                var myMin = $this.data('dm-min');
                var myRange = $this.data('dm-range');
                // Update value text.
                $this.find('.dm-innerDiv .dm-valueP').html(myVal);
                // Rotate mask div.
                var myRelVal = myVal - myMin;
                var myDeg = myRelVal / myRange * 180;
                $this.find('.dm-maskDiv').css({
                    '-webkit-transform': 'rotate(' + myDeg + 'deg)',
                '-moz-border-radius': 'rotate(' + myDeg + 'deg)',
                'border-radius': 'rotate(' + myDeg + 'deg)'
                });
                // Set/update dm-value attr.
                $this.data('dm-value', myVal);
            }

            // Initialize once.
            if (!$this.hasClass('dm-wrapperDiv')) {
                $this.addClass('dm-wrapperDiv');
                $this.data('dm-id', ('dm-' + new Date().getTime()));
                $this.data('dm-min', settings.min);
                $this.data('dm-max', settings.max);
                $this.data('dm-range', settings.max - settings.min);

                $this.html('');
                $this.append('<canvas class="dm-canvas"></canvas>');
                $this.append('<div class="dm-maskDiv"></div>');
                $this.append('<div class="dm-innerDiv"></div>');

                var $canvas = $this.find('canvas.dm-canvas');
                var $maskDiv = $this.find('div.dm-maskDiv');
                var $innerDiv = $this.find('div.dm-innerDiv');

                // Style divs based on settings.width;
                // Overrides any widths/heights from jquery.dynameter.css.
                var setBorderRadius = function ($myDiv) {
                    var myWidth = $myDiv.width();
                    var myHeight = myWidth / 2;
                    $myDiv.css({
                        '-webkit-border-radius': myHeight + 'px ' + myHeight + 'px 0 0',
                        '-moz-border-radius': myHeight + 'px ' + myHeight + 'px 0 0',
                        'border-radius': myHeight + 'px ' + myHeight + 'px 0 0'
                    });
                };
                var myRadius = settings.width / 2;
                $this.css({
                    'width': settings.width + 'px',
                    'height': myRadius + 'px',
                    'fontSize': Math.round(settings.width * 0.08)
                });
                $canvas.attr('width', settings.width).attr('height', settings.width);
                $canvas.css({
                    'bottom': '0',
                    'left': '0'
                });
                setBorderRadius($canvas);
                $maskDiv.css({
                    'bottom': '0',
                    'left': '0',
                    'width': settings.width + 'px',
                    'height': myRadius + 'px'
                });
                setBorderRadius($maskDiv);
                $innerDiv.css({
                    'bottom': '0',
                    'left': settings._indicatorWidth + 'px',
                    'width': settings.width - (settings._indicatorWidth * 2) + 'px',
                    'height': myRadius - settings._indicatorWidth + 'px'
                });
                setBorderRadius($innerDiv);


                $innerDiv.append('<p class="dm-valueP">' + settings.value + '</p>');
                if (settings.unit) {
                    $innerDiv.append('<p class="dm-unitP">' + settings.unit + '</p>');
                }
                $innerDiv.append('<p class="dm-labelP">' + settings.label + '</p>');

                var $valueP = $this.find('p.dm-valueP');
                var $unitP = $this.find('p.dm-unitP');
                var $labelP = $this.find('p.dm-labelP');

                var getAngleFromValue = function (myVal) {
                    // Returns angle for canvas arc color-stops.
                    if (myVal < settings.min || myVal > settings.max) {
                        // console.log('[dynameter.getAngleFromValue] ERROR: myValue is outside value range!');
                        return null;
                    }
                    // Return calculated angle plus canvas-arc offset.
                    return parseInt((myVal - settings.min) / (settings._range) * 180) + 180;
                };

                // Setup canvas resources/functions to draw indicator color(s).
                var colorStops = [];  // Color-ref by angle, based on settings.regions.
                var keyIdx = 0;
                for (key in settings.regions) {
                    // If there's no beginning-value region, prepend one using 'normal' as color-ref.
                    if (key > settings.min && keyIdx == 0) {
                        colorStops.push([getAngleFromValue(settings.min), settings._colors['normal']]);
                        keyIdx++;
                    }
                    colorStops.push([getAngleFromValue(key), settings._colors[settings.regions[key]]]);
                    keyIdx++;
                }
                var colorStopsLength = colorStops.length;
                // console.log('[dynameter.drawCanvas] colorStops array assembled -- array-length: ' + colorStops.length);

                var getColorFromAngle = function (myAngle) {
                    // Returns color for myAngle, based on colorStops.
                    var myKey = null;
                    var myNextKey = null;
                    var myColor = null;
                    for (var i = 0; i < colorStopsLength; i++) {
                        myKey = colorStops[i][0];
                        if (i != (colorStopsLength - 1)) {
                            myNextKey = colorStops[i + 1][0];
                            if (myKey <= myAngle && myAngle < myNextKey) {
                                myColor = colorStops[i][1];
                                break;
                            }
                        } else {
                            if (myKey <= myAngle) {
                                myColor = colorStops[i][1];
                                break;
                            } 
                        }
                    }
                    // console.log('Color found for myAngle(' + myAngle + '): ' + myColor);
                    return myColor;
                };

                // Draw the value band, using colorStops for color range(s).
                var myCtx = $canvas[0].getContext('2d');
                for(var angle=180; angle<=356; angle+=2) {
                    var startAngle = (angle)*Math.PI/180;
                    var endAngle = (angle + 4) * Math.PI/180;
                    myCtx.beginPath();
                    myCtx.moveTo(myRadius, myRadius);
                    myCtx.arc(myRadius, myRadius, myRadius, startAngle, endAngle, false);
                    myCtx.closePath();
                    myCtx.fillStyle = getColorFromAngle(angle);
                    myCtx.fill();
                }

                console.log('[dynameter] div#' + $this.attr('id') + ' initialized.');

            }

            updateValue(settings.value);

        });


 
    };
 
}( jQuery ));
