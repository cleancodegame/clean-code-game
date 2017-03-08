import React from 'react'
import { connect } from 'react-redux'
import AppHeader from './View/AppHeader'
import AppFooter from './View/AppFooter'

function AppPage(props) {
  const {tallHeader, children, dispatch, userName} = props
  return (
    <div>
      <AppHeader tall={tallHeader} dispatch={dispatch} userName={userName} />
      <div className="container">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}

export default connect()(AppPage);
