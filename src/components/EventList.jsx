import React from "react";
import { connect } from "react-redux";
import { getEventList } from './../redux/actions/eventActions';
import Blockies from 'react-blockies';
import { makeStyles } from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles(theme => ({
  loadingSec: {
    background: "#fff",
    margin: "50px auto",
    border: "1px #eee solid",
    width: "700px !important",
    boxShadow: "1px 0px 8px 2px rgba(62, 118, 244, 0.14)",
    borderRadius:"5px",
    padding: "20px",
    fontSize: "22px"
  },
  eventList: {
    background: "#fff",
    borderBottom: "2px #eee solid",
    boxShadow: "1px 0px 8px 2px rgba(62, 118, 244, 0.14)",
    borderRadius:"6px",
    padding: "20px",
    height: "100px",
    textAlign: "left"
  }
}));


function EventList(props) {
  const {
    getEventList,
    eventList
  } = props;

  const classes = useStyles();

  React.useEffect(() => {
    getEventList()
  }, []);

  React.useEffect(() => {
    console.log('eventListeventList', eventList);
    eventList.sort(function(a,b){
      return new Date(b.date) - new Date(a.date);
    });
  }, [eventList])

  const copyToClipboard = () => {
    // alert('Copied!');
    console.log('Copied!');
  }

  if (eventList.length === 0) {
    return (
      <div className="container">
        <div className={classes.loadingSec}>
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="header-sec">
      <div className="container event-sec">
        {eventList.map((list, i) => (
          list.type === 'PayoutClaimed'
          ?
            <div key={i} className={classes.eventList}>
               <Blockies
                seed={list.userAddress}
                size={13}
                scale={4}
                color={list.color}
                bgColor={list.bgColor}
                spotColor={list.spotColor}
              />  
              <div className="event-title-sec">
                <p className="title">User <strong>{list.userAddress}</strong> claimed <strong>{list.amount}{list.token}</strong> payout from pot <strong>{list.foundingPotId}</strong></p>
                <p className="date">{list.dateTime}
                <CopyToClipboard text={`User ${list.userAddress} claimed ${list.amount}{list.token} payout from pot ${list.foundingPotId}`}
                onCopy={copyToClipboard}>
                  <span>Copy</span>
                </CopyToClipboard>
                </p>
              </div>
            </div>
          : list.type === 'ColonyInitialised'
            ?
            <div key={i} className={classes.eventList}>
               <Blockies
                seed={list.userAddress}
                size={13}
                scale={4}
                color={list.color}
                bgColor={list.bgColor}
                spotColor={list.spotColor}
              />  
              <div className="event-title-sec">
                <p className="title">Congratulations! It's a beautiful baby colony!</p>
                <p className="date">{list.dateTime}
                <CopyToClipboard text={`Congratulations! It's a beautiful baby colony!`}
                onCopy={copyToClipboard}>
                  <span>Copy</span>
                </CopyToClipboard>
                </p>
              </div>
            </div>
            : list.type === 'ColonyRoleSet'
            ?
            <div key={i} className={classes.eventList}>
                <Blockies
                seed={list.userAddress}
                size={13}
                scale={4}
                color={list.color}
                bgColor={list.bgColor}
                spotColor={list.spotColor}
              />  
              <div className="event-title-sec">
                <p className="title">
                <strong>Role</strong> role assigned to user <strong>{list.userAddress}</strong> in domain domainId.</p>
                <p className="date">{list.dateTime}
                <CopyToClipboard text={`Role role assigned to user ${list.userAddress} in domain domainId.`}
                onCopy={copyToClipboard}>
                  <span>Copy</span>
                </CopyToClipboard>
                </p>
              </div>
            </div>
            : list.type === 'DomainAdded'
              ? 

              <div key={i} className={classes.eventList}>
                <Blockies
                seed={list.userAddress}
                size={13}
                scale={4}
                color={list.color}
                bgColor={list.bgColor}
                spotColor={list.spotColor}
              />  
              <div className="event-title-sec">
                <p className="title">
                Domain <strong>domainId</strong>added.</p>
                <p className="date">{list.dateTime}
                <CopyToClipboard text={`Domain domainId added.`}
                onCopy={copyToClipboard}>
                  <span>Copy</span>
                </CopyToClipboard>
                </p>
              </div>
            </div>
            :null
          )
        )
        }
      </div>
    </div>
  );
}

//this map the states to our props in this functional component
const mapStateToProps = (state) => ({
  eventList: state.event.eventList,
});

//this map actions to our props in this functional component
const mapActionsToProps = {
  getEventList,
};

export default connect(mapStateToProps, mapActionsToProps)(EventList);
