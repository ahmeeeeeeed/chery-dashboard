import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const ModifyDossierModalForm = ({ visible, onCreate, onCancel, data }) => {
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
      visible={visible}
      title={`Modifier la description du dossier numéro ${data.num} `}
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
          remarques: data.remarques
        }}
      >
        <Form.Item
          name="remarques"
          label="Descriptions et remarques :"
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
      </Form>
    </Modal>
  );
};

export default ModifyDossierModalForm