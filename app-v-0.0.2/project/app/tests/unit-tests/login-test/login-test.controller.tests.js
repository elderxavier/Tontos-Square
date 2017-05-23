describe('LoginTestController', function() {
    var controller,
        deferredLogin,
        loginServiceMock,
        stateMock,
        ionicPopupMock,
        $httpBackend;


    // load the module for our app
    beforeEach(module('starter'));

    // disable template caching
    beforeEach(module(function($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function() {});
        $urlRouterProvider.deferIntercept();
    }));

    // instantiate the controller and mocks for every test
    beforeEach(inject(function($controller, $q, _$httpBackend_) {
        $httpBackend = _$httpBackend_;

        $httpBackend.when('GET', 'scripts/validation/validation.json').respond({});
        $httpBackend.when('GET', 'scripts/validation/validation-default.json').respond({});

        deferredLogin = $q.defer();

        // mock loginService
        loginServiceMock = {
            login: jasmine.createSpy('login spy')
                .and.returnValue(deferredLogin.promise)
        };

        // mock $state
        stateMock = jasmine.createSpyObj('$state spy', ['go']);

        // mock $ionicPopup
        ionicPopupMock = jasmine.createSpyObj('$ionicPopup spy', ['alert']);

        // instantiate LoginController
        controller = $controller('LoginTestController', {
            '$ionicPopup': ionicPopupMock,
            '$state': stateMock,
            'loginTestService': loginServiceMock
        });
    }));

    afterEach(inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.flush();
    }));

    describe("#dumbTest", function() {

        it("contains spec with an expectation", function() {
            expect(true).toBe(true);
        });
    });


    describe('#login', function() {
        // call login on the controller for every test
        beforeEach(inject(function(_$rootScope_) {
            $rootScope = _$rootScope_;
            controller.username = 'test1';
            controller.password = 'password1';
            controller.login();
        }));

        it('should call login on loginService', function() {
            expect(loginServiceMock.login).toHaveBeenCalledWith('test1', 'password1');
        });

        describe('when the login is executed,', function() {
            it('if successful, should change state to home', function() {

                deferredLogin.resolve();
                $rootScope.$digest();

                expect(stateMock.go).toHaveBeenCalledWith('home');
            });

            it('if unsuccessful, should show a popup', function() {

                deferredLogin.reject();
                $rootScope.$digest();

                expect(ionicPopupMock.alert).toHaveBeenCalled();
            });
        });
    })
});
