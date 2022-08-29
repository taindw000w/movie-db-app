import React, { useState } from 'react';
import { Pagination } from 'antd';

export const Paginationn = (props) => {
  return (
    <Pagination 
      current={props.currentPage}
      pageSize={20}
      responsive
      onChange={props.handleChange}
      total={props.totalResults}
      showSizeChanger={false}
      value={props.value}
    />
  )
};