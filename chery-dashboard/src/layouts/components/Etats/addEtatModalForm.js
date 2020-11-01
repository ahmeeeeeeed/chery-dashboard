import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Checkbox, Alert, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;


const AddEtatModalForm = ({ visible, onCreate, onCancel, listetats }) => {
    //const plainOptions = ['positif', 'negatif'];
    //const defaultCheckedList = ['Apple', 'Orange'];
    const options = [
        { label: 'Valider', value: 'positif' },
        { label: 'Refuser', value: 'negatif' }
    ];

    const [checkedList, setCheckedList] = useState([])
    const [etats, setEtats] = useState(listetats)
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
            title="Ajouter un nouvel état"
            okText="Ajouter"
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
                            onCreate(values, checkedList);
                            form.resetFields();
                            //setCheckedList([])
                        }


                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            <Form
                form={form}
                {...layout}
                name="form_in_modal"
                initialValues={{
                    //  signes: 'Apple',
                }}
            >
                <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
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
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="ordre"
                    label="Ordre"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <Select placeholder="Choisir un ordre parmis ces états" style={{ width: 300 }} onChange={handleChangeSelect}>
                        {etats && etats.map((value, index) => (
                            <Option
                                key={index}
                                value={value.ordre}>
                                {`${value.ordre} -- ${value.nom}`}
                            </Option>
                        ))}
                        <Option
                            key={etats.length + 1}
                            value={etats.length + 1}>
                            {`${etats.length + 1} --------------------------------------------`}
                        </Option>


                    </Select>
                </Form.Item>

                <Form.Item
                    name="mailcontent"
                    label="Contenu du mail à envoyer"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <TextArea />
                </Form.Item>
                <Form.Item label="Signes" name="signes" className="collection-create-form_last-form-item">
                    {checkboxError === true && <Alert showIcon message="Il faut sélectionner au moin la signe validé !!" type="error" style={{ marginBottom: 20 }} />}
                    <CheckboxGroup
                        options={options}
                        value={checkedList}
                        onChange={onChangeCheckList}
                    />

                </Form.Item>

                {checkedList.indexOf("positif") == 0 &&
                    <Form.Item
                        name="desc_positif"
                        label="Description de validation"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>}

                {checkedList.indexOf("negatif") == 1 &&
                    <Form.Item
                        name="desc_negatif"
                        label="Description de réfus"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input the title of collection!',
                            },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>}

            </Form>
        </Modal>
    );
};

export default AddEtatModalForm