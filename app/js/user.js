var userApp = angular.module('userApp', []);

userApp.controller('UserController',
        function (
                $scope,
                $mdDialog,
                $http,
                $routeParams,
                $rootScope,
                $cookies,
                $location)
        {

            //$rootScope
            $rootScope.isDevelopper = $cookies.get('user_Developper') === "true" ? true : false;
            $rootScope.isProjectCreator = $cookies.get('user_ProjectCreator') === "true" ? true : false;
            $test = $cookies.get('loggedIn');
            $rootScope.loggedIn = ($test === "true");

            //$scope
            $scope.myAccount = false;
            
            $scope.projects = loadUserProjects();
            $scope.projects = loadUserProjects();
            $scope.IdUserConnected = $cookies.get('user_UniqId');
            $scope.password = '';
            $scope.verif_password = '';
            $scope.currentProjects = undefined;
            $scope.completedProjects = undefined;
            $scope.user = {
                Login: $cookies.get('user_login') || undefined,
                Password: undefined,
                Email: undefined,
                FirstName: undefined,
                LastName: undefined,
                verif_password: undefined,
                Developper: $cookies.get('user_Developper') === "true" ? true : false || undefined,
                Activated: undefined,
                Admin: $cookies.get('user_Admin') === "true" ? true : false || undefined,
                Description: undefined,
                UniqId: $cookies.get('user_UniqId'),
                ImageUrl: undefined,
                ProjectCreator: $cookies.get('user_ProjectCreator') === "true" ? true : false || undefined
            };

            ////////////////////////////
            /////Functions du scope/////
            ////////////////////////////
            
            $scope.loadUserDetail = function () {
                $http.get('http://codingmarketplace.apphb.com/api/Users/Detail/' + $routeParams.userId).success(function (data) {
                    $scope.user = data;
                    if ($scope.IdUserConnected === $routeParams.userId)
                    {
                        $scope.myAccount = true;
                    }
                });
            };
            $scope.showDialogContact = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'partials/dialog-contact.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                }).then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
            };
            $scope.showAlert = function () {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                alert('Vos modifications ont bien été enregistrées..');
            };
            $scope.saveModification = function () {
                if ($scope.password === $scope.verif_password) {
                    var user_modificated = {Id: $scope.user.Id, Email: $scope.user.Email, Password: $scope.password, Description: $scope.user.Description};
                    $http.post('http://codingmarketplace.apphb.com/api/Users/Update/' + $scope.user.UniqId, user_modificated).success(function (data) {
                        $scope.showAlert();
                    });
                }
            };
            $scope.resetPassword = function () {
                if ($scope.password === $scope.verif_password) {
                    id = $routeParams.userId;
                    var reset_password = {Password: $scope.password, UniqId: id};
                    $http.post('http://localhost:57396/api/Users/ResetPassword/' + id, reset_password).success(function (data) {
                        alert("Mot de passe changé !");
                        $location.path('/');
                    });
                }
                ;
            };

            
            ////////////////////////////
            /////Functions privées//////
            ////////////////////////////
            
            function loadUserProjects() {
                if ($rootScope.isDevelopper == true) {
                    $http.get('http://codingmarketplace.apphb.com/api/Projects/AllForUser/' + $routeParams.userId).success(function (data) {
                        $scope.projects = data;
                    }).error(function (data) {
                    });
                } else if ($rootScope.isProjectCreator == true) {
                    $http.get('http://codingmarketplace.apphb.com/api/Users/AllProjects/' + $routeParams.userId).success(function (data) {
                        $scope.projects = data;
                    }).error(function (data) {
                    });
                }
            };
            
            
            $scope.loadUserDetail();
        });
//Controller pour l'ouverture des différentes pop-up
function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
}