// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl  : '',
  //baseUrl :'http://192.168.1.23:4001',
  baseUrl :'http://93.174.125.40:4000',
  firebaseConfig: {
    apiKey: "AIzaSyDFDKitQ58rrmQqUSCVJw5CoEEbxeDJRpM",
    authDomain: "clubloyalty-abd8b.firebaseapp.com",
    projectId: "clubloyalty-abd8b",
    storageBucket: "clubloyalty-abd8b.appspot.com",
    messagingSenderId: "97317602521",
    appId: "1:97317602521:web:b8aa49437719e78839aac8",
    measurementId: "G-WGQDDP9DJ1"
  }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
