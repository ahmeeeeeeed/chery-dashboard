import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const ModifyEmailModalForm = ({ visible, onCreate, onCancel, data }) => {

    const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 24,
        },
        wrapperCol: {
            // offset : 8,
            span: 24
        },
    };

    return (
        <Modal
            width="45%"
            visible={visible}
            title={`Modifier le contenu de l'email pour l'état ${data.etat} `}
            okText="Modifier"
            cancelText="Annuler"
            onCancel={onCancel}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        // form.resetFields();
                        onCreate(values, data);
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
                    description: data.description
                }}
            >
                <Form.Item
                    name="description"
                    label="Description du contenu :"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        },
                    ]}
                >
                    <TextArea style={{ height: 100 }} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModifyEmailModalForm