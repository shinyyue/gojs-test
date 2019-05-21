import angular from 'angular';
import controller from './controllers';

class ShowComponents {
  constructor() {
    this.template = require('./index.html');
    this.controller = controller;
  }
}

const SHOW_MODULE = angular
  .module('show', [])
  .component('show', new ShowComponents());

export default SHOW_MODULE;
