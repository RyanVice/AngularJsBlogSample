angular.module('app', [])
    .controller('MainController', function ($scope, $log, $q, $http) {
        $scope.posts = [];
        $scope.message = "";

        var getUserByUserName = function (userName) {
            var deffered = $q.defer();

            $http.get('http://jsonplaceholder.typicode.com/users')
                .success(function (response) {

                    var user;

                    for (var i = 0; i < response.length; i++) {
                        if (response[i].username === userName) {
                            user = response[i];
                            break;
                        }
                    }

                    deffered.resolve(user);
                })
                .error(function (error) {
                    deferred.reject(error);
                });

            return deffered.promise;
        };

        var getPostByUserName = function (userName) {
            var deffered = $q.defer();

            getUserByUserName(userName)
                .then(function (user) {

                    $log.debug('BlogService.getUserByUserName.then user:' + user + ' user.id: ' + user.id);

                    getPosts()
                        .then(function (posts) {

                            var postsByUser = [];

                            for (var i = 0; i < posts.length; i++) {
                                if (posts[i].userId === user.id) {
                                    postsByUser.push(posts[i]);
                                }
                            }

                            deffered.resolve(postsByUser);
                        },

                        function (error) {
                            deffered.reject(error);
                        });
                });

            return deffered.promise;
        };

        var getPosts = function () {
            var deffered = $q.defer();

            $http.get('http://jsonplaceholder.typicode.com/posts')
                .success(function (response) {
                    deffered.resolve(response);
                })
                .error(function (error) {
                    deferred.reject(error);
                });

            return deffered.promise;
        };

        $scope.getPosts = function () {
            getPostByUserName($scope.username)
                .then(function (response) {

                    $log.debug('MainController.getPostByUserName reponse.length: ' + response.length);

                    $scope.posts.length = 0;

                    $scope.posts.username = $scope.username;

                    for (var i = 0; i < response.length; i++) {
                        $scope.posts.push(response[i]);
                    }
                }, function (error) {
                    $scope.message = "No posts found."
                });
        };
    });