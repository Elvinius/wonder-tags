import React, {
    Component
} from 'react';
import TagButton from './TagButton';
import EditModal from './EditModal';
import {
    Button,
    Label,
    Form,
    Input
} from 'reactstrap';
import FormErrors from './FormErrors';
import HeadingJumbotron from './HeadingJumbotron';
import {
    FadeTransform
} from 'react-animation-components';
import { controlData, errorClass, validateAllowedCharacters } from '../utils.js';

class Tag extends Component {
    constructor(props) {
        super(props);
        //define state below
        this.state = {
            inputValue: "",
            tags: [],
            editTagsModal: false,
            formErrors: {
                tag: ''
            },
            tagValid: false,
            popoverOpen: false
        }
        //bind the functions to be able to refer to this
        this.handleChange = this.handleChange.bind(this);
        this.addTags = this.addTags.bind(this);
        this.editTagsToInput = this.editTagsToInput.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.toggleEditTagsModal = this.toggleEditTagsModal.bind(this);
        this.refreshTags = this.refreshTags.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
    }

    // Make sure that to set the state for the persistent tag buttons retrieved from localStorage API
    componentDidMount() {
       this.refreshTags();
    }

    //Function to handle the input value changes
    handleChange = (e) => {
        this.setState({
            inputValue: e.target.value
        }, () => {
            this.validateField(e.target.value)
        })
    }

    //The following function will show the current tags when you open the edit modal after clicking the edit button
    editTagsToInput = (tags) => {
        return tags.join();
    }
    //Function to validate the input values, takes single event target value and checks if it fits the requirements
    validateField(value) {
        let fieldValidationErrors = this.state.formErrors;
        fieldValidationErrors.tag = '';
        let tagValid = true;
        if (value.length === 0) {
            fieldValidationErrors.tag = 'The form can not be blank!';
            tagValid = false;
        }
        //array method every checks if for every input value matches allowed characters and tag validity is also dependent on the non-empty field.
        else if (value.length > 0 && !validateAllowedCharacters(value)) {
            fieldValidationErrors.tag = 'Tag is invalid';
            tagValid = false;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            tagValid: tagValid,
        });
    }

    //Add the tags after adding tags and clicking or pressing the Enter key
    addTags = (e) => {
        if (e.type === "click" || (e.which === 13 && !e.shiftKey)) {
            let {
                tags
            } = this.state;
            if (this.state.inputValue.length !== 0) {
                let newTags = controlData(this.state.inputValue);
                newTags.forEach(tag => tags.push(tag));
                //Use the spread operator and Set to create a unique array
                let uniqueTags = [...new Set(tags)];
                localStorage.setItem('myTags', JSON.stringify(uniqueTags));
                this.setState({
                    tags: uniqueTags,
                    inputValue: ""
                });
            }
        }
    }

    //Delete tags according to their key values. As the added numbers should all be unique keys are composed of those number values
    deleteTag = (key) => (e) => {
        let updatedTags = this.state.tags.filter(tag => tag !== key);
        this.setState({
            tags: updatedTags,
            inputValue: ""
        })
        localStorage.setItem('myTags', JSON.stringify(updatedTags));
        e.stopPropagation();
    }

    //Toggle edit modal with the help of the below function
    toggleEditTagsModal = () => {
        this.setState({
            editTagsModal: !this.state.editTagsModal,
            inputValue: ""
        });
    }
    
    //Close the edit modal after clicking the cancel button
    onEditCancel = () => {
        this.setState({
            editTagsModal: false
        });
    }

    //After adding the save button or pressing the Enter key save the changed button values and change the local storage accordingly 
    refreshTags = (e) => {
        let updatedTags = JSON.parse(localStorage.getItem('myTags')) !== null ? JSON.parse(localStorage.getItem('myTags')) : [];
        this.setState({
            tags: updatedTags,
            editTagsModal: false
        })
    }

    // to toggle popover button
    togglePopover = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        })
    }

    render() {
        return (
            <React.Fragment>
                <HeadingJumbotron togglePopover={this.togglePopover} popoverOpen={this.state.popoverOpen} />
                <div className="container tags-container">
                    <Form>
                        <div className="form-group">
                            <Label for="adc-tags"> Tags </Label>
                            {this.state.formErrors && <FormErrors formErrors={this.state.formErrors} />}
                            <Input id="adc-tags" type="textarea" className={`form-control ${errorClass(this.state.formErrors.tag)}`} name="adc-tags" value={this.state.inputValue} onChange={this.handleChange} onKeyPress = {this.addTags} placeholder="Add the tags"/>
                        </div>
                        <Button className="main-buttons" color="secondary" type="button" onClick={this.toggleEditTagsModal}>Edit</Button>
                        <Button className="main-buttons add-button" color="primary" type="button" onClick={this.addTags} disabled={!this.state.tagValid}>Add</Button>
                    </Form>
                    <hr className="break" />
                    {this.state.editTagsModal && (
                        <EditModal onSave={this.refreshTags} onCancel={this.onEditCancel} isOpen={this.state.editTagsModal} toggle={this.toggleEditTagsModal} />
                    )}
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
            </React.Fragment>
        )
    }

}

export default Tag;