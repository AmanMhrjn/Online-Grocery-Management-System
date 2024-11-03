import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';
import { Link } from 'react-router-dom';

const FrequentlyBought = ({ slug }) => {
    const [data, setData] = useState([])

    const fetchData = async () => {
        const res = await axios.get(`${API_URL}/order/frequently-bought/${slug}`)
        console.log("Res is", res)
        setData(res.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (data.length === 0) return null

    return <div className='product-container'>
        <h2>Frequently Bought</h2>
        <div className='product-list'>


            {data.length > 0 && data.map((product, index) => {
                return <div key={index} className='mb-3 mb-md-0'>
                    <div className='product-container'>
                        <div className='item-box'>

                            <div className='item-link'>
                                <Link
                                    to={`/product/${product.slug}`}
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
                                            {product.brand && Object.keys(product.brand).length > 0 && (
                                                <p className='by'>
                                                    By <span>{product.brand.name}</span>
                                                </p>
                                            )}
                                            <p className='item-desc mb-0'>{product.description}</p>
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
            })}
        </div>
    </div>

}

export default FrequentlyBought