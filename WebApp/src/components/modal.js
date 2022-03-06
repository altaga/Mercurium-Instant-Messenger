/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';

const Modals = (props) => {
    const {
        className
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div style={{ textAlign: "center" }}>
            <img alt="subimage" onClick={toggle} src={props.message.file} style={{ maxWidth: "100%", borderRadius: "10px" }} />
            <Modal ref={React.createRef()} isOpen={modal} toggle={toggle} className={className} size="lg">
                <ModalBody style={{
                    textAlign: "center",
                }}>
                    <img src={props.message.file} alt={"Image" + props.index} style={{ maxHeight: "700px", maxWidth: "500px", height: "100%", width: "100%", borderRadius: "10px" }} />
                </ModalBody>
            </Modal>
        </div>
    );
}

export default Modals;