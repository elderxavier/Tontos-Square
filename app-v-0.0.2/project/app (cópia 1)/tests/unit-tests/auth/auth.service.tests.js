describe("authService", function() {
    var authService, httpBackend, mockDependency;

    beforeEach(module("restaurant"));

    beforeEach(module(function($provide, authServiceProvider) {
        authService = authServiceProvider.$get();
        authService.getSomething = function() {
            return 'something';
        };

        $provide.value('authService', authService);
    }));

    // instantiate the controller and mocks for every test
    beforeEach(inject(function($q, _$httpBackend_) {
        authService.checkIsChef = function() {
            return $q.resolve(true);
        };

        spyOn(authService, "signInWithEmailAndPassword").and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve({ "uid": "abc" });
            return deferred.promise;
        });
    }));

    //dummy
    describe("#getSomething", function() {
        it('need to be called and return something', inject(function(authService) {

            spyOn(authService, 'getSomething').and.callThrough();
            var value = authService.getSomething();

            expect(authService.getSomething).toHaveBeenCalled();
            expect(value).toBe('something');
        }));
    });

    describe("#emailLogin", function() {
        it('need to be called', inject(function(authService) {
            spyOn(authService, 'emailLogin').and.callThrough();
            authService.emailLogin('jose123@gmail.com', '123456');

            expect(authService.emailLogin).toHaveBeenCalled();
        }));

        it('need to call signInWithEmailAndPassword', inject(function(authService) {
            authService.emailLogin('jose123@gmail.com', '123456');
            expect(authService.signInWithEmailAndPassword).toHaveBeenCalled();
        }));


        it('need to show modal if is chef', inject(function(authService) {
            authService.emailLogin('jose123@gmail.com', '123456');
            expect(authService.signInWithEmailAndPassword).toHaveBeenCalled();
        }));


        it('need to go to location if logged successfully', inject(function(authService) {
            authService.emailLogin('jose123@gmail.com', '123456');
            expect(authService.signInWithEmailAndPassword).toHaveBeenCalled();
        }));

    });

});
