import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import {
  LogoutOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { Layout, Typography, Tooltip, Button, Avatar } from 'antd';
import Cookies from 'universal-cookie';

import { paths } from '../config/constants'
import { getJwt, getConnectedUser } from '../helpers/userdata'
import { logout } from '../api/auth'



const { Header } = Layout;
const { Title } = Typography;

function HeaderLyout() {

  let history = useHistory()
  const cookies = new Cookies();
  const [user, setUser] = useState(getConnectedUser())

  /*  useEffect(()=>{
       setUser(getConnectedUser())
   },[]) */
  const Logout = async () => {



    enterLoading(2);
    /* await axios.post(`${Api.baseURL}/logout`, {
        refresh_token : getJwt().refreshToken
      }) */
    await logout({ refresh_token: getJwt().refreshToken })
      .then(res => {
        //console.log(res.status)
        cookies.remove('connecter_user', { path: '/' });
        history.push(paths.LOGIN);
      }).catch(err => console.log(err))

  }

  const [loadings, setLoadings] = useState([])

  const enterLoading = index => {


    const newLoadings = [...loadings];
    newLoadings[index] = true;
    setLoadings(newLoadings)

    setTimeout(() => {
      const newLoadings = [...loadings];
      newLoadings[index] = false;
      setLoadings(newLoadings)
    }, 6000);

  };


  return (
    <Header className="site-layout-background"
      style={{ position: 'sticky', zIndex: 1, top: 0, height: 'auto', width: '100%', padding: 20 }}  >
      <Tooltip title="Se déconnecter" >
        <Button onClick={Logout} loading={loadings[2]}
          style={{ float: 'right' }} type="primary" shape="circle" icon={<LogoutOutlined />} />
      </Tooltip>

      <Avatar size={60} style={{ float: 'left', backgroundColor: 'cadetblue' }} type="primary" icon={<AuditOutlined />} />

      <Title level={3} style={{ color: 'white', marginLeft: 100, marginTop: 15 }}>
        {user.role === 'admin' ? <>Administrateur : {user.username} </> : <>Conseiller client  : {user.username}</>}
      </Title>
    </Header>
  )

}
export default HeaderLyout