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
            editedTagsData: {
                value: ''
            },
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
        this.deleteTag = this.deleteTag.bind(this);
        this.toggleEditTagsModal = this.toggleEditTagsModal.bind(this);
        this.handleEditedValue = this.handleEditedValue.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.controlData = this.controlData.bind(this);
        this.togglePopover = this.togglePopover.bind(this);
    }

    // Make sure that to set the state for the persistent tag buttons retrieved from localStorage API
    componentDidMount() {
        const myTags = JSON.parse(localStorage.getItem('myTags')) !== null ? JSON.parse(localStorage.getItem('myTags')) : [];
        this.setState({
            tags: myTags
        })
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
    editTags = (value) => {
        value = value.join();
        this.setState({
            editedTagsData: {
                value
            },
            editTagsModal: !this.state.editTagsModal
        })
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
        let tagValid = this.state.tagValid;
        let allowedCharacters = /;|,|\n|[A-Za-z]|\d|\s|-/; //regex for allowed characters in the input field
        tagValid = value.split("").every(v => allowedCharacters.test(v)) && value.length !== 0; //array method every checks if for every input value matches allowed characters and tag validity is also dependent on the non-empty field.
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
        if (e.type === "click" || e.key === "Enter") {
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
                })
            }
        }

    }
    //implement filtering to prevent the unexpected behaviour of the JS
    filterValue = (value) => {
        return isNaN(value) === false && value !== "" && value !== "Infinity";
    }

    //Set the local storage before submitting the button 
    handleSubmit = (e) => {
        let {
            tags
        } = this.state;
        localStorage.setItem('myTags', JSON.stringify(tags));
        e.preventDefault();
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
            editTagsModal: !this.state.editTagsModal
        });
    }

    //After adding the save button or pressing the Enter key save the changed button values and change the local storage accordingly 
    updateTags = (e) => {
        if (e.type === "click" || e.key === "Enter") {
            let {
                editedTagsData
            } = this.state;
            if (editedTagsData.value.length !== 0) {
                let uniqueTags = [...new Set(this.controlData(editedTagsData.value))];
                this.setState({
                    tags: uniqueTags,
                    editedTagsData: {
                        value: ''
                    },
                    editTagsModal: false
                })
                localStorage.setItem('myTags', JSON.stringify(uniqueTags));
            }
        }
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
                    <Form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <Label for="adc-tags"> Tags </Label>
                            {this.state.formErrors && <FormErrors formErrors={this.state.formErrors} />}
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
            </React.Fragment>
        )
    }

}

export default Tag;