import React, { useState } from 'react'

import ModifyConseillerModalForm from './modifyConseillerFormModal';
import { updateUser } from '../../../api/conseillers';
import { getConnectedUser } from '../../../helpers/userdata';


const ModifyConseiller = (props) => {

    const [visible, setVisible] = useState(true);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (new_values) => {


        const newOne = {
            ...new_values,
            "role": props.data.role,
            "password": props.data.password,
        }
        console.log(newOne);

        await updateUser(newOne, props.data._id).then(() => {
            setVisible(false)
            props.refreshAfterUpdateConseiller()
            setTimeout(() => {
                props.modalState()
            }, 500);
        })
            .catch(err => console.log(err))

    };

    const handleCancel = e => {
        setVisible(false)
        setTimeout(() => {
            props.modalState()
        }, 500);
    };

    return (
        <div>
            <ModifyConseillerModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                data={props.data}
            />
        </div>
    );
}

export default ModifyConseiller;