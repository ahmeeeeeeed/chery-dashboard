import { Card, Avatar, Button, Input, Tooltip, message, Popconfirm, Menu, Dropdown } from 'antd';
import React, { useState, useEffect } from 'react';
import { FolderOpenTwoTone, DownOutlined } from '@ant-design/icons';
import { getDateExact, getConnectedUser } from '../../../../helpers/userdata';
import { getEtatById, listEtats } from '../../../../api/etats';
import { updateDossier, getDossier, deleteDossier, changerEtatDossier } from '../../../../api/dossiers';
import ChangerEtat from './changerEtat';

const { Meta } = Card;

const DossierInfo = ({ dossier, reloadPage, changeDossierData }) => {

    const [etatActuel, setEtatActuel] = useState({})
    const [doss, setDoss] = useState(dossier)

    const [loading, setLoading] = useState(true)
    const [modifyInput, setModifyInput] = useState(false)
    /*  const [changeEtatDropDown, setChangeEtatDropDown] = useState(false)
        const [etats, setEtats] = useState([])
        const [dropDownListButtonName, setDropDownListButtonName] = useState("Changer état")
        const [selectedItem, setSelectedItem] = useState({ nom: "--- Choisir un état ---" }) */
    const [inputValue, setInputValue] = useState(doss.Remarques)
    const [updateButtonName, setUpdateButtonName] = useState("Modifier")
    const [openChangeEtatModal, setOpenChangeEtatModal] = useState(false)

    useEffect(() => {
        refresh()
        /* getFullDossier(doss._id).then(res => {
            setDoss(res)
            //    getFullEtat(res.etat_actuel.etatId).then(ress => {
            setEtatActuel(res.etat_actuel.etatId)

            //console.log(doss)
            //   })//.catch(err => console.log(err))
            getAllEtats().then(ress => {
                setEtats(ress)
                //console.log(ress)
                setLoading(false)
            })
        }) */


    }, [])


    const refresh = async () => {
        setLoading(true)
        getFullDossier(doss._id).then(res => {

            setDoss(res)
            setEtatActuel(res.etat_actuel.etatId)
            setLoading(false)
            /*  getAllEtats().then(ress => {
                 setEtats(ress)
                 //console.log(ress)
                
             }) */
        })
    }
    const getFullEtat = async (id) => {
        return await getEtatById(id)
    }
    const getFullDossier = async (id) => {
        return await getDossier(id)//.then((res) => console.log("dossierinfo  : " + res))
    }
    const getAllEtats = async () => {
        return await listEtats()
    }
    const updateDoss = async () => {
        const data = { remarques: inputValue }
        setLoading(true)
        message.loading('Action in progress..', 2).then(async () => {
            //console.log({ dossierid: dossier._id, user: getConnectedUser(), data: data })
            // await changerEtatDossier(doss._id, selectedItem._id, getConnectedUser(), data).then(res => {
            await updateDossier(doss._id, getConnectedUser(), data).then(res => {
                // console.log(res)
                message.success('Remarques modifiées !')
                setLoading(false)
                //  console.log("befor : " + doss.Remarques)
                doss.Remarques = inputValue
                setDoss(doss)
                //console.log("after : " + doss.Remarques)
                setModifyInput(false)
                setUpdateButtonName("Modifier")
                reloadPage()

            })
        })
    }
    const deleteDoss = async () => {
        setLoading(true)
        //console.log(new Date())
        message.loading('Action in progress..', 2).then(async () => {
            await deleteDossier(doss._id, getConnectedUser()).then(res => {
                message.success('Dossier supprimé !')
                setLoading(false)
                // console.log(doss.deleted_at)
                doss.deleted_at = new Date()
                setDoss(doss)
                // console.log(doss.deleted_at)
                setUpdateButtonName("Annuler")//just to make some changes in the card to auto refresh
                setUpdateButtonName("Modifier")//just to make some changes in the card to auto refresh
                reloadPage()

            })
        })

    }
    const handleChange = (v) => {
        setInputValue(v.target.value)
    }

    const closeModal = () => {
        setOpenChangeEtatModal(false)
    }
    return (<>
        {openChangeEtatModal && <ChangerEtat etatdata={etatActuel} dossier={doss} modalState={closeModal}
            refreshAfterChangingEtat={() => { refresh(); changeDossierData() }} />}
        <Card
            bordered loading={loading}
            style={{ width: 400, textAlign: "center" }}
            cover={
                <Avatar style={{ top: '50%', left: '50%', transform: 'translate(-50%, 10%)', backgroundColor: "white" }} size={100} icon={<FolderOpenTwoTone />} />
            }
            actions={[
                <Button disabled={loading} type="link" block onClick={() => {

                    if (updateButtonName == "Modifier") {
                        setModifyInput(true)
                        setUpdateButtonName("Annuler")
                    }

                    else {
                        setModifyInput(false)
                        setUpdateButtonName("Modifier")
                        setInputValue(doss.Remarques)
                    }
                }}>
                    {updateButtonName}
                </Button>,
                <Button disabled={loading} type="link" block onClick={() => { /* setLoading(true); */ setOpenChangeEtatModal(true); }} >
                    Changer état
                </Button>,

                <Popconfirm disabled={doss.deleted_at || loading ? true : false} title="Are you sure？" onConfirm={async () => { deleteDoss() }} okText="Yes" cancelText="No">
                    <Button danger disabled={doss.deleted_at ? true : false} type="link" block >
                        Supprimer
                        </Button>
                </Popconfirm>
            ]}

        >
            <Meta

                title={`Dossier numéro ${dossier.num}`}
                description={<b>
                    {etatActuel.ordre === 0 && <p style={{ color: "red" }} >Etat actuel (Supprimé) : {etatActuel.nom}</p>}
                    <p>Remarques : {modifyInput ? (
                        <Tooltip title="Appuyez sur entrée pour enregistrer" >
                            <Input allowClear value={inputValue}
                                onChange={(v) => handleChange(v)}
                                onPressEnter={() => { updateDoss() }}
                                onBlur={() => {
                                    setModifyInput(false)
                                    setUpdateButtonName("Modifier")
                                    setInputValue(doss.Remarques)
                                }} />
                        </Tooltip>
                    )
                        :
                        (<>{doss.Remarques}</>)} </p>
                    <p>Date de creation : {getDateExact(dossier.created_at)}</p>
                    <p>Date de modification : {getDateExact(doss.updated_at)}</p>
                    {doss.deleted_at && <p style={{ color: "red" }} >Supprimé le : {getDateExact(doss.deleted_at)}</p>}
                </b>}
            />
        </Card>
    </>);
}

export default DossierInfo;