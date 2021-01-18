import 'react-native-get-random-values'
import React, { useState, useEffect, useRef } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    ImageBackground,
    FlatList,
    TextInput,
    Animated,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import { v1 as uuidv1 } from 'uuid';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
        isMountRef.current = false;
    }, []);
    return isMountRef.current;
};

function TodoView() {
    const [finshedLoading, setFinishedLoading] = useState(false);
    const [todoData, setTodoData] = useState([]);
    const [inputText, setInputText] = useState();
    const [pressed, setPressed] = useState(true);
    const isMount = useIsMount();

    const getFromStorage = () => {
        try {
            AsyncStorage.getItem('@todo_list')
                .then((jsonValue) => {
                    if (jsonValue !== null) {
                        const data = JSON.parse(jsonValue);
                        var newArray = []
                        for (i in data.items) {
                            newArray.push({ id: data.items[i].id, task: data.items[i].task, completed: data.items[i].completed });
                        }
                        setTodoData(newArray);
                    }
                    setFinishedLoading(true);
                });
        } catch (e) {
            console.error(e);
        }
    }

    const saveToStorage = () => {
        var json = {};
        var items = json['items'] = [];

        for (i = 0; i < todoData.length; i++) {
            var nestedData = {};
            nestedData['id'] = todoData[i].id;
            nestedData['task'] = todoData[i].task;
            nestedData['completed'] = todoData[i].completed;
            items.push(nestedData);
        }

        try {
            AsyncStorage.setItem('@todo_list', JSON.stringify(json));
        } catch (e) {
            console.error(e);
        }
    }

    const removeItem = (index) => {
        var newArray = [...todoData];
        newArray.splice(index, 1);
        setTodoData(newArray);
        setPressed(!pressed);
    }

    const renderRightActions = (progress, dragX, index) => {
        const trans = dragX.interpolate({
            inputRange: [-150, 150],
            outputRange: [0, 300],
        });

        const deleteAction = {
            transform: [{ translateX: trans }],
            backgroundColor: 'red',
            justifyContent: 'center',
            width: 150,
            flex: 1,
        };

        return (
            <RectButton onPress={() => {
                removeItem(index);
            }}>
                <Animated.View style={deleteAction}>
                    <Text style={styles.deleteText}>Delete</Text>
                </Animated.View>
            </RectButton>
        );
    }

    useEffect(() => getFromStorage(), []);
    useEffect(() => { if (!isMount) saveToStorage(); }, [pressed]);

    return (
        <>
            <View style={styles.titleView}>
                <ImageBackground source={require('./beach.png')} style={styles.image}>
                    <Text style={styles.titleText}>To Do</Text>
                </ImageBackground>
            </View>
            <SafeAreaView style={styles.screen}>
                {finshedLoading &&
                    <FlatList
                        data={todoData}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => (
                            <>
                                <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, index)} friction={2}>
                                    <View style={styles.todoItem}>
                                        <CheckBox
                                            value={item.completed}
                                            onValueChange={() => {
                                                var newArray = [...todoData];
                                                newArray[index].completed = !item.completed;
                                                setTodoData(newArray);
                                                setPressed(!pressed);
                                            }} />
                                        <Text style={item.completed ? styles.todoItemCompleted : styles.todoItemText}>{item.task}</Text>
                                    </View>
                                </Swipeable>

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
                                            setTodoData([...todoData, { id: uuidv1(), task: inputText, completed: false }]);
                                            setInputText('');
                                            setPressed(!pressed);
                                        }} />
                                </View>
                            </>
                        }
                        ListFooterComponentStyle={styles.inputView}
                        ListEmptyComponent={
                            <>
                                <View style={styles.emptyView}>
                                    <Text style={styles.emptyText}>Nothing to do! 🎉</Text>
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