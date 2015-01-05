var models = require("./models.js");

function animate(comp, effect){
    if (!comp) return;
    var $el = $(comp.getDOMNode());
    $el.addClass("animated " + effect);
    $el.one(
        'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', 
        function(){$el.removeClass("animated " + effect)}
    );
}

var CodeMirrorEditor = React.createClass({
    getInitialState: function() {
        return { isControlled: this.props.value != null };
    },

    propTypes: {
        value: React.PropTypes.string,
        defaultValue: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        onChange: React.PropTypes.func,
        onmouseup: React.PropTypes.func
    },

    componentDidMount: function() {
        var isTextArea = this.props.forceTextArea;
        if (!isTextArea) {
            this.editor = CodeMirror.fromTextArea(this.refs.editor.getDOMNode(), this.props);
            this.editor.on('change', this.handleChange);
        }
        this.getDOMNode().onmouseup =
            function(){
                var sel = this.editor.doc.sel.ranges[0].head;
                this.props.onmouseup(sel.line, sel.ch);
            }.bind(this);

    },

    componentDidUpdate: function() {
      if (this.editor) {
        this.editor.setValue(this.props.defaultValue);
      }
    },

    handleChange: function() {
      if (this.editor) {
        var value = this.editor.getValue();
        if (value !== this.props.value) {
          this.props.onChange && this.props.onChange({target: {value: value}});
          if (this.editor.getValue() !== this.props.value) {
            if (this.state.isControlled) {
              this.editor.setValue(this.props.value);
            } else {
              this.props.value = value;
            }
          }
        }
      }
    },

    render: function() {
      var editor = React.createElement('textarea', {
        ref: 'editor',
        value: this.props.value,
        readOnly: this.props.readOnly,
        defaultValue: this.props.defaultValue,
        onChange: this.props.onChange,
        style: this.props.textAreaStyle,
        className: this.props.textAreaClassName || this.props.textAreaClass
      });

      return React.createElement('div', {style: this.props.style, className: this.props.className}, editor);
    }
});



var Code = React.createClass({
    propTypes: {
        sample: React.PropTypes.instanceOf(models.CodeSample).isRequired,
        handleClick: React.PropTypes.func.isRequired
    },

    render: function() {
        return <CodeMirrorEditor 
            key="code" 
            defaultValue={this.props.sample.text} 
            lineNumbers="true"
            mode="text/x-csharp"
            readOnly="nocursor"
            onmouseup={this.props.handleClick}
            />;
    }
});




var Round = React.createClass({
    propTypes: {
        codeSample: React.PropTypes.instanceOf(models.CodeSample).isRequired,
        onNext: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        return {
            codeSample : this.props.codeSample,
            score : 0,
            descriptions: []
        };
    },

    handleShowHint: function(){
        console.log("hint");
    },

    finished: function(){
        return this.state.codeSample.bugsCount == 0;
    },
    
    handleClick: function(line, ch){
        if (this.finished()) return;
        var bug = this.state.codeSample.findBug(line, ch);
        if (bug != null){
            this.setState({
                codeSample: this.state.codeSample.fix(bug),
                score: this.state.score + 10,
                descriptions: _.union(this.state.descriptions, [bug.description]),
            });
            console.log(this.state.codeSample);
        }
        else {
            console.log(this.state.codeSample.bugs);
            this.setState({
                score: this.state.score - 1,
            });
        }
    },

    componentDidUpdate: function(prevProps, prevState) {
        if (prevState.codeSample.bugsCount != this.state.codeSample.bugsCount)
            animate(this.refs.bugsCount, "bounce");
        if (prevState.score < this.state.score)
            animate(this.refs.score, "flipInX");
        else if (prevState.score > this.state.score)
            animate(this.refs.score, "rubberBand");
        if (this.finished())
            animate(this.refs.title, "flipInX");
        animate(this.refs.lastDesc, "fadeIn");
    },
    
    renderDescriptions: function(){
        if (this.state.descriptions.length == 0) return "";
        return <div>
            <h3>Explanation:</h3>
            <ol>
                {this.state.descriptions.map(function(d, i){
                    if (i == this.state.descriptions.length-1)
                        return <li key={i} ref={"lastDesc"} className="last-desc">{d}</li>    
                    else
                        return <li key={i}>{d}</li>
                }.bind(this))}
            </ol>
        </div>
    },

    renderNextButton: function(){
        if (!this.finished()) return "";
        return <button 
                className="pull-right btn btn-lg btn-success"
                onClick={this.props.onNext}>Next Piece of Code</button>
    },

    renderTitle: function(){
        if (this.finished()) return <h2 ref="title">Good job!</h2>;
        return <h2>
            Find <span ref="bugsCount">{this.state.codeSample.bugsCount}</span> more code style issues
            </h2>;
    },

    render: function() {
        return  (
            <div className="round">
              <div className="row">
                <div className="col-sm-12">
                    {this.renderTitle()}
                    <p>Point and click on every code style drawbacks you find in this piece of code.</p>
                    <Code sample={this.state.codeSample} handleClick={this.handleClick} />
                    <div className="score">
                        Your score: <span className="score-value" ref="score">{this.state.score}</span> 
                        {this.renderNextButton()}
                    </div>
                    {this.renderDescriptions()}
                </div>
              </div>
            </div>
            );
    }

});

exports.Round=Round;