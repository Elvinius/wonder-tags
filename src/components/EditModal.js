import React from 'react';
import { Button, Form, Input, Modal, ModalBody, ModalHeader, ModalFooter, Label } from 'reactstrap';
import FormErrors from './FormErrors';

const EditModal = ({ editTagsModal, toggleEditTagsModal, editTags, updateTags, editedTagsData, formErrors, formValid, errorClass }) => {
  return (
    <Modal isOpen={editTagsModal} toggle={toggleEditTagsModal}>
      <ModalHeader toggle={toggleEditTagsModal}><h3>Edit tags</h3></ModalHeader>
      <ModalBody>
        <Form>
          <div className="panel panel-default">
            <FormErrors formErrors={formErrors} />
          </div>
          <div className="form-group">
            <Label for="adc-tags">Tags</Label>
            <Input id="adc-tags" type="textarea" name="adc-tags" value={editedTagsData} onChange={editTags} className={`form-control ${errorClass(formErrors.tag)}`} placeholder="Add the tags" required onKeyPress={editTags} />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button className="main-buttons" color="primary" onClick={updateTags} disabled={!formValid}>Save</Button>{' '}
        <Button className="main-buttons" color="danger" onClick={toggleEditTagsModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditModal;