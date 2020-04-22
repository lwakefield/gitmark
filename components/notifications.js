import { connect } from 'unistore/preact';

export default connect('notification')(({ notification }) => {
  if (!notification) return null;

  const style = {};
  if (notification.type === 'success') style.color = 'green';
  if (notification.type === 'error') style.color = 'red';

  return (
    <div style={style}>{ notification.message }</div>
  );
});
