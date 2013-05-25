angular.module("directives", []).
    directive("cdcolumn", function () {
        return {
            restrict: "E",
            //replace : true,
            scope   : {
                text    : "@",
                property: "="
            },
            template: "<span>{{text}}</span>"
            //template: "<td>{{text}}</td>"
        };
    }).
    directive("cdcolumns", function () {
        return {
            restrict  : "E",
            //replace   : true,
            transclude: true,
            scope     : {},
            template  : "<div ng-transclude></div>"
            //template  : "<tr ng-transclude></tr>"
        };
    }).
    directive("cddatagrid", function () {
        return {
            restrict  : "E",
            transclude: true,
            scope     : {
                data: "="
            },
            template  : "<table>\n    <tr ng-transclude></tr>\n    <tr ng-repeat=\"record in data\">\n        <td ng-repeat=\"field in record\">{{field}}</td>\n    </tr>\n</table>",
            compile   : function (tplEl, attr, transclude) {

            }
        };
    });

