import { Layout, Breadcrumb, Spin, Card, Avatar, Button, Row, Col } from 'antd';
import React from 'react';
import { FolderOpenTwoTone } from '@ant-design/icons';
import './dossiers.css'

import { listDossiers } from '../../../api/dossiers'

import Title from 'antd/lib/typography/Title';
import Display from './display';


const { Content } = Layout;

class afficherDossiers extends React.Component {



  constructor(props) {
    super(props)
    this.state = {
      list: [],
      loading: false
    }
  }

  componentDidMount() {
    //this.setState({list : this.state.list.push( this.getlist()) })
    //this.getlist()
  }
  /* getlist = async () => {
    await listDossiers().then(res => {
      // console.log(res)
      console.log(res)
      console.log(Array.from(res))

      // console.log(this.state)
      this.setState({ list: res, loading: false })

      //console.log(this.state)
    })

  } */

  render() {
    return (
      <Content style={{ margin: '0 16px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item >Dashboard</Breadcrumb.Item>
          <Breadcrumb.Item>Dossiers</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 'auto' }}>

          {this.state.loading ? (
            <div className="example">
              <Spin size="large" />
            </div>
          ) : (
              <>
                <Title level={3} style={{ padding: 20, textAlign: "center", color: 'cadetblue', marginBottom: 20 }}>
                  Liste de tous les dossiers
                </Title>
                <Display />
              </>
            )}
        </div>
      </Content >
    );
  }
}

//ReactDOM.render(<SiderDemo />, mountNode);

export default afficherDossiers;