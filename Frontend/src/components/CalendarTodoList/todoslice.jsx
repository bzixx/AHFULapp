import { createSlice } from "@reduxjs/toolkit";

export const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        value: [{
            text: 'Go to the store',
            isCompleted: true,
        }, {
            text: 'New Todo',
            isCompleted: false, 
        }],
    },
    reducers: {
        createTodo: (state, action) => {
            state.value = [...state.value, {
                text: action.payload,
                isCompleted: false,
            }];
        },
        markAsComplete: (state, action) => {
            const text = action.payload;
            const todo = state.value.find(t => t.text === text);
            todo.isCompleted = true;
        },
        deleteTodo: (state, action) => {
            const text = action.payload;
            state.value = state.value.filter(t => t.text !== text);
        },
    }
})

export const { createTodo, markAsComplete, deleteTodo } = todoSlice.actions;