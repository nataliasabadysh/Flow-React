/* @flow */

// Types
import type { TaskModel } from '../../types';

export type Props = {
    task: TaskModel,
    removeTaskAsync: Function,
    updateTaskAsync: Function,
};
