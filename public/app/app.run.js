(function() {
    'use strict';

    angular
        .module('vg.app')
        .run(run);

    function run($rootScope, $location, $state, $firebaseObject, AuthWrapper, FIREBASEDATA) {

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            if (error === 'AUTH_REQUIRED') {
                $state.go('registerOrLogin');
            }
        });

        $rootScope.$on('$stateChangeSuccess', function() {

            // If user is logged in, download their profile data to an object in $rootScope.
            // FIXME: We shouldn't need to do this every successful state change.
            if (AuthWrapper.$getAuth()) {
                
                var authData = AuthWrapper.$getAuth();
                var ref = new Firebase(FIREBASEDATA.FBURL);

                var profileData = $firebaseObject(ref.child('users').child(authData.uid));
                profileData.$bindTo($rootScope, 'profile').then(function(unbind) {
                    $rootScope.unbindFunction = unbind;
                });

            }

        });

        $rootScope.Utils = {
            keys: Object.keys
        };

    }

})();