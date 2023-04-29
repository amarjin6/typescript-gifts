import styled from 'styled-components';
import React, {memo} from 'react';
import {Task} from '../../models/TodoList';

interface Props {
    task: Task;
    toggleTaskComplete: (id: number) => void;
    deleteTask: (id: number) => void;
}

export const TodoItem: React.FC<Props> = memo(
    ({task, toggleTaskComplete, deleteTask}) => {
        return (
            <StyledRow>
                <StyledTodoItemWithCheckbox>
                    <input
                        id={String(task.id)}
                        type='checkbox'
                        checked={task.isDone}
                        onChange={() => toggleTaskComplete(task.id)}
                    />
                    {task.isDone ? (
                        <StyledStrikeOut>{task.name}</StyledStrikeOut>
                    ) : (
                        task.name
                    )}
                    <br/>
                    {task.status}
                    <br/>
                    {task.date}
                </StyledTodoItemWithCheckbox>
                <button type='button' onClick={() => deleteTask(task.id)}>
                    Delete
                </button>
            </StyledRow>
        );
    }
);

const StyledStrikeOut = styled.span`
  text-decoration: line-through;
`;

const StyledTodoItemWithCheckbox = styled.div`
  display: flex;
  column-gap: 10px;
  min-width: 300px;
  max-width: 300px;
  overflow-wrap: anywhere;
`;
const StyledRow = styled.div`
  display: flex;
  column-gap: 10px;
  padding: 5px 0;
`;
