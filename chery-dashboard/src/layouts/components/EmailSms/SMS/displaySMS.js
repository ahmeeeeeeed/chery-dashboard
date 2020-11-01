import React, { useState, useEffect } from 'react';
import { Card, Input, Tooltip, message, Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import { getSms, updateSms } from '../../../../api/EmailSMS';



function DisplaySMS(props) {

    const [smsOuvertueData, setSmsOuvertueData] = useState()
    const [ouvertureInputValue, setOuvertureInputValue] = useState()
    const [smsClotureData, setSmsClotureData] = useState()
    const [clotureInputValue, setClotureInputValue] = useState()
    const [loading, setLoading] = useState(false)
    const [ouvertureButtonName, setOuvertureButtonName] = useState("Modifier")
    const [clotureButtonName, setClotureButtonName] = useState("Modifier")

    useEffect(() => {
        getSmsData()
    }, [])

    const getSmsData = async () => {
        setLoading(true)
        await getSms().then((res) => {
            res.forEach(element => {
                if (element.type === "ouverture") {
                    setSmsOuvertueData(element.description)
                    setOuvertureInputValue(element.description)
                }

                if (element.type === "cloture") {
                    setSmsClotureData(element.description)
                    setClotureInputValue(element.description)
                }

            });
            setLoading(false)
        }).catch((err) => {
            console.log(err);
            setLoading(false)
        })
    }
    const handleChangeOuvertureField = (v) => {
        setOuvertureInputValue(v.target.value)
    }
    const handleChangeClotureField = (v) => {
        setClotureInputValue(v.target.value)
    }
    const updateContent = async (type, description) => {

        console.log(description)
        const data = { description: description, type: type }
        message.loading('Action in progress..', 1).then(async () => {
            await updateSms(data).then(() => {
                message.success('Contenu modifié !')
                getSmsData()
                if (type === "ouverture")
                    setOuvertureButtonName("Modifier")
                if (type === "cloture")
                    setClotureButtonName("Modifier")
            })

        })

    }

    return (
        <div>
            <Card bordered={true} loading={loading}
                style={{ marginBottom: 12, textAlign: "center", borderWidth: 5, borderColor: "#dddcdc" }}
                title="SMS de création du compte et de début du processus"
                extra={<a onClick={() => {
                    if (ouvertureButtonName === "Modifier")
                        setOuvertureButtonName("Annuler")
                    if (ouvertureButtonName === "Annuler")
                        setOuvertureButtonName("Modifier")
                }}>
                    {ouvertureButtonName}
                </a>} >
                <div style={{ float: "left", textAlign: "left", width: '100%' }}>
                    <Title level={5} style={{ float: "left", width: '10%' }} >
                        Contenu :
                    </Title>
                    {ouvertureButtonName === "Modifier" ?
                        (
                            <p style={{ float: "left", width: '90%' }} >
                                {smsOuvertueData}
                            </p>
                        ) : (<>
                            <TextArea allowClear value={ouvertureInputValue}
                                style={{ float: "left", width: '65%', height: 80 }}
                                placeholder="Contenu de SMS d'ouverture"
                                onChange={(v) => handleChangeOuvertureField(v)}
                            /*  onPressEnter={() => { updateContent("ouverture", ouvertureInputValue) }}
                             onBlur={() => {
                                 setOuvertureButtonName("Modifier")
                                 setOuvertureInputValue(smsOuvertueData)
                             }} */
                            />

                            <Button type="primary" style={{ float: "left", width: '10%', marginLeft: 20 }}
                                onClick={() => {
                                    updateContent("ouverture", ouvertureInputValue)
                                }}
                            >Enregistrer</Button>
                            <Button style={{ float: "left", width: '10%', marginLeft: 20 }}
                                onClick={() => {
                                    setOuvertureButtonName("Modifier")
                                    setOuvertureInputValue(smsOuvertueData)
                                }}
                            >Annuler</Button>

                        </>)}
                </div>
            </Card>
            <Card bordered={true} loading={loading}
                style={{ marginBottom: 12, textAlign: "center", borderWidth: 5, borderColor: "#dddcdc" }}
                title="SMS de clotûre de processus"
                extra={<a onClick={() => {
                    if (clotureButtonName === "Modifier")
                        setClotureButtonName("Annuler")
                    if (clotureButtonName === "Annuler")
                        setClotureButtonName("Modifier")
                }}>
                    {clotureButtonName}
                </a>} >
                <div style={{ float: "left", textAlign: "left", width: '100%' }}>
                    <Title level={5} style={{ float: "left", width: '10%' }} >
                        Contenu :
                    </Title>
                    {clotureButtonName === "Modifier" ?
                        (
                            <p style={{ float: "left", width: '90%' }} >
                                {smsClotureData}
                            </p>
                        ) : (<>

                            <TextArea allowClear value={clotureInputValue}
                                style={{ float: "left", width: '65%', height: 80 }}
                                placeholder="Contenu de SMS d'ouverture"
                                onChange={(v) => handleChangeClotureField(v)}
                            /*  onPressEnter={() => { updateContent("cloture", clotureInputValue) }}
                             onBlur={() => {
                                 setClotureButtonName("Modifier")
                                 setClotureInputValue(smsClotureData)
                             }} */
                            />

                            <Button type="primary" style={{ float: "left", width: '10%', marginLeft: 20 }}
                                onClick={() => {
                                    updateContent("cloture", clotureInputValue)
                                }}
                            >Enregistrer</Button>
                            <Button style={{ float: "left", width: '10%', marginLeft: 20 }}
                                onClick={() => {
                                    setClotureButtonName("Modifier")
                                    setClotureInputValue(smsClotureData)
                                }}
                            >Annuler</Button>

                        </>)}
                </div>
            </Card>
        </div>
    );
}

export default DisplaySMS;