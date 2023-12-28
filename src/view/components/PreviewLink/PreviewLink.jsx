import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import ReactHtmlParser from 'html-react-parser';
import isEmpty from 'lodash.isempty';
import './style.scss';
import { truncateString } from '../../../utils/truncateString';
import { formatUrl } from '../../../utils/formatUrl';

const PreviewLink = ({ previewLink, source }) => {
  const onClickPreview = useCallback((l) => window.open(formatUrl(l), '_blank'), []);

  if (isEmpty(previewLink)) {
    return <></>;
  }

  if (!isEmpty(previewLink)) {
    const { image, title, description, hostname } = previewLink;
    return (
      <div className='preview' onClick={() => onClickPreview(source)}>
        <div className='preview-image'>
          {image ? <img src={image} alt={hostname} /> : <FontAwesomeIcon icon={regular('image')} />}
        </div>
        <div className='preview-text'>
          <p className='preview-text-title'>
            {title ? ReactHtmlParser(truncateString(title, 100)) : ''}
          </p>
          <p className='preview-text-description'>
            {description ? ReactHtmlParser(truncateString(description, 150)) : ''}
          </p>
          <p className='preview-text-description'>
            {!description && hostname ? truncateString(hostname, 150) : ''}
          </p>
        </div>
      </div>
    );
  }
  return <></>;
};

PreviewLink.propTypes = {
  source: PropTypes.string,
  previewLink: PropTypes.object,
};

export default PreviewLink;
