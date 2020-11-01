import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Alert, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const CheckboxGroup = Checkbox.Group;

const ModifyEtatModalForm = ({ visible, onCreate, onCancel, data }) => {
    const options = [
        { label: 'Valider', value: 'positif' },
        { label: 'Refuser', value: 'negatif' }
    ];

    const [checkedList, setCheckedList] = useState([])
    const [checkboxError, setCheckboxError] = useState(false)

    const onChangeCheckList = checkedList => {
        if (checkedList.indexOf("negatif") == 0)
            setCheckboxError(true)
        else setCheckboxError(false)
        /*  if (checkedList.length)
             setCheckboxError(false) */
        setCheckedList(checkedList)
    };
    const handleChangeSelect = (value) => {
        //console.log(`selected ${value}`);
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
            width={'70%'}
            visible={visible}
            title="Modifier un nouvel état"
            okText="Modifier"
            cancelText="Annuler"
            onCancel={() => { form.resetFields(); onCancel() }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        if (checkedList.indexOf("negatif") == 0 || checkedList.length == 0) {
                            setCheckboxError(true)
                            console.log("errooorrr")

                        }
                        else {
                            onCreate(values, checkedList, data._id);
                            //form.resetFields();
                            //setCheckedList([])
                        }


                    })
                    .catch((info) => {
                        /* if (checkedList.length == 0) {
                            setCheckboxError(true)
                            console.log("errooorrr")

                        }
                        else */ console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                {...layout}
                name="form_in_modal"
                initialValues={{
                    nom: data.nom,
                    titre: data.nom,
                    desc_positif: data.signes[0].positif,
                    desc_negatif: data.signes[1] ? data.signes[1].negatif : "",
                    //signes: ['positif']
                }}
            >
                <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="titre"
                    label="Titre"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                {checkboxError === true && <Alert showIcon message="Il faut sélectionner au moin la signe validé !!" type="error"
                    style={{ marginBottom: 20, width: '85%', position: "relative", left: '15%' }} />}

                <Form.Item label="Signes" name="signes" className="collection-create-form_last-form-item">
                    <CheckboxGroup
                        options={options}
                        value={checkedList}
                        onChange={onChangeCheckList}
                    />

                </Form.Item>

                {/*  {checkedList.indexOf("positif") == 0 && */}
                <Form.Item
                    hidden={checkedList.indexOf("positif") != 0}
                    name="desc_positif"
                    label="Description de validation"
                    rules={[
                        {
                            required: checkedList.indexOf("positif") === 0,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>

                {/*  {checkedList.indexOf("negatif") == 1 && */}
                <Form.Item
                    hidden={checkedList.indexOf("negatif") == -1 || checkedList.indexOf("negatif") == 0}
                    name="desc_negatif"
                    label="Description de réfus"
                    rules={[
                        {
                            required: checkedList.indexOf("negatif") === 1,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default ModifyEtatModalForm