var adminApp = angular.module('adminApp', []);

adminApp.controller('AdminController',
        function (
                $scope,
                $location,
                $http,
                $rootScope,
                $cookies,
                $route)
        {

            // $rootScope
            $test = $cookies.get('loggedIn');
            $rootScope.loggedIn = ($test === "true");
            $rootScope.isAdmin = $cookies.get('user_Admin') === "true" ? true : false;
            
            // $scope
            $scope.selectedUser = {};
            $scope.queryFilter = '';
            $scope.loadUsersData();
            $scope.adminId = $cookies.get('user_UniqId');


            ////////////////////////////
            /////Functions du scope/////
            ////////////////////////////

            $scope.UserManagement = function () {
                $location.path('/admin/user-management');
            };
            $scope.loadUsersData = function () {
                $http.get('http://codingmarketplace.apphb.com/api/Users/All').success(function (data) {
                    $scope.users = data;
                });
                if ($rootScope.loggedIn === false || $rootScope.isAdmin === false) {
                    $location.path('#/');
                }
            };

            $scope.deleteUser = function (id) {

                var userToDelete = {UniqId: id};

                $http({url: 'http://codingmarketplace.apphb.com/api/Users/Delete/' + $scope.adminId,
                    method: 'DELETE',
                    data: userToDelete,
                    headers: {"Content-Type": "application/json;charset=utf-8"}
                }).success(function (res) {
                    $route.reload();
                }, function (error) {
                });
            };

            $scope.updateUser = function (id, admin, projetCreator, Dev) {

                var updateUser = {ID: 0, Admin: admin, ProjectCreator: projetCreator, Developper: Dev, UniqId: id};
                $http.post('http://codingmarketplace.apphb.com/api/users/ChangeRole/' + $scope.adminId, updateUser).success(function (data) {

                    alert(data);
                })
                        .error(function (data) {

                            alert("Une errreur est survenue !");
                        });

            };
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