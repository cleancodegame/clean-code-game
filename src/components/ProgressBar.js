import React from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import './ProgressBar.css'

function ProgressBar({max, completed}) {
    const tiles = _.range(max)
        .map(i => <td key={"tile" + i} className={classnames("progressbar__tile", {"progressbar__tile_completed": i < completed})} />);
    return <table className="progressbar"><tbody><tr>{tiles}</tr></tbody></table>
}

export default ProgressBar;