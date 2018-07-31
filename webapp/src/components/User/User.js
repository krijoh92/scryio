import React from 'react'
import styled from 'styled-components'
import {Switch, Route} from 'react-router-dom'
import {Layout, Menu, Icon} from 'antd'
import Profile from './Profile'
import LiveScan from './LiveScan'
import Collections from './Collections'

const {Header, Footer, Sider, Content} = Layout

const UserLayout = styled(Layout)`
  &.ant-layout {
    height: 100%;
    .ant-layout-sider-children {
      h1 {
        margin-bottom: 18px;
      }
    }
  }
`

class User extends React.Component {
  state = {
    collapsed: false,
  }

  onCollapse = collapsed => {
    this.setState(() => ({collapsed}))
  }

  navigate = ({key: path}) => {
    this.props.history.push({pathname: path})
  }

  render() {
    const {collapsed} = this.state
    const {
      location: {pathname},
    } = this.props

    return (
      <UserLayout>
        <Layout>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <h1 style={{color: 'white', paddingLeft: collapsed ? 10 : 24}}>
              {collapsed ? 'Scry' : 'Scryio'}
            </h1>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[pathname]}
              onClick={this.navigate}
            >
              <Menu.Item key="/profile">
                <Icon type="user" />
                <span>Profile</span>
              </Menu.Item>
              <Menu.Item key="/live-scan">
                <Icon type="video-camera" />
                <span>Live scan</span>
              </Menu.Item>
              <Menu.Item key="/collections">
                <Icon type="folder" />
                <span>Collections</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <Switch>
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/live-scan" component={LiveScan} />
                <Route exact path="/collections" component={Collections} />
                {/*
                <Route component={Dashboard} /> */}
              </Switch>
            </Content>
            <Footer>Scryio© 1990-2137</Footer>
          </Layout>
        </Layout>
      </UserLayout>
    )
  }
}

export default User
