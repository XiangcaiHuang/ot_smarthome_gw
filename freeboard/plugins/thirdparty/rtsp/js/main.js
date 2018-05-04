var app = angular.module("app", ['ui.router', 'ui.bootstrap']) //依赖模块
  .config(function ($stateProvider, ) {
    //$urlRouterProvider.when('','/page1');//$urlRouterProvider初始化跳转的状态，首先想展示哪一个页面
    $stateProvider /*
      .state("login", {
        url: "/login",
        component: "loginComponent"
      })
      .state("register", {
        url: "/register",
        component: "registerComponent"
      })
      .state("addNew", {
        url: "/new",
        component: "addNewComponent"
      })
      .state("list", {//定义状态，出发此状态，将会跳转templateurl页面
        url: "/list",//url:'/page1/:id',       //：id定义参数；定义方式三种 1./page1/：id/：name 2./page1/{id}/{name}/ 3./page1?id&name 在跳转页面用$stateParams接收
        component: "listComponent"
      })*/
      .state("player", {
        url: "/",
        component: "playerComponent",
        params: {rtspUrl: "rtsp://184.72.239.149/vod/mp4://BigBuckBunny_175k.mov"}
      })
  })
