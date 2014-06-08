if ( window.sessionStorage ) {
	sessionStorage.clear();
}

window.onload = function () {

	// TEST/DYNAMETER CONSTANTS.
	TEST_DIV_ID = 'testMeterDiv';
	TEST_DIV_$ID = '#' + TEST_DIV_ID;
	WRAPPER_CLASS = 'dm-wrapperDiv';
	WRAPPER_$CLASS = '.' + WRAPPER_CLASS;
	DATA_MIN_ATTR = 'dm-min';
	DATA_MAX_ATTR = 'dm-max';
	DATA_RANGE_ATTR = 'dm-range';
	VALUE_TXT_CLASS = 'dm-valueP';
	VALUE_TXT_$CLASS = '.' + VALUE_TXT_CLASS;
	VALUE_GRAPHIC_CLASS = 'dm-maskDiv';
	VALUE_GRAPHIC_$CLASS = '.' + VALUE_GRAPHIC_CLASS;

	INIT_LABEL = 'test';
	INIT_VALUE = 5;
	INIT_UNIT = 'points';
	INIT_MIN = 0;
	INIT_MAX = 10;
	INIT_REGIONS = {
		0: 'normal',
		8: 'warn',
		9: 'error'
	};
	ANGLE_MIN = 0;
	ANGLE_MAX = 180;


	module("Init");

		test("HasDmWrapperClasshook", function () {
			var $dm = $(TEST_DIV_$ID).dynameter();
			var hasDmWrprCls = $dm.hasClass(WRAPPER_CLASS);
			equal(hasDmWrprCls, true, "Expecting div to have 'dm-wrapperDiv' classhook added.");
		});

		test("HasDmMinData", function () {
			var $dm = $(TEST_DIV_$ID).dynameter();
			var $dmDataMin = $dm.data(DATA_MIN_ATTR);
			var hasDmMinData = (typeof $dmDataMin !== 'undefined' && $dmDataMin !== '');
			ok(hasDmMinData, "Expecting div data-dm-min to be defined and populated.");
		});

		test("HasDmMaxData", function () {
			var $dm = $(TEST_DIV_$ID).dynameter();
			var $dmDataMax = $dm.data(DATA_MAX_ATTR);
			var hasDmMaxData = (typeof $dmDataMax !== 'undefined' && $dmDataMax !== '');
			ok(hasDmMaxData, "Expecting div data-dm-max to be defined and populated.");
		});

		test("HasDmRangeData", function () {
			var $dm = $(TEST_DIV_$ID).dynameter();
			var $dmDataRange = $dm.data(DATA_RANGE_ATTR);
			var hasDmMaxRange = (typeof $dmDataRange !== 'undefined' && $dmDataRange !== '');
			ok(hasDmMaxRange, "Expecting div data-dm-range to be defined and populated.");
		});

		test("ReturnsDmObject", function () {
			var $dm = $(TEST_DIV_$ID).dynameter();
			var $dmIsDefined = (typeof $dm !== 'undefined');
			var $dmIsObject = (typeof $dm === 'object');
			ok($dmIsDefined && $dmIsObject, "Expecting returned jQuery object to be defined.");
		});

		test("DuplicateInitIsSafe", function () {
			var $dm = $(TEST_DIV_$ID).dynameter();
			var $dm2 = $(TEST_DIV_$ID).dynameter();
			var sameClasses = ($dm.attr('class') === $dm2.attr('class'));
			var sameNbrChildDivs = ($dm.children('div').length === $dm2.children('div').length);
			ok(sameClasses && sameNbrChildDivs, "Expecting no extra classhook or child-divs from duplicate init-call.");
		});


	module("ChangeValue");

		test("ValidValue_TxtDisplay", function () {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_VALUE,
				min: INIT_MIN,
				max: INIT_MAX
			});
			var newVal = 8;
			$dm.changeValue(newVal);
			var actualValTxt = $dm.find(VALUE_TXT_$CLASS).text();
			equal(actualValTxt, newVal, "Expecting text display to equal new value.");
		});

		test("ValidValue_GraphicDisplay", function () {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_VALUE,
				min: INIT_MIN,
				max: INIT_MAX
			});
			var newVal = 8;
			var newGraphicAngle = (newVal - INIT_MIN) / INIT_MAX * ANGLE_MAX;
			$dm.changeValue(newVal);
			var actualGraphicStyle = $dm.find(VALUE_GRAPHIC_$CLASS).attr('style');
			var agsIdx0 = actualGraphicStyle.indexOf('rotate(') + 7;
			var agsIdx1 = actualGraphicStyle.indexOf('deg)', agsIdx0);
			var actualGraphicAngle = actualGraphicStyle.substring(agsIdx0, agsIdx1);
			equal(actualGraphicAngle, newGraphicAngle, "Expecting graphic display angle to equal new value's test-calculated angle.");

		});

};
