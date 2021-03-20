import React from 'react';
import { Button } from 'reactstrap';

const TagButton = ({ number, onRemove }) => {
    return (
        <Button className="tag-button" color={number < 0 ? "primary" : "danger"}><span onClick={onRemove(number)}><i className="fa fa-trash"></i></span></Button>
    )
}

export default TagButton;