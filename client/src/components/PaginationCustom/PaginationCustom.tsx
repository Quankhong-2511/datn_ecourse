import { Button, Pagination } from 'antd';
import React, { CSSProperties, ReactNode } from 'react';
import styles from './style.module.scss';

type Props = {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
};

const PaginationCustom = ({ current, total, pageSize, onChange }: Props) => {
  return <Pagination current={current} total={total} pageSize={pageSize} onChange={onChange} />;
};

export default PaginationCustom;
