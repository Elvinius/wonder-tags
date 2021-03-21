import React, { Component } from 'react';
import { Button, Form, Input, Modal, ModalBody, ModalHeader, ModalFooter, Label } from 'reactstrap';
import FormErrors from './FormErrors';
import {controlData, errorClass, validateAllowedCharacters} from '../utils.js';

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      formErrors: {
        tag: ''
      },
      tagValid: false

    }
    this.handleChange = this.handleChange.bind(this);
  }

//refresh the storage after mounting the component
componentDidMount() {
  let tags = JSON.parse(localStorage.getItem('myTags')) !== null ? JSON.parse(localStorage.getItem('myTags')) : [];
  this.setState({
    inputValue: tags.join()
      });
 }

//change the input value according to the target value
handleChange = (e) => {
  this.setState({
      inputValue: e.target.value
  },
      () => {
          this.validateInput(e.target.value)
      })
}

//this function updates the tags either after clicking or pressing enter
updateTags = (e) => {
  if (e.type === "click" || (e.which === 13 && !e.shiftKey)) { 
      let { inputValue } = this.state;
      let changedTags = controlData(inputValue);
      let uniqueTags = [...new Set(changedTags)]; //Use the spread operator and Set to create a unique array
      localStorage.setItem('myTags', JSON.stringify(uniqueTags));
      this.props.onSave();
  }
}

//validate the input value
validateInput(value) {
  let fieldValidationErrors = this.state.formErrors;
  fieldValidationErrors.tag = '';
  let tagValid = true;
  //array method every checks if for every input value matches allowed characters and tag validity is also dependent on the non-empty field.
  if (value.length > 0 && !validateAllowedCharacters(value)) {
      fieldValidationErrors.tag = 'Tag is invalid';
      tagValid = false;
  }
  this.setState({
      formErrors: fieldValidationErrors,
      tagValid: tagValid,
  });
}

  render () {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>Edit tags</ModalHeader>
        <ModalBody>
          <Form>
            <div className="form-group"> 
              <Label for="adc-tags"> Tags </Label>
              {this.state.formErrors && <FormErrors formErrors={this.state.formErrors} /> }
              <Input id="adc-tags" type="textarea" name="adc-tags" value={this.state.inputValue} onChange={this.handleChange} className={`form-control ${errorClass(this.state.formErrors.tag)}`} placeholder="Add the tags" onKeyPress={this.updateTags}   />
            </div>
            <Button className="main-buttons" color="primary" onClick = {this.updateTags} disabled={!this.state.tagValid}>Save</Button>
            <Button className="main-buttons" color="danger" onClick={this.props.onCancel}>Cancel</Button>
          </Form>
        </ModalBody>
      </Modal>
    )
  }
}

export default EditModal;