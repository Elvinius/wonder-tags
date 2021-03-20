import React, { Component } from 'react';
import TagButton from './TagButton';
import EditModal from './EditModal';
import { Button, Label, Form, Input } from 'reactstrap';
import FormErrors from './FormErrors';
import { FadeTransform } from 'react-animation-components';

class Tag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: "",
            tags: [],
            editTagsModal: false,
            editedTagsData: {
                value: ''
            },
            formErrors: { tag: '' },
            tagValid: false,
            formValid: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.addTags = this.addTags.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.toggleEditTagsModal = this.toggleEditTagsModal.bind(this);
        this.handleEditedValue = this.handleEditedValue.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.controlData = this.controlData.bind(this);
    }

    componentDidMount() {
        const myTags = JSON.parse(localStorage.getItem('myTags')) !== null ? JSON.parse(localStorage.getItem('myTags')) : [];
        this.setState({
            tags: myTags
        })
    }

    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        }, () => { this.validateField(e.target.value) })
    }

    editTags = (value) => {
        value = value.join();
        this.setState(
            {
                editedTagsData: {value},
                editTagsModal: !this.state.editTagsModal
        })
    }

    handleEditedValue = (e) => {
        let {editedTagsData} = this.state;
        editedTagsData.value = e.target.value;
        console.log(editedTagsData.value);
        this.setState({ editedTagsData: editedTagsData  },
            () => { this.validateField(e.target.value) })
      }

    validateField(value) {
        let fieldValidationErrors = this.state.formErrors;
        let tagValid = this.state.tagValid;
        let allowedCharacters = /;|,|\n|[A-Za-z]|\d|\s|-/;
        tagValid = value.split("").every(v => allowedCharacters.test(v)) && value.length !== 0;
        if (tagValid) {
            fieldValidationErrors.tag = '';
        } else {
            if (value.length === 0) {
                fieldValidationErrors.tag = 'The form can not be blank!';
            } else {
                fieldValidationErrors.tag = 'Tag is invalid';
            }
        }
        this.setState({
            formErrors: fieldValidationErrors,
            tagValid: tagValid,
        }, this.validateForm);
    }

    validateForm() {
        this.setState({ formValid: this.state.tagValid });
    }

    errorClass(error) {
        return (error.length === 0 ? 'is-valid' : 'is-invalid');
    }

    addTags = (e) => {
        if (e.type === "click" || e.key === "Enter") {
            let { tags } = this.state;
            if (this.state.inputValue.length !== 0) {
                let newTags = this.controlData(this.state.inputValue);
                newTags.forEach(tag => tags.push(tag));
                let uniqueTags = [...new Set(tags)];
                this.setState({
                    tags: uniqueTags,
                    inputValue: "",
                    editTagsModal: false
                })
            }
        }

    }
    filterValue = (value) => {
        return isNaN(value) === false && value !== "" && value !== "Infinity";
    }

    handleSubmit = (e) => {
        let { tags } = this.state;
        localStorage.setItem('myTags', JSON.stringify(tags));
        e.preventDefault();
    }  

    deleteTag = (key) => (e) => {
        console.log(e);
        console.log(key);
        let updatedTags = this.state.tags.filter(tag => tag !== key);
        this.setState({
            tags: updatedTags,
            inputValue: ""
        })
        localStorage.setItem('myTags', JSON.stringify(updatedTags));
        e.stopPropagation();
    }

    toggleEditTagsModal = () => {
        this.setState({
            editTagsModal: !this.state.editTagsModal
        });
    }

    updateTags = (e) => {
        if (e.type === "click" || e.key === "Enter") {
            let { editedTagsData } = this.state;
            if (editedTagsData.value.length !== 0) {
                let uniqueTags = [...new Set(this.controlData(editedTagsData.value))];
                this.setState({
                    tags: uniqueTags,
                    editedTagsData: {value: ''},
                    editTagsModal: false
                })
                localStorage.setItem('myTags', JSON.stringify(uniqueTags));
            }
        }
    }

    controlData = (data) => {
        let reg = /\s*(?:;|,|\n|$)\s*/;
        let filteredTags = data.split(reg).filter(value => this.filterValue(value)).map(v => Number(v.trim()));
        return filteredTags;
    }

    render() {
        return (
            <div className="container tags-container">
                <Form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <Label for="adc-tags"> Tags </Label>
                        {this.state.formErrors && <FormErrors formErrors={this.state.formErrors} /> }
                        <Input id="adc-tags" type="textarea" className={`form-control ${this.errorClass(this.state.formErrors.tag)}`} name="adc-tags" value={this.state.inputValue} onChange={this.handleChange} placeholder="Add the tags" onKeyPress={this.addTags} />
                    </div>
                    <Button className="main-buttons" color="secondary" onClick={this.editTags.bind(this, [...this.state.tags])} type="submit">Edit</Button>
                    <Button className="main-buttons add-button" color="primary" onClick={this.addTags} type="submit" disabled={!this.state.formValid}>Add</Button>
                </Form>
                <hr className="break" />
                <EditModal editTagsModal={this.state.editTagsModal} toggleEditTagsModal={this.toggleEditTagsModal} handleEditedValue={this.handleEditedValue} editedTagsData={this.state.editedTagsData} updateTags={this.updateTags} formValid={this.state.formValid} formErrors={this.state.formErrors} errorClass={this.errorClass} />
                <div className="tags-box">
                    <ul>
                        {this.state.tags.map(number => {
                            return (<li key={number} >
                                <FadeTransform in transformProps={{
                                    exitTransform: 'scale(0.5) translateY(-50%)'
                                }}>
                                    <TagButton number={number} onRemove={this.deleteTag} />
                                </FadeTransform>
                            </li>);
                        })}
                    </ul>
                </div>
            </div>
        )
    }

}

export default Tag;