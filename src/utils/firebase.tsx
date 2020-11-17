import React, { FunctionComponent } from 'react';
import { FirebaseAppProvider, useFirestoreDocData, useFirestore, SuspenseWithPerf } from 'reactfire';

const firebaseConfig = {
  apiKey: "AIzaSyASyhevburrwiH7IVFk92Cm1Ne2V1Im-Sw",
  authDomain: "swyftx-leaderboard.firebaseapp.com",
  databaseURL: "https://swyftx-leaderboard.firebaseio.com",
  projectId: "swyftx-leaderboard",
  storageBucket: "swyftx-leaderboard.appspot.com",
  messagingSenderId: "664923141711",
  appId: "1:664923141711:web:0862fc1f9235944ae9dc3a"
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
