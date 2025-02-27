import React, { useState } from "react";
import PropTypes from "prop-types";
import Star from "@mui/icons-material/Star";
import StarBorder from "@mui/icons-material/StarBorder";
import StarHalf from "@mui/icons-material/StarHalf";
import { LocalBar } from "@mui/icons-material"; // Beer mug icon
import Tooltip from "@mui/material/Tooltip";

// Helper function to render stars based on rating
const renderStars = (rating) => {
    if (rating === undefined || rating === null) {
        return <p>No rating available</p>;
    }

    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const remainder = rating % 1;
    const halfStar = remainder >= 0.2 && remainder <= 0.8 ? 1 : 0;
    const adjustedFullStars = remainder > 0.8 ? fullStars + 1 : fullStars;
    const emptyStars = totalStars - adjustedFullStars - halfStar;

    const stars = [];
    for (let i = 0; i < adjustedFullStars; i++) stars.push("full");
    for (let i = 0; i < halfStar; i++) stars.push("half");
    for (let i = 0; i < emptyStars; i++) stars.push("empty");

    return (
        <Tooltip title={`Rating: ${rating.toFixed(2)}/5`} arrow>
            <div className="stars">
                {stars.map((star, index) => {
                    if (star === "full") {
                        return <Star key={index} />;
                    } else if (star === "half") {
                        return <StarHalf key={index} />;
                    } else {
                        return <StarBorder key={index} />;
                    }
                })}
            </div>
        </Tooltip>
    );
};

function BeerCard({ beer }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };

    const renderImage = () => {
        if (imageError) {
            return <LocalBar style={{ fontSize: 120, color: "#f39c12", margin: 40 }} />;
        }
        // Return the beer image if it's loaded
        return <img className="beer-image" src={beer.image} alt={beer.name} onError={handleImageError} />;
    };

    return (
        <div className="beer-card">
            {renderImage()}
            <h2>{beer.name}</h2>
            <p className="beer-price">{beer.price}</p>
            <div>{renderStars(beer.rating?.average)}</div>
            <p>{beer.rating.reviews} reviews</p>
        </div>
    );
}

BeerCard.propTypes = {
    beer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string,
        price: PropTypes.string.isRequired,
        rating: PropTypes.shape({
            average: PropTypes.number,
            reviews: PropTypes.number.isRequired
        }).isRequired
    }).isRequired
};

export default BeerCard;