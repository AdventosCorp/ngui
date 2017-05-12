import angular from 'angular';
import Template from './template.html';
import Styles from './styles.css';

export default angular
    .module('ngui.tooltip', [])
    .component('tooltip', {
        template: Template,
        bindings: {
            nguiModel: '=',
            nguiOptions: '<'
        },
        controller: function($element, $timeout) {
            "ngInject";
            var $ctrl = this;
            var promise;

            $ctrl.start = function(){
                promise = $timeout(function(){
                        $ctrl.nguiModel = false;
                    },$ctrl.timeout*1000)
            }

            function updateOptions(options) {
                if (!options)
                    return;
                console.log("[TOOLTIP] updateOptions", options, $ctrl);

                $ctrl.message = options.message || "Your message goes here";
                $ctrl.position = options.position || 'top';
                $ctrl.color = options.color || '#fff';
                $ctrl.bgcolor = options.bgcolor || '#005e9d';
                if(options.timeout > 0) {
                    $ctrl.timeout = options.timeout;
                }
            }

            $ctrl.$onChanges = function(changes) {
                updateOptions(changes.nguiOptions.currentValue);
            }

            function show() {
                $ctrl.visibility = 'visible';
            }

            function show() {
                $timeout(function(){
                    $ctrl.visibility = 'visible';
                },200)
            }
            $ctrl.clear = function (){
                $timeout.cancel(promise);
                $ctrl.nguiModel = false;
            }

            $ctrl.timeoutThis = function(){
                $element.ready(function() {
                    var el = $element[0];
                    var prevSib = el.previousElementSibling;
                    var prevSibW = prevSib.offsetWidth;
                    var prevSibH = prevSib.offsetHeight;
                    var rect = el.getBoundingClientRect();
                    var tooltipW = el.children[0].offsetWidth;
                    var tooltipH = el.children[0].offsetHeight;
                    var bodyH = document.body.offsetHeight;

                    if(el.offsetTop - prevSib.offsetTop > 1){
                        console.log(bodyH,el.offsetTop,tooltipH);
                        if (bodyH - el.offsetTop - tooltipH < 0) {
                            // Doesn't fit on the bottom
                            $ctrl.nguiOptions.position = 'forceTop';
                        } else {
                            $ctrl.nguiOptions.position = 'forceBottom';
                        }
                    }

                    function setLeft() {
                        $ctrl.positionClass = 'left';
                        $ctrl.top = (prevSibH - tooltipH) / 2 + 'px';
                        $ctrl.right = prevSibW + 8 + 'px';
                        $ctrl.bottom = 'auto';
                        $ctrl.left = 'auto';
                        $ctrl.fadeOutClass = 'Left';
                        show();
                    }

                    function setRight() {
                        $ctrl.positionClass = 'right';
                        $ctrl.top = (prevSibH - tooltipH) / 2 + 'px';
                        $ctrl.right = 'auto';
                        $ctrl.bottom = 'auto;'
                        $ctrl.left = '8px';
                        $ctrl.fadeOutClass = 'Right';
                        show();
                    }

                    function setBottom() {
                        $ctrl.positionClass = 'bottom';
                        $ctrl.top = prevSibH + 6 + 'px';
                        $ctrl.right = 'auto';
                        $ctrl.bottom = 'auto';
                        $ctrl.left = '-' + (prevSibW / 2) - tooltipW / 2 - 1 + 'px';
                        $ctrl.fadeOutClass = 'Bottom';
                        show();
                    }

                    function setForcedBottom(){
                        $ctrl.positionClass = 'bottom';
                        $ctrl.top = '6px';
                        $ctrl.right = 'auto';
                        $ctrl.bottom = 'auto';
                        $ctrl.left = (prevSibW / 2) - tooltipW / 2 - 1 + 'px';
                        $ctrl.fadeOutClass = 'Bottom';
                        show();
                    }

                    function setTop() {
                        $ctrl.positionClass = 'top';
                        $ctrl.top = -6 - tooltipH + 'px';
                        $ctrl.right = 'auto';
                        $ctrl.bottom = 'auto';
                        $ctrl.left = '-' + (prevSibW / 2) - tooltipW / 2 - 1 + 'px';
                        $ctrl.fadeOutClass = 'Top';
                        show();
                    }

                    function setForcedTop() {
                        $ctrl.positionClass = 'top';
                        $ctrl.top = -6 - prevSibH - tooltipH + 'px';
                        $ctrl.right = 'auto';
                        $ctrl.bottom = 'auto';
                        $ctrl.left = (prevSibW / 2) - tooltipW / 2 - 1 + 'px';
                        $ctrl.fadeOutClass = 'Top';
                        show();
                    }

                    $timeout(function(){
                        switch ($ctrl.nguiOptions.position) {
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
                                    setLeft();
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
                            case 'forceBottom':
                                setForcedBottom()
                                console.log('forceBottom');
                                break;
                            case 'forceTop':
                                setForcedTop()
                                console.log('forceTop');
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
                    },100)
                });
                if($ctrl.timeout > 0){
                    $timeout.cancel(promise);
                    $ctrl.start();
                }
            }

            $ctrl.$onInit = function() {
                if (!this.nguiOptions)
                    this.nguiOptions = {};
                updateOptions(this.nguiOptions);
            }
        }
    })
    .name
