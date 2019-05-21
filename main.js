import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload';

//  引入模块
import home from './views/home';
import login from './views/login';
import edit from './views/edit';
import show from './views/show';
import test from './views/test';

// angular.module声明或者获取一个模块。该函数有两个参数，第一个是模块名称，第二个参数是需要注入的依赖列表。只传一个参数可以用来引用该模块。
// 它有很多属性，例如，config、service、controller、
const app = angular.module('myapp', ['ui.router', 'oc.lazyLoad']);

// app.config配置代码块，只有provider和constant可以被注入代码块。
// 函数参数: $httpProvider 配置请求头；$stateProvider 配置页面信息
app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  const loginRoute = {
    name: 'login',
    url: '/login',
    component: 'login',
    // 懒加载的两种方式：resolve和import
    resolve: {
      load: [
        '$ocLazyLoad',
        function ($ocLazyLoad) {
          return $ocLazyLoad.load([login]);
        }
      ]
    }
  };

  const homeRoute = {
    name: 'home',
    url: '/home',
    component: 'home',
    lazyLoad: $transition$ => {
      const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');
      return import( /* webpackChunkName: "home" */ './views/home').then(() =>
        $ocLazyLoad.load([home])
      );
    }
  };

  const editRoute = {
    name: 'edit',
    url: '/edit',
    component: 'edit',
    resolve: {
      load: [
        '$ocLazyLoad',
        function ($ocLazyLoad) {
          return $ocLazyLoad.load([edit]);
        }
      ]
    }
  };

  const showRoute = {
    name: 'show',
    url: '/show',
    component: 'show',
    resolve: {
      load: [
        '$ocLazyLoad',
        function ($ocLazyLoad) {
          return $ocLazyLoad.load([show]);
        }
      ]
    }
  };
  const testRoute = {
    name: 'test',
    url: '/test',
    component: 'test',
    resolve: {
      load: [
        '$ocLazyLoad',
        function ($ocLazyLoad) {
          return $ocLazyLoad.load([test]);
        }
      ]
    }
  };

  $stateProvider.state(homeRoute);
  $stateProvider.state(loginRoute);
  $stateProvider.state(editRoute);
  $stateProvider.state(showRoute);
  $stateProvider.state(testRoute);

  // $locationProvider.html5Mode({
  //     enabled: true,
  //     requireBase: false
  // }) // mode: history

  $urlRouterProvider.otherwise('/login');
});

export default app;