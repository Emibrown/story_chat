angular
.module('bdrsApp')
.directive('dateTimePicker', dateTimePicker);

var dateTimePicker = function() {
            return {
                restrict: "A",
                require: "ngModel",
                link: function (scope, element, attrs, ngModelCtrl) {
                    var parent = $(element).parent();
                    var dtp = parent.datetimepicker({
                        format: "LL",
                        showTodayButton: true
                    });
                    dtp.on("dp.change", function (e) {
                        ngModelCtrl.$setViewValue(moment(e.date).format("LL"));
                        scope.$apply();
                    });
                }
            };
        };