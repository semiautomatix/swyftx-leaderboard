import React, { FunctionComponent } from 'react';
import { FirebaseAppProvider, useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';

const firebaseConfig = {
  apiKey: "",
  authDomain: "xxx.firebaseapp.com",
  databaseURL: "https://xxx.firebaseio.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "",
  appId: ""
};

const FireBaseComponent: FunctionComponent = (props: any) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SuspenseWithPerf fallback={<p>Loading...</p>} traceId={'loading-app-status'}>
        {props.children}
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  )
}

export default FireBaseComponent
