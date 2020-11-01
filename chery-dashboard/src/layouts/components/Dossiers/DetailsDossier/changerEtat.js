import React, { useState } from 'react'
import ChangerEtatModal from './changerEtatModal';
import { changerEtatDossier, changerEtatEnsembleDossiers, getDossier } from '../../../../api/dossiers';
import { getConnectedUser } from '../../../../helpers/userdata';
import { sendSms, sendMail } from '../../../../api/EmailSMS';
import { getClient } from '../../../../api/clients';


const ChangerEtat = (props) => {
    // console.log(props.dossier);

    //const dispatch = useDispatch()
    const [visible, setVisible] = useState(true);

    const showModal = () => {
        setVisible(true)

    };

    const handleOk = async (new_values, status, new_etat, sendCheckBoxButton) => {

        if (props.listeDossier) {
            /*
            [
                {
                    "dossier": "5f6e30f94d4408092c41829e",
                    "etat": "5f70beadca93fb1cf4a8f3a0",
                    "remarques": "changer vers letat num 1",
                    "signe": "positif"
                }
            ]
            */
            const tab = []
            props.listeDossier.forEach(async (element) => {

                tab.push({
                    dossier: element,
                    etat: new_etat._id,
                    remarques: new_values.remarques,
                    signe: new_values.signe
                })
                if (sendCheckBoxButton) {
                    const dos = await getDossier(element)
                    if (new_etat._id !== dos.etat_actuel.etatId._id) {

                        if (new_etat.isFinal === true) {
                            await smsSending("cloture", dos.client, dos)
                            await emailSending(dos.client, "Félicitation", new_etat._id, dos)
                        }
                        if (new_etat.isFirst == true) {
                            await smsSending("ouverture", dos.client, dos)
                            await emailSending(dos.client, "Commencement du processus", new_etat._id, dos)
                        }
                        if (new_etat.isFirst === false && new_etat.isFirst === false) {
                            await emailSending(dos.client, "Chengement de l'état de votre dossier", new_etat._id, dos)
                        }
                        if (dos.etat_actuel.etatId._id.isFinal === true) {
                            await emailSending(dos.client, "Chengement de l'état de votre dossier", new_etat._id, dos)
                        }
                    }
                }

            });

            await changerEtatEnsembleDossiers(getConnectedUser(), tab).then(res => {

                setVisible(false)
                props.modalState()
                props.refreshAfterChangingEtat()
            })
        }
        else {
            const data = {
                remarques: new_values.remarques,
                signe: new_values.signe
            }
            await changerEtatDossier(props.dossier._id, new_etat._id, getConnectedUser(), data).then(async (res) => {

                setVisible(false)
                props.modalState()
                props.refreshAfterChangingEtat()

                //si l'etat est changé non seuelemt la desc ou signes
                if (sendCheckBoxButton) {

                    if (new_etat._id !== props.etatdata._id) {

                        if (new_etat.isFinal === true) {
                            //console.log("final : " + new_etat)
                            await smsSending("cloture", props.dossier.client, props.dossier)
                            await emailSending(props.dossier.client, "Félicitation", new_etat._id, props.dossier)
                        }

                        if (new_etat.isFirst === true) {
                            //console.log("first : " + new_etat)
                            await smsSending("ouverture", props.dossier.client, props.dossier)
                            await emailSending(props.dossier.client, "Commencement du processus", new_etat._id, props.dossier)
                        }
                        if (new_etat.isFirst === false && new_etat.isFinal === false) {
                            //console.log(new_etat)
                            await emailSending(props.dossier.client, "Chengement de l'état de votre dossier", new_etat._id, props.dossier)
                        }
                        if (props.etatdata.isFinal === true) {
                            //console.log(new_etat)
                            await emailSending(props.dossier.client, "Chengement de l'état de votre dossier", new_etat._id, props.dossier)
                        }
                    }
                }

            })

        }

    };

    const smsSending = async (type, client, dossier) => {

        //const client = await getClient(id_client).catch(err => console.log(err))
        return await sendSms(type, client, dossier, dossier.etat_actuel.etatId._id).catch(err => console.log(err))
    }

    const emailSending = async (client, subject, id_etat, dossier) => {

        //const client = await getClient(id_client).catch(err => console.log(err))
        console.log({ client, subject, id_etat })
        return await sendMail(client, subject, id_etat, dossier).catch(err => console.log(err))
    }

    const handleCancel = e => {
        setVisible(false)
        setTimeout(() => {
            props.modalState()
        }, 500);
    };

    return (
        <div >
            <ChangerEtatModal

                visible={visible}
                onCreate={handleOk}
                onCancel={handleCancel}
                etatdata={props.etatdata}
                dossier={props.dossier}
            />
        </div>
    );
}

export default ChangerEtat;