// Write your code here

import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsPlusSquare} from 'react-icons/bs'
import {BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class ProductItemDetails extends Component {
  state = {
    quantity: 1,
    productDetails: {},
    similarProductData: [],
    apiStatus: apiStatusConstants.initial,
  }

  renderLoadingView = () => (
    <div className="products-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="renderFailure-styling">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button className="continue-button-styling" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  componentDidMount = () => {
    this.renderProductDetails()
  }

  formattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    price: data.price,
    description: data.description,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    style: data.style,
  })

  renderProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const formattedProductDetails = this.formattedData(data)
      console.log(formattedProductDetails)
      const formattedSimilarProducts = data.similar_products.map(eachItem =>
        this.formattedData(eachItem),
      )
      console.log(formattedSimilarProducts)
      this.setState({
        productDetails: formattedProductDetails,
        similarProductData: formattedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    }

    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderDecrementView = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState({quantity: quantity - 1})
    }
  }

  renderIncrementView = () => {
    const {quantity} = this.state
    this.setState({quantity: quantity + 1})
  }

  renderSuccessView = () => {
    const {productDetails, similarProductData, quantity} = this.state

    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetails

    return (
      <div className="success-view">
        <div className="product-details">
          <img src={imageUrl} alt="product" className="product-thumb-image" />
          <div className="productData-container">
            <h1 className="title-styling">{title}</h1>
            <p className="price-styling">Rs {price}</p>
            <div className="review-rating-container">
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-styling"
                />
              </div>
              <p className="reviews-styling">{totalReviews} Reviews</p>
            </div>
            <p className="description-styling">{description}</p>
            <div className="availability-container">
              <p className="label-styling">Availability: </p>
              <p className="value-styling">{availability}</p>
            </div>
            <div className="availability-container">
              <p className="label-styling">Brand: </p>
              <p className="value-styling">{brand}</p>
            </div>
            <hr className="horizontal-line-styling" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-button-styling"
                onClick={this.renderDecrementView}
                testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="quantity-styling">{quantity}</p>
              <button
                type="button"
                testid="plus"
                className="quantity-button-styling"
                onClick={this.renderIncrementView}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1>Similar Products</h1>
          <ul className="similar-products-styling">
            {similarProductData.map(eachItem => (
              <SimilarProductItem productItem={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProducts = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProducts()}
      </>
    )
  }
}

export default ProductItemDetails
