"use strict";
exports.__esModule = true;
exports.CompareSlider = void 0;
var react_compare_slider_1 = require("react-compare-slider");
var CompareSlider = function (_a) {
    var original = _a.original, restored = _a.restored;
    return (<react_compare_slider_1.ReactCompareSlider itemOne={<react_compare_slider_1.ReactCompareSliderImage src={original} alt="original photo"/>} itemTwo={<react_compare_slider_1.ReactCompareSliderImage src={restored} alt="restored photo"/>} portrait className="flex w-[475px] mt-5"/>);
};
exports.CompareSlider = CompareSlider;
