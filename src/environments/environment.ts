// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
declare var require;

const file = '/environment/.env';

let env: any;

try {
  const customEnv: any = require('./.env');
  if (customEnv.environment) {
    env = customEnv.environment;
  } else {
    env = {};
    console.warn('Please export your config settings in as const environment');
  }
} catch (ex) {
  console.warn('Local .env does not exist');
  env = {};
}


const defaults = {
  production: false, // do not override this in your .env settings
  api_url: 'https://jdwebapi01.dominiondiagnostics.com/',
  env_name: 'development', // do not override this in your .env settings
  user_name: 'jdewar',
  password: '123connect?'
};



const environment = { ...defaults, ...env };

export { environment };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
