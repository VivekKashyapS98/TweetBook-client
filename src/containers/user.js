import React, { Component } from 'react';
import NavBar from "./NavBar";
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import { apiCall } from '../services/api';
import MessageCard from '../components/messageCard';
import DialogBox from '../components/dialogBox';
import FormDialog from '../components/profileEdit';
import '../styling/main.css';

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            load: false,
            navbar: null,
            follow: null
        }
    }
    componentDidMount() {
        let { id } = this.props.match.params;
        const { user } = this.props;
        
        apiCall('get', `/api/users/${id}`)
            .then(data => {
                console.log(data);
                if(id === user.id) {
                    this.setState({user: data, load:true, navbar: "User"});
                } else {
                    if(data.followers.some(value => value._id === user.id)) {
                        this.setState({user: data, load:true, follow: "following"});
                    } else {
                        this.setState({user: data, load:true, follow: "follow"});
                    }
                    
                }
            })
            .catch(err => console.log(err));
    }
    handleFollow() {
        const { follow, user } = this.state;
        let http = '';
        if(follow === "follow") {
            http = "post"
        } else {
            http = "delete"
        }
        apiCall(http, `/api/users/${this.props.user.id}/follow/${user._id}`)
                .then(data => {
                    if(data.tweet === "followed") {
                        this.setState({follow: "following"});
                    } else {
                        this.setState({follow: "follow"});
                    }
                    console.log(data.tweet)
                })
                .catch(err => console.log(err))
    }
    
    editProfile({ bio, profilePic }) {
        let data = {};
        if(profilePic !== null) {
            data = {
                ...data,
                profileImgUrl: profilePic
            } 
        }
        if(bio !== null) {
            data = {
                ...data,
                bio
            }
        }
        apiCall('put', `/api/users/${this.props.user.id}`, data)
                .then(data => console.log(data))
                .catch(err => console.log(err))
    }
    
    render() {
        let user = <CircularProgress />;
        if(this.state.load === true) {
            const { _id, username, profileImgUrl, bio, followers, following, messages } = this.state.user;
            const tweets = messages.map((item, index) => {
                return <MessageCard key={index} userInfo={this.props.user} post={{...item, user: { _id, username, profileImgUrl }}} />
            });
            user = <div>
                <div className="profile-row">
                    <img 
                    className="profile-img" 
                    src={profileImgUrl ? 
                    profileImgUrl : 
                    "https://www.knack.com/images/about/default-profile.png"} 
                    alt="profile-img"
                    />
                    <div className="profile-info">
                        <h1 className="username">{username}</h1>
                        <p style={{color: 'white', maxWidth: '500px'}}>{bio}</p>
                        <DialogBox user={{followers, following}} />
                    </div>
                {
                    this.state.navbar ? 
                    <FormDialog editProfile={(e) => this.editProfile(e)} /> :
                    <Button 
                      component="button"
                      style={{ margin: 'auto 0' }}
                      variant="contained"
                      onClick={() => this.handleFollow()}>
                        {this.state.follow}
                    </Button>
                }
                </div>
                {tweets}
            </div>
        }
        return (
            <React.Fragment>
                <div className="home-page">
                {user}
                </div>
                <NavBar value={this.state.navbar} />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.currentUser.user
});

export default withRouter(connect(mapStateToProps, null)(User));
