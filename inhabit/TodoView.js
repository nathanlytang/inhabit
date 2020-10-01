import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ImageBackground,
    FlatList,
    TextInput,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';

function TodoView() {
    const [finshedLoading, setFinishedLoading] = useState(false);
    const [todoData, setTodoData] = useState([]);
    const [inputText, setInputText] = useState();

    if (!finshedLoading) {
        try {
            AsyncStorage.getItem('@todo_list')
                .then((jsonValue) => {
                    console.log(jsonValue);
                    if (jsonValue !== null) {
                        const data = JSON.parse(jsonValue);
                        for (i in data.items) {
                            setTodoData([...todoData, { key: data.items[i].key, completed: data.items[i].completed }]);
                        }
                    }
                    setFinishedLoading(true);
                });
        } catch (e) {
            console.log(e);
        }
    }

    const saveToStorage = () => {
        var json = {};
        var items = json['items'] = [];

        for (i = 0; i < todoData.length; i++) {
            var nestedData = {};
            nestedData['key'] = todoData[i].key;
            nestedData['completed'] = todoData[i].completed;
            items.push(nestedData);
        }

        try {
            AsyncStorage.setItem('@todo_list', JSON.stringify(json));
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => saveToStorage(), [JSON.stringify(todoData)]);

    return (
        <>
            <View style={styles.titleView}>
                <ImageBackground source={require('./beach.png')} style={styles.image}>
                    <Text style={styles.titleText}>inhabit</Text>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.screen}>
                {finshedLoading &&
                    <FlatList
                        data={todoData}
                        renderItem={({ item, index }) => (
                            <>
                                <View style={styles.todoItem}>
                                    <CheckBox
                                        value={item.completed}
                                        onValueChange={() => {
                                            var newArray = [...todoData];
                                            newArray[index].completed = !item.completed;
                                            setTodoData(newArray);
                                        }} />
                                    <Text style={item.completed ? styles.todoItemCompleted : styles.todoItemText}>{item.key}</Text>
                                </View>
                            </>
                        )}
                        contentContainerStyle={todoData.length === 0 ? styles.todoList : null}
                        ListFooterComponent={
                            <>
                                <View style={null}>
                                    <TextInput
                                        placeholder='Let&apos;s add something to do...'
                                        style={styles.inputText}
                                        enablesReturnKeyAutomatically={true}
                                        returnKeyType={'done'}
                                        onChangeText={(value) => setInputText(value)}
                                        value={inputText}
                                        onSubmitEditing={() => {
                                            setTodoData([...todoData, { key: inputText, completed: false }]);
                                            setInputText('');
                                        }} />
                                </View>
                            </>
                        }
                        ListFooterComponentStyle={styles.inputView}
                        ListEmptyComponent={
                            <>
                                <View style={styles.emptyView}>
                                    <Text style={styles.emptyText}>Nothing to do! Hooray 🎉🎉</Text>
                                </View>
                            </>
                        }
                    />
                }
            </SafeAreaView>
        </>
    )
}

export default TodoView;