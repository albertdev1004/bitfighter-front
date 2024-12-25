

import './Loader.css';

import React from 'react';
import loaderGif from '../assets/images/loader_animation.gif';

const AnimatedLoader = () => {
  return (
    <div className="loader-overlay">
      <img src={loaderGif} alt="Loading..." className="loader-gif" />
    </div>
  );
};

export default AnimatedLoader;
