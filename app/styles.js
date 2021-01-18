import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    screen: {
        flex: 3,
    },
    titleView: {
        flex: 1,
    },
    titleText: {
        fontSize: 60,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : null,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: 'white',
    },
    image: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    todoList: {
        flex: 1,
    },
    todoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    todoItemText: {
        fontSize: 25,
        margin: 10,
        flex: 1,
    },
    todoItemCompleted: {
        fontSize: 25,
        margin: 10,
        flex: 1,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    emptyView: {
        flex: 5,
        justifyContent: 'center',
    },
    emptyText: {
        fontFamily: 'sans-serif-thin',
        textAlign: 'center',
        fontSize: 40,
        color: 'black',
        opacity: 0.6,
    },
    inputView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    inputText: {
        fontSize: 25,
        margin: 10,
    },
    deleteText: {
        fontSize: 25,
        color: 'white',
        fontWeight: '500',
        textAlign: 'center'
    },
});

export default styles;