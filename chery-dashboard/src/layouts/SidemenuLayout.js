import { Layout, Menu } from 'antd';
import React, { Component, useState, useEffect } from 'react';
import {
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  FolderOpenOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  MailOutlined
} from '@ant-design/icons';

import { Link } from 'react-router-dom'

import { paths } from '../config/constants'
import { getConnectedUser } from '../helpers/userdata'
import { connect, useDispatch, useSelector } from 'react-redux';
import allActions from '../redux/actionsStore';

const { Sider } = Layout;
const SidemenuLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false)
  //const [selectedKey, setSelectedKey] = useState(useSelector(state => state.selectedItemReducer.selectedKey))
  const selectedKey = useSelector(state => state.selectedItemReducer.selectedKey)
  /* state = {
    collapsed: false,
  }; */
  const dispatch = useDispatch()

  useEffect(() => {
    //dispatch(allActions.sideMenuActions.changeSelectedItemAction(2))

  }, [])




  const onCollapse = collapsed => {
    // this.setState({ collapsed });
    //this.props.collapseHandler(collapsed)
    setCollapsed(collapsed)
    props.collapseHandler(collapsed)
  };

  // render() {


  return (<>


    < Sider collapsible collapsed={collapsed} onCollapse={onCollapse}
      /* style={{marginTop:84}}  */
      style={{ overflow: 'auto', position: 'fixed', zIndex: 1, height: '100%', width: 'auto' }
      }>
      {/*  <div className="logo" /> */}
      < Menu onClick={(e) => {
        dispatch(allActions.sideMenuActions.changeSelectedItemAction(e.key))
      }}
        theme="dark" defaultSelectedKeys={['1']} mode="inline" selectedKeys={[selectedKey]}  >
        <Menu.Item key="1" icon={<HomeOutlined />} >
          <Link to={{ pathname: paths.DASHBOARD, component: paths.DASHBOARD }} />
          Accueil
        </Menu.Item>

        <Menu.Item key="2" icon={<UserOutlined />} >
          <Link to={{ pathname: paths.DASHBOARD, component: paths.CLIENTS }} />
          Clients
            </Menu.Item>
        <Menu.Item key="3" icon={<FolderOpenOutlined />}>
          <Link to={{ pathname: paths.DASHBOARD, component: paths.DOSSIERS }} />
          Dossiers
            </Menu.Item>
        {getConnectedUser().role === "admin" && <>
          <Menu.Item key="4" icon={<CheckCircleOutlined />}>
            <Link to={{ pathname: paths.DASHBOARD, component: paths.ETATS }} />
            États
            </Menu.Item>


          <Menu.Item key="5" icon={<TeamOutlined />}>
            <Link to={{ pathname: paths.DASHBOARD, component: paths.CONSEILLERS }} />
            Conseillers et admins
                </Menu.Item>


          <Menu.Item key="6" icon={<HistoryOutlined />}>
            <Link to={{ pathname: paths.DASHBOARD, component: paths.HISTORIQUES }} />
            Historique
            </Menu.Item>
          <Menu.Item key="7" icon={<MailOutlined />}>
            <Link to={{ pathname: paths.DASHBOARD, component: paths.EMAIL_SMS }} />
            Mail et SMS
            </Menu.Item>
        </>}
      </Menu >
    </Sider >
  </>)
}
//}
export default SidemenuLayout

/* function mapStateToProps(state) {
  return {
    selection: state.selectedKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeSelection: (key) => {
      dispatch({
        type: 'CHANGE_SELECTED_ITEM',
        payload: {
          key: key,
        }
      })
    },
    getSelection: () => { dispatch({ type: 'GET_SELECTED_ITEM' }) }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SidemenuLayout) */