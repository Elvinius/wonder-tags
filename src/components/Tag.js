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
            formValid: false,
            popoverOpen: false
        }
        //bind the functions to be able to refer to this
        this.handleChange = this.handleChange.bind(this);
        this.addTags = this.addTags.bind(this);
        this.editTagsToInput = this.editTagsToInput.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.toggleEditTagsModal = this.toggleEditTagsModal.bind(this);
        this.handleEditedValue = this.handleEditedValue.bind(this);
        this.refreshTags = this.refreshTags.bind(this);
        this.controlData = this.controlData.bind(this);
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
    //Similar to the handleChange and used for handling input value changes in the edit field
    handleEditedValue = (e) => {
        let {
            editedTagsData
        } = this.state;
        editedTagsData.value = e.target.value;
        this.setState({
            editedTagsData: editedTagsData
        },
            () => {
                this.validateField(e.target.value)
            })
    }
    //Function to validate the input values, takes single event target value and checks if it fits the requirements
    validateField(value) {
        let fieldValidationErrors = this.state.formErrors;
        fieldValidationErrors.tag = '';
        let tagValid = true;
        let allowedCharacters = /;|,|\n|[A-Za-z]|\d|\s|-/; //regex for allowed characters in the input field

        if (value.length === 0) {
            fieldValidationErrors.tag = 'The form can not be blank!';
            tagValid = false;
        }
        //array method every checks if for every input value matches allowed characters and tag validity is also dependent on the non-empty field.
        else if (value.length > 0 && !value.split("").every(v => allowedCharacters.test(v))) {
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
    //Add the tags after adding tags and clicking or pressing the Enter key
    addTags = (e) => {
        if (e.type === "submit" || (e.which === 13 && !e.shiftKey)) {
            let {
                tags
            } = this.state;
            if (this.state.inputValue.length !== 0) {
                let newTags = this.controlData(this.state.inputValue);
                newTags.forEach(tag => tags.push(tag));
                let uniqueTags = [...new Set(tags)]; //Use the spread operator and Set to create a unique array
                this.setState({
                    tags: uniqueTags,
                    inputValue: "",
                    editTagsModal: false
                    //Set the local storage before submitting the button
                }, localStorage.setItem('myTags', JSON.stringify(uniqueTags)));
            }
        }
        //e.preventDefault();
    }
    //implement filtering to prevent the unexpected behaviour of the JS
    filterValue = (value) => {
        return isNaN(value) === false && value !== "" && value !== "Infinity";
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

    //this function will take the input value and will return the filtered and trimmed value array
    controlData = (data) => {
        let reg = /\s*(?:;|,|\n|$)\s*/;
        let filteredTags = data.split(reg).filter(value => this.filterValue(value)).map(v => Number(v.trim()));
        return filteredTags;
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
                    <Form onSubmit={this.addTags}>
                        <div className="form-group">
                            <Label for="adc-tags"> Tags </Label>
                            {this.state.formErrors && <FormErrors formErrors={this.state.formErrors} />}
                            <Input type="submit" id="adc-tags" type="textarea" className={`form-control ${this.errorClass(this.state.formErrors.tag)}`} name="adc-tags" value={this.state.inputValue} onChange={this.handleChange} onKeyPress = {this.addTags} placeholder="Add the tags"/>
                        </div>
                        <Button className="main-buttons" color="secondary" type="button" onClick={this.toggleEditTagsModal}>Edit</Button>
                        <Button className="main-buttons add-button" color="primary" type="submit" disabled={!this.state.formValid}>Add</Button>
                    </Form>
                    <hr className="break" />
                    <EditModal onSave={this.refreshTags} onCancel={this.onEditCancel} isOpen={this.state.editTagsModal} toggle={this.toggleEditTagsModal} />
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