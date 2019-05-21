// 声明home模块

import angular from 'angular';
import TestController from './controller';

class TestComponent {
  constructor() {
    this.template = require('./index.html');
    this.controller = TestController;
  }
}

const TEST_MODULE = angular
  .module('test', [])
  .component('test', new TestComponent());

export default TEST_MODULE;