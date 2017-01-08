import { connect } from 'react-redux'
import App from './App'
import {startGame} from '../actions'

const mapStateToProps = (state) => {
    return { game: state }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onStartGame: () => {
            dispatch(startGame())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
