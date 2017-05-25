import React from 'react'
import cat from '../../img/cat.png'

export default class PackageView extends React.Component {
	render() {
		const packagesIds = Object.keys(this.props.packages)
			.sort((idA, idB) => this.props.packages[idA].orderKey - this.props.packages[idB].orderKey)

  	return (
      <div className="container body">
    		<div className="home-text PackageView-package-buttons">
          {packagesIds.map(id => {
              if (this.props.finishedPackages[this.props.packages[id].beforePackage]) {
                return <button
                    className="btn btn-lg btn-primary btn-styled"
                    key={id}
                    onClick={() => this.props.startPackage(id)}
                  >
                    {this.props.packages[id].name}
                </button>
              }

              return <button
      					className="btn btn-lg btn-primary btn-styled PackageView-button-disable"
                disabled
                key={id}
              >
    					  {this.props.packages[id].name}
      				</button>
          }
          )}
    		 </div>
    		<img className="home-cat" src={cat} alt="clean code cat" />
    		<div className="clearfix"></div>
    	</div>
    )
  }
}
