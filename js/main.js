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

.controller('mainController',["$scope","$firebaseArray","$firebaseObject","$firebaseAuth","$location", function ($scope,$firebaseArray,$firebaseObject, $firebaseAuth,$location) {

    var ref  = new Firebase("https://smrproj.firebaseio.com/comments");
    var ref2  = new Firebase("https://smrproj.firebaseio.com/chat");

        $scope.makeChat = $firebaseObject(ref2);
        $scope.makeChat1 = $firebaseArray(ref2);

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
                $scope.authData = authData;
                var ref3  = new Firebase("https://smrproj.firebaseio.com/users/" + $scope.authData.uid);
                $scope.userChatId = $firebaseArray(ref3);


            } else {
                $location.path("/");
            }
        });


        $scope.addChat = function(){

            $scope.makeChat1.$add({
                chat: $scope.newChat,
                user: $scope.authData.password.email

            }).then(
                function(ref){
                    $location.path("/userChat/" + ref.key());
                    $scope.userChatId.$add({
                        uid : ref.key()
                    })

                }
            );

        }

}])
 .filter('userChats', function() {
        return function(allChats, myChatKeys) {
            var myChats = [];
            angular.forEach(myChatKeys, function(value,key){

                var key = value.uid;
                var chat = allChats[key]
                chat.$id = key
                myChats.push(chat);
            });

            return myChats
        }
    })
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


        $scope.back = function(){

            $location.path("/chat");
            console.log("button work");

        };

        $scope.authObj.$onAuth(function(authData) {
            if (authData) {
                $scope.authData = authData;
            } else {
                $location.path("/");
            }
        });

    }]);


