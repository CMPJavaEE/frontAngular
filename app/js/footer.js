var footerApp = angular.module('footerApp', ['ngMaterial']);

footerApp.controller('FooterCtrl',
        function (
                $scope,
                $mdDialog,
                $http)
        {

            // $scope
            $scope.lastName;
            $scope.firstName;
            $scope.email;
            $scope.content;


            ////////////////////////////
            /////Functions du scope/////
            ////////////////////////////

            // Affichage  pop-up d'inscription
            $scope.showDialogContact = function (ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'partials/dialog-contact.tmpl.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                        .then(function (answer) {
                            $scope.status = 'You said the information was "' + answer + '".';
                        }, function () {
                            $scope.status = 'You cancelled the dialog.';
                        });
            };

            $scope.sendMail = function () {
                var mail = {FirstName: $scope.firstName, LastName: $scope.lastName, Email: $scope.email, Message: $scope.content};
                $http.post('http://codingmarketplace.apphb.com/api/Contact/ContactUs', mail).success(function () {
                    alert('Votre amil a bien été envoyé');
                    $scope.hide();
                });
            };

        });

// Controller pour l'ouverture des différentes pop-up
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