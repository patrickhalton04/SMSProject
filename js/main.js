/**
 * Created by patrickhalton on 8/31/15.
 */

var smsApp = angular.module('smsApp', ["firebase"]);

smsApp.controller('mainController',["$scope","$firebaseArray", function ($scope,$firebaseArray) {

    var ref  = new Firebase("https://smrproj.firebaseio.com/comments");
    var userDoc = new Firebase("https://smrproj.firebaseio.com/users");

    $scope.comments = $firebaseArray(ref);

    $scope.username = "patient" + Math.floor(Math.random() * 10);

    $scope.addComment = function(e){
        if(e){
            $scope.comments.$add({
                from: $scope.username,
                body: $scope.newComment
            });

            $scope.newComment = "";

        }
    };

    $scope.name = "";
    $scope.pass = "";

    $scope.addForm = function(e){
    if(e){

        $scope.users.$add({
            user :$scope.name,
            pass :$scope.pass
        })

    }



    }



}]);