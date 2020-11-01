import { Layout } from 'antd';
import React from 'react';

const { Footer } = Layout;


class FooterLayout extends React.Component {

  render() {
    return (
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    );
  }
}


export default FooterLayout;