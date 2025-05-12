
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
  const navigate = useNavigate();
  
  // Redirect to quick-recipe page immediately
  useEffect(() => {
    console.log('RecipeDetail page is deprecated, redirecting to quick-recipe');
    navigate('/quick-recipe', { replace: true });
  }, [navigate]);

  // Return null or a minimal loading component as this will only show briefly during redirect
  return null;
};

export default RecipeDetail;
