import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

import { getConnectedUser } from '../../../helpers/userdata'
import ModifyDossierModalForm from './modifyDossierModalForm';
import { updateDossier } from '../../../api/dossiers';


const ModifyDossier = (props) => {

  const dispatch = useDispatch()
  const [visible, setVisible] = useState(true);

  const showModal = () => {
    setVisible(true)

  };

  const handleOk = async (new_values, data) => {

    const new_data = { remarques: new_values.remarques }

    await updateDossier(data._id, getConnectedUser(), new_data).then((res) => {
      setVisible(false)
      props.refreshAfterUpdateDossier()
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
      <ModifyDossierModalForm
        visible={visible}
        onCreate={handleOk}
        onCancel={handleCancel}
        data={props.data}
      />
    </div>
  );
}

export default ModifyDossier;