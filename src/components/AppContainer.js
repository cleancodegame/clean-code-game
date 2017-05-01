import { connect } from 'react-redux'
import App from './App'

const mapStateToProps = (state) => {
    return {
      game: state.game,
      auth: state.auth,
      user: state.user,
      scoreboard: state.scoreboard,
   }
}

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
