import React, { useState } from 'react';
import { Button, Modal, Form, Input, Radio, Alert } from 'antd';
import { controleCIN } from '../../../helpers/checkDataEntry';

const ModifyClientModalForm = ({ visible, onCreate, onCancel, data, listclients }) => {
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
      title="Modifier un client"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            /*   if (controleCIN(listclients, values.CIN)) {
                setAlert(true)
              }
              else {
                setAlert(false)
                // form.resetFields();
                onCreate(values, data);
              } */
            onCreate(values, data);

          })
          .catch((info) => {
            setAlert(false)
            console.log('Validate Failed:', info);
          });
      }}
    >
      {/*   {alert && <Alert message="CIN déjà utilisé !" type="error" style={{ textAlign: "center", marginBottom: 20 }} />} */}

      <Form
        form={form}
        {...layout}
        name="form_in_modal"
        initialValues={{
          nom: data.nom,
          prenom: data.prenom,
          CIN: data.CIN,
          adresse: data.adresse,
          email: data.email,
          tel: data.tel,
          VIP: data.VIP
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
        >
          <Input type="number" disabled={true} />
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

export default ModifyClientModalForm