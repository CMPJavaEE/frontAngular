var codingMarketPlaceApp = angular.module('CodingMarketPlaceApp');

codingMarketPlaceApp.factory('User', function($resource) {
    return $resource('', {}, {
        login: {method: 'post', url:'/rest/login/:id'}
    });
});

codingMarketPlaceApp.service('UserService', function (User) {
    var data = {
        user: {},
        isLoggedIn: false
    };
    
    var login = function() {
        data.user = User.login();
    };
    
    return {
            data: data,
            login: login
    };
});