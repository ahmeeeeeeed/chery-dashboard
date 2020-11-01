import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';
import AddClientModalForm from './addClientModalForm'

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

import { getConnectedUser } from '../../../helpers/userdata'
import { addClient } from '../../../api/clients';


const AddClient = ({ refreshAfterAddClient, listclients }) => {

    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (values) => {


        const client = {
            ...values,
            "dossiers": [],
            "deleted_at": null
        }

        //  dispatch(allActions.clientActions.addClient(client, getConnectedUser()))
        await addClient(client, getConnectedUser()).then((res) => {
            setVisible(false)
            refreshAfterAddClient()
        })

        /*  message.loading('Action in progress..', 2).then( () => {
             dispatch(allActions.clientActions.addClient(client, getConnectedUser()))
             message.success('Client ajouté !')
                 setVisible(false)
                 refreshAfterAddClient()
           }) */
    };

    const handleCancel = e => {
        setVisible(false)
    };

    return (
        <div>
            <AddClientModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                listclients={listclients}
            />
            <Tooltip title="Ajouter un client" >
                <Button className="add-button-shadow"
                    style={{ position: 'fixed', bottom: 40, right: 40, borderWidth: 0, backgroundColor: '#19ac9f', color: 'white', width: 50, height: 50 }}
                    shape="circle" icon={<PlusOutlined />}
                    onClick={showModal} />
            </Tooltip>
        </div>
    );
}


export default AddClient;