angular.module("directives", []).
    directive("cdDatagrid", function () {
        "use strict";
        return {
            restrict  : "E",
            transclude: true,
            template  : "<table>\n    <tr ng-transclude></tr>\n    <tr ng-repeat=\"record in data\">\n        <td ng-repeat=\"column in columns\">{{record[column]}}</td>\n    </tr>\n</table>",
            scope     : {
                data: "="
            },
            controller: ["$scope", "$element", "$attrs", "$transclude", "$filter", "$timeout", function ($scope, $element, $attrs, $transclude, $filter, $timeout) {
                var self = this;
                $scope.columns = [];
                self.addHeader = function (header) {
                    $scope.columns.push(header);
                };

                $scope.$watch("data.length", function (newValue, oldValue) {
                    console.log("Data length changed");
                    if ($scope.sortedColumn && $scope.order !== "undefined") {
                        if (newValue > 0) {
                            $timeout(function () {
                                self.orderBy($scope.sortedColumn, $scope.order);
                            });
                        }
                    }
                });

                self.orderBy = function (header, order) {
                    console.log("order by " + header + " with value: " + order);
                    $scope.$apply(function () {
                        $scope.data = $filter('orderBy')($scope.data, header, order);
                    });
                };

                self.setOrder = function (header, order) {
                    $scope.order = order;
                    $scope.sortedColumn = header;
                };
            }]
        };
    }).
    directive("cdDatagridColumns", function () {
        "use strict";
        return {
            restrict  : "E",
            //replace   : true,
            transclude: true,
            scope     : {},
            template  : "<div ng-transclude></div>"
            //template  : "<tr ng-transclude></tr>"      //dont working! WTF!?   issue : https://github.com/angular/angular.js/issues/1459
        };
    }).
    directive("cdDatagridColumn", function () {
        "use strict";
        return {
            restrict: "E",
            require : "^cdDatagrid",
            //replace : true,
            scope   : {
                text    : "@",
                property: "=",
                order   : "@"
            },

            link    : function (scope, element, attrs, cdDatagridCtrl) {
                var property = attrs.property;

                cdDatagridCtrl.addHeader(property);
                if (attrs.order) {
                    scope.order = attrs.order === "DESC" ? true : false;
                    cdDatagridCtrl.setOrder(property, scope.order);
                } else {
                    scope.order = false;
                }
                element.bind("click", function () {
                    cdDatagridCtrl.orderBy(property, scope.order);
                    scope.order = !scope.order;
                });
            },
            template: "<span>{{text}}</span>"
            //template: "<td>{{text}}</td>"  //dont working! WTF!?   issue: https://github.com/angular/angular.js/issues/1459
        };
    });

