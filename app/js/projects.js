var projectsApp = angular.module('projectsApp', []);


projectsApp.controller('ProjectsController',
        function (
                $scope,
                $routeParams,
                $http,
                $rootScope,
                $cookies)
        {

            //$scope
            $scope.searchText = $routeParams.key || '';
            $scope.countProjects = 0;
            $scope.user = {};
            $scope.projects = loadProjects();

            //$rootScope
            $test = $cookies.get('loggedIn');
            $rootScope.loggedIn = ($test === "true");


            ////////////////////////////
            /////Functions privées//////
            ////////////////////////////

            function loadProjects() {
                $http.get('http://codingmarketplace.apphb.com/api/Projects/All/' + $scope.searchText).success(function (data) {
                    $scope.projects = data;
                    $scope.countProjects = $scope.projects.length || $scope.countProjects;
                    angular.forEach($scope.projects, function (projet) {
                        $http.get('http://codingmarketplace.apphb.com/api/Users/Detail/' + projet.IdUser).success(function (data) {
                            projet.userName = data.FirstName + ' ' + data.LastName;
                        });
                    });
                });
            }
        });