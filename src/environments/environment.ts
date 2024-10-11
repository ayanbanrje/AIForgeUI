// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  REGION: '',
  URL: 'http://20.219.19.89:8000/',
  BACKENDSERVICE: 'api/nodes',

  tests: 'https://e8zdlsc6h9.execute-api.ap-south-1.amazonaws.com/prod/',
  fleets: 'https://vzt42hc1f1.execute-api.ap-south-1.amazonaws.com/prod/',
  vehicles: 'https://xujoqlyv1h.execute-api.ap-south-1.amazonaws.com/prod/',
  tyres: 'https://6wgkyav4td.execute-api.ap-south-1.amazonaws.com/prod/',
  reports: 'https://tc1ywd6y47.execute-api.ap-south-1.amazonaws.com/dev',
  googleMapsApiKey: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
