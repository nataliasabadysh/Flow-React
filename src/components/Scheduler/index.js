/* @flow */

// Core
import React, { useState, useEffect } from 'react';
import Move from 'react-flip-move';

// Types
import type { TaskModel } from '../../types';

// Instruments
import Styles from './styles.module.css';
import { Checkbox } from '../Checkbox';
import { api } from '../../API';
import { sortTasksByGroup } from '../../instruments';

// Components
import { Task } from '../Task';
import { Spinner } from '../Spinner';

export const Scheduler = () => {
    const [ newTaskMessage, setNewTaskMessage ] = useState('');
    const [ tasksFilter, setTasksFilter ] = useState('');
    const [ isTasksFetching, setTasksFetching ] = useState(false);
    const [ tasks, setTasks ] = useState([]);

    const getAllCompleted = () => tasks.every((task) => task.completed);

    const fetchTasksAsync = async () => {
        try {
            setTasksFetching(true);

            const fetchedTasks = await api.fetchTasks();

            setTasks(fetchedTasks);
        } catch (error) {
            console.log(error.message);
        } finally {
            setTasksFetching(false);
        }
    };

    const createTaskAsync = async (event: SyntheticEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();
            if (!newTaskMessage.trim()) {
                return null;
            }
            setTasksFetching(true);
            const createdTask = await api.createTask(newTaskMessage);
            setTasks([ createdTask, ...tasks ]);
            setNewTaskMessage('');
        } catch (error) {
            console.log(error.message);
        } finally {
            setTasksFetching(false);
        }
    };

    const updateTaskAsync = async (updatedTask: TaskModel) => {
        try {
            setTasksFetching(true);
            const updatedTaskFromResponse = await api.updateTask(updatedTask);

            setTasks(
                tasks.map((task) => {
                    return task.id === updatedTaskFromResponse.id
                        ? updatedTaskFromResponse
                        : task;
                }),
            );
        } catch (error) {
            console.log(error.message);
        } finally {
            setTasksFetching(false);
        }
    };

    const removeTaskAsync = async (removedTaskId: string) => {
        try {
            setTasksFetching(true);
            await api.removeTask(removedTaskId);
            setTasks(tasks.filter((task) => task.id !== removedTaskId));
        } catch (error) {
            console.log(error.message);
        } finally {
            setTasksFetching(false);
        }
    };

    const completeAllTasksAsync = async () => {
        try {
            if (getAllCompleted()) {
                return null;
            }

            setTasksFetching(true);
            await api.completeAllTasks(tasks);
            setTasks(tasks.map((task) => ({ ...task, completed: true })));
        } catch (error) {
            console.log(error.message);
        } finally {
            setTasksFetching(false);
        }
    };

    const sortedTasks = sortTasksByGroup(
        tasks.filter((task) => task.message.toLowerCase().includes(tasksFilter)),
    );
    const tasksListJSX = sortedTasks.map((task) => (
        <div key = { task.id }>
            <Task
                removeTaskAsync = { removeTaskAsync }
                task = { task }
                updateTaskAsync = { updateTaskAsync }
            />
        </div>
    ));

    useEffect(() => {
        fetchTasksAsync();
    }, []);

    return (
        <section className = { Styles.scheduler }>
            <Spinner isSpinning = { isTasksFetching } />
            <main>
                <header>
                    <h1>Планировщик задач</h1>
                    <input
                        placeholder = 'Поиск'
                        type = 'text'
                        value = { tasksFilter }
                        onChange = { (event) => {
                            setTasksFilter(event.target.value.toLowerCase());
                        } }
                    />
                </header>
                <section>
                    <form onSubmit = { createTaskAsync }>
                        <input
                            className = { Styles.createTask }
                            maxLength = { 50 }
                            placeholder = 'Описaние моей новой задачи'
                            type = 'text'
                            value = { newTaskMessage }
                            onChange = { (event) => {
                                setNewTaskMessage(event.target.value);
                            } }
                        />
                        <button>Добавить задачу</button>
                    </form>
                    <div className = { Styles.overlay }>
                        <ul>
                            <Move
                                duration = { 400 }
                                easing = 'ease-in-out'>
                                {tasksListJSX}
                            </Move>
                        </ul>
                    </div>
                </section>
                <footer>
                    <Checkbox
                        color1 = '#363636'
                        color2 = '#fff'
                        isChecked = { getAllCompleted() }
                        onClick = { completeAllTasksAsync }
                    />
                    <span
                        className = { Styles.completeAllTasks }
                        onClick = { completeAllTasksAsync }>
                        Все задачи выполнены
                    </span>
                </footer>
            </main>
        </section>
    );
};
