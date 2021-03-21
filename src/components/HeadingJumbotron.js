import React from 'react';
import { Jumbotron, Button, Popover, PopoverBody } from 'reactstrap';
import {
  Fade, Stagger
} from 'react-animation-components';

const HeadingJumbotron = ({ togglePopover, popoverOpen }) => {
  return (
    <div>
      <Stagger in>
        <Jumbotron className="wonder-heading">
          <Fade in>
            <h1 className="display-4">Wonder Tags</h1>
            <p className="lead">This app enables you to create and edit tags by adding integer numbers in the below form.</p>
            <hr className="my-2" />
            <p>There are few important points to take into consideration before you create your own tags.</p>
            <p className="lead">
              <Button color="primary" id="Popover1">Learn More</Button>
            </p>
            <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={togglePopover}>
              <PopoverBody>Add only negative or positive integer numbers in the input field. Accepted delimeters between numbers are commas, semicolons, and new lines.</PopoverBody>
            </Popover>
          </Fade>
        </Jumbotron>
      </Stagger>
    </div>
  );
};

export default HeadingJumbotron;