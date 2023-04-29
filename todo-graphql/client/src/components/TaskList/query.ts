import {gql} from '@apollo/client';

export const QUERY_LAUNCH_LIST = gql`
    query GetAllTasks {
        tasks {
            id
            title
            description
            completed
            dueDate
        }
    }
`;