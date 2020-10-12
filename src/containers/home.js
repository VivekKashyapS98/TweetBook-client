import React, { Component } from 'react';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import { withRouter } from 'react-router-dom';
import { loadMessages } from '../store/actions/actionCreators';

class Home extends Component {
    createTweet() {
        this.props.history.push("/usr/newTweet");
    }
    render() {
        return (
            <React.Fragment>
                    <Fab 
                     component="button" 
                     color="primary" 
                     onClick={() => this.createTweet()}
                    >
                    <AddIcon />
                    </Fab>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    messages: state.messages
});

export default withRouter(connect(mapStateToProps, {loadMessages})(Home));