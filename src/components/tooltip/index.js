import main from '../../main.js';
import Template from './template.html';
import Styles from './styles.css';

export default main.component('tooltip', {
    template: Template,
    bindings: {
        nguiMessage: '@',
        nguiPosition: '@',
        nguiTimeout: '<'
    },
    controller: function($element, $timeout) {
        var $ctrl = this;

        $ctrl.$onInit = function() {

            var timeFadeOut = 4000;
            if ($ctrl.nguiTimeout != undefined) {
                if ($ctrl.nguiTimeout < 1) {
                    $ctrl.nguiTimeout = 1
                }
                timeFadeOut = $ctrl.nguiTimeout * 1000;
            }
            var timeRemove = timeFadeOut + 1000;

            $timeout(function() {
                $ctrl.positionClass += ' fadeOut';
                $ctrl.positionClass += $ctrl.fadeOutClass; 
            }, timeFadeOut)
            $timeout(function() {
                $ctrl.showTooltip = false;
            }, timeRemove)

            $element.ready(function() {

                var el = $element[0];
                var prevSib = el.previousElementSibling;
                var prevSibW = prevSib.offsetWidth;
                var prevSibH = prevSib.offsetHeight;
                var rect = el.getBoundingClientRect();
                var tooltipW = el.children[0].offsetWidth;
                var tooltipH = el.children[0].offsetHeight;
                var bodyH = document.body.offsetHeight;

                function setLeft() {
                    $ctrl.positionClass = 'left';
                    $ctrl.top = 'auto';
                    $ctrl.right = prevSibW + 8 + 'px';
                    $ctrl.bottom = (prevSibH - tooltipH) / 2 + 'px';
                    $ctrl.left = 'auto';
                    $ctrl.fadeOutClass = 'Left';
                }

                function setRight() {
                    $ctrl.positionClass = 'right';
                    $ctrl.top = -prevSibH / 2 - tooltipH / 2 + 0.5 + 'px';
                    $ctrl.right = 'auto';
                    $ctrl.bottom = 'auto;'
                    $ctrl.left = '3.5px';
                    $ctrl.fadeOutClass = 'Right';
                }

                function setBottom() {
                    $ctrl.positionClass = 'bottom';
                    $ctrl.top = '6px';
                    $ctrl.right = 'auto';
                    $ctrl.bottom = 'auto';
                    $ctrl.left = '-' + (prevSibW / 2) - tooltipW / 2 - 1 + 'px';
                    $ctrl.fadeOutClass = 'Bottom';
                }

                function setTop() {
                    $ctrl.positionClass = 'top';
                    $ctrl.top = -6 - tooltipH - prevSibH + 'px';
                    $ctrl.right = 'auto';
                    $ctrl.bottom = 'auto';
                    $ctrl.left = '-' + (prevSibW / 2) - tooltipW / 2 - 1 + 'px';
                    $ctrl.fadeOutClass = 'Top';
                }

                switch ($ctrl.nguiPosition) {
                    case 'left':
                        if (rect.left - prevSibW - tooltipW < 0) {
                            // Doesn't fit on the left
                            setRight();
                        } else {
                            // Fits on the left
                            setLeft();
                        }
                        break;
                    case 'right':
                        if (window.innerWidth - rect.right - tooltipW < 0) {
                            // Doesn't fit on the right
                            setBottom();
                        } else {
                            // Fits on the right
                            setRight();
                        }
                        break;
                    case 'bottom':
                        if (bodyH - el.offsetTop - tooltipH < 0) {
                            // Doesn't fit on the bottom
                            setTop();
                        } else {
                            // Fits on the bottom
                            setBottom();
                        }
                        break;
                    case 'top':
                    default:
                        if (rect.top - prevSibH - tooltipH < 0) {
                            // Doesn't fit on the top
                            setBottom();
                        } else {
                            // Fits on the top
                            setTop();
                        }
                }
            });
            $ctrl.showTooltip = true;
        }
    }
});
