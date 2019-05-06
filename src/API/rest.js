/* @flow */

// Instruments
import { MAIN_URI, TOKEN } from './config';

// Types
import { TaskModel } from '../types';

export const api = new class Api {
    async fetchTasks() {
        const response = await fetch(MAIN_URI, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });

        const {
            data: tasks,
        }: { data: Array<TaskModel> } = await response.json();

        if (response.status !== 200) {
            throw new Error('Tasks were not fetched.');
        }

        return tasks;
    }

    async createTask(newTaskMessage: string) {
        const response = await fetch(MAIN_URI, {
            method:  'POST',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: newTaskMessage }),
        });

        const { data: task }: { data: TaskModel } = await response.json();

        if (response.status !== 200) {
            throw new Error('Task was not created.');
        }

        return task;
    }

    async updateTask(updatedTask: TaskModel) {
        const response = await fetch(MAIN_URI, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([ updatedTask ]),
        });

        const {
            data: [ updatedTaskFromResponse ],
        }: {
            data: [TaskModel],
        } = await response.json();

        if (response.status !== 200) {
            throw new Error('Task was not updated.');
        }

        return updatedTaskFromResponse;
    }

    async removeTask(removedTaskId: string) {
        const response = await fetch(`${MAIN_URI}/${removedTaskId}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error('Task was not deleted.');
        }
    }

    async completeAllTasks(tasks: Array<TaskModel>) {
        const response = await fetch(MAIN_URI, {
            method:  'PUT',
            headers: {
                Authorization:  TOKEN,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tasks),
        });

        if (response.status !== 200) {
            throw new Error('Tasks was not completed.');
        }
    }
}();
