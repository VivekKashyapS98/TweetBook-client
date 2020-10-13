import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from "./NavBar";
import MessageCard from '../components/messageCard';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadMessages } from '../store/actions/actionCreators';
import '../styling/main.css';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feed: null
        }
    }
    componentDidMount() {
        this.props.loadMessages()
            .then(data => {
                this.setState({feed: data});
                console.log(this.state.feed);
            })
            .catch(err => {
                this.setState({feed: err});
            })
    }
    render() {
        let feed = <div className="loading"><CircularProgress /></div>;
        if(this.state.feed !== null) {
            feed = this.state.feed.map((item, index) => {
                return <MessageCard key={index} post={item} />
            });
        }
        return (
            <React.Fragment>
            <div className="home-page">
                {feed}
            </div>
                <NavBar value={"Home"} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    messages: state.messages
});

export default connect(mapStateToProps, {loadMessages})(Home);