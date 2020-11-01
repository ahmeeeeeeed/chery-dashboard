import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Alert } from 'antd';
import { controleCIN } from '../../../helpers/checkDataEntry';

const AddClientModalForm = ({ visible, onCreate, onCancel, listclients }) => {

  const [alert, setAlert] = useState(false)


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
      visible={visible}
      title="Ajouter un nouveau client"
      okText="Create"
      cancelText="Cancel"
      onCancel={() => { form.resetFields(); onCancel() }}
      onOk={() => {
        form
          .validateFields()
          .then(async (values) => {
            if (controleCIN(listclients, values.CIN)) {
              setAlert(true)
            }
            else {
              setAlert(false)
              form.resetFields();
              onCreate(values);
            }

          })
          .catch((info) => {
            console.log('Validate Failed:', info);
            setAlert(false)
          });
      }}
    >
      <Form
        form={form}
        {...layout}
        name="form_in_modal"
        initialValues={{
          VIP: 'non',
        }}
      >
        {alert && <Alert message="CIN invalide ou déjà utilisé !" type="error" style={{ textAlign: "center", marginBottom: 20 }} />}

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
          name="prenom"
          label="Prénom"
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
          name="CIN"
          label="CIN"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
            {
              len: 8,
              message: 'len 8',
            },
            /*  {
 
               type: "number",
               enum: [1, 2],
               message: 'CIN utilisé',
             } */
          ]}
        >
          <Input type="number" />

        </Form.Item>

        <Form.Item
          name="adresse"
          label="Adresse"
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
          name="tel"
          label="Téléphonne"
          rules={[
            {
              required: true,
              message: 'Please input the title of collection!',
            },
            {
              len: 8,
              message: 'len 8',
            }
          ]}
        >
          <Input type="number" />
        </Form.Item>


        <Form.Item label="VIP" name="VIP" className="collection-create-form_last-form-item">
          <Radio.Group >
            <Radio value="oui">Oui</Radio>
            <Radio value="non">Non</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddClientModalForm