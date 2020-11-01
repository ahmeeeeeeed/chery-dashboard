import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

import { getConnectedUser } from '../../../helpers/userdata'
import AddEtatModalForm from './addEtatModalForm';
import { addEtat } from '../../../api/etats';
import { addMail } from '../../../api/EmailSMS';


const AddEtat = ({ refreshAfterAddEtat, listetats }) => {

    const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (values, signes) => {

        const etat = {
            nom: values.nom,
            titre: values.titre,
            ordre: values.ordre,
            signes: signes.length === 1 ? [{ positif: values.desc_positif }] : [
                { positif: values.desc_positif },
                { negatif: values.desc_negatif }
            ],
            isFinal: values.ordre === listetats.length + 1 ? true : false,
            isFirst: values.ordre === 1 ? true : false,
            deleted_at: null
        }

        // console.log(values)
        //console.log(signes)
        //console.log(etat);

        await addEtat(etat, getConnectedUser()).then(async (res) => {
            const data = {
                description: values.mailcontent,
                etat: res._id,
                deleted_at: null
            }
            await addMail(data)

            setVisible(false)
            refreshAfterAddEtat()
        })


    };

    const handleCancel = e => {
        setVisible(false)
    };

    return (
        <div>
            <AddEtatModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                listetats={listetats}
            />
            <Tooltip title="Ajouter un état" >
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
export default AddEtat;