/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import People from './components/People';
import { SQLiteContext, useSQLiteHelper } from './helpers';

function App() {
    const sqlite = useSQLiteHelper({
        name: 'test.db',
        aliasName: 'abc.db',
    });

    return (
        <SQLiteContext.Provider value={sqlite}>
            <People/>
        </SQLiteContext.Provider>
    );
};

export default App;