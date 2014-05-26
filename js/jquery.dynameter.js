(function ( $ ) {
 
    $.fn.dynameter = function ( options ) {
        var defaults = {
            label: 'DynaMeter',
            value: 50,
            min: 0,
            max: 100,
            regions: {  // Value-keys and color-refs.  E.g., value: 'normal'|'warn|'error', etc.
                0: 'normal'
            }
        };

        var settings = $.extend( {}, defaults, options) ;

        settings._range = settings.max - settings.min;

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
                '-moz-transform': 'rotate(' + myDeg + 'deg)',
                '-ms-transform': 'rotate(' + myDeg + 'deg)',
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
                    '-moz-transform': 'rotate(' + myDeg + 'deg)',
                    '-ms-transform': 'rotate(' + myDeg + 'deg)',
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
                $this.append('<div class="dm-maskDiv"></div>');
                $this.append('<div class="dm-innerDiv"></div>');

                var $bgDiv = $this.find('div.dm-bgDiv');
                var $maskDiv = $this.find('div.dm-maskDiv');
                var $innerDiv = $this.find('div.dm-innerDiv');

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
                    return parseInt((myVal - $this.data('dm-min')) / $this.data('dm-range') * 180);
                };

                // Color stops for indicator color-bands [[angle, color-reference],...].
                var colorStops = [];  // Color-ref by angle, based on settings.regions.
                var keyIdx = 0;
                for (key in settings.regions) {
                    // If there's no beginning-value region, prepend one using 'normal' as color-ref.
                    if (key > settings.min && keyIdx == 0) {
                        colorStops.push([getAngleFromValue(settings.min), 'normal']);
                        keyIdx++;
                    }
                    colorStops.push([getAngleFromValue(key), settings.regions[key]]);
                    keyIdx++;
                }
                var colorStopsLength = colorStops.length;

                // Create and rotate color-bands for indicator background.
                for (var i = 0; i < colorStopsLength; i++) {
                    var myAngle = colorStops[i][0];
                    var myClrRef = colorStops[i][1];
                    $(document.createElement('div'))
                        .addClass('dm-bgClrDiv ' + myClrRef)
                        .css({
                            '-webkit-transform': 'rotate(' + myAngle + 'deg)',
                            '-moz-transform': 'rotate(' + myAngle + 'deg)',
                            '-ms-transform': 'rotate(' + myAngle + 'deg)',
                            'transform': 'rotate(' + myAngle + 'deg)',
                            'zIndex': i + 1
                        })
                        .prependTo($this);
                }

                console.log('[dynameter] div#' + $this.attr('id') + ' initialized.');

            }

            updateValue(settings.value);

        });


 
    };
 
}( jQuery ));
