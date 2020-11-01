import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Slider, Steps, message, Tooltip, Alert, Checkbox } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { listEtats, listEtatsSupprimesEtNonSupprimes } from '../../../../api/etats';
const { Step } = Steps;

const ChangerEtatModal = ({ visible, onCreate, onCancel, etatdata, dossier }) => {

    const [loading, setLoading] = useState(false)
    const [etats, setEtats] = useState([])
    const [steps, setSteps] = useState([])
    const [current, setCurrent] = useState(0)
    const [status, setStatus] = useState("finish")
    const [visi, setVisi] = useState(false)
    const [initialValues, seInitialValues] = useState("positif")
    const [radioGroupError, setRadioGroupError] = useState(false)
    const [etatsSupprimesError, setEtatsSupprimesError] = useState(false)
    const [sendCheckBoxButton, setSendCheckBoxButton] = useState(true)
    useEffect(() => {
        //en cas où l'etat est supprimé
        if (etatdata && etatdata.ordre === 0)
            setEtatsSupprimesError(true)
        //en cas de changement d'etat pour plusieurs dossiers
        if (etatdata && etatdata.ordre !== 0)
            setCurrent(etatdata.ordre - 1)
        if (dossier && etatdata && etatdata.ordre !== 0) {
            setStatus(dossier.etat_actuel.signe === "positif" ? "finish" : "error")
            seInitialValues(dossier.etat_actuel.signe)
        }
        setLoading(true)
        getAllEtats().then(ress => {
            setEtats(ress)
            //console.log(ress)
            loadingSteps(ress)
            setLoading(false)
        })
    }, [])
    const getAllEtats = async () => {
        // if (etatsSupprimes) return await listEtatsSupprimesEtNonSupprimes()
        return await listEtats()
    }
    const loadingSteps = (etats) => {
        //console.log({ etatdata: etatdata, dossier: dossier })
        etats.forEach(element => {
            //setSteps(...steps, { title: element.nom, content: element._id })
            steps.push({ title: element.nom, content: element._id })

        });
        /* steps.push({
            title: 'First',
            content: 'First-content',
        })
        steps.push({
            title: 'First',
            content: 'First-content',
        })
        steps.push({
            title: 'First',
            content: 'First-content',
        }) */
        setVisi(true)
        //console.log(steps)
    }
    const next = () => {
        setEtatsSupprimesError(false)
        setCurrent(current + 1)
        if (etats[current + 1].signes.length == 1) {
            setStatus("finish")
        }
        else {
            if (initialValues === "positif")
                setStatus("finish")
            if (initialValues === "negatif")
                setStatus("error")
        }
    }

    const prev = () => {
        setEtatsSupprimesError(false)
        setCurrent(current - 1)
        if (etats[current - 1].signes.length == 1) {
            setStatus("finish")
        }
        else {
            if (initialValues === "positif")
                setStatus("finish")
            if (initialValues === "negatif")
                setStatus("error")
        }
    }
    const cancel = () => {
        setEtatsSupprimesError(false)
        setVisi(false)
        onCancel()
    }

    const onChangeSteps = (current) => {
        //console.log('onChange:', current);
        setEtatsSupprimesError(false)
        setCurrent(current)
        if (etats[current].signes.length == 1) {
            setStatus("finish")
            // seInitialValues("positif")
        }
        else {
            if (initialValues === "positif")
                setStatus("finish")
            if (initialValues === "negatif")
                setStatus("error")
        }


    };
    const onChangeRadioGroup = (e) => {
        setStatus(e.target.value === "positif" ? "finish" : "error")
        seInitialValues(e.target.value)
        setRadioGroupError(false)
    }
    const onChangeSendCheckBox = e => {
        setSendCheckBoxButton(e.target.checked)
    }

    const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            // offset : 8,
            span: 20
        },
    };

    return (
        <Modal
            width="10"
            visible={visi}
            title="Modification d'état"
            okText="Create"
            cancelText="Cancel"
            onCancel={cancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        // console.log(values.signe)
                        if (etats[current].signes.length == 1 && values.signe === "negatif") {
                            console.log("errooorrr")
                            setRadioGroupError(true)
                        }

                        else {
                            form.resetFields();
                            onCreate(values, status, etats[current], sendCheckBoxButton);
                        }

                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            {etatsSupprimesError && <Alert message={`L'état de ce dossier ayant le nom "${etatdata.nom}" est supprimé, veillez choisir un autre état !!`} type="error" style={{ textAlign: "center", marginBottom: 20 }} />}

            <Form
                form={form}

                name="form_in_modal"
                initialValues={{
                    signe: initialValues,
                }}
            >
                <Form.Item>
                    <>
                        {/*  {dossier ? (<p>Modification d'état pour le dossier numéro {dossier.num}</p>)
                        : (<p>Modification d'état pour les dossiers suivants :</p>)} */}

                        <Steps current={current} status={status} onChange={(e) => onChangeSteps(e)}  >
                            {steps.map((item, index) => (
                                <Step key={item.title} title={`état ${index + 1}`} description={item.title} />
                            ))}
                        </Steps>
                        <div style={{ marginTop: '24px' }}>
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => next()}>
                                    Next
                                 </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                    Done
                                 </Button>
                            )}
                            {current > 0 && (
                                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                    Previous
                                 </Button>
                            )}
                        </div>
                    </>
                </Form.Item>
                <Form.Item label="Signes" name="signe" className="collection-create-form_last-form-item">

                    <Radio.Group onChange={(e) => onChangeRadioGroup(e)} >
                        {radioGroupError && <Alert showIcon message="Il faut sélectionner une signe !!" type="error" style={{ marginBottom: 20 }} />}
                        <Radio style={{ marginLeft: 30 }} value="positif" >
                            <CheckCircleTwoTone style={{ fontSize: 30 }} twoToneColor="#52c41a" />
                        </Radio>
                        {etats.length && etats[current].signes.length > 1 &&
                            <Radio style={{ marginLeft: 30 }} value="negatif">
                                <CloseCircleTwoTone style={{ fontSize: 30 }} twoToneColor="red" />
                            </Radio>}
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="remarques"
                    label="Remarques"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item
                    name="sendCheckBox"
                    label="Envoyer un Mail/Sms"

                >
                    <Checkbox checked={sendCheckBoxButton} onChange={onChangeSendCheckBox} ></Checkbox>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangerEtatModal