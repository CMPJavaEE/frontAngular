'use strict';

/* App Module */

var codingMarketPlaceApp = angular.module('CodingMarketPlaceApp', [
    'ngRoute',
    'ngMaterial',
    'ngCookies',
    'toolbarApp',
    'projectsApp',
    'projectApp',
    'userApp',
    'adminApp',
    'footerApp',
    'ngResource'
]);

codingMarketPlaceApp.config(function ($routeProvider) {
    $routeProvider.
            when('/', {
                templateUrl: 'partials/template-index.html',
                controller: ''
            }).
            when('/search-projects/:key?', {
                templateUrl: 'partials/template-projects.html',
                controller: 'ProjectsController'
            }).
            when('/projects/:projectId', {
                templateUrl: 'partials/template-detail-project.html',
                controller: 'ProjectController'
            }).
            when('/legal-notice', {
                templateUrl: 'partials/legal-notice.html',
                controller: ''
            }).
            when('/user/:userId', {
                templateUrl: 'partials/template-detail-user.html',
                controller: 'UserController'
            }).
            when('/admin', {
                templateUrl: 'partials/admin/template-choice-module.html',
                controller: 'AdminController'
            }).
            when('/admin/user-management', {
                templateUrl: 'partials/admin/user-management.html',
                controller: 'AdminController'
            }).
            when('/contact', {
                templateUrl: 'partials/template-contact.tmpl.html',
                controller: ''
            }).
            when('/forgot-password/:userId', {
                templateUrl: 'partials/template-forgot-password.html',
                controller: 'UserController'
            }).
            otherwise({
                redirectTo: '/'
            });
});



/////////////////////////////
////////Propriétés///////////
/////////////////////////////