jquery-dynameter
================
http://github.com/tlei123/jquery-dynameter

by Tze Lei (tclei2009@gmail.com)

Link jquery.dynameter.css stylesheet into your head section [adjust path as needed]:

    <link rel="stylesheet" type="text/css" href="css/jquery.dynameter.css">
  

Link jquery core library and jquery.dynameter.js into your body section, at the bottom [adjust path as needed]:

    <script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/jquery.dynameter.js"></script>

Add a div with a unique id to your body section:

    <div id="#meterDiv"></div>

Initialize and assign it to a variable [put this script tag below the DynaMeter script tag]:

    <script type="text/javascript">
      var $myMeter = null;
      $( function () {
        $myMeter = $('#meterDiv').dynameter({
          label: 'My Meter',
          value: 50,
          min: 0,
          max: 100,
          unit: 'things'
        });
      });
    </script>

Update your meter instance's value-indicator with changeValue method on you variable:

    $myMeter.changeValue(88);

