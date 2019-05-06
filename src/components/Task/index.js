/* @flow */

// Core
import React, { useState, useRef, useEffect } from 'react';
import cx from 'classnames';

// Types
import type { Props } from './types';

// Instruments
import Styles from './styles.module.css';

// Components
import { Checkbox } from '../Checkbox';
import { Remove } from '../Remove';
import { Edit } from '../Edit';
import { Star } from '../Star';

export const Task = (props: Props) => {
    const [ isTaskEditing, setTaskEditing ] = useState(false);
    const [ newMessage, setNewMessage ] = useState(props.task.message);

    const taskInput: { current: HTMLInputElement | null } = useRef(null);

    const updateTask = () => {
        if (props.task.message === newMessage) {
            setTaskEditing(false);

            return null;
        }

        props.updateTaskAsync({ ...props.task, message: newMessage });
        setTaskEditing(false);
    };

    const updateTaskMessageOnClick = () => {
        if (isTaskEditing) {
            updateTask();

            return null;
        }

        setTaskEditing(true);
    };

    const cancelUpdatingTaskMessage = () => {
        setNewMessage(props.task.message);
        setTaskEditing(false);
    };

    const updateTaskMessageOnKeyDown = (
        event: SyntheticKeyboardEvent<HTMLInputElement>,
    ) => {
        if (!newMessage.length) {
            return null;
        }

        switch (event.key) {
            case 'Enter': {
                updateTask();
                break;
            }

            case 'Escape': {
                cancelUpdatingTaskMessage();
                break;
            }

            default:
                break;
        }
    };

    const toggleTaskCompletedState = () => {
        const taskToUpdate = {
            ...props.task,
            completed: !props.task.completed,
        };

        props.updateTaskAsync(taskToUpdate);
    };

    const toggleTaskFavoriteState = () => {
        const taskToUpdate = { ...props.task, favorite: !props.task.favorite };

        props.updateTaskAsync(taskToUpdate);
    };

    const removeTask = () => props.removeTaskAsync(props.task.id);

    useEffect(() => {
        if (taskInput.current instanceof HTMLInputElement) {
            taskInput.current.focus();
        }
    }, [ isTaskEditing ]);

    const styles = cx(Styles.task, {
        [ Styles.completed ]: props.task.completed,
    });

    const currentMessage = isTaskEditing ? newMessage : props.task.message;

    return (
        <li className = { styles }>
            <div className = { Styles.content }>
                <Checkbox
                    inlineBlock
                    className = { Styles.toggleTaskCompletedState }
                    color1 = '#3B8EF3'
                    color2 = '#FFF'
                    isChecked = { props.task.completed }
                    onClick = { toggleTaskCompletedState }
                />
                <input
                    disabled = { !isTaskEditing }
                    maxLength = { 50 }
                    ref = { taskInput }
                    type = 'text'
                    value = { currentMessage }
                    onChange = { (event) => setNewMessage(event.target.value) }
                    onKeyDown = { updateTaskMessageOnKeyDown }
                />
            </div>
            <div className = { Styles.actions }>
                <Star
                    inlineBlock
                    className = { Styles.toggleTaskFavoriteState }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    color3 = '#808080'
                    isChecked = { props.task.favorite }
                    isDisabled = { props.task.completed }
                    onClick = { !props.task.completed && toggleTaskFavoriteState }
                />
                <Edit
                    inlineBlock
                    className = { Styles.updateTaskMessageOnClick }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    color3 = '#808080'
                    isChecked = { isTaskEditing }
                    isDisabled = { props.task.completed }
                    onClick = { !props.task.completed && updateTaskMessageOnClick }
                />
                <Remove
                    inlineBlock
                    className = { Styles.removeTask }
                    color1 = '#3B8EF3'
                    color2 = '#000'
                    onClick = { removeTask }
                />
            </div>
        </li>
    );
};
