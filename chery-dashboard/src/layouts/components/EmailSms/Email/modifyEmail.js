import React, { useState } from 'react'

import ModifyEmailModalForm from './modifyEmailModalForm';
import { updateMail } from '../../../../api/EmailSMS';


const ModifyEmail = (props) => {

    const [visible, setVisible] = useState(true);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (content, emaildata) => {

        const data = {
            description: content.description,
            "deleted_at": null
        }

        await updateMail(emaildata._id, data).then(() => {
            setVisible(false)
            props.refreshAfterUpdateEmail()
            setTimeout(() => {
                props.modalState()
            }, 500);
        })

    };

    const handleCancel = e => {
        setVisible(false)
        setTimeout(() => {
            props.modalState()
        }, 500);
    };

    return (
        <div>
            <ModifyEmailModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                data={props.data}
            />
        </div>
    );
}

export default ModifyEmail;