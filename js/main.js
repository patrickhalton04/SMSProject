/**
 * Created by patrickhalton on 8/31/15.
 */

angular.module('smsApp', ['ngRoute','firebase','ui.bootstrap']).config(["$routeProvider",function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'www/views/signLog.html',
            controller: 'formController'

        })
        .when('/chat', {
            templateUrl: 'www/views/chat.html',
            controller: 'mainController',
            authRequired: true
        })

        .when('/userChat/:id', {
            templateUrl: 'www/views/userChat.html',
            controller: 'chaterController',
            authRequired: true
        })



}])

.controller('mainController',["$scope","$firebaseArray","$firebaseAuth","$location", function ($scope,$firebaseArray,$firebaseAuth,$location) {

    var ref  = new Firebase("https://smrproj.firebaseio.com/comments");
    var ref2  = new Firebase("https://smrproj.firebaseio.com/chat");

        $scope.makeChat = $firebaseArray(ref2);
        $scope.authObj = $firebaseAuth(ref);
        $scope.comments = $firebaseArray(ref);


        $scope.username = "patient" + Math.floor(Math.random()*11);

    $scope.addComment = function(e){
        if(e){
            $scope.comments.$add({
                from: $scope.authData.password.email,
                body: $scope.newComment
            });

            $scope.newComment = "";

        }
    };

        $scope.authObj.$onAuth(function(authData) {
            if (authData) {
                console.log(authData);
                console.log("im in:", authData.uid);
                $scope.authData = authData;
            } else {
                $location.path("/");
                console.log("Logged out");
            }
        });

        $scope.addChat = function(){

            $scope.makeChat.$add({
                chat: $scope.newChat,
                user: $scope.authData.password.email
            })
                .then(function(ref) {
                    var id = ref.key();
                    console.log("added record with id " + id);
                    $scope.makeChat.$indexFor(id); // returns location in the array
                    $location.path("/userChat/"+ id);
                });

        };

}])

.controller('formController',["$scope","$firebaseArray","$firebaseAuth","$location", function ($scope,$firebaseArray,$firebaseAuth,$location) {

    var userDoc = new Firebase("https://smrproj.firebaseio.com");

    $scope.authObj = $firebaseAuth(userDoc);
    $scope.signIn = false;

    $scope.addForm = function(){

        $scope.authObj.$createUser({

            email: $scope.newUser.email,
            name: $scope.login.username,
            password: $scope.newUser.pass

        }).then(function(userData) {
                console.log("User " + userData.uid + " created successfully!");

                return $scope.authObj.$authWithPassword({

                    email: $scope.newUser.email,
                    name: $scope.login.username,
                    password: $scope.newUser.pass

                });
            }).then(function(authData) {
                console.log("Logged in as:", authData.uid);
                $location.path("/chat")
            }).catch(function(error) {
                $scope.errMess2 = "Error: Email already in use"
            });
    };

    $scope.login = function(){

        $scope.authObj.$authWithPassword({

            email: $scope.login.email,
            password: $scope.login.password

        }).then(function(authData) {
                $location.path("/chat");
                console.log("Logged in as:", authData.uid);
            }).catch(function(error) {

                $scope.errMess = "Invalid Login";

                console.error("Authentication failed:", error);
            });

    }


}])

 .controller('chaterController',["$scope","$firebaseArray","$firebaseAuth","$location","$routeParams", function ($scope,$firebaseArray,$firebaseAuth,$location,$routeParams) {

        var ref3  = new Firebase("https://smrproj.firebaseio.com/chat/" + $routeParams.id);

        $scope.authObj = $firebaseAuth(ref3);
        $scope.privChat = $firebaseArray(ref3);

        $scope.chatId = $routeParams.id;


        $scope.addToChat = function(e){
            if(e){
                $scope.privChat.$add({
                    from: $scope.authData.password.email,
                    body: $scope.newComment
                });

                $scope.newComment = "";

            }
        };

        $scope.authObj.$onAuth(function(authData) {
            if (authData) {
        console.log(authData);
                console.log("im in:", authData.uid);
                $scope.authData = authData;
            } else {
                $location.path("/");
                console.log("Logged out");
            }
        });

console.log($scope.privChat);

    }]);


