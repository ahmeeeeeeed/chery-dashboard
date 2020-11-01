import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Alert, AutoComplete } from 'antd';
import { controleCIN } from '../../../helpers/checkDataEntry';

const AutoCompleteOption = AutoComplete.Option;

const ModifyConseillerModalForm = ({ visible, onCreate, onCancel, data }) => {

    const [alert, setAlert] = useState(false)
    const [autoCompleteResult, setAutoCompleteResult] = useState([]);


    const [form] = Form.useForm();

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
            title="Modifier un conseiller"
            okText="Modifier"
            cancelText="Annuler"
            onCancel={() => { form.resetFields(); onCancel() }}
            onOk={() => {
                form
                    .validateFields()
                    .then(async (values) => {
                        // form.resetFields();
                        onCreate(values);

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
                    username: data.username,
                    email: data.email

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

                {/* <Form.Item
                    name="password"
                    label="Encien mot de passe"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please confirm your password!',
                        },
                        () => ({
                            validator(rule, value) {
                                console.log(data.password)
                                if (!value || data.password === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Password dosent match!');
                            },
                        }),
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="new_password"
                    label="Nouveau mot de passe"
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
                    label="Confirmr le mot de passe"
                    dependencies={['new_password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('new_password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('The two passwords that you entered do not match!');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item> */}

            </Form>
        </Modal>
    );
};

export default ModifyConseillerModalForm