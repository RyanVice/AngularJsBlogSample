angular.module('app', [])
    .controller('MainController', function ($scope, $log, $q, $http) {
        $scope.posts = [];
        $scope.message = "";

        function getUserByUserName(userName) {

            return $http.get('http://jsonplaceholder.typicode.com/users')
                .then(function (response) {

                    var user;

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].username === userName) {
                            user = response.data[i];
                            break;
                        }
                    }

                    return user;
                });
        };

        function getPostByUserName(userName) {

            return getUserByUserName(userName)
                .then(function (user) {

                    $log.debug('BlogService.getUserByUserName.then user:' + user + ' user.id: ' + user.id);

                    return getPosts()
                        .then(function (posts) {

                            var postsByUser = [];

                            for (var i = 0; i < posts.length; i++) {
                                if (posts[i].userId === user.id) {
                                    postsByUser.push(posts[i]);
                                }
                            }

                            return postsByUser;
                        });
                });
        };

        function getPosts() {
            return $http.get('http://jsonplaceholder.typicode.com/posts')
                .then(function (response) {
                    return response.data;
                });
        };

        $scope.getPosts = function () {
            getPostByUserName($scope.username)
                .then(function (posts) {

                    $log.debug('MainController.getPostByUserName reponse.length: ' + posts.length);

                    $scope.posts.length = 0;

                    $scope.posts.username = $scope.username;

                    for (var i = 0; i < posts.length; i++) {
                        $scope.posts.push(posts[i]);
                    }
                }, function (error) {
                    $scope.error = error;
                });
        };
    });