import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Radio, Select, Alert } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { getClients } from '../../../api/clients';
import { controleNumDossier } from '../../../helpers/checkDataEntry';
const { Option } = Select;


const AddDossierModalForm = ({ visible, onCreate, onCancel, listdossiers }) => {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {
        setLoading(true)
        loadingClients().then(res => {
            res.forEach(element => {
                clients.push(element)
            });
            setLoading(false)
        })
    }, [])

    const loadingClients = async () => {
        return await getClients()
    }

    /******************************************** selected menu ************************************ */

    const onBlurSelect = () => {
        //  console.log('blur');
    }

    const onFocusSelect = () => {
        //   console.log('focus');
    }

    const onSearchSelect = (val) => {
        // console.log('search:', val);
    }
    const onChangeSelect = (value) => {
        // console.log(`selected ${value}`);
    }

    return (
        <Modal
            visible={visible}
            title="Ajouter un nouveau dossier"
            okText="Ajouter"
            cancelText="Annuler"
            onCancel={() => { form.resetFields(); onCancel() }}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        if (controleNumDossier(listdossiers, values.num)) {
                            setAlert(true)
                        }
                        else {
                            setAlert(false)
                            onCreate(values);
                            form.resetFields();
                        }

                    })
                    .catch((info) => {
                        setAlert(false)
                        console.log('Validate Failed:', info);
                    });
            }}
        >
            {alert && <Alert message="Numéro invalide ou déjà utilisé !" type="error" style={{ textAlign: "center", marginBottom: 20 }} />}

            <Form
                form={form}
                {...layout}
                name="form_in_modal"
                initialValues={{
                    //  client: 'Selectionner un client',
                }}
            >
                <Form.Item
                    name="num"
                    label="Numéro"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        }

                    ]}
                >
                    <Input type="number" />
                </Form.Item>

                <Form.Item
                    name="client"
                    label="CIN client"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        }
                    ]}
                >
                    <Select
                        showSearch
                        allowClear
                        loading={loading}
                        disabled={loading}
                        style={{ width: 200 }}
                        placeholder="Selectionner un client"
                        optionFilterProp="children"
                        onChange={onChangeSelect}
                        onFocus={onFocusSelect}
                        onBlur={onBlurSelect}
                        onSearch={onSearchSelect}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {clients && clients.map((value, index) => (
                            <Option
                                key={index}
                                value={value._id}>
                                {`${value.CIN}: ${value.nom} ${value.prenom}`}
                            </Option>
                        ))}
                        {/* <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="tom">Tom</Option> */}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="Remarques"
                    label="Remarques"
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: 'Please input the title of collection!',
                        }
                    ]}
                >
                    <TextArea type="number" />

                </Form.Item>
            </Form>
            <p style={{ color: "red" }} >**Aprés l'ajout, ce dossier sera automatiqement mis dans la première étape**</p>
        </Modal>
    );
};

export default AddDossierModalForm