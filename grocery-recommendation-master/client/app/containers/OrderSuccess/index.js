/*
 *
 * OrderSuccess
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from '../../actions';

import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import axios from 'axios';
import khaltiImg from './khalti.png'
import { API_URL } from '../../constants';

class OrderSuccess extends React.PureComponent {
  state = {
    paymentUrl: ""
  }
  async componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchOrder(id);
    const paymentUrl = await axios.get(`${API_URL}/product/make-payment/${id}`)
    this.state.paymentUrl = paymentUrl.data
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.match.params.id;
      this.props.fetchOrder(id);

    }
  }

  render() {
    const { order, isLoading } = this.props;
    const onMakePayment = async () => {
      window.open(this.state.paymentUrl, '_blank');
    }
    return (
      <div className='order-success'>
        {isLoading ? (
          <LoadingIndicator />
        ) : order._id ? (
          <div className='order-message'>
            <h2>Thank you for your order.</h2>
            <p>
              Order{' '}
              <Link
                to={{
                  pathname: `/order/${order._id}?success`,
                  state: { prevPath: location.pathname }
                }}
                // to={`/order/${order._id}?success`}
                className='order-label'
              >
                #{order._id}
              </Link>{' '}
              is complete.
            </p>
            <p>A confirmation email will be sent to you shortly.</p>
            <p> You can make payment via cash on delivery OR Khalti</p>
            <div style={{ marginTop: "40px", marginBottom: "55px" }}>

              <p style={{ color: "#5D2E8E", fontWeight: 500, fontSize: "20px", marginBottom: "5px" }}>Pay via</p>
              <button style={{ marginTop: "" }} onClick={onMakePayment}>
                <img src={khaltiImg} />
              </button>
            </div>
            <div className='order-success-actions'>
              <Link to='/dashboard/orders' className='btn-link'>
                Manage Orders
              </Link>
              <Link to='/shop' className='btn-link shopping-btn'>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <NotFound message='No order found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    order: state.order.order,
    isLoading: state.order.isLoading
  };
};

export default connect(mapStateToProps, actions)(OrderSuccess);
