/**
 * ng-context-menu - An AngularJS directive to display a context menu when a right-click event is triggered
 *
 * @author Ian Kennington Walter (http://ianvonwalter.com)
 */
angular
  .module('ng-context-menu', [])
  .directive('contextMenu', ['$window', '$parse', function($window, $parse) {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {
        var opened = false,
            openTarget,
            disabled = $scope.$eval(attrs.contextMenuDisabled),
            win = angular.element($window),
            menuElement = angular.element(document.getElementById(attrs.target)),
            fn = $parse(attrs.contextMenu);

        function open(event, element) {
          element.removeClass('open');
          element.css('top', event.pageY + 'px');
          if (150 + event.pageX > screen.width)
            element.css('left', (event.pageX - 150) + 'px');
          else 
            element.css('left', event.pageX + 'px');

          opened = true;
        }

        function close(element) {
          opened = false;
          element.addClass('open');
        }

        menuElement.css('position', 'absolute');
        // menuElement.addClass('open');
        // console.log(menuElement.getBoundingClientRect());
        

        element.bind('contextmenu', function(event) {
          if (!disabled) {
            openTarget = event.target;
            event.preventDefault();
            event.stopPropagation();
            $scope.$apply(function() {
              fn($scope, { $event: event });
              open(event, menuElement);
            });
          }
        });

        win.bind('keyup', function(event) {
          if (!disabled && opened && event.keyCode === 27) {
            $scope.$apply(function() {
              close(menuElement);
            });
          }
        });

        function handleWindowClickEvent(event) {
          if (!disabled && opened && (event.button !== 2 || event.target !== openTarget)) {
            $scope.$apply(function() {
              close(menuElement);
            });
          }
        }

        // Firefox treats a right-click as a click and a contextmenu event while other browsers
        // just treat it as a contextmenu event
        win.bind('click', handleWindowClickEvent);
        win.bind('contextmenu', handleWindowClickEvent);
      }
    };
  }]);