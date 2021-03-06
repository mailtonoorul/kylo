import * as angular from 'angular';
import {moduleName} from "./module-name";
import lazyLoadUtil from "../../kylo-utils/LazyLoadUtil";
import "kylo-common";
import "kylo-services";
import "kylo-opsmgr";
import AccessConstants from "../../constants/AccessConstants";

class ModuleFactory  {
    module: ng.IModule;
    constructor () {
        this.module = angular.module(moduleName,[]);
        this.module.config(['$stateProvider','$compileProvider',this.configFn.bind(this)]);
    }
    configFn($stateProvider:any, $compileProvider: any) {
          //preassign modules until directives are rewritten to use the $onInit method.
        //https://docs.angularjs.org/guide/migration#migrating-from-1-5-to-1-6
        $compileProvider.preAssignBindingsEnabled(true);

        $stateProvider.state(AccessConstants.UI_STATES.JOBS.state,{
            url:'/jobs',
            params: {
                filter: null,
                tab:null
            },
            views: {
                'content': {
                    templateUrl: './jobs.html',
                    controller:"JobsPageController",
                    controllerAs:"vm"
                }
            },
            resolve: {
                // loadMyCtrl: this.lazyLoadController(['./JobsPageController'])
                loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad: any) => {
                    return import(/* webpackChunkName: "opsmgr.jobs.controller" */ './JobsPageController')
                        .then(mod => {

                            return $ocLazyLoad.load(mod.default)
                        })
                        .catch(err => {
                            throw new Error("Failed to load JobsPageController, " + err);
                        });
                }]
            },
            data:{
                breadcrumbRoot:false,
                displayName:'Jobs',
                module:moduleName,
                permissions:AccessConstants.UI_STATES.JOBS.permissions
            }
        });
    }  
}

const module = new ModuleFactory();
export default module;


