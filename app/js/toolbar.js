var toolbarApp = angular.module('toolbarApp', ['ngMaterial', 'ngFileUpload', 'CodingMarketPlaceApp']);

toolbarApp.config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

toolbarApp.controller('ToolbarCtrl', function ($scope, $rootScope, $mdDialog, $http, $location, $cookies, $mdSidenav, $log, UserService) {

    //$rootScope
    $test = $cookies.get('loggedIn');
    $rootScope.loggedIn = ($test === "true");
    $rootScope.notifs = {};
    $rootScope.couleur = '#FFFFFF';
    $rootScope.isAdmin = $cookies.get('user_Admin') === "true" ? true : false;
    $rootScope.isDevelopper = $cookies.get('user_Developper') === "true" ? true : false;
    $rootScope.isProjectLeader = $cookies.get('user_ProjectCreator') === "true" ? true : false;
    $rootScope.user = $scope.user;
    $rootScope.ImageUrlSaved = "";

    //$scope
    $scope.status = '';
    $scope.notAgreed = false;
    $scope.captchaNotValidated = false;
    $scope.fieldMissing = false;
    $scope.description = '';
    $scope.showMobileMainHeader = true;
    $scope.erreurLogin = false;
    $scope.input = {
        searchText: ''
    };
    $scope.project = {
        projectName: '',
        projectBudget: 0,
        projectDelay: 0,
        description: ''
    };
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
        ProjectCreator: $cookies.get('user_ProjectCreator') === "true" ? true : false || undefined,
        tags: ''
    };
    
    $scope.userService = UserService.data;


    ////////////////////////////
    /////Functions du scope/////
    ////////////////////////////
    $scope.prev = function () {
        $('#carousel-accueil').carousel('prev');
    };
    $scope.next = function () {
        $('#carousel-accueil').carousel('next');
    };
    $scope.goAdmin = function () {
        $location.path('admin');
    };


    /////////////////////////////
    ////Fonctions publiques//////
    /////////////////////////////

    // Connexion d'un user
    $scope.connection = function () {
        var identification = {password: $scope.user.password, login: $scope.user.mail};
        $http.post('http://codingmarketplace.apphb.com/api/Users/Login', identification).success(function (data) {
            $scope.user = data;
            $rootScope.user = $scope.user;
            $rootScope.loggedIn = true;
            $cookies.put('loggedIn', $rootScope.loggedIn);
            $cookies.put('user_login', $scope.user.Login);
            $cookies.put('user_UniqId', $scope.user.UniqId);
            var projectCreatorStr = $scope.user.ProjectCreator === true ? "true" : "false";
            var Admin = $scope.user.Admin === true ? "true" : "false";
            var Developper = $scope.user.Developper === true ? "true" : "false";
            $cookies.put('user_ProjectCreator', projectCreatorStr);
            $cookies.put('user_Admin', Admin);
            $cookies.put('user_Developper', Developper);
            $rootScope.isAdmin = $cookies.get('user_Admin') === "true" ? true : false;
            $rootScope.isDevelopper = $cookies.get('user_Developper') === "true" ? true : false;
            $rootScope.isProjectLeader = $cookies.get('user_ProjectCreator') === "true" ? true : false;

            // Chargement des notifications + changement de couleur de la cloche si notifs non lus.

            $http.get('http://codingmarketplace.apphb.com/api/Notifications/AllForUser/' + $rootScope.user.UniqId).success(function (data) {
                $rootScope.notifs = data;
                // Changement de couleur si notif non lue
                angular.forEach($rootScope.notifs, function (value) {
                    if (value.Read === false) {
                        $rootScope.couleur = '#00FF00';
                    }
                });

            });
            $scope.hide();
        }).error(function (data) {
            $scope.erreurLogin = true;
        });
    };

    // Déconnexion d'un user
    $scope.logOut = function () {
        $rootScope.loggedIn = false;
        $scope.user = undefined;
        $cookies.put('loggedIn', $rootScope.loggedIn);
        $cookies.put('user', $scope.user);
        $cookies.put('user_Developper', "false");
        $cookies.put('user_Admin', "false");
        $cookies.put('user_ProjectCreator', "false");
        $rootScope.isAdmin = false;
        $location.path('#/');
    };



    // Recherche d'un project
    $scope.search = function () {
        $location.path('search-projects/' + $scope.input.searchText);
    };

    // Accès à mon compte
    $scope.myAccount = function () {
        $location.path('user/' + $rootScope.user['UniqId']);
    };

    // Création d'un project
    $scope.createProject = function () {
        var project = {ID: 0, Title: $scope.project.projectName, Description: $scope.project.description, Duration: $scope.project.projectDelay, Budget: $scope.project.projectBudget, IdUser: 0, ImageUrl: $rootScope.ImageUrlSaved, CreationDate: ''};

        $http.post('http://codingmarketplace.apphb.com/api/Projects/Create/' + $rootScope.user['UniqId'], project).success(function (data) {
            $scope.hide();
            alert('Le projet a été créé avec succès');
        });
    };

    // Validation des informations d'inscription
    $scope.checkInscriptionInfos = function () {
        if ($scope.agreecondition !== true) {
            $scope.notAgreed = true;
        } else {
            $scope.notAgreed = false;
        }

        if ($captchaValidated !== true) {
            $scope.captchaNotValidated = true;
        } else {
            $scope.captchaNotValidated = false;
        }

        if ($scope.firstname === undefined || $scope.lastname === undefined || $scope.login === undefined || $scope.mail === undefined || $scope.password === undefined || $scope.verif_password === undefined) {
            $scope.fieldMissing = true;
        } else {
            $scope.fieldMissing = false;
        }

        if ($scope.fieldMissing === false && $scope.notAgreed === false && $scope.captchaNotValidated === false && $scope.password === $scope.verif_password) {
            var identification = {Id: 0, Email: $scope.mail, Password: $scope.password, Login: $scope.login, Activated: false, Developper: $scope.inscriptionDevelopper, ProjectCreator: $scope.inscriptionProjectCreator, FirstName: $scope.firstname, LastName: $scope.lastname, Admin: false, UniqId: "", Description: $scope.description, ImageUrl: $rootScope.ImageUrlSaved};

            $.ajax({
                type: "POST",
                url: "http://codingmarketplace.apphb.com/api/Users/Create",
                contentType: "application/json",
                data: JSON.stringify(identification),
                success: function (results) {
                    $scope.user.password = $scope.password;
                    $scope.user.mail = $scope.login;
                    $scope.connection();
                },
                error: function (resultat, status) {
                }
            });
        }
    };

    // Affectation de valeurs suivant le rôle sélectionné
    $scope.selectChange = function () {
        if ($scope.typeaccount === '1') {
            $scope.inscriptionProjectCreator = true;
            $scope.inscriptionDevelopper = false;
        } else if ($scope.typeaccount === '2') {
            $scope.inscriptionProjectCreator = false;
            $scope.inscriptionDevelopper = true;
        }
    };

    // Affichage d'un alert ou pop-up
    $scope.showAlert = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        $mdDialog.show(
                $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .content('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
                );
    };

    // Affichage pop-up de connexion 
    $scope.showDialogConnect = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'partials/dialog-connect.tmpl.html',
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

    // Affichage pop-up mot de passe oublié
    $scope.showDialogForgotPassword = function (e) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'partials/dialog-forgot-password.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: e,
            clickOutsideToClose: true
        })
                .then(function (answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
    };

    // Demande à l'api l'envoi de mail pour Mot de passe oublié
    $scope.sendMailForNewPassword = function (e) {
        var identification = {Email: $scope.email};
        $.ajax({
            type: "POST",
            url: "http://codingmarketplace.apphb.com/api/Users/ForgottenPass/",
            contentType: "application/json",
            data: JSON.stringify(identification),
            success: function (data) {
                alert("Un mail vous a été envoyé !");
            },
            error: function (resultat, status) {
            }
        });
    };

    // Affichage  pop-up d'inscription
    $scope.showDialogInscription = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'partials/dialog-inscription.tmpl.html',
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

    // Affichage pop-up de création de projet 
    $scope.showDialogProjectCreate = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'partials/dialog-creation-project.tmpl.html',
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

    $rootScope.openSideNavPanel = function () {
        $mdSidenav('left').open();
        // Validation des notifications en lus
        $scope.couleur = '#FF00FF';
    };
    $rootScope.closeSideNavPanel = function () {
        $mdSidenav('left').close();
    };

    $rootScope.openSideNavNotif = function () {
        $mdSidenav('right').open();
        $http.post('http://codingmarketplace.apphb.com/api/Notifications/ReadForUser/' + $rootScope.user.UniqId);
        $rootScope.couleur = '#FFFFFF';
    };
    $rootScope.closeSideNavNotif = function () {
        $mdSidenav('right').close();
    };


    $scope.toggleRight = buildToggler('right');
    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
        };
    }
    ;

}).controller('photoUploadCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'Upload',
    /* Uploading with Angular File Upload */
    function ($scope, $rootScope, $routeParams, $location, $upload) {
        var d = new Date();
        $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
        //$scope.$watch('files', function() {
        $scope.uploadFiles = function (files) {
            $scope.files = files;
            if (!$scope.files)
                return;
            angular.forEach(files, function (file) {
                if (file && !file.$error) {
                    file.upload = $upload.upload({
                        url: "https://api.cloudinary.com/v1_1/" + $.cloudinary.config().cloud_name + "/upload",
                        fields: {
                            upload_preset: $.cloudinary.config().upload_preset,
                            tags: 'myphotoalbum',
                            context: 'photo=' + $scope.title
                        },
                        file: file
                    }).progress(function (e) {
                        file.progress = Math.round((e.loaded * 100.0) / e.total);
                        file.status = "Uploading... " + file.progress + "%";
                    }).success(function (data, status, headers, config) {
                        $rootScope.photos = $rootScope.photos || [];
                        data.context = {custom: {photo: $scope.title}};
                        file.result = data;
                        $rootScope.photos.push(data);
                        $rootScope.ImageUrlSaved = file.result.url;
                    }).error(function (data, status, headers, config) {
                        file.result = data;
                    });
                }
            });
        };
        //});

        /* Modify the look and fill of the dropzone when files are being dragged over it */
        $scope.dragOverClass = function ($event) {
            var items = $event.dataTransfer.items;
            var hasFile = false;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].kind == 'file') {
                        hasFile = true;
                        break;
                    }
                }
            } else {
                hasFile = true;
            }
            return hasFile ? "dragover" : "dragover-err";
        };
    }]).controller('RightCtrl', function ($scope, $mdSidenav, $log) {
    $scope.close = function () {
        $mdSidenav('right').close()
                .then(function () {
                    $log.debug("close RIGHT is done");
                });
    };
});
;

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
