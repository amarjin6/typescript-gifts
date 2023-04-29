import React from 'react';
import styled from 'styled-components';

interface Props {
    connected: boolean;
}

export const ConnectionStatus: React.FC<Props> = ({connected}) => {
    return (
        <>
            {connected ? (
                <Green>Connected to server.</Green>
            ) : (
                <Red>
                    Not connected to server. Any local changes will be overwritten after
                    connection.
                </Red>
            )}
        </>
    );
};

const Red = styled.div`
  color: red;
  margin-bottom: 30px;
  font-size: 22px;
  text-align: center;
`;

const Green = styled.div`
  color: green;
  margin-bottom: 30px;
  font-size: 22px;
  text-align: center;
`;
