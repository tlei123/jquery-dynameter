if ( window.sessionStorage ) {
	sessionStorage.clear();
}

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
REGION_CLASS = 'dm-bgClrDiv';
REGION_$CLASS = '.' + REGION_CLASS;
REGION_CLASS_NORMAL = 'normal';
REGION_CLASS_$NORMAL = '.' + REGION_CLASS_NORMAL;
REGION_CLASS_WARN = 'warn';
REGION_CLASS_$WARN = '.' + REGION_CLASS_WARN;
REGION_CLASS_ERROR = 'error';
REGION_CLASS_$ERROR = '.' + REGION_CLASS_ERROR;

INIT_LABEL = 'test';
INIT_VALUE = 5;
INIT_UNIT = 'points';
INIT_MIN = 0;
INIT_MAX = 10;
INIT_REGIONS = {
	8: 'warn',
	9: 'error'
};
ANGLE_MIN = 0;
ANGLE_MAX = 180;

function initDiv () {
	return $(TEST_DIV_$ID).dynameter({
		label: INIT_LABEL,
		value: INIT_VALUE,
		unit: INIT_UNIT,
		min: INIT_MIN,
		max: INIT_MAX,
		regions: INIT_REGIONS
	});
}

function getAngleFromValue (myVal) {
	// Returns calculated region/value display-angle based on myVal.
	return (myVal - INIT_MIN) / INIT_MAX * ANGLE_MAX;
}
function getAngleFromStyle ($myDiv) {
	// Returns actual region/value display-angle based on $myDiv's style attribute.
	var actualGraphicStyle = $myDiv.attr('style');
	var agsIdx0 = actualGraphicStyle.indexOf('rotate(') + 7;
	var agsIdx1 = actualGraphicStyle.indexOf('deg)', agsIdx0);
	return actualGraphicStyle.substring(agsIdx0, agsIdx1);
}

module("Init");

	test("BlocksInvalidInit_ValueBelowMin", function () {
		try {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_MIN - 1,
				min: INIT_MIN,
				max: INIT_MAX
			});
		} catch (error) {
			ok(error !== null, "Expecting value-below-min init to return error -- '" + error + "'.");
		}
	});

	test("BlocksInvalidInit_ValueAboveMax", function () {
		try {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_MAX + 1,
				min: INIT_MIN,
				max: INIT_MAX
			});
		} catch (error) {
			ok(error !== null, "Expecting value-above-max init to return error -- '" + error + "'.");
		}
	});

	test("BlocksInvalidInit_RegionColorKeyUndefined", function () {
		try {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_VALUE,
				min: INIT_MIN,
				max: INIT_MAX,
				regions: {
					8: 'wrongClrRef'
				}
			});
		} catch (error) {
			ok(error !== null, "Expecting undefined-region-color-key init to return error -- '" + error + "'.");
		}
	});

	test("BlocksInvalidInit_RegionValueBelowMin", function () {
		try {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_VALUE,
				min: INIT_MIN, // 0
				max: INIT_MAX,
				regions: {
					'-1': 'normal'
				}
			});
		} catch (error) {
			ok(error !== null, "Expecting below-min-region-value init to return error -- '" + error + "'.");
		}
	});

	test("BlocksInvalidInit_RegionValueAboveMax", function () {
		try {
			var $dm = $(TEST_DIV_$ID).dynameter({
				label: INIT_LABEL,
				value: INIT_VALUE,
				min: INIT_MIN, // 0
				max: INIT_MAX,
				regions: {
					11: 'normal'
				}
			});
		} catch (error) {
			ok(error !== null, "Expecting above-max-region-value init to return error -- '" + error + "'.");
		}
	});

	test("HasCorrectDmWrapperClasshook", function () {
		var $dm = initDiv();
		var hasDmWrprCls = $dm.hasClass(WRAPPER_CLASS);
		equal(hasDmWrprCls, true, "Expecting classhook to match init value.");
	});

	test("HasCorrectDmMinData", function () {
		var $dm = initDiv();
		var dmDataMin = $dm.data(DATA_MIN_ATTR);
		equal(dmDataMin, INIT_MIN, "Expecting dm-min attribute value to equal init value.");
	});

	test("HasCorrectDmMaxData", function () {
		var $dm = initDiv();
		var dmDataMax = $dm.data(DATA_MAX_ATTR);
		equal(dmDataMax, INIT_MAX, "Expecting dm-max attribute value to equal init value.");
	});

	test("HasCorrectDmRangeData", function () {
		var $dm = initDiv();
		var dmDataRange = $dm.data(DATA_RANGE_ATTR);
		var initRange = INIT_MAX - INIT_MIN;
		equal(dmDataRange, initRange, "Expecting dm-range attribute value to match test-calculated value.");
	});

	test("NormalRegionIsCorrect_EmptyInit", function () {
		var $dm = $(TEST_DIV_$ID).dynameter();
		var actualNormalAngle = getAngleFromStyle($dm.find(REGION_CLASS_$NORMAL));
		equal(actualNormalAngle, 0, "Expecting normal region angle to be 0, with no init settings at all.");
	});

	test("NormalRegionIsCorrect_InitNoNormalRegion", function () {
		var $dm = $(TEST_DIV_$ID).dynameter({
			value: INIT_VALUE,
			min: INIT_MIN,
			max: INIT_MAX,
			regions: {
				8: 'warn',
				9: 'error'
			}
		});
		var actualNormalAngle = getAngleFromStyle($dm.find(REGION_CLASS_$NORMAL));
		equal(actualNormalAngle, 0, "Expecting normal region angle to be 0 by default, init-setting only warn & error regions.");
	});

	test("MethodIsChainable", function () {
		var $dm = initDiv().addClass('postInitClass');
		var $dmIsDefined = (typeof $dm !== 'undefined');
		var $dmIsObject = (typeof $dm === 'object');
		var $dmHasTestClass = $dm.hasClass('postInitClass');
		ok($dmIsDefined && $dmIsObject && $dmHasTestClass, "Expecting init method to be chainable.");
	});

	test("HasChangeValueMethod", function () {
		var $dm = initDiv();
		var hasChangeValueMethod = (typeof $dm.changeValue == 'function');
		ok(hasChangeValueMethod, "Expecting returned jQuery object to have changeValue public method.");
	});

	test("DuplicateInitIsSafe", function () {
		var $dm = initDiv();
		var $dm2 = initDiv();
		var sameClasses = ($dm.attr('class') === $dm2.attr('class'));
		var sameNbrChildDivs = ($dm.children('div').length === $dm2.children('div').length);
		ok(sameClasses && sameNbrChildDivs, "Expecting no extra classhook or child-divs from duplicate init-call.");
	});


module("ChangeValue");

	test("ValidValue_TxtDisplayIsCorrect", function () {
		var $dm = initDiv();
		var newVal = 8;
		$dm.changeValue(newVal);
		var actualValTxt = $dm.find(VALUE_TXT_$CLASS).text();
		equal(actualValTxt, newVal, "Expecting text display to equal new value.");
	});

	test("ValidValue_GraphicDisplayIsCorrect", function () {
		var $dm = initDiv();
		var newVal = 8;
		var newGraphicAngle = getAngleFromValue(newVal);
		$dm.changeValue(newVal);
		var actualGraphicAngle = getAngleFromStyle($dm.find(VALUE_GRAPHIC_$CLASS));
		equal(actualGraphicAngle, newGraphicAngle, "Expecting graphic display angle to equal new value's test-calculated angle.");
	});

	test("BelowMinValue_GraphicDisplayIsMin", function () {
		var $dm = $(TEST_DIV_$ID).dynameter({
			label: INIT_LABEL,
			value: INIT_VALUE,
			min: INIT_MIN,
			max: INIT_MAX
		});
		var newVal = INIT_MIN - 1;
		$dm.changeValue(newVal);
		var actualGraphicAngle = getAngleFromStyle($dm.find(VALUE_GRAPHIC_$CLASS));
		equal(actualGraphicAngle, ANGLE_MIN, "Expecting graphic display angle to be at minimum if new value is below.");
	});

	test("AboveMaxValue_GraphicDisplayIsMax", function () {
		var $dm = $(TEST_DIV_$ID).dynameter({
			label: INIT_LABEL,
			value: INIT_VALUE,
			min: INIT_MIN,
			max: INIT_MAX
		});
		var newVal = INIT_MAX + 1;
		$dm.changeValue(newVal);
		var actualGraphicAngle = getAngleFromStyle($dm.find(VALUE_GRAPHIC_$CLASS));
		equal(actualGraphicAngle, ANGLE_MAX, "Expecting graphic display angle to be at maximum if new value is above.");
	});
