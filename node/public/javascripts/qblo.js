angular.module('qblo', ['ngResource']).
    filter('array', function () {
        return function (input) {
            var out = "";
            input.forEach(function (item) {
                out += item;
            });
            return out;
        };
    }).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'partials/dashboard',
                controller: IndexCtrl
            }).
            when('/login', {
                templateUrl: 'partials/login',
                controller: LoginCtrl
            }).
            when('/draw/:id', {
                templateUrl: 'partials/draw',
                controller: DrawCtrl
            }).
            otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    }]);

function IndexCtrl($scope, $http, $location) {
    $http.get('/user').
        success(function (data, status) {
            $scope.user = data;
            $scope.status = status;
            if (!$scope.user) {
                $location.path('/login');
            } else {
                $http.get('/dashboard').
                    success(function (data, status) {
                        $scope.boards = data;
                        $scope.status = status;
                    }).
                    error(function () {
                        $location.path('/login');
                    });
            }
        }).
        error(function () {
            $location.path('/login');
        });
}

function LoginCtrl($scope, $http, $location) {
    $scope.form = {};
    $scope.login = function () {
        $http.post('/auth', $scope.form).
            success(function (data, status) {
                $location.path('/');
            }).
            error(function (data, status) {
                $scope.error = data;
                $scope.status = status;
            });
    };
}

function DrawCtrl($scope, $http, $routeParams) {
    $http.get('/board/' + $routeParams.id).
        success(function (data, status) {
            $scope.board = data;
            $scope.status = status;
        }).
        error(function (data, status) {
            $scope.error = data;
            $scope.status = status;
        });
}



