import React from 'react';
import { Spinner } from 'react-bootstrap';

const SpinnerLoader: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
      <Spinner animation="border" role="status" variant="primary" />
    </div>
  );
};

export default SpinnerLoader;