import React, { useState } from 'react'
import { Form, Input, Button, Alert } from 'antd';

import { useHistory } from "react-router-dom";
import Cookies from 'universal-cookie';
import { paths, Api } from '../../../config/constants'

import { login } from '../../../api/auth'

import axios from 'axios'
import { useDispatch } from 'react-redux';
import allActions from '../../../redux/actionsStore';
import { controleDisponibilitéConseiller } from '../../../helpers/checkDataEntry';


const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 20,
  },
};
const tailLayout = {
  wrapperCol: {
    // offset: 8,
    span: 17,
  },
};

const LoginForm = () => {

  let history = useHistory()
  const cookies = new Cookies();
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(false)
  const [alertDelete, setAlertDelete] = useState(false)

  const dispatch = useDispatch()

  const onFinish = async (values) => {

    console.log('Success:', values);

    await login({ email: values.email, password: values.password })
      .then((res) => {

        console.log(res.status)
        if (res.status === 403) {//if conseiller is removed
          setAlertDelete(true)
          setLoading(false)
        }
        else {
          cookies.set('connecter_user', res.data, { path: '/' });

          dispatch(allActions.sideMenuActions.changeSelectedItemAction("1"))

          history.push(paths.DASHBOARD)
          setLoading(false)
          setAlert(false)
          setAlertDelete(false)
        }
      })
      .catch(err => {
        setAlert(false)
        setAlertDelete(false)
        console.log(res);
        setLoading(false)
        var res = err.toString().slice(39, err.length);
        if (res === "403") setAlertDelete(true)
        else setAlert(true)

      })

  };

  const onFinishFailed = (errorInfo) => {
    setLoading(false)
    setAlert(false)
    setAlertDelete(false)
    console.log('Failed:', errorInfo);

  };


  return (<>
    {alert && <Alert message="Email ou mot de passe incorrecte" type="error" style={{ marginBottom: 20 }} />}
    {alertDelete && <Alert message="Compte banné ou supprimé" type="error" style={{ marginBottom: 20 }} />}


    <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}

    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            whitespace: true,

            message: 'Please input your email!',
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
        label="Password"
        name="password"
        rules={[
          {
            whitespace: true,

            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      {/* <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

      <Form.Item  {...tailLayout}>
        {/*  <Button type="primary" htmlType="submit" >
          Submit
        </Button> */}


        <Button type="primary" htmlType="submit" loading={loading} onClick={() => setLoading(true)} >
          Submit
        </Button>
      </Form.Item>



    </Form>
  </>);
};

export default LoginForm

