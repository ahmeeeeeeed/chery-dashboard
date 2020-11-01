import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

//import { getConnectedUser } from '../../../helpers/userdata'
import AddConseillerModalForm from './addConseillerFormModal';
import { register } from '../../../api/conseillers';
import { getConnectedUser } from '../../../helpers/userdata';
//import AddConseillerModalForm from './testForm';


const AddConseiller = ({ refreshAfterAddConseiller }) => {

    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (values) => {


        console.log(values)
        const conseiller = {
            "username": values.username,
            "role": "conseiller",
            "email": values.email,
            "password": values.password,
            "deleted_at": null,
            "grants": []
        }

        await register(conseiller).then(() => {
            setVisible(false)
            refreshAfterAddConseiller()
        })
            .catch(err => console.log(err))

    };

    const handleCancel = e => {
        setVisible(false)
    };

    return (
        <div>
            <AddConseillerModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
            />

            <Tooltip title="Ajouter un conseiller" >
                <Button className="add-button-shadow"
                    style={{ position: 'fixed', bottom: 40, right: 40, borderWidth: 0, backgroundColor: '#19ac9f', color: 'white', width: 50, height: 50 }}
                    shape="circle" icon={<PlusOutlined />}
                    onClick={showModal} />
            </Tooltip>
        </div>
    );
}

/* webkit-box-shadow: 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05);
    box-shadow: 0 3px 6px -4px rgba(0,0,0,.12), 0 6px 16px 0 rgba(0,0,0,.08), 0 9px 28px 8px rgba(0,0,0,.05);
 */
export default AddConseiller;