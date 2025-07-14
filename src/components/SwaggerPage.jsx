import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerPage() {
  return (
    <SwaggerUI url="http://api.dustipharma.tj:1212/api/v1/app/swagger/doc.json" />
  );
}
