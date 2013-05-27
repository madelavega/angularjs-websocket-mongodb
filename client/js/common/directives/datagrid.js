angular.module("directives", []).
    directive("cdDatagrid", function () {
        return {
            restrict  : "E",
            transclude: true,
            template  : "<table>\n    <tr ng-transclude></tr>\n    <tr ng-repeat=\"record in data\">\n        <td ng-repeat=\"column in columns\">{{record[column]}}</td>\n    </tr>\n</table>",
            scope     : {
                data: "="
            },
            controller: ["$scope", "$element", "$attrs", "$transclude", function ($scope, $element, $attrs, $transclude) {
                $scope.columns = [];
                this.addHeader = function (header) {
                    $scope.columns.push(header);
                };
            }]
        };
    }).
    directive("cdDatagridColumns", function () {
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
        return {
            restrict: "E",
            require : "^cdDatagrid",
            //replace : true,
            scope   : {
                text    : "@",
                property: "="
            },
            link    : function (scope, element, attrs, cddatagridCtrl) {
                cddatagridCtrl.addHeader(attrs.property);
            },
            template: "<span>{{text}}</span>"
            //template: "<td>{{text}}</td>"  //dont working! WTF!?   issue: https://github.com/angular/angular.js/issues/1459
        };
    });

