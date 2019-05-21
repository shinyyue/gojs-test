import angular from 'angular'
import editController from './controller'

class EditComponent {
    constructor() {
        this.template = require('./index.html')
        this.controller = editController
    }
}



const EDIT_MODULE = angular
    .module('edit', [])
    .component('edit', new EditComponent())

export default EDIT_MODULE