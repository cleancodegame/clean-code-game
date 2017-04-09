import { connect } from 'react-redux'
import App from './App'

const mapStateToProps = (state) => {
    return { game: state.game }
}

const mapDispatchToProps = (dispatch) => {
    return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
