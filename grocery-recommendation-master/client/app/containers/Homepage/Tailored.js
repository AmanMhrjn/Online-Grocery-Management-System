import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL } from '../../constants';
import actions from '../Account/actions';
import { Link } from 'react-router-dom';

const Tailored = (props) => {
  const [data, setData] = useState([]);
  const user = props.user

  console.log("User props is", user)
  const fetchData = async useremail => {
    const res = await axios.get(
      `${API_URL}/product/tailored-recommended/${useremail}`
    );
    console.log('Res is', res);
    setData(res.data);
  };

  useEffect(() => {
    if (user && user.email) {
      fetchData(user.email);
    }

  }, [user]);

  if (data.length === 0) return null;
  // let sliceData = data.slice(0, 4);

  return (
    <div className='product-container my-5'>
      <h2 className='pb-3'>For You</h2>
      <div className='product-list'>
        {data.length > 0 &&
          data.slice(0, 4).map((product, index) => {
            return (
              <div key={index} className='mb-3 mb-md-0'>
                <div className='product-container'>
                  <div className='item-box'>
                    <div className='item-link'>
                      <Link
                        to={`/product/${product?.slug}`}
                        className='d-flex flex-column h-60'
                      >
                        <div className='item-image-container'>
                          <div className='item-image-box'>
                            <img
                              className='item-image'
                              src={`${product.imageUrl
                                ? product.imageUrl
                                : '/images/placeholder-image.png'
                                }`}
                            />
                          </div>
                        </div>
                        <div className='item-body'>
                          <div className='item-details p-3'>
                            <h1 className='item-name'>{product.name}</h1>
                            {product.brand &&
                              Object.keys(product.brand).length > 0 && (
                                <p className='by'>
                                  By <span>{product.brand.name}</span>
                                </p>
                              )}
                            <p className='item-desc mb-0'>
                              {product.description}
                            </p>
                          </div>
                        </div>
                        <div className='d-flex flex-row justify-content-between align-items-center px-4 mb-2 item-footer'>
                          <p className='price mb-0'>Rs.{product.price}</p>
                          {product.totalReviews > 0 && (
                            <p className='mb-0'>
                              <span className='fs-16 fw-normal mr-1'>
                                {parseFloat(product?.averageRating).toFixed(1)}
                              </span>
                              <span
                                className={`fa fa-star ${product.totalReviews !== 0 ? 'checked' : ''
                                  }`}
                                style={{ color: '#ffb302' }}
                              ></span>
                            </p>
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};


const mapStateToProps = state => {
  return {
    user: state.account.user,
    resetFormData: state.resetPassword.resetFormData,
    formErrors: state.resetPassword.formErrors
  };
};


export default connect(mapStateToProps, actions)(Tailored);
