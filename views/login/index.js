// 声明login模块

import angular from 'angular'
import loginController from './controller'

class LoginComponent {
    constructor() {
        this.template = require('./index.html');
        this.controller = loginController;
    }
}

const LOGIN_MODULE = angular
    .module('login', [])
    .component('login', new LoginComponent())

export default LOGIN_MODULE