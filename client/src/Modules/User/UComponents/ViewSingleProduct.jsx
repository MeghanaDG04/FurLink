import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosConfig";
import {
  Container,
  Grid,
  Typography,
  CardMedia,
  Box,
  Chip,
  Button,
  Paper,
  IconButton,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import ReplayIcon from "@mui/icons-material/Replay";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const StarRating = ({ value, onChange, readOnly = false, size = "small" }) => (
  <Rating
    value={value}
    onChange={onChange}
    readOnly={readOnly}
    size={size}
    emptyIcon={<StarIcon style={{ opacity: 0.3 }} />}
  />
);

const ReviewCard = ({ review }) => (
  <Box sx={{ py: 2, borderBottom: "1px solid #eee" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
      <Avatar sx={{ bgcolor: "#667eea", width: 36, height: 36 }}>
        {review.userName?.charAt(0) || "U"}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          {review.userName || "Anonymous"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {review.date || "Recently"}
        </Typography>
      </Box>
    </Box>
    <StarRating value={review.rating || 4} readOnly size="small" />
    <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
      {review.comment || "Great product! My pet loves it."}
    </Typography>
  </Box>
);

const FeedbackForm = ({ productId, onFeedbackSubmitted }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !comment) return;
    setSubmitting(true);
    try {
      await axiosInstance.post("/feedback/add", {
        targetId: productId,
        targetType: "product",
        rating,
        comment
      });
      setRating(0);
      setComment("");
      setOpen(false);
      onFeedbackSubmitted();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ mt: 2 }}>
        Write a Review
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>Rating</Typography>
            <Rating value={rating} onChange={(e, val) => setRating(val)} size="large" />
          </Box>
          <TextField
            label="Comment"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!rating || !comment || submitting}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ProductCard = ({ product, onSelect, isCompact = false }) => (
  <Card
    onClick={() => onSelect(product)}
    sx={{
      cursor: "pointer",
      borderRadius: 3,
      transition: "0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
      }
    }}
  >
    <CardMedia
      component="img"
      height={isCompact ? 120 : 180}
      image={product.productimage ? `http://localhost:7000/image/${product.productimage}` : "/fallback.jpg"}
      alt={product.name}
      sx={{ objectFit: "contain", p: 1 }}
    />
    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
      <Typography
        variant="subtitle2"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap"
        }}
      >
        {product.name}
      </Typography>
      {!isCompact && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {product.description?.substring(0, 50)}...
        </Typography>
      )}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1, color: "#1976d2" }}>
        ₹{product.price}
      </Typography>
    </CardContent>
  </Card>
);

const ProductCarousel = ({ title, products, onSelectProduct }) => {
  const scrollRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    checkScroll();
  }, [products]);

  return (
    <Box sx={{ mt: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            sx={{ background: "#f5f5f5", "&:hover": { background: "#e0e0e0" } }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            sx={{ background: "#f5f5f5", "&:hover": { background: "#e0e0e0" } }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          pb: 1
        }}
      >
        {products?.map((product, index) => (
          <Box key={product._id || index} sx={{ minWidth: 240 }}>
            <ProductCard product={product} onSelect={onSelectProduct} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default function ViewSingleProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviewExpanded, setReviewExpanded] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [feedbacks, setFeedbacks] = useState([]);

  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

const fetchWishlist = async () => {
      try {
        const res = await axiosInstance.get("/wishlist/");
        const wishlistProducts = res.data.wishlist?.products?.map(p => p._id) || [];
        setIsWishlisted(wishlistProducts.includes(id));
      } catch (err) {
        console.log("No wishlist found:", err.message);
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const res = await axiosInstance.get(`/feedback/target/product/${id}`);
        setFeedbacks(res.data.feedbacks || []);
      } catch (err) {
        console.log("No feedbacks found:", err.message);
      }
    };

const mockImages = [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600",
    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
    "https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600"
  ];

  const mockRecommended = [
    { _id: "1", name: "Premium Dog Food", price: 899, description: "Nutritious and delicious", productimage: null },
    { _id: "2", name: "Rubber Chew Toy", price: 249, description: "Durable and safe", productimage: null },
    { _id: "3", name: "Pet Bowl Set", price: 399, description: "Easy to clean", productimage: null },
    { _id: "4", name: "Cozy Pet Bed", price: 1299, description: "Soft and comfortable", productimage: null }
  ];

  const mockBundle = [
    { _id: "5", name: "Dental Chews", price: 299, productimage: null },
    { _id: "6", name: "Vitamin Supplement", price: 449, productimage: null }
  ];

  const getImageUrl = (img) => {
    if (!img) return "/fallback.jpg";
    return img.startsWith("http") ? img : `http://localhost:7000/image/${img}`;
  };

  const productImages = product?.productimage 
    ? [product.productimage, ...mockImages].slice(0, 5)
    : [...mockImages].slice(0, 5);

  const fetchSingleProduct = async () => {
    try {
      const res = await axiosInstance.get(`/product/getsingleproduct/${id}`);
      const pdata = res.data.pdata;
      setProduct(pdata);
      setRecommendedProducts(mockRecommended);
      setFrequentlyBoughtTogether(mockBundle);
      setRelatedProducts(mockRecommended.slice(0, 3));
      setRecentlyViewed([...mockRecommended].reverse().slice(0, 4));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
    fetchWishlist();
    fetchFeedbacks();
  }, [id]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.quantity || 10)) {
      setQuantity(newQty);
    }
  };

   const handleShare = (platform) => {
     const url = window.location.href;
     const text = `Check out this product: ${product?.name}`;
     
     if (platform === "twitter") {
       window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
     } else if (platform === "whatsapp") {
       window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
     } else if (platform === "linkedin") {
       window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
     }
   };

   const toggleFavorite = async () => {
     const token = localStorage.getItem("Token");
     if (!token) {
       setSnackbar({ open: true, message: "Please login to add to wishlist", severity: "info" });
       return;
     }

     if (isWishlisted) {
       setIsWishlisted(false);
       try {
         await axiosInstance.delete("/wishlist/remove", {
           data: { itemId: product._id, type: "product" },
         });
         setSnackbar({ open: true, message: "Removed from wishlist", severity: "success" });
       } catch (err) {
         console.error("Error:", err);
       }
     } else {
       setIsWishlisted(true);
       try {
         await axiosInstance.post("/wishlist/product", { productId: product._id });
         setSnackbar({ open: true, message: "Added to wishlist", severity: "success" });
       } catch (err) {
         setIsWishlisted(false);
         console.error("Error:", err);
       }
     }
   };

   const addToCart = async () => {
     const token = localStorage.getItem("Token");
     if (!token) {
       setSnackbar({ open: true, message: "Please login to add to cart", severity: "info" });
       return;
     }

     try {
       await axiosInstance.post("/cart/product", { productId: product._id, quantity });
       setSnackbar({ open: true, message: `Added ${quantity} item(s) to cart`, severity: "success" });
     } catch (err) {
       setSnackbar({ open: true, message: "Failed to add to cart", severity: "error" });
     }
   };

   const calculateSavings = () => {
    if (!product?.price) return null;
    const originalPrice = product.price * 1.25;
    const savings = originalPrice - product.price;
    const discountPercent = Math.round((savings / originalPrice) * 100);
    return { originalPrice, savings, discountPercent };
  };

  const savings = calculateSavings();

  const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        <Skeleton variant="text" width="60%" height={40} sx={{ mt: 3 }} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="80%" />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            mb: 2,
            background: "#f5f5f5",
            "&:hover": { background: "#e0e0e0" }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 5, background: "#ffffff" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <Box
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                sx={{
                  overflow: "hidden",
                  borderRadius: 4,
                  background: "#f8fafc",
                  position: "relative"
                }}
              >
                <CardMedia
                  component="img"
                  height="450"
                  image={getImageUrl(productImages[selectedImage])}
                  alt={product.name}
                  sx={{
                    borderRadius: 3,
                    transition: "transform 0.4s ease",
                    transform: isZoomed ? "scale(1.5)" : "scale(1)",
                    transformOrigin: "center center",
                    objectFit: "contain",
                    cursor: isZoomed ? "zoom-in" : "default"
                  }}
                />
              </Box>

              {productImages.length > 1 && (
                <Box sx={{ display: "flex", gap: 1.5, mt: 2, overflowX: "auto" }}>
                  {productImages.map((img, index) => (
                    <Box
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        border: selectedImage === index ? "2px solid #667eea" : "2px solid transparent",
                        opacity: selectedImage === index ? 1 : 0.7,
                        transition: "0.3s",
                        "&:hover": { opacity: 1 }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="100%"
                        image={getImageUrl(img)}
                        sx={{ objectFit: "contain" }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                  <Chip
                    label={product.category?.category || "Pet Supplies"}
                    color="secondary"
                    sx={{ fontWeight: 600 }}
                  />
                  {savings?.discountPercent > 0 && (
                    <Chip
                      label={`${savings.discountPercent}% OFF`}
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>

                <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {product.name}
                </Typography>

                {/* <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5 }}>
                  <StarRating value={4.5} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    <span style={{ fontWeight: 600, color: "#1976d2" }}>4.5</span> (128 reviews)
                  </Typography>
                </Box> */}
              </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={toggleFavorite}
                  sx={{
                    background: "#f5f5f5",
                    "&:hover": { background: "#fee2e2" },
                    color: isWishlisted ? "#e53935" : "text.secondary"
                  }}
                >
                  {isWishlisted ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton
                  onClick={() => handleShare("twitter")}
                  sx={{
                    background: "#f5f5f5",
                    "&:hover": { background: "#e0e0e0" }
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <Typography variant="h3" fontWeight={700} sx={{ color: "#1976d2" }}>
                  ₹{product.price}
                </Typography>
                {savings && (
                  <>
                    <Typography
                      variant="h6"
                      sx={{ textDecoration: "line-through", color: "gray" }}
                    >
                      ₹{Math.round(savings.originalPrice)}
                    </Typography>
                    <Chip
                      label={`Save ₹${Math.round(savings.savings)}`}
                      size="small"
                      sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}
                    />
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, bgcolor: "#f0fdf4", borderRadius: 2 }}>
                <LocalShippingOutlined sx={{ color: "#22c55e" }} />
                <Typography variant="body2" fontWeight={500}>
                  Free delivery by {getDeliveryDate()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, bgcolor: "#fff7ed", borderRadius: 2 }}>
                <ReplayIcon sx={{ color: "#f97316" }} />
                <Typography variant="body2" fontWeight={500}>
                  7-day return policy
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Box sx={{ mt: 3, p: 2, bgcolor: "#f8fafc", borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                Product Features:
              </Typography>
              <List dense>
                {["Premium quality materials", "Pet-safe and non-toxic", "Easy to clean", "Durable construction"].map((feature, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: "#22c55e" }} />
                    </ListItemIcon>
                    <ListItemText primary={feature} primaryTypographyProps={{ variant: "body2" }} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Quantity:
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #ddd", borderRadius: 2 }}>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || product.quantity <= 0}
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    if (val >= 1 && val <= (product?.quantity || 10)) {
                      setQuantity(val);
                    }
                  }}
                  size="small"
                  disabled={product.quantity <= 0}
                  sx={{
                    width: 60,
                    "& .MuiInputBase-input": { textAlign: "center", p: 1 }
                  }}
                />
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product?.quantity || 10) || product.quantity <= 0}
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ 
                color: product.quantity <= 0 ? "#f44336" : "text.secondary",
                fontWeight: product.quantity <= 0 ? 600 : 400
              }}>
                {product.quantity > 0 ? `(${product.quantity} in stock)` : "⚠ Out of Stock"}
              </Typography>
            </Box>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<ShoppingCartOutlined />}
                disabled={product.quantity <= 0}
                onClick={addToCart}
                sx={{
                  flex: 1,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5568d3, #6540a0)"
                  }
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                disabled={product.quantity <= 0}
                sx={{
                  flex: 1,
                  py: 1.8,
                  borderRadius: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  borderColor: product.quantity <= 0 ? "#ccc" : "#667eea",
                  color: product.quantity <= 0 ? "#999" : "#667eea",
                  "&:hover": {
                    borderColor: product.quantity <= 0 ? "#ccc" : "#667eea",
                    bgcolor: product.quantity <= 0 ? "#f5f5f5" : "#f5f7ff"
                  }
                }}
                onClick={() => {
                localStorage.setItem("selectedProduct", JSON.stringify(product));
                navigate('/bookingform');
              }}
              >
                {product.quantity <= 0 ? "Out of Stock" : "Buy Now"}
              </Button>
            </Box>
          </Grid>
        </Grid>
</Paper>

      <Accordion
        expanded={reviewExpanded}
        onChange={() => setReviewExpanded(!reviewExpanded)}
        sx={{ mt: 3, borderRadius: "12px !important", "&:before": { display: "none" }, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ bgcolor: "#fafafa", borderRadius: "12px" }}
        >
          <Typography variant="h6" fontWeight={600}>
            Customer Reviews ({feedbacks.length})
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ bgcolor: "#fff", borderRadius: "0 0 12px 12px" }}>
          <FeedbackForm productId={product._id} onFeedbackSubmitted={fetchFeedbacks} />
          {feedbacks.length > 0 ? (
            feedbacks.map((feedback, index) => (
              <ReviewCard key={feedback._id || index} review={{
                userName: feedback.userId?.name || "Anonymous",
                rating: feedback.rating,
                comment: feedback.comment,
                date: new Date(feedback.createdAt).toLocaleDateString()
              }} />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              No reviews yet. Be the first to review this product!
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>

      <ProductCarousel
        title="🐾 Recommended for your pet"
        products={recommendedProducts}
        onSelectProduct={(p) => navigate(`/product/${p._id}`)}
      />

      {frequentlyBoughtTogether.length > 0 && (
        <Paper elevation={2} sx={{ mt: 6, p: 4, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Frequently Bought Together
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center" }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <ProductCard product={product} onSelect={() => {}} />
            </Box>
            {frequentlyBoughtTogether.map((item, index) => (
              <React.Fragment key={item._id || index}>
                <Typography variant="h5" color="text.secondary">+</Typography>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <ProductCard product={item} onSelect={() => {}} />
                </Box>
              </React.Fragment>
            ))}
            <Box sx={{ minWidth: 150, textAlign: "center" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Bundle Price:
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ color: "#1976d2" }}>
                ₹{product.price + frequentlyBoughtTogether.reduce((sum, item) => sum + item.price, 0)}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ShoppingCartOutlined />}
                sx={{
                  mt: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  width: "100%"
                }}
              >
                Add All to Cart
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      <ProductCarousel
        title="Related Products"
        products={relatedProducts}
        onSelectProduct={(p) => navigate(`/product/${p._id}`)}
      />

       <ProductCarousel
         title="Recently Viewed"
         products={recentlyViewed}
         onSelectProduct={(p) => navigate(`/product/${p._id}`)}
       />

       <Snackbar
         open={snackbar.open}
         autoHideDuration={3000}
         onClose={() => setSnackbar({ ...snackbar, open: false })}
         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
       >
         <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
           {snackbar.message}
         </Alert>
       </Snackbar>
     </Container>
   );
 }