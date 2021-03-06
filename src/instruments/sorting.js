/* @flow */

// Core
import moment from 'moment';

// Types
import type { TaskModel } from '../types';

export const sortTasksByDate = (tasks: Array<TaskModel>): Array<TaskModel> => {
    return tasks.sort((task1, task2) => {
        if (moment(task1.created).unix() < moment(task2.created).unix()) {
            return 1;
        } else if (
            moment(task1.created).unix() > moment(task2.created).unix()
        ) {
            return -1;
        }

        return 0;
    });
};

export const sortTasksByGroup = (tasks: Array<TaskModel>): Array<TaskModel> => {
    const favorite = tasks.filter((task) => task.favorite && !task.completed);
    const usual = tasks.filter((task) => !task.favorite && !task.completed);
    const completed = sortTasksByDate(tasks.filter((task) => task.completed));

    const sortedCompleted = [
        ...completed.sort((task1, task2) => {
            if (task1.favorite && !task2.favorite) {
                return -1;
            } else if (!task1.favorite && task2.favorite) {
                return 1;
            }

            return 0;
        }),
    ];

    return [
        ...sortTasksByDate(favorite),
        ...sortTasksByDate(usual),
        ...sortedCompleted,
    ];
};
