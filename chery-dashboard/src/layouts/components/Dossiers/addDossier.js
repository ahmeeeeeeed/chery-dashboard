import React, { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tooltip, Modal } from 'antd';

import { useSelector, useDispatch } from 'react-redux'
import allActions from '../../../redux/actionsStore'

import { getConnectedUser } from '../../../helpers/userdata'
import AddDossierModalForm from './addDossierModalForm';
import { getEtatByOrdre } from '../../../api/etats';
import { addDossier } from '../../../api/dossiers';
import { sendSms, getSms, sendMail } from '../../../api/EmailSMS';
import { getClient } from '../../../api/clients';


const AddDossier = ({ refreshAfterAddDossier, listdossiers }) => {

    //const dispatch = useDispatch()
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (values) => {

        //console.log(values.client)
        values.num = parseInt(values.num, 10)
        const dossier = {
            ...values,
            etat_actuel: null,
            etats_prec: [],
            deleted_at: null,
        }

        await getEtatByOrdre(1).then(async (res) => {

            dossier.etat_actuel = { etatId: res._id, signe: "positif" }
            await addDossier(getConnectedUser(), dossier).then(async (res) => {
                setVisible(false)
                refreshAfterAddDossier()
                //envoi sms et mail
                await getClient(values.client).then(async (client) => {
                    await smsSending(client, dossier)
                    await emailSending(client, "Commencement du processus", dossier.etat_actuel.etatId, dossier)
                })
                    .catch(err => console.log(err))

            })
                .catch(err => console.log(err))
        })
            .catch(err => console.log(err))

    };

    const smsSending = async (client, dossier) => {

        //const client = await getClient(id_client).catch(err => console.log(err))
        return await sendSms("ouverture", client, dossier, dossier.etat_actuel.etatId).catch(err => console.log(err))
    }

    const emailSending = async (client, subject, id_etat, dossier) => {
        //const client = await getClient(id_client).catch(err => console.log(err))
        return await sendMail(client, subject, id_etat, dossier).catch(err => console.log(err))
    }

    const handleCancel = e => {
        setVisible(false)
    };

    return (
        <div>
            <AddDossierModalForm
                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                listdossiers={listdossiers}
            />
            <Tooltip title="Ajouter un dossier" >
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
export default AddDossier;