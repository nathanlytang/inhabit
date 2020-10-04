import React from 'react';
import {
    StatusBar,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import TodoView from './TodoView';

function App() {
    return (
        <>
            {Platform.OS === 'ios' ?
                <>
                    <StatusBar barStyle='light-content' />
                    <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
                        <TodoView />
                    </KeyboardAvoidingView>
                </>
                :
                <>
                    <StatusBar barStyle='light-content' translucent backgroundColor='transparent' />
                    <TodoView />
                </>
            }
        </>
    );
};

export default App;
