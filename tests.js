describe('MainController', function () {

    var endpointController;

    var dummyPosts = [
        {
            "userId": 1,
            "id": 1,
            "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
        },
        {
            "userId": 1,
            "id": 2,
            "title": "qui est esse",
            "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
        },
        {
            "userId": 2,
            "id": 11,
            "title": "et ea vero quia laudantium autem",
            "body": "delectus reiciendis molestiae occaecati non minima eveniet qui voluptatibus\naccusamus in eum beatae sit\nvel qui neque voluptates ut commodi qui incidunt\nut animi commodi"
        }];

    var dummyUsers = [
        {
            "id": 1,
            "name": "Leanne Graham",
            "username": "Bret",
            "email": "Sincere@april.biz",
            "address": {
                "street": "Kulas Light",
                "suite": "Apt. 556",
                "city": "Gwenborough",
                "zipcode": "92998-3874",
                "geo": {
                    "lat": "-37.3159",
                    "lng": "81.1496"
                }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
                "name": "Romaguera-Crona",
                "catchPhrase": "Multi-layered client-server neural-net",
                "bs": "harness real-time e-markets"
            }
        },
        {
            "id": 2,
            "name": "Ervin Howell",
            "username": "Antonette",
            "email": "Shanna@melissa.tv",
            "address": {
                "street": "Victor Plains",
                "suite": "Suite 879",
                "city": "Wisokyburgh",
                "zipcode": "90566-7771",
                "geo": {
                    "lat": "-43.9509",
                    "lng": "-34.4618"
                }
            },
            "phone": "010-692-6593 x09125",
            "website": "anastasia.net",
            "company": {
                "name": "Deckow-Crist",
                "catchPhrase": "Proactive didactic contingency",
                "bs": "synergize scalable supply-chains"
            }
        }];

    beforeEach(module('app'));

    it('Give $scope.username is Bret When calling getPosts() Then Brets two posts are returned',
        inject(function ($rootScope, $controller, $httpBackend) {

        var expectedPosts = [
            {
                "userId": 1,
                "id": 1,
                "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
                "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
            },
            {
                "userId": 1,
                "id": 2,
                "title": "qui est esse",
                "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
            }
        ];

        $httpBackend.expectGET('http://jsonplaceholder.typicode.com/users')
            .respond(dummyUsers);
        $httpBackend.expectGET('http://jsonplaceholder.typicode.com/posts')
            .respond(dummyPosts);

        var scope = $rootScope.$new();

        scope.username = 'Bret';

        endpointController = $controller("MainController", { $scope: scope });

        scope.getPosts();

        $httpBackend.flush();

        expect(endpointController).not.toBeNull();
        expect(arraysOfObjectsAreEqual(scope.posts, expectedPosts)).toBeTruthy();

        function arraysOfObjectsAreEqual(actual, expected) {

            if (actual.length !== expected.length) {
                return false;
            }

            for(var i=0;i < actual.length;i++) {
                for(var propertyName in actual[i]) {
                    if(actual[i][propertyName] !== expected[i][propertyName])
                        return false;
                }
            }

            return true;
        }
    }));

    it('Give $scope.username is Bret When calling getPosts() and getting a 404 from /users Then scope.error has a message indicating that the user wasnt found',
        inject(function ($rootScope, $controller, $httpBackend) {

            $httpBackend.whenGET('http://jsonplaceholder.typicode.com/users')
                .respond(404, null, null, "Not Found");
            $httpBackend.whenGET('http://jsonplaceholder.typicode.com/posts')
                .respond(dummyPosts);

            var scope = $rootScope.$new();

            scope.username = 'Bret';

            endpointController = $controller("MainController", { $scope: scope });

            scope.getPosts();

            $httpBackend.flush();

            expect(endpointController).toBeTruthy();
            expect(scope.error).toBeTruthy();
            expect(scope.error).toBe("That user could not be found.");
        }));

    it('Give $scope.username is Bret When calling getPosts() and getting a 500 from /posts Then scope.error.status is 500',
        inject(function ($rootScope, $controller, $httpBackend) {

            $httpBackend.whenGET('http://jsonplaceholder.typicode.com/users')
                .respond(dummyUsers);
            $httpBackend.whenGET('http://jsonplaceholder.typicode.com/posts')
                .respond(500, null, null, "Internal Server Error");

            var scope = $rootScope.$new();

            scope.username = 'Bret';

            endpointController = $controller("MainController", { $scope: scope });

            scope.getPosts();

            $httpBackend.flush();

            expect(endpointController).not.toBeNull();
            expect(scope.error).not.toBeNull();
            expect(scope.error.status).toBe(500);
        }));
});