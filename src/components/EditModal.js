import React from 'react';
import { Button, Form, Input, Modal, ModalBody, ModalHeader, ModalFooter, Label } from 'reactstrap';
import FormErrors from './FormErrors';

const EditModal = ({ editTagsModal, toggleEditTagsModal, handleEditedValue, updateTags, editedTagsData, formErrors, formValid, errorClass }) => {
  return (
    <Modal isOpen={editTagsModal} toggle={toggleEditTagsModal}>
      <ModalHeader toggle={toggleEditTagsModal}>Edit tags</ModalHeader>
      <ModalBody>
        <Form>
          <div className="panel panel-default">
            <FormErrors formErrors={formErrors} />
          </div>
          <div className="form-group">
            <Label for="adc-tags">Tags</Label>
            <Input id="adc-tags" type="textarea" name="adc-tags" value={editedTagsData.value} onChange={handleEditedValue} className={`form-control ${errorClass(formErrors.tag)}`} placeholder="Add the tags" onKeyPress={updateTags}   />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="main-buttons" color="primary" onClick={updateTags} disabled={!formValid}>Save</Button>
        <Button className="main-buttons" color="danger" onClick={toggleEditTagsModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditModal;