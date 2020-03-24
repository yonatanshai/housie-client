import React from 'react';

const Table = (headers, body, ...props) => {
    return (
        <table className={props.className}>
            <thead>
                {headers.map(header => <th>{header}</th>)}
            </thead>
            <tbody>
                {body}
            </tbody>
        </table>
    )
};

export default Table;