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
            editedTagsData: [],
            formErrors: { tag: '' },
            tagValid: false,
            formValid: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.addTags = this.addTags.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.toggleEditTagsModal = this.toggleEditTagsModal.bind(this);
        this.editTags = this.editTags.bind(this);
        this.updateTags = this.updateTags.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    // componentDidMount() {
    //     const myTags = JSON.parse(localStorage.getItem('myTags')) !== null ? JSON.parse(localStorage.getItem('myTags')) : [];
    //     console.log("this is stored tags " + myTags);
    //     this.setState({
    //         tags: myTags
    //     })
    // }

    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        }, () => { this.validateField(e.target.value) })
    }

    validateField(value) {
        let fieldValidationErrors = this.state.formErrors;
        let tagValid = this.state.tagValid;
        let allowedCharacters = /;|,|\n|[A-Za-z]|\d|\s|-/;
        tagValid = value.split("").every(v => allowedCharacters.test(v)) && value.length !== 0;
        if(tagValid) {
            fieldValidationErrors.tag ='';
        } else {
            if(value.length === 0) {
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
                let reg = /\s*(?:;|,|\n|$)\s*/;
                let newTags = this.state.inputValue.split(reg).filter(value => this.filterValue(value)).map(v => Number(v.trim()));
                newTags.forEach(tag => tags.push(tag));
                let uniqueTags = [...new Set(tags)];
                this.setState({
                    tags: uniqueTags,
                    inputValue: ""
                })
            }
        }

    }
    filterValue = (value) => {
        return isNaN(value) === false && value !== "" && value !== "Infinity";
    }

    // handleSubmit = (e) => {
    //     let { tags } = this.state;
    //     localStorage.setItem('myTags', JSON.stringify(tags));
    //     e.preventDefault();
    // }

    editTags = (e) => {
        this.setState({
            editedTagsData: e.target.value
        }, () => { this.validateField(e.target.value)})
    }

    deleteTag = (key) => (e) => {
        console.log(e);
        console.log(key);
        let updatedTags = this.state.tags.filter(tag => tag !== key);
        this.setState({
            tags: updatedTags,
            inputValue: ""
        })
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
            if (editedTagsData.length !== 0) {
                let reg = /\s*(?:;|,|\n|$)\s*/;
                let editedTags = editedTagsData.split(reg).filter(value => isNaN(value) === false).map(v => Number(v.trim()));
                let uniqueTags = [...new Set(editedTags)];
                this.setState({
                    tags: uniqueTags,
                    editedTagData: [],
                    editTagsModal: false
                })
            }
        }
    }

    render() {
        return (
            <div className="container tags-container">
                <Form onSubmit={this.handleSubmit}>
                    <div className="panel panel-default">
                        <FormErrors formErrors={this.state.formErrors} />
                    </div>
                    <div className="form-group">
                        <Label for="adc-tags">Tags</Label>
                        <Input id="adc-tags" type="textarea" className={`form-control ${this.errorClass(this.state.formErrors.tag)}`} name="adc-tags" value={this.state.inputValue} onChange={this.handleChange} placeholder="Add the tags" required onKeyPress={this.addTags} />
                    </div>
                    <Button className="main-buttons" color="secondary" onClick={this.toggleEditTagsModal} type="submit">Edit</Button>
                    <Button className="main-buttons add-button" color="primary" onClick={this.addTags} type="submit" disabled={!this.state.formValid}>Add</Button>    
                </Form>
                <hr className="break"/>
                <EditModal editTagsModal={this.state.editTagsModal} toggleEditTagsModal={this.toggleEditTagsModal} editTags={this.editTags} editedTagsData={this.state.tags} updateTags={this.updateTags} formValid={this.state.formValid} formErrors={this.state.formErrors} errorClass={this.errorClass}/>
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