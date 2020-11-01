import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Alert, AutoComplete } from 'antd';
import { controleCIN } from '../../../helpers/checkDataEntry';

const AutoCompleteOption = AutoComplete.Option;

const AddConseillerModalForm = ({ visible, onCreate, onCancel }) => {

    const [alert, setAlert] = useState(false)
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);


    const [form] = Form.useForm();
    /* const layout = {
        labelCol: {
            span: 5,
        },
        wrapperCol: {
            // offset : 8,
            span: 20
        },
    }; */
    const formItemLayout = {
        labelCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 9,
            },
        },
        wrapperCol: {
            xs: {
                span: 24,
            },
            sm: {
                span: 15,
            },
        },
    };
    return (
        <Modal
            visible={visible}
            scrollToFirstError
            title="Ajouter un nouveau conseiller"
            okText="Ajouter"
            cancelText="Annuler"
            onCancel={() => { onCancel(); form.resetFields(); }}
            onOk={() => {
                form
                    .validateFields()
                    .then(async (values) => {
                        onCreate(values);
                        form.resetFields();
                    })
                    .catch((info) => {
                        console.log('Validate Failed:', info);
                        //setAlert(false)
                    });
            }}
        >
            <Form
                form={form}
                {...formItemLayout}
                name="form_in_modal"
                initialValues={{
                    // VIP: 'non',
                }}
            >
                {/* {alert && <Alert message="CIN déjà utilisé !" type="error" style={{ textAlign: "center", marginBottom: 20 }} />} */}

                <Form.Item
                    name="username"
                    label="Nom d'utilisateur"
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
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        },
                        {
                            pattern: /^[a-zA-z0-9_.+-]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                            // /^[a-zA-z0-9_.+-]+@[a-zA-z0-9-]+.[a-zA-z0-9-.]+$/
                            // /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/
                            message: 'error pattern',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Mot de passe"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input your password!',
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirmer le mot de passe"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>



                {/* <Form.Item
                    name="grants"
                    label="Priviléges"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        }
                    ]}
                >
                    <Input />
                </Form.Item> */}

            </Form>
        </Modal>
    );
};

export default AddConseillerModalForm