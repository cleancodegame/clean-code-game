import { connect } from 'react-redux'
import ProgressBar from './ProgressBar';


function mapStateToProps(state){
  return {
    max: state.levelsCount,
    completed: state.currentLevelIndex
  }  
}

function mapDispatchToProps(dispatch){
  return {};
}

const ProgressBarContainer = connect(
  mapStateToProps, 
  mapDispatchToProps
  )(ProgressBar);

export default ProgressBarContainer;