if ( window.sessionStorage ) {
	sessionStorage.clear();
}

window.onload = function () {

	// TEST CONSTANTS.
	TESTDIVID = 'testMeterDiv';
	TESTDIV$ID = '#testMeterDiv';
	WRAPPERCLASS = 'dm-wrapperDiv';
	DATAMINATTR = 'dm-min';
	DATAMAXATTR = 'dm-max';
	DATARANGEATTR = 'dm-range';


	module("Init");

		test("HasDmWrapperClasshook", function () {
			var $dm = $(TESTDIV$ID).dynameter();
			var hasDmWrprCls = $dm.hasClass(WRAPPERCLASS);
			equal(hasDmWrprCls, true, "Expecting div to have 'dm-wrapperDiv' classhook added.");
		});

		test("HasDmMinData", function () {
			var $dm = $(TESTDIV$ID).dynameter();
			var $dmDataMin = $dm.data(DATAMINATTR);
			var hasDmMinData = (typeof $dmDataMin !== 'undefined' && $dmDataMin !== '');
			ok(hasDmMinData, "Expecting div data-dm-min to be defined and populated.");
		});

		test("HasDmMaxData", function () {
			var $dm = $(TESTDIV$ID).dynameter();
			var $dmDataMax = $dm.data(DATAMAXATTR);
			var hasDmMaxData = (typeof $dmDataMax !== 'undefined' && $dmDataMax !== '');
			ok(hasDmMaxData, "Expecting div data-dm-max to be defined and populated.");
		});

		test("HasDmRangeData", function () {
			var $dm = $(TESTDIV$ID).dynameter();
			var $dmDataRange = $dm.data(DATARANGEATTR);
			var hasDmMaxRange = (typeof $dmDataRange !== 'undefined' && $dmDataRange !== '');
			ok(hasDmMaxRange, "Expecting div data-dm-range to be defined and populated.");
		});

		test("ReturnsDmObject", function () {
			var $dm = $(TESTDIV$ID).dynameter();
			var $dmIsDefined = (typeof $dm !== 'undefined');
			var $dmIsObject = (typeof $dm === 'object');
			ok($dmIsDefined && $dmIsObject, "Expecting returned jQuery object to be defined.");
		});

		test("DuplicateInitIsSafe", function () {
			var $dm = $(TESTDIV$ID).dynameter();
			var $dm2 = $(TESTDIV$ID).dynameter();
			var sameClasses = ($dm.attr('class') === $dm2.attr('class'));
			var sameNbrChildDivs = ($dm.children('div').length === $dm2.children('div').length);
			ok(sameClasses && sameNbrChildDivs, "Expecting no extra classhook or child-divs from duplicate init-call.");
		});

};
