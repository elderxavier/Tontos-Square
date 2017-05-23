(function () {
    'use strict';

    var app = angular.module('starter.common');
    app.factory('ModalScaffoldService', ModalScaffoldService);

    ModalScaffoldService.$inject = ['ngDialog'];

    function ModalScaffoldService(ngDialog) {

        var ModalScaffold = function (name, opts) {
            this.__name = name;
            this.__opts = opts;
            this.__path = (opts && opts.fullPath) ? opts.fullPath : 'scripts/'+ name+ '/'+ name+'-modal.html';
        };
        
        ModalScaffold.prototype.setScope = function(scope) {
            this.__scope = scope;
        }

        ModalScaffold.prototype.open = function () {
            var self = this;
            
            self.__modal = ngDialog.open({
				template: self.__path,
                scope: self.__scope ? self.__scope : undefined,
				className: self.__opts.class,
                overlay: self.__opts.overlay,
                showClose: self.__opts.close,
                controller: self.__opts.controller,
                controllerAs: self.__opts.controllerAs
			});
        };
        
        ModalScaffold.prototype.isOpen = function() {
            if(!this.__modal) return false;
            return ngDialog.isOpen(this.__modal.id);
        }

        ModalScaffold.prototype.close = function () {
        	ngDialog.close()
        };
        
        ModalScaffold.prototype.toggle = function () {
        	if (this.isOpen()) return this.close();
            this.open();
        };

        return ModalScaffold;
    }
})();
