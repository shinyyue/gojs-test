// 声明home模块

import angular from 'angular';
import HomeController from '../../other/edit';

class HomeComponent {
  constructor() {
    this.template = require('./index.html');
    this.controller = HomeController;
  }
}

const HOME_MODULE = angular
  .module('home', [])
  .component('home', new HomeComponent());

export default HOME_MODULE;
