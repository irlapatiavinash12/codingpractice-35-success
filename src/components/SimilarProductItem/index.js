// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productItem} = props
  const {imageUrl, title, brand, price, rating} = productItem
  return (
    <li className="list-item-styling">
      <img src={imageUrl} className="image-styling" alt="similar product" />
      <h3 className="title-styling">{title}</h3>
      <p className="brand-styling">by {brand}</p>
      <div className="cost-rating-container">
        <p className="cost-styling">Rs {price}</p>
        <div className="rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="start"
            className="star-img-styling"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
