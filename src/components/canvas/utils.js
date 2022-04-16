import React from 'react';

export const renderStrokeWidthOptions = values => {
  return values.map(v => (
    <option key={`stroke-width-option-${v}`} value={v}>
      {v}px
    </option>
  ));
};

export const renderSizeOptions = currentSize => {
  return (
    <>
      <option value={currentSize}>{`${currentSize}px`}</option>
      <option value={72}>72px</option>
      <option value={64}>64px</option>
      <option value={56}>56px</option>
      <option value={48}>48px</option>
      <option value={40}>40px</option>
      <option value={36}>36px</option>
      <option value={32}>32px</option>
      <option value={28}>28px</option>
      <option value={24}>24px</option>
      <option value={20}>20px</option>
      <option value={18}>18px</option>
      <option value={16}>16px</option>
      <option value={14}>14px</option>
    </>
  );
};
