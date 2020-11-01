import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

import { getConnectedUser } from '../../../helpers/userdata'
import ModifyEtatModalForm from './modifyEtatModalFomr';
import { updateEtat } from '../../../api/etats';


const ModifyEtat = (props) => {

    const dispatch = useDispatch()
    const [visible, setVisible] = useState(true);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (new_values, signes, id_etat) => {

        // console.log(new_values)
        // console.log(signes)
        const updatedEtat = {
            nom: new_values.nom,
            titre: new_values.titre,
            signes: signes.length === 1 ? [{ positif: new_values.desc_positif }] : [
                { positif: new_values.desc_positif },
                { negatif: new_values.desc_negatif }
            ]
        }

        await updateEtat(id_etat, getConnectedUser(), updatedEtat).then(() => {
            setVisible(false)
            props.refreshAfterUpdateEtat()
            setTimeout(() => {
                props.modalState()
            }, 500);
        })
        /*    const updatedclient = {
              nom: new_values.nom,
              prenom: new_values.prenom,
              adresse: new_values.adresse,
              email: new_values.email,
              tel: new_values.tel,
              CIN: new_values.CIN,
              VIP: new_values.VIP,
          }
  
          dispatch(allActions.clientActions.updateClient(data._id, updatedclient, getConnectedUser()))
    */

    };

    const handleCancel = e => {
        setVisible(false)
        setTimeout(() => {
            props.modalState()
        }, 500);
    };

    return (
        <div>
            <ModifyEtatModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                data={props.data}
            />
        </div>
    );
}

export default ModifyEtat;