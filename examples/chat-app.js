// import React from "react";

export default function ChatApp() {
  return (
    <div className="chat-app">
      <div className="chat-app__messages">
        <Message
          id="janhaldjha"
          userName="Alex Yeah"
          body="This is a message"
          timeSent={Date.now().toString()}
        />
      </div>
    </div>
  );
}

function Message({ userName, timeSent, body }) {
  const time = new Date(timeSent);

  return (
    <div className="message">
      <div className="message__header">
        <div className="m-h__time">{time.toTimeString()}</div>
        <div className="m-h__user">{userName}</div>
      </div>
      <p className="message__body">{body}</p>
    </div>
  );
}
