import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';
import ModifyClientModalForm from './modifyClientModalForm'

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

import { getConnectedUser } from '../../../helpers/userdata'


const ModifyClient = (props) => {

  const dispatch = useDispatch()
  const [visible, setVisible] = useState(true);

  const showModal = () => {
    setVisible(true)

  };

  const handleOk = (new_values, data) => {

    const updatedclient = {
      nom: new_values.nom,
      prenom: new_values.prenom,
      adresse: new_values.adresse,
      email: new_values.email,
      tel: new_values.tel,
      CIN: new_values.CIN,
      VIP: new_values.VIP,
    }

    dispatch(allActions.clientActions.updateClient(data._id, updatedclient, getConnectedUser()))

    setVisible(false)
    props.refreshAfterUpdateClient()
    setTimeout(() => {
      props.modalState()
    }, 500);
  };

  const handleCancel = e => {
    setVisible(false)
    setTimeout(() => {
      props.modalState()
    }, 500);
  };

  return (
    <div>
      <ModifyClientModalForm
        visible={visible}
        onCreate={handleOk}
        onCancel={handleCancel}
        data={props.data}
        listclients={props.listclients}
      />
    </div>
  );
}

export default ModifyClient;