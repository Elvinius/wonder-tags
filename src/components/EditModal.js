import React, { Component } from 'react';
import { Button, Form, Input, Modal, ModalBody, ModalHeader, ModalFooter, Label } from 'reactstrap';
import FormErrors from './FormErrors';

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      formErrors: {
        tag: ''
      },
      formValid: false,
      tagValid: false

    }
    this.handleChange = this.handleChange.bind(this);
    this.errorClass = this.errorClass.bind(this);
  }

  componentDidMount() {
    let tags = JSON.parse(localStorage.getItem('myTags')) !== null ? JSON.parse(localStorage.getItem('myTags')) : [];
        this.setState({
          inputValue: tags.join()
            })
 }

  handleChange = (e) => {
    this.setState({
        inputValue: e.target.value
    },
        () => {
            this.validateInput(e.target.value)
        })
}

updateTags = (e) => {
  if (e.type === "click" || e.key === "Enter") { 
      let { inputValue } = this.state;
      let changedTags = this.controlData(inputValue);
      let uniqueTags = [...new Set(changedTags)]; //Use the spread operator and Set to create a unique array
      localStorage.setItem('myTags', JSON.stringify(uniqueTags));
      this.props.onSave();
  }
}

  //this function will take the input value and will return the filtered and trimmed value array
  controlData = (data) => {
    let reg = /\s*(?:;|,|\n|$)\s*/;
    let filteredTags = data.split(reg).filter(value => this.filterValue(value)).map(v => Number(v.trim()));
    return filteredTags;
}

//implement filtering to prevent the unexpected behaviour of the JS
filterValue = (value) => {
  return isNaN(value) === false && value !== "" && value !== "Infinity";
}

validateInput(value) {
  let fieldValidationErrors = this.state.formErrors;
  fieldValidationErrors.tag = '';
  let tagValid = true;
  let allowedCharacters = /;|,|\n|[A-Za-z]|\d|\s|-/; //regex for allowed characters in the input field

  //array method every checks if for every input value matches allowed characters and tag validity is also dependent on the non-empty field.
  if (value.length > 0 && !value.split("").every(v => allowedCharacters.test(v))) {
      fieldValidationErrors.tag = 'Tag is invalid';
      tagValid = false;
  }
  this.setState({
      formErrors: fieldValidationErrors,
      tagValid: tagValid,
  }, this.validateForm);
}
//Decide the form validity according to the validity of the tags
validateForm() {
  this.setState({
      formValid: this.state.tagValid
  });
}
//Apply bootstrap classes depending on the existence of the errors
errorClass(error) {
  return (error.length === 0 ? 'is-valid' : 'is-invalid');
}
  render () {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle}>Edit tags</ModalHeader>
        <ModalBody>
          <Form>
            <div className="form-group"> 
              <Label for="adc-tags"> Tags </Label>
              {this.state.formErrors && <FormErrors formErrors={this.state.formErrors} /> }
              <Input id="adc-tags" type="textarea" name="adc-tags" value={this.state.inputValue} onChange={this.handleChange} className={`form-control ${this.errorClass(this.state.formErrors.tag)}`} placeholder="Add the tags" onKeyPress={this.updateTags}   />
            </div>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button className="main-buttons" color="primary" onClick={this.updateTags} disabled={!this.state.formValid}>Save</Button>
          <Button className="main-buttons" color="danger" onClick={this.props.onCancel}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default EditModal;