angular.module('app', [])
    .controller('MainController', function ($scope, $log, $q, $http) {
        $scope.posts = [];
        $scope.message = "";

        function getUserByUserName(userName) {

            return getUsers()
                .then(function (response) {

                    var user;

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].username === userName) {
                            user = response.data[i];
                            break;
                        }
                    }

                    return user;
                }).catch(function (error) {
                    $log.error(error);
                    return $q.reject("That user could not be found.");
                });
        }

        function getUsers() {
            return $http.get('http://jsonplaceholder.typicode.com/users');
        }

        function getPostByUser(user){

            return getAllPosts()
                .then(function (posts) {

                    var postsByUser = [];

                    for (var i = 0; i < posts.length; i++) {
                        if (posts[i].userId === user.id) {
                            postsByUser.push(posts[i]);
                        }
                    }

                    return postsByUser;
                });
        }

        function getAllPosts() {
            return $http.get('http://jsonplaceholder.typicode.com/posts')
                .then(function (response) {
                    return response.data;
                });
        }

        function addPostsToScope(posts) {

            $log.debug('MainController.getPostByUserName reponse.length: ' + posts.length);

            $scope.posts.length = 0;

            $scope.posts.username = $scope.username;

            for (var i = 0; i < posts.length; i++) {
                $scope.posts.push(posts[i]);
            }
        }

        $scope.getPosts = function () {
            getUserByUserName($scope.username)
                .then(getPostByUser)
                .then(addPostsToScope)
                .catch(function (error) {
                        $scope.error = error;
                });
        }
    });